import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { boardService } from '../services/board.service'
import { Board } from '../types'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Input } from '../components/ui/Input'
import { BoardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { useForm } from 'react-hook-form'

interface BoardForm {
  title: string
}

export function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editBoard, setEditBoard] = useState<Board | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BoardForm>()

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await boardService.getAll()
      setBoards(data)
    } catch {
      toast.error('Failed to load boards')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    reset({ title: '' })
    setEditBoard(null)
    setShowModal(true)
  }

  const openEdit = (board: Board, e: React.MouseEvent) => {
    e.preventDefault()
    setEditBoard(board)
    setValue('title', board.title)
    setShowModal(true)
  }

  const onSubmit = async (data: BoardForm) => {
    setSaving(true)
    try {
      if (editBoard) {
        const updated = await boardService.update(editBoard.id, data.title)
        setBoards((prev) => prev.map((b) => (b.id === editBoard.id ? { ...b, ...updated } : b)))
        toast.success('Board updated')
      } else {
        const newBoard = await boardService.create(data.title)
        setBoards((prev) => [newBoard, ...prev])
        toast.success('Board created')
      }
      setShowModal(false)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (board: Board, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm(`Delete "${board.title}"? This will also delete all its tasks.`)) return
    try {
      await boardService.remove(board.id)
      setBoards((prev) => prev.filter((b) => b.id !== board.id))
      toast.success('Board deleted')
    } catch {
      toast.error('Failed to delete board')
    }
  }

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Boards</h1>
          <p className="text-sm text-text-secondary mt-1">
            {boards.length} board{boards.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New board
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <BoardSkeleton key={i} />)}
        </div>
      ) : boards.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
              <rect x="2" y="2" width="4" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="8" y="2" width="4" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
          title="No boards yet"
          description="Create your first board to start organizing your tasks."
          action={<Button onClick={openCreate}>Create a board</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="group relative p-5 bg-bg-surface border border-bg-border rounded-xl hover:border-violet/30 hover:bg-bg-elevated transition-all"
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 rounded-xl bg-violet-subtle opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-subtle border border-violet/20 flex items-center justify-center">
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-violet">
                      <rect x="2" y="2" width="4" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="8" y="2" width="4" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => openEdit(board, e)}
                      className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors"
                    >
                      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                        <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(board, e)}
                      className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-text-primary group-hover:text-text-accent transition-colors mb-1 truncate">
                  {board.title}
                </p>
                <p className="text-xs text-text-muted">
                  {board._count?.tasks ?? 0} task{(board._count?.tasks ?? 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editBoard ? 'Edit board' : 'New board'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Board title"
            placeholder="e.g. Q1 Marketing"
            error={errors.title?.message}
            autoFocus
            {...register('title', { required: 'Title is required' })}
          />
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editBoard ? 'Save changes' : 'Create board'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
