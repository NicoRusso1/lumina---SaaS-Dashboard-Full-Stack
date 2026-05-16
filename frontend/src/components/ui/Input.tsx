import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-bg-elevated border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted',
            'transition-colors duration-150 outline-none',
            'focus:border-violet/60 focus:bg-bg-overlay',
            error
              ? 'border-red-400/40'
              : 'border-bg-border hover:border-bg-overlay',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
