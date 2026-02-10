import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, ChevronDown, ExternalLink } from 'lucide-react'
import { useAdminAuth } from '../../hooks'

function UserDropdownMenu() {
  const navigate = useNavigate()
  const { logout, user } = useAdminAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-admin-card-hover transition-colors"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">A</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-admin-card border border-admin-border rounded-lg shadow-xl overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-admin-border">
            <p className="text-white font-medium">Admin User</p>
            <p className="text-sm text-neutral-500">admin@mulyamjewels.com</p>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <button
              onClick={() => {
                navigate('/admin/settings')
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:bg-admin-card-hover rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:bg-admin-card-hover rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Store</span>
            </a>
          </div>

          {/* Logout */}
          <div className="p-1 border-t border-admin-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropdownMenu
