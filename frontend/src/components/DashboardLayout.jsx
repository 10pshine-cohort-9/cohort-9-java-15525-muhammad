import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function DashboardLayout() {
  return (
    <div className="shell">
      <Navbar />
      <main className="page">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}