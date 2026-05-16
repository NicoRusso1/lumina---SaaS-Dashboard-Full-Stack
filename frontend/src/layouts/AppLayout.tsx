import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/layout/Sidebar'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
