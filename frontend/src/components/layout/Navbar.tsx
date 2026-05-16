import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/auth.store'
import { Avatar } from '../ui/Avatar'
import { Search, Plus, Bell, ChevronDown, Settings, User, LogOut, Command } from 'lucide-react'
import clsx from 'clsx'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/boards': 'Boards',
  '/kanban': 'Kanban',
  '/tasks': 'Tasks',
  '/focus': 'Focus',
  '/notes': 'Notes',
  '/calendar': 'Calendar',
  '/profile': 'Profile',
}

interface NavbarProps {
  onSearch?: () => void
  onQuickCreate?: () => void
}

export function Navbar({ onSearch, onQuickCreate }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const pageLabel = routeLabels[location.pathname] || 'Lumina'

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onSearch])

  return (
    <header className="h-14 border-b border-bg-border bg-bg-surface/80 backdrop-blur-md flex items-center px-5 gap-4 sticky top-0 z-30">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-text-primary">{pageLabel}</h1>
      </div>

      {/* Search */}
      <button
        onClick={onSearch}
        className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-bg-border text-text-muted hover:border-violet/30 hover:text-text-secondary transition-all text-xs"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="ml-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-overlay text-text-muted text-[10px] font-mono border border-bg-border">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Quick create */}
      <button
        onClick={onQuickCreate}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet text-white text-xs font-medium hover:bg-violet-dim transition-all shadow-glow-sm hover:shadow-glow"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>New</span>
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet" />
      </button>

      {/* Profile dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          <Avatar src={user?.avatar} name={user?.username} size="sm" online />
          <ChevronDown
            className={clsx('w-3 h-3 text-text-muted transition-transform', dropdownOpen && 'rotate-180')}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 bg-bg-elevated border border-bg-border rounded-xl shadow-modal overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-bg-border">
                <p className="text-sm font-medium text-text-primary">{user?.username}</p>
                <p className="text-xs text-text-muted">{user?.email}</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <DropdownItem
                  icon={User}
                  label="Profile"
                  onClick={() => { navigate('/profile'); setDropdownOpen(false) }}
                />
                <DropdownItem
                  icon={Settings}
                  label="Settings"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="border-t border-bg-border my-1" />
                <DropdownItem
                  icon={LogOut}
                  label="Logout"
                  danger
                  onClick={() => { logout(); navigate('/login') }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
        danger
          ? 'text-danger hover:bg-danger/8'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-overlay'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
