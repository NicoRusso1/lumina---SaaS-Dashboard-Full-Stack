import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task } from '../types'
import { useAuthStore } from '../store/auth.store'
import { StatSkeleton, BoardSkeleton } from '../components/ui/Skeleton'
import { PriorityBadge } from '../components/ui/PriorityBadge'
import { EmptyState } from '../components/ui/EmptyState'

export function DashboardPage() {
  const { user } = useAuthStore()
  const [boards, setBoards] = useState<Board[]>([])
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const bs = await boardService.getAll()
        setBoards(bs)

        // Grab tasks from the first 2 boards
        if (bs.length > 0) {
          const taskArrays = await Promise.all(
            bs.slice(0, 2).map((b) => taskService.getByBoard(b.id))
          )
          const allTasks = taskArrays.flat().slice(0, 6)
          setRecentTasks(allTasks)
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalTasks = recentTasks.length
  const completedTasks = recentTasks.filter((t) => t.completed).length
  const pendingTasks = recentTasks.filter((t) => !t.completed).length
  const highPriority = recentTasks.filter((t) => t.priority === 'HIGH' && !t.completed).length

  const stats = [
    { label: 'Total boards', value: boards.length, color: 'text-violet' },
    { label: 'Recent tasks', value: totalTasks, color: 'text-text-primary' },
    { label: 'Completed', value: completedTasks, color: 'text-emerald-400' },
    { label: 'High priority', value: highPriority, color: 'text-red-400' },
  ]

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          Good {getGreeting()},{' '}
          <span className="text-text-accent">{user?.username}</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here's what's happening with your work today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 bg-bg-surface border border-bg-border rounded-xl hover:border-violet/20 transition-colors"
              >
                <p className="text-xs text-text-secondary mb-1">{stat.label}</p>
                <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent boards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">Recent Boards</h2>
            <Link
              to="/boards"
              className="text-xs text-text-secondary hover:text-text-accent transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <BoardSkeleton key={i} />)
            ) : boards.length === 0 ? (
              <EmptyState
                title="No boards yet"
                description="Create your first board to get started."
              />
            ) : (
              boards.slice(0, 4).map((board) => (
                <Link
                  key={board.id}
                  to={`/boards/${board.id}`}
                  className="flex items-center justify-between p-4 bg-bg-surface border border-bg-border rounded-xl hover:border-violet/30 hover:bg-bg-elevated transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary group-hover:text-text-accent transition-colors">
                      {board.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {board._count?.tasks ?? 0} tasks
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-text-muted group-hover:text-text-accent transition-colors"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-xs text-text-secondary hover:text-text-accent transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-bg-surface border border-bg-border rounded-xl animate-skeleton" />
              ))
            ) : recentTasks.length === 0 ? (
              <EmptyState title="No tasks yet" description="Tasks from your boards will appear here." />
            ) : (
              recentTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-bg-surface border border-bg-border rounded-xl"
                >
                  <div
                    className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? 'bg-emerald-400 border-emerald-400'
                        : 'border-bg-border'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <p
                    className={`flex-1 text-sm truncate ${
                      task.completed ? 'line-through text-text-muted' : 'text-text-primary'
                    }`}
                  >
                    {task.title}
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Completion bar */}
      {!loading && totalTasks > 0 && (
        <div className="mt-8 p-5 bg-bg-surface border border-bg-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-primary">Recent progress</p>
            <p className="text-xs text-text-secondary">
              {completedTasks}/{totalTasks} tasks
            </p>
          </div>
          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-violet rounded-full transition-all duration-700"
              style={{ width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {pendingTasks} task{pendingTasks !== 1 ? 's' : ''} still pending
          </p>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
