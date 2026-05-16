import { useEffect, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Task, KanbanStatus, Board } from '../types'
import { useToast } from '../context/ToastContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PriorityBadge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { GripVertical, Columns3 } from 'lucide-react'
import clsx from 'clsx'

const COLUMNS: { id: KanbanStatus; label: string; color: string; bg: string }[] = [
  { id: 'todo', label: 'Todo', color: 'text-text-secondary', bg: 'bg-bg-border' },
  { id: 'in_progress', label: 'In Progress', color: 'text-info', bg: 'bg-info/20' },
  { id: 'review', label: 'Review', color: 'text-warning', bg: 'bg-warning/20' },
  { id: 'done', label: 'Done', color: 'text-success', bg: 'bg-success/20' },
]

function KanbanCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `task-${task.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'bg-bg-surface border border-bg-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing select-none',
        'hover:border-violet/20 hover:shadow-glow-sm transition-all',
        isDragging && 'opacity-40'
      )}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-text-muted hover:text-text-secondary shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary font-medium leading-snug mb-2">{task.title}</p>
          {task.description && (
            <p className="text-xs text-text-muted mb-2 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            <PriorityBadge priority={task.priority} />
            <span className="text-[10px] text-text-muted">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  column,
  tasks,
  activeId,
}: {
  column: typeof COLUMNS[number]
  tasks: Task[]
  activeId: string | null
}) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={clsx('w-2 h-2 rounded-full', column.bg)} />
        <span className={clsx('text-xs font-semibold uppercase tracking-wider', column.color)}>
          {column.label}
        </span>
        <span className="ml-auto text-xs text-text-muted font-medium bg-bg-elevated px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => `task-${t.id}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 min-h-[200px] p-2 bg-bg-surface/40 rounded-xl border border-bg-border">
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-xs text-text-muted">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                isDragging={activeId === `task-${task.id}`}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export function KanbanPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const [activeBoard, setActiveBoard] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [kanbanStatus, setKanbanStatus] = useLocalStorage<Record<number, KanbanStatus>>(
    'lumina_kanban_status',
    {}
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  useEffect(() => {
    const load = async () => {
      try {
        const b = await boardService.getAll()
        setBoards(b)
        if (b.length > 0) {
          setActiveBoard(b[0].id)
        }
      } catch {
        toast.error('Failed to load boards')
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!activeBoard) { setLoading(false); return }
    setLoading(true)
    taskService.getByBoard(activeBoard)
      .then(setTasks)
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [activeBoard])

  const getTaskStatus = (task: Task): KanbanStatus => {
    if (kanbanStatus[task.id]) return kanbanStatus[task.id]
    return task.completed ? 'done' : 'todo'
  }

  const columnTasks = (colId: KanbanStatus) =>
    tasks.filter((t) => getTaskStatus(t) === colId)

  const getTaskFromId = (id: string) => {
    const taskId = parseInt(id.replace('task-', ''))
    return tasks.find((t) => t.id === taskId) || null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const taskId = parseInt((active.id as string).replace('task-', ''))
    const overId = over.id as string

    let newStatus: KanbanStatus | null = null

    if (overId.startsWith('task-')) {
      const overTaskId = parseInt(overId.replace('task-', ''))
      const overTask = tasks.find((t) => t.id === overTaskId)
      if (overTask) newStatus = getTaskStatus(overTask)
    } else {
      newStatus = overId as KanbanStatus
    }

    if (newStatus) {
      setKanbanStatus((prev) => ({ ...prev, [taskId]: newStatus! }))
      if (newStatus === 'done') {
        await taskService.update(taskId, { completed: true }).catch(() => {})
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: true } : t))
      } else if (getTaskStatus(tasks.find((t) => t.id === taskId)!) === 'done') {
        await taskService.update(taskId, { completed: false }).catch(() => {})
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, completed: false } : t))
      }
    }
  }

  const activeTask = activeId ? getTaskFromId(activeId) : null

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Kanban</h1>
          <p className="text-sm text-text-secondary mt-0.5">Drag and drop to organize tasks</p>
        </div>
      </div>

      {/* Board selector */}
      {boards.length > 0 && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 mb-6">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBoard(b.id)}
              className={clsx(
                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeBoard === b.id
                  ? 'bg-violet text-white shadow-glow-sm'
                  : 'text-text-secondary hover:text-text-primary bg-bg-elevated hover:bg-bg-overlay'
              )}
            >
              {b.title}
            </button>
          ))}
        </div>
      )}

      {boards.length === 0 ? (
        <EmptyState
          icon={<Columns3 className="w-6 h-6" />}
          title="No boards yet"
          description="Create a board first to use the Kanban view."
        />
      ) : loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-72 shrink-0 h-64 bg-bg-surface border border-bg-border rounded-xl animate-skeleton" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-6">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={columnTasks(col.id)}
                activeId={activeId}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="rotate-2 shadow-modal opacity-95">
                <KanbanCard task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
