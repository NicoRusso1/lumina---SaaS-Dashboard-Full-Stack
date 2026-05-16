import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/auth.store'
import { boardService } from '../services/board.service'
import { taskService } from '../services/task.service'
import { Board, Task, ActivityItem } from '../types'
import { StatsCard } from '../components/dashboard/StatsCard'
import { WeeklyAreaChart, DonutChart, ActivityBarChart } from '../components/dashboard/Charts'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { DashboardSkeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { Columns3, CheckSquare, Timer, Flame, ArrowRight, Zap, TrendingUp, StickyNote, Target } from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function generateWeeklyData(tasks: Task[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const now = new Date()
  return days.map((day, i) => {
    const dayTasks = tasks.filter((t) => {
      const d = new Date(t.createdAt)
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      return diff === i
    })
    return { day, completed: dayTasks.filter((t) => t.completed).length, created: dayTasks.length }
  })
}

function generateActivity(boards: Board[], tasks: Task[]): ActivityItem[] {
  const items: ActivityItem[] = []
  boards.slice(0, 3).forEach((b) => {
    items.push({ id: `board-${b.id}`, type: 'board_created', message: `Created board "${b.title}"`, time: b.createdAt })
  })
  tasks.slice(0, 6).forEach((t) => {
    items.push({
      id: `task-${t.id}`,
      type: t.completed ? 'task_completed' : 'task_created',
      message: t.completed ? `Completed "${t.title}"` : `Created "${t.title}"`,
      time: t.createdAt,
    })
  })
  return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [boards, setBoards] = useState<Board[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const boardsData = await boardService.getAll()
        setBoards(boardsData)
        const results = await Promise.all(
          boardsData.slice(0, 6).map((b) => taskService.getByBoard(b.id).catch(() => [] as Task[]))
        )
        setTasks(results.flat())
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const completedTasks = tasks.filter((t) => t.completed)
  const pendingTasks = tasks.filter((t) => !t.completed)
  const highPriority = tasks.filter((t) => t.priority === 'HIGH' && !t.completed)
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0

  const weeklyData = useMemo(() => generateWeeklyData(tasks), [tasks])
  const activity = useMemo(() => generateActivity(boards, tasks), [boards, tasks])

  const donutData = [
    { name: 'Completed', value: completedTasks.length, color: '#22c55e' },
    { name: 'Pending', value: pendingTasks.length, color: '#7c6af7' },
    { name: 'High priority', value: highPriority.length, color: '#ef4444' },
  ]

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-7xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-xs text-text-muted font-medium">
              {completionRate}% completion rate
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
            {getGreeting()},{' '}
            <span className="text-gradient-violet">{user?.username}</span> 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">
            You have{' '}
            <span className="text-text-primary font-semibold">{pendingTasks.length} tasks</span>{' '}
            pending across{' '}
            <span className="text-text-primary font-semibold">{boards.length} boards</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Timer className="w-3.5 h-3.5" />}
            onClick={() => navigate('/focus')}
          >
            Focus mode
          </Button>
          <Button
            size="sm"
            icon={<Zap className="w-3.5 h-3.5" />}
            onClick={() => navigate('/boards')}
          >
            New board
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatsCard title="Total Tasks" value={tasks.length} icon={<CheckSquare className="w-4 h-4" />} trend={12} subtitle="vs last week" accent="violet" delay={0} />
        <StatsCard title="Completed" value={completedTasks.length} icon={<Target className="w-4 h-4" />} trend={8} subtitle="vs last week" accent="success" delay={0.05} />
        <StatsCard title="Active Boards" value={boards.length} icon={<Columns3 className="w-4 h-4" />} accent="info" subtitle="workspaces" delay={0.1} />
        <StatsCard title="Completion" value={`${completionRate}%`} icon={<TrendingUp className="w-4 h-4" />} trend={completionRate - 65} subtitle="vs average" accent="warning" delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="lg:col-span-2 p-5 bg-bg-surface border border-bg-border rounded-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Weekly Activity</h3>
              <p className="text-xs text-text-secondary mt-0.5">Tasks created vs completed</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet rounded inline-block" />Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-info rounded inline-block opacity-60" />Created</span>
            </div>
          </div>
          <WeeklyAreaChart data={weeklyData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="p-5 bg-bg-surface border border-bg-border rounded-xl"
        >
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-text-primary">Task Status</h3>
            <p className="text-xs text-text-secondary mt-0.5">Distribution overview</p>
          </div>
          {tasks.length > 0 ? (
            <DonutChart data={donutData} />
          ) : (
            <div className="flex items-center justify-center h-28 text-xs text-text-muted">
              No tasks yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="lg:col-span-2 bg-bg-surface border border-bg-border rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-bg-border">
            <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
            <span className="text-xs text-text-muted">{activity.length} events</span>
          </div>
          <div className="p-2">
            <ActivityFeed items={activity} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="space-y-3"
        >
          <div className="p-4 bg-bg-surface border border-bg-border rounded-xl">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { label: 'View all boards', to: '/boards', Icon: Columns3 },
                { label: 'All tasks', to: '/tasks', Icon: CheckSquare },
                { label: 'Start Pomodoro', to: '/focus', Icon: Timer },
                { label: 'Write a note', to: '/notes', Icon: StickyNote },
              ].map(({ label, to, Icon }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors group"
                >
                  <Icon className="w-3.5 h-3.5 text-violet shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-bg-surface border border-bg-border rounded-xl">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Daily Output</h3>
            <ActivityBarChart data={weeklyData.map((d) => ({ day: d.day, tasks: d.completed }))} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
