import { forwardRef } from 'react'

const variants = {
  primary: 'bg-dark text-white hover:bg-black',
  secondary: 'border border-dark text-dark hover:bg-dark hover:text-white',
  coral: 'bg-caramel text-white hover:bg-caramel-dark',
  caramel: 'bg-caramel text-white hover:bg-caramel-dark',
  ghost: 'text-dark hover:bg-beige',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-colors duration-200
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

Button.displayName = 'Button'

export default Button
