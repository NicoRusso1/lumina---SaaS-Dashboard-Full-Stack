import { useEffect, useState } from 'react'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task, Priority } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import clsx from 'clsx'

type Filter = 'all' | 'active' | 'completed'
type PriorityFilter = 'all' | Priority

export function TasksPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const { toast } = useToast()

  useEffect(() => {
    boardService.getAll().then((data) => {
      setBoards(data)
      if (data.length > 0) {
        setSelectedBoard(data[0])
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedBoard) return
    setTasksLoading(true)
    taskService
      .getByBoard(selectedBoard.id)
      .then(setTasks)
      .finally(() => setTasksLoading(false))
  }, [selectedBoard])

  const filteredTasks = tasks.filter((t) => {
    const statusMatch =
      filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
    const priorityMatch = priorityFilter === 'all' ? true : t.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const handleSubmit = async (data: { title: string; description: string; priority: Priority }) => {
    if (!selectedBoard) return
    setSaving(true)
    try {
      if (editTask) {
        const updated = await taskService.update(editTask.id, data)
        setTasks((prev) => prev.map((t) => (t.id === editTask.id ? updated : t)))
        toast.success('Task updated')
      } else {
        const newTask = await taskService.create(selectedBoard.id, data)
        setTasks((prev) => [newTask, ...prev])
        toast.success('Task created')
      }
      setShowModal(false)
      setEditTask(null)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task: Task) => {
    try {
      const updated = await taskService.update(task.id, { completed: !task.completed })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditTask(task)
    setShowModal(true)
  }

  const handleDelete = async (task: Task) => {
    if (!confirm('Delete this task?')) return
    try {
      await taskService.remove(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const openCreate = () => {
    setEditTask(null)
    setShowModal(true)
  }

  const statusFilters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' },
  ]

  const priorityFilters: { value: PriorityFilter; label: string }[] = [
    { value: 'all', label: 'Any priority' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ]

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Tasks</h1>
          <p className="text-sm text-text-secondary mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {selectedBoard && (
          <Button onClick={openCreate}>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            New task
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Board selector */}
        {!loading && boards.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
            {boards.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoard(b)}
                className={clsx(
                  'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  selectedBoard?.id === b.id
                    ? 'bg-violet-subtle border-violet/30 text-text-accent'
                    : 'border-bg-border text-text-secondary hover:text-text-primary hover:border-bg-overlay'
                )}
              >
                {b.title}
              </button>
            ))}
          </div>
        )}

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          className="text-xs bg-bg-elevated border border-bg-border rounded-lg px-3 py-1.5 text-text-secondary outline-none focus:border-violet/40 cursor-pointer"
        >
          {priorityFilters.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-bg-surface border border-bg-border rounded-xl mb-5 w-fit">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.value
                ? 'bg-bg-elevated text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasksLoading ? (
          Array.from({ length: 4 }).map((_, i) => <TaskSkeleton key={i} />)
        ) : !selectedBoard ? (
          <EmptyState
            title="No boards yet"
            description="Create a board first, then add tasks to it."
          />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title={filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            description={
              filter === 'all'
                ? 'Add your first task to get started.'
                : undefined
            }
            action={
              filter === 'all' ? (
                <Button size="sm" onClick={openCreate}>Add a task</Button>
              ) : undefined
            }
          />
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <TaskFormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditTask(null) }}
        onSubmit={handleSubmit}
        initialData={editTask}
        loading={saving}
      />
    </div>
  )
}
