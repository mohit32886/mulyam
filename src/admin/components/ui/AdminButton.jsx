import { forwardRef } from 'react'

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white',
  secondary: 'bg-neutral-700 hover:bg-neutral-600 text-white',
  ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-300',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500',
  success: 'bg-green-500/10 hover:bg-green-500/20 text-green-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const AdminButton = forwardRef(function AdminButton(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
})

export default AdminButton
