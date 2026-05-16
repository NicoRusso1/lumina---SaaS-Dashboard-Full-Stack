import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      className={clsx('flex flex-col items-center justify-center py-20 text-center px-6', className)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="relative mb-5">
          <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-bg-border flex items-center justify-center text-text-muted">
            {icon}
          </div>
          <div className="absolute inset-0 rounded-2xl bg-violet/5 blur-xl" />
        </div>
      )}
      <p className="text-sm font-semibold text-text-primary mb-1.5">{title}</p>
      {description && (
        <p className="text-xs text-text-secondary max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
