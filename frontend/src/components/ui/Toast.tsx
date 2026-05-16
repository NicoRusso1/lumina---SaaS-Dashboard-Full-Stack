import { useToast } from '../../context/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'

const config = {
  success: {
    icon: CheckCircle,
    className: 'text-success border-success/20 bg-success/5',
  },
  error: {
    icon: XCircle,
    className: 'text-danger border-danger/20 bg-danger/5',
  },
  info: {
    icon: Info,
    className: 'text-violet border-violet/20 bg-violet-subtle',
  },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const { icon: Icon, className } = config[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-modal',
                'bg-bg-elevated/95 backdrop-blur-xl text-text-primary',
                className
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-text-primary">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-1 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
