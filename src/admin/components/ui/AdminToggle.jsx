function AdminToggle({ checked, onChange, disabled = false, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  }

  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const translateX = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7',
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex items-center rounded-full transition-colors
        ${sizes[size]}
        ${checked ? 'bg-orange-500' : 'bg-neutral-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white transition-transform
          ${dotSizes[size]}
          ${checked ? translateX[size] : 'translate-x-0.5'}
        `}
      />
    </button>
  )
}

export default AdminToggle
