import { motion } from 'framer-motion'
import { CheckCircle, Plus, Columns3, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ActivityItem } from '../../types'

const iconMap = {
  task_created: { icon: Plus, color: 'text-info bg-info/10' },
  task_completed: { icon: CheckCircle, color: 'text-success bg-success/10' },
  board_created: { icon: Columns3, color: 'text-violet bg-violet-subtle' },
  task_deleted: { icon: Trash2, color: 'text-danger bg-danger/10' },
}

interface ActivityFeedProps {
  items: ActivityItem[]
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (!items.length) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-text-muted">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const { icon: Icon, color } = iconMap[item.type]
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-elevated transition-colors group"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-primary truncate">{item.message}</p>
            </div>
            <span className="text-[10px] text-text-muted shrink-0 group-hover:text-text-secondary transition-colors">
              {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
