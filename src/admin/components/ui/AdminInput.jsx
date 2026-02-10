import { forwardRef } from 'react'

const AdminInput = forwardRef(function AdminInput(
  { label, error, className = '', type = 'text', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-neutral-400">{label}</label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md
          text-white placeholder-neutral-500
          focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
          transition-colors
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export default AdminInput
