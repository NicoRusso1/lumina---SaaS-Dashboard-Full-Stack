import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { BoardSkeleton } from '../components/ui/Skeleton'
import { Plus, Columns3, MoreHorizontal, Edit3, Trash2, ArrowRight, CheckSquare } from 'lucide-react'
import clsx from 'clsx'

const BOARD_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
  'from-lime-500 to-green-600',
]

function getBoardColor(id: number) {
  return BOARD_COLORS[id % BOARD_COLORS.length]
}

function BoardCard({
  board,
  taskCount,
  completedCount,
  onEdit,
  onDelete,
  onClick,
}: {
  board: Board
  taskCount: number
  completedCount: number
  onEdit: () => void
  onDelete: () => void
  onClick: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0
  const gradient = getBoardColor(board.id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group bg-bg-surface border border-bg-border rounded-xl overflow-hidden card-hover"
    >
      {/* Cover */}
      <div
        className={clsx('h-20 bg-gradient-to-br cursor-pointer relative', gradient)}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-3 left-4">
          <Columns3 className="w-6 h-6 text-white/80" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <button onClick={onClick} className="flex-1 text-left min-w-0">
            <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-violet transition-colors">
              {board.title}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {taskCount} task{taskCount !== 1 ? 's' : ''} · {new Date(board.createdAt).toLocaleDateString()}
            </p>
          </button>

          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-36 bg-bg-elevated border border-bg-border rounded-xl shadow-modal z-20 overflow-hidden py-1">
                  <button
                    onClick={() => { onEdit(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-overlay transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/8 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <CheckSquare className="w-3 h-3" />
              <span>{completedCount}/{taskCount}</span>
            </div>
            <span className="text-xs font-medium text-text-secondary">{progress}%</span>
          </div>
          <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className={clsx('h-full rounded-full bg-gradient-to-r', gradient)}
            />
          </div>
        </div>

        <button
          onClick={onClick}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors border border-transparent hover:border-bg-border"
        >
          Open board <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  )
}

export function BoardsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [boards, setBoards] = useState<Board[]>([])
  const [taskCounts, setTaskCounts] = useState<Record<number, { total: number; completed: number }>>({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editBoard, setEditBoard] = useState<Board | null>(null)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchBoards = async () => {
    try {
      const data = await boardService.getAll()
      setBoards(data)
      const counts: Record<number, { total: number; completed: number }> = {}
      await Promise.all(
        data.map(async (b) => {
          try {
            const tasks: Task[] = await taskService.getByBoard(b.id)
            counts[b.id] = { total: tasks.length, completed: tasks.filter((t) => t.completed).length }
          } catch {
            counts[b.id] = { total: 0, completed: 0 }
          }
        })
      )
      setTaskCounts(counts)
    } catch {
      toast.error('Failed to load boards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBoards() }, [])

  const openCreate = () => { setEditBoard(null); setTitle(''); setModalOpen(true) }
  const openEdit = (board: Board) => { setEditBoard(board); setTitle(board.title); setModalOpen(true) }

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      if (editBoard) {
        await boardService.update(editBoard.id, title.trim())
        toast.success('Board updated')
      } else {
        await boardService.create(title.trim())
        toast.success('Board created')
      }
      setModalOpen(false)
      fetchBoards()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await boardService.remove(id)
      setBoards((prev) => prev.filter((b) => b.id !== id))
      toast.success('Board deleted')
    } catch {
      toast.error('Failed to delete board')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Boards</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {boards.length} board{boards.length !== 1 ? 's' : ''} · organize your work
          </p>
        </div>
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>
          New Board
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <BoardSkeleton key={i} />)}
        </div>
      ) : boards.length === 0 ? (
        <EmptyState
          icon={<Columns3 className="w-7 h-7" />}
          title="No boards yet"
          description="Create your first board to start organizing tasks and projects."
          action={
            <Button icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>
              Create your first board
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              taskCount={taskCounts[board.id]?.total ?? 0}
              completedCount={taskCounts[board.id]?.completed ?? 0}
              onEdit={() => openEdit(board)}
              onDelete={() => handleDelete(board.id)}
              onClick={() => navigate(`/boards/${board.id}`)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editBoard ? 'Edit Board' : 'New Board'}
        description={editBoard ? 'Update board name' : 'Give your board a name to get started'}
        size="sm"
      >
        <div className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="Board name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-bg-overlay border border-bg-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-violet/50 focus:ring-1 focus:ring-violet/20 transition"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave} disabled={!title.trim()}>
              {editBoard ? 'Save changes' : 'Create board'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
