import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/use-auth'
import DashboardLayout from './DashboardLayout'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <DashboardLayout />
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/contacts" replace />
  }

  return <Outlet />
}