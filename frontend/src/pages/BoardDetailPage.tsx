import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task, Priority } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!id) return
    const boardId = Number(id)

    Promise.all([
      boardService.getById(boardId),
      taskService.getByBoard(boardId),
    ])
      .then(([b, t]) => {
        setBoard(b as Board)
        setTasks(t)
      })
      .catch(() => {
        toast.error('Board not found')
        navigate('/boards')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: { title: string; description: string; priority: Priority }) => {
    if (!board) return
    setSaving(true)
    try {
      if (editTask) {
        const updated = await taskService.update(editTask.id, data)
        setTasks((prev) => prev.map((t) => (t.id === editTask.id ? updated : t)))
        toast.success('Task updated')
      } else {
        const newTask = await taskService.create(board.id, data)
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

  const completed = tasks.filter((t) => t.completed).length
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link to="/boards" className="hover:text-text-secondary transition-colors">Boards</Link>
        <span>/</span>
        <span className="text-text-secondary">{board?.title ?? '...'}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          {loading ? (
            <div className="h-7 w-40 bg-bg-elevated rounded-lg animate-skeleton" />
          ) : (
            <h1 className="text-2xl font-semibold text-text-primary">{board?.title}</h1>
          )}
          <p className="text-sm text-text-secondary mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} · {completed} completed
          </p>
        </div>
        <Button onClick={() => { setEditTask(null); setShowModal(true) }}>
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add task
        </Button>
      </div>

      {/* Progress */}
      {!loading && tasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-text-secondary">Progress</span>
            <span className="text-xs font-mono text-text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-violet rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <TaskSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            title="No tasks yet"
            description="Add your first task to this board."
            action={
              <Button size="sm" onClick={() => setShowModal(true)}>
                Add a task
              </Button>
            }
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={(t) => { setEditTask(t); setShowModal(true) }}
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
