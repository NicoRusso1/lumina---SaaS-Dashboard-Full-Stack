import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: number
  subtitle?: string
  accent?: 'violet' | 'success' | 'warning' | 'danger' | 'info'
  delay?: number
}

const accentStyles = {
  violet: 'bg-violet/10 text-violet border-violet/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-info/10 text-info border-info/20',
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  accent = 'violet',
  delay = 0,
}: StatsCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 bg-bg-surface border border-bg-border rounded-xl card-hover group"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {title}
        </span>
        <div
          className={clsx(
            'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0',
            accentStyles[accent]
          )}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>

        <div className="flex items-center gap-1.5">
          {trend !== undefined && (
            <span
              className={clsx(
                'flex items-center gap-0.5 text-xs font-medium',
                isPositive && 'text-success',
                isNegative && 'text-danger',
                !isPositive && !isNegative && 'text-text-muted'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : isNegative ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-text-muted">{subtitle}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
