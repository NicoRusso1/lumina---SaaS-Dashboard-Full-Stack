import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 disabled:opacity-40 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:
      'bg-violet text-white hover:bg-violet-dim active:scale-[0.97] shadow-glow-sm hover:shadow-glow',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-bg-elevated active:scale-[0.97]',
    danger:
      'text-danger hover:bg-danger/10 active:scale-[0.97]',
    outline:
      'border border-bg-border text-text-secondary hover:border-violet/40 hover:text-text-primary hover:bg-bg-elevated active:scale-[0.97]',
    subtle:
      'bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-bg-overlay active:scale-[0.97]',
  }

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 h-7',
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-9',
    lg: 'text-sm px-5 py-2.5 h-10',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}
