import { Priority } from '../../types'
import clsx from 'clsx'

const config: Record<Priority, { label: string; className: string; dot: string }> = {
  HIGH: {
    label: 'High',
    className: 'text-red-400 bg-red-400/10 border-red-400/20',
    dot: 'bg-red-400',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  LOW: {
    label: 'Low',
    className: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className, dot } = config[priority]
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border', className)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  )
}
