import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader2 } from 'lucide-react'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-tan animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/account/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return children
}

export default ProtectedRoute
