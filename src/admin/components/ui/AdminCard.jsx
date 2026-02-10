function AdminCard({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-admin-card border border-admin-border rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

function AdminCardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-admin-border ${className}`}>
      {children}
    </div>
  )
}

function AdminCardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export { AdminCard, AdminCardHeader, AdminCardContent }
export default AdminCard
