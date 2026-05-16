import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task, Priority } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { PriorityBadge } from '../components/ui/Badge'
import { TaskSkeleton } from '../components/ui/Skeleton'
import { Plus, CheckSquare, MoreHorizontal, Edit3, Trash2 } from 'lucide-react'
import clsx from 'clsx'

type Filter = 'all' | 'active' | 'completed'
type PrioFilter = 'any' | Priority

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated/50 transition-colors rounded-xl border border-transparent hover:border-bg-border"
    >
      <button
        onClick={onToggle}
        className={clsx(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
          task.completed
            ? 'bg-success border-success text-white'
            : 'border-bg-border hover:border-violet/50'
        )}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm truncate transition-colors', task.completed ? 'text-text-muted line-through' : 'text-text-primary')}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-text-muted truncate mt-0.5">{task.description}</p>
        )}
      </div>

      <PriorityBadge priority={task.priority} />

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-32 bg-bg-elevated border border-bg-border rounded-xl shadow-modal z-20 overflow-hidden py-1">
              <button
                onClick={() => { onEdit(); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => { onDelete(); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/8"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export function TasksPage() {
  const { toast } = useToast()
  const [boards, setBoards] = useState<Board[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeBoard, setActiveBoard] = useState<number | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [prioFilter, setPrioFilter] = useState<PrioFilter>('any')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardService.getAll()
        setBoards(data)
        if (data.length > 0) {
          setActiveBoard(data[0].id)
        }
      } catch {
        toast.error('Failed to load boards')
      }
    }
    fetchBoards()
  }, [])

  useEffect(() => {
    if (!activeBoard) { setLoading(false); return }
    setLoading(true)
    taskService.getByBoard(activeBoard)
      .then(setTasks)
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [activeBoard])

  const filtered = tasks.filter((t) => {
    if (filter === 'active' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    if (prioFilter !== 'any' && t.priority !== prioFilter) return false
    return true
  })

  const openCreate = () => {
    setEditTask(null); setTaskTitle(''); setTaskDesc(''); setTaskPriority('MEDIUM'); setModalOpen(true)
  }
  const openEdit = (task: Task) => {
    setEditTask(task); setTaskTitle(task.title); setTaskDesc(task.description || ''); setTaskPriority(task.priority); setModalOpen(true)
  }

  const handleSave = async () => {
    if (!taskTitle.trim() || !activeBoard) return
    setSaving(true)
    try {
      if (editTask) {
        const updated = await taskService.update(editTask.id, { title: taskTitle.trim(), description: taskDesc, priority: taskPriority })
        setTasks((prev) => prev.map((t) => t.id === editTask.id ? updated : t))
        toast.success('Task updated')
      } else {
        const created = await taskService.create(activeBoard, { title: taskTitle.trim(), description: taskDesc, priority: taskPriority })
        setTasks((prev) => [...prev, created])
        toast.success('Task created')
      }
      setModalOpen(false)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task: Task) => {
    try {
      const updated = await taskService.update(task.id, { completed: !task.completed })
      setTasks((prev) => prev.map((t) => t.id === task.id ? updated : t))
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await taskService.remove(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Tasks</h1>
          <p className="text-sm text-text-secondary mt-0.5">{filtered.length} tasks · {tasks.filter((t) => t.completed).length} completed</p>
        </div>
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate} disabled={!activeBoard}>
          Add Task
        </Button>
      </div>

      {/* Board tabs */}
      {boards.length > 0 && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 mb-4">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBoard(b.id)}
              className={clsx(
                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeBoard === b.id
                  ? 'bg-violet text-white'
                  : 'text-text-secondary hover:text-text-primary bg-bg-elevated hover:bg-bg-overlay'
              )}
            >
              {b.title}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="flex gap-1 bg-bg-surface border border-bg-border rounded-lg p-1">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                filter === f ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-bg-surface border border-bg-border rounded-lg p-1">
          {(['any', 'HIGH', 'MEDIUM', 'LOW'] as PrioFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPrioFilter(p)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                prioFilter === p ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {p === 'any' ? 'Any priority' : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <TaskSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6" />}
          title="No tasks found"
          description={filter === 'all' ? "Add your first task to get started." : `No ${filter} tasks with selected filters.`}
          action={filter === 'all' ? <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>Add task</Button> : undefined}
        />
      ) : (
        <div className="space-y-1">
          <AnimatePresence>
            {filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => handleToggle(task)}
                onEdit={() => openEdit(task)}
                onDelete={() => handleDelete(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Edit Task' : 'New Task'} size="sm">
        <div className="space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-bg-overlay border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 transition"
          />
          <textarea
            placeholder="Description (optional)..."
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows={2}
            className="w-full bg-bg-overlay border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 transition resize-none"
          />
          <div className="flex gap-1.5">
            {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setTaskPriority(p)}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-xs font-medium transition-colors border',
                  taskPriority === p
                    ? p === 'HIGH' ? 'bg-danger/15 text-danger border-danger/30' : p === 'MEDIUM' ? 'bg-warning/15 text-warning border-warning/30' : 'bg-success/15 text-success border-success/30'
                    : 'border-bg-border text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
                )}
              >
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" loading={saving} onClick={handleSave} disabled={!taskTitle.trim()}>
              {editTask ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
