import { Navigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext.jsx'

function AdminRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p>Checking authentication...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute