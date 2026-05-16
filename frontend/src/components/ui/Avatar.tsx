import clsx from 'clsx'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  online?: boolean
}

const sizeStyles = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
}

const dotSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
}

export function Avatar({ src, name, size = 'md', className, online }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      <div
        className={clsx(
          'rounded-full flex items-center justify-center overflow-hidden',
          'border border-violet/20',
          sizeStyles[size],
          !src && 'bg-violet-subtle'
        )}
      >
        {src ? (
          <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span className="font-semibold text-violet">{initials}</span>
        )}
      </div>
      {online && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full bg-success border-2 border-bg-base',
            dotSizeStyles[size]
          )}
        />
      )}
    </div>
  )
}
