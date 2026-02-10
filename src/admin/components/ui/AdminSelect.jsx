import { forwardRef } from 'react'

const AdminSelect = forwardRef(function AdminSelect(
  { label, options = [], className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-neutral-400">{label}</label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md
          text-white
          focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
          transition-colors appearance-none cursor-pointer
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
})

export default AdminSelect
