import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="page-shell">
      <Navbar />
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .dashboard-shell { display: flex; align-items: flex-start; }
        .dashboard-content { flex: 1; min-width: 0; padding: 32px 28px 60px; }
      `}</style>
    </div>
  )
}
