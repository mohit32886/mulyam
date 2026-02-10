import { Navigate } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import { useAdminAuth } from '../../hooks/useAdminAuth'

function AdminLayout({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminHeader />
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout
