const variants = {
  default: 'bg-neutral-700 text-neutral-300',
  success: 'bg-green-500/20 text-green-500',
  warning: 'bg-yellow-500/20 text-yellow-500',
  danger: 'bg-red-500/20 text-red-500',
  info: 'bg-blue-500/20 text-blue-500',
  orange: 'bg-orange-500/20 text-orange-500',
}

function AdminBadge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default AdminBadge
