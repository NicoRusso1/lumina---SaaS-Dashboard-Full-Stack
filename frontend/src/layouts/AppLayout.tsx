import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '../components/layout/Sidebar'
import { Navbar } from '../components/layout/Navbar'
import { Modal } from '../components/ui/Modal'
import { Search, Columns3, CheckSquare, X } from 'lucide-react'

export function AppLayout() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onSearch={() => setSearchOpen(true)}
          onQuickCreate={() => setCreateOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Global Search */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-bg-elevated border border-bg-border rounded-2xl shadow-modal overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-bg-border">
                <Search className="w-4 h-4 text-text-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search tasks, boards, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2 text-center py-10 text-text-muted">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Start typing to search...</p>
              </div>

              <div className="px-4 py-2 border-t border-bg-border flex items-center gap-4 text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-overlay border border-bg-border font-mono">↵</kbd>
                  to select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-overlay border border-bg-border font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-overlay border border-bg-border font-mono">esc</kbd>
                  close
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Create */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Quick Create">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { navigate('/boards'); setCreateOpen(false) }}
            className="flex flex-col items-center gap-3 p-5 rounded-xl border border-bg-border hover:border-violet/40 hover:bg-violet-subtle transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-overlay flex items-center justify-center group-hover:bg-violet/10 transition-colors">
              <Columns3 className="w-5 h-5 text-violet" />
            </div>
            <span className="text-sm font-medium text-text-primary">New Board</span>
          </button>
          <button
            onClick={() => { navigate('/tasks'); setCreateOpen(false) }}
            className="flex flex-col items-center gap-3 p-5 rounded-xl border border-bg-border hover:border-violet/40 hover:bg-violet-subtle transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-overlay flex items-center justify-center group-hover:bg-violet/10 transition-colors">
              <CheckSquare className="w-5 h-5 text-violet" />
            </div>
            <span className="text-sm font-medium text-text-primary">New Task</span>
          </button>
        </div>
      </Modal>
    </div>
  )
}
