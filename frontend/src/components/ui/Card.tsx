import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className, hover, glass, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-bg-border bg-bg-surface',
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        glass && 'glass',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
