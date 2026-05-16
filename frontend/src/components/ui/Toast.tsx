import { useToast } from '../../context/ToastContext'
import clsx from 'clsx'

const icons = {
  success: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

const colors = {
  success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  error: 'text-red-400 bg-red-400/10 border-red-400/20',
  info: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium animate-slide-up shadow-modal',
            'bg-bg-elevated/90 backdrop-blur-xl text-text-primary border-bg-border',
          )}
        >
          <span className={clsx('p-1 rounded-md', colors[t.type])}>
            {icons[t.type]}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
