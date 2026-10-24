import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useApp from '../hooks/useApp'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { role } = useApp()
  const location = useLocation()

  if (!role) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children || <Outlet />
}
