import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useApp from '../hooks/useApp'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { role, user, loading } = useApp()
  const location = useLocation()

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: '#6366f1' }}>Connecting to workspace...</div>
  }

  if (!role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user?.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children || <Outlet />
}
