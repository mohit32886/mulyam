import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const typeStyles = {
  success: {
    bg: 'bg-green-500',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-500',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-500',
    icon: Info,
  },
}

function Toast({ message, type = 'success', onClose, isVisible, duration = 5000 }) {
  const { bg, icon: Icon } = typeStyles[type] || typeStyles.success

  // Auto-dismiss
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 pointer-events-none">
      <div
        className={`${bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md pointer-events-auto animate-slide-down`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
