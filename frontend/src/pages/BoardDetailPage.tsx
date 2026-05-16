import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task, Priority } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { PriorityBadge } from '../components/ui/Badge'
import { TaskSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { Plus, CheckSquare, ChevronRight, MoreHorizontal, Edit3, Trash2 } from 'lucide-react'
import clsx from 'clsx'

const BOARD_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
]

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [board, setBoard] = useState<Board | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const boardId = Number(id)
    Promise.all([boardService.getById(boardId), taskService.getByBoard(boardId)])
      .then(([b, t]) => { setBoard(b as Board); setTasks(t) })
      .catch(() => { toast.error('Board not found'); navigate('/boards') })
      .finally(() => setLoading(false))
  }, [id])

  const openCreate = () => { setEditTask(null); setTaskTitle(''); setTaskDesc(''); setTaskPriority('MEDIUM'); setModalOpen(true) }
  const openEdit = (task: Task) => { setEditTask(task); setTaskTitle(task.title); setTaskDesc(task.description || ''); setTaskPriority(task.priority); setModalOpen(true) }

  const handleSave = async () => {
    if (!taskTitle.trim() || !board) return
    setSaving(true)
    try {
      if (editTask) {
        const updated = await taskService.update(editTask.id, { title: taskTitle.trim(), description: taskDesc, priority: taskPriority })
        setTasks((prev) => prev.map((t) => t.id === editTask.id ? updated : t))
        toast.success('Task updated')
      } else {
        const newTask = await taskService.create(board.id, { title: taskTitle.trim(), description: taskDesc, priority: taskPriority })
        setTasks((prev) => [newTask, ...prev])
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
    const updated = await taskService.update(task.id, { completed: !task.completed }).catch(() => null)
    if (updated) setTasks((prev) => prev.map((t) => t.id === task.id ? updated : t))
  }

  const handleDelete = async (taskId: number) => {
    await taskService.remove(taskId).catch(() => toast.error('Failed to delete'))
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    toast.success('Task deleted')
  }

  const completed = tasks.filter((t) => t.completed).length
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0
  const gradient = BOARD_COLORS[(board?.id ?? 0) % BOARD_COLORS.length]

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-text-muted mb-6">
        <Link to="/boards" className="hover:text-text-secondary transition-colors">Boards</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-secondary">{board?.title ?? '...'}</span>
      </div>

      {/* Board header */}
      {!loading && board && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`h-24 bg-gradient-to-br ${gradient} rounded-xl mb-5 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <h1 className="text-xl font-bold text-white">{board.title}</h1>
            <p className="text-sm text-white/70">{tasks.length} tasks · {completed} completed</p>
          </div>
        </motion.div>
      )}

      {/* Progress + Add */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Progress</span>
            <span className="text-text-secondary font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
            />
          </div>
        </div>
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>
          Add task
        </Button>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {loading ? (
          [...Array(3)].map((_, i) => <TaskSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="w-6 h-6" />}
            title="No tasks yet"
            description="Add your first task to get started."
            action={<Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>Add task</Button>}
          />
        ) : (
          tasks.map((task, i) => (
            <TaskRow
              key={task.id}
              task={task}
              index={i}
              onToggle={() => handleToggle(task)}
              onEdit={() => openEdit(task)}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTask ? 'Edit Task' : 'New Task'}
        size="sm"
      >
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
                  'flex-1 py-2 rounded-lg text-xs font-medium border transition-colors',
                  taskPriority === p
                    ? p === 'HIGH' ? 'bg-danger/15 text-danger border-danger/30'
                      : p === 'MEDIUM' ? 'bg-warning/15 text-warning border-warning/30'
                      : 'bg-success/15 text-success border-success/30'
                    : 'border-bg-border text-text-muted hover:bg-bg-elevated'
                )}
              >
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end pt-1">
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

function TaskRow({ task, index, onToggle, onEdit, onDelete }: {
  task: Task; index: number
  onToggle: () => void; onEdit: () => void; onDelete: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex items-center gap-3 p-4 bg-bg-surface border border-bg-border rounded-xl hover:border-violet/15 transition-all"
    >
      <button
        onClick={onToggle}
        className={clsx(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
          task.completed ? 'bg-success border-success text-white' : 'border-bg-border hover:border-violet/50'
        )}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium truncate', task.completed ? 'text-text-muted line-through' : 'text-text-primary')}>{task.title}</p>
        {task.description && <p className="text-xs text-text-muted truncate mt-0.5">{task.description}</p>}
      </div>
      <PriorityBadge priority={task.priority} />
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-32 bg-bg-elevated border border-bg-border rounded-xl shadow-modal z-20 overflow-hidden py-1">
              <button onClick={() => { onEdit(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-bg-overlay hover:text-text-primary">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => { onDelete(); setMenuOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/8">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
