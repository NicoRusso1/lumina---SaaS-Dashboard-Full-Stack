import clsx from 'clsx'

type BadgeVariant = 'default' | 'violet' | 'success' | 'warning' | 'danger' | 'info' | 'ghost'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-bg-elevated text-text-secondary border border-bg-border',
  violet: 'bg-violet-subtle text-violet border border-violet-border',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-info/10 text-info border border-info/20',
  ghost: 'text-text-secondary',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] font-semibold',
  md: 'px-2 py-0.5 text-xs font-medium',
}

export function Badge({ children, variant = 'default', size = 'md', className, dot }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md tracking-wide',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full shrink-0', {
            'bg-violet': variant === 'violet',
            'bg-success': variant === 'success',
            'bg-warning': variant === 'warning',
            'bg-danger': variant === 'danger',
            'bg-info': variant === 'info',
            'bg-text-secondary': variant === 'default',
          })}
        />
      )}
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const map = {
    LOW: { variant: 'success' as const, label: 'Low' },
    MEDIUM: { variant: 'warning' as const, label: 'Medium' },
    HIGH: { variant: 'danger' as const, label: 'High' },
  }
  const { variant, label } = map[priority]
  return (
    <Badge variant={variant} size="sm" dot>
      {label}
    </Badge>
  )
}
