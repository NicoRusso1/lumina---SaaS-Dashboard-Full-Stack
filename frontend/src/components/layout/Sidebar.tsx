import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/auth.store'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Avatar } from '../ui/Avatar'
import { WorkspaceType } from '../../types'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Columns3,
  CheckSquare,
  Timer,
  StickyNote,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Briefcase,
  BookOpen,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/boards', label: 'Boards', icon: Columns3 },
  { to: '/kanban', label: 'Kanban', icon: Columns3 },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/focus', label: 'Focus', icon: Timer },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
]

const workspaces = [
  { id: 'personal' as WorkspaceType, label: 'Personal', icon: User },
  { id: 'work' as WorkspaceType, label: 'Work', icon: Briefcase },
  { id: 'study' as WorkspaceType, label: 'Study', icon: BookOpen },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useLocalStorage('sidebar_collapsed', false)
  const [workspace, setWorkspace] = useLocalStorage<WorkspaceType>('active_workspace', 'personal')
  const [showWorkspaces, setShowWorkspaces] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const activeWs = workspaces.find((w) => w.id === workspace)!

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 224 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative shrink-0 flex flex-col bg-bg-surface border-r border-bg-border h-screen sticky top-0 overflow-hidden"
    >
    {/* Header */}
      <div className={clsx(
        "flex border-b border-bg-border shrink-0 px-3 py-4",
        collapsed ? "flex-col items-center gap-4" : "items-center justify-between"
      )}>
        <div className="flex items-center gap-2.5 min-w-0">
          {collapsed ? (
            /* ✅ MODO COLAPSADO: La L centrada */
            <div className="shrink-0 flex items-center justify-center">
              <img 
                src="/favicon.png" 
                alt="Lumina L" 
                className="w-9 h-9 object-contain" 
              />
            </div>
          ) : (
            /* ✅ MODO EXPANDIDO: Logo completo */
            <div className="w-35 h-20 shrink-0 rounded-lg overflow-hidden flex items-center">
              <img 
                src="/logo.png" 
                alt="Lumina Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          )}
        </div>
        
        {/* ✅ BOTÓN CORREGIDO: Ahora nunca se oculta, cambia de posición según el estado */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      {/* Workspace switcher */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-bg-border shrink-0">
          <button
            onClick={() => setShowWorkspaces(!showWorkspaces)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <activeWs.icon className="w-3.5 h-3.5 text-violet shrink-0" />
            <span className="flex-1 text-left font-medium">{activeWs.label}</span>
            <ChevronRight
              className={clsx(
                'w-3 h-3 transition-transform duration-150',
                showWorkspaces && 'rotate-90'
              )}
            />
          </button>
          <AnimatePresence>
            {showWorkspaces && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden mt-1 space-y-0.5"
              >
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWorkspace(ws.id)
                      setShowWorkspaces(false)
                    }}
                    className={clsx(
                      'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                      workspace === ws.id
                        ? 'bg-violet-subtle text-violet'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    )}
                  >
                    <ws.icon className="w-3 h-3" />
                    {ws.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group relative',
                isActive
                  ? 'nav-active font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={clsx('w-4 h-4 shrink-0', isActive ? 'text-violet' : '')}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-violet/8 pointer-events-none"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-bg-border px-2 py-3 space-y-1 shrink-0">
        <NavLink
          to="/profile"
          title={collapsed ? 'Profile' : undefined}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'nav-active font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            )
          }
        >
          <Avatar src={user?.avatar} name={user?.username} size="xs" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-text-primary truncate">{user?.username}</p>
                <p className="text-[10px] text-text-muted">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-text-secondary hover:text-danger hover:bg-danger/8 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
