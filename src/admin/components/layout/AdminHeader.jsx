import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, ExternalLink, ChevronDown } from 'lucide-react'
import { SearchModal, UserDropdownMenu } from '../ui'

const navLinks = [
  { to: '/admin/catalogue', label: 'Catalogue', hasDropdown: true },
  { to: '/admin/images', label: 'Images' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/time-machine', label: 'Time Machine' },
  { to: '/admin/settings', label: 'Settings', hasDropdown: true },
]

function AdminHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 bg-admin-bg border-b border-admin-border">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link to="/admin" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-200 to-amber-400 rounded flex items-center justify-center">
                <span className="text-black font-serif font-bold text-lg">M</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'text-white bg-admin-card-hover'
                        : 'text-neutral-400 hover:text-white hover:bg-admin-card-hover'
                    }`
                  }
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-admin-card-hover border border-admin-border rounded-md text-neutral-400 hover:text-white hover:border-[#3a3a45] transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">
                <span className="px-1.5 py-0.5 bg-admin-border rounded text-[10px]">Cmd</span>
                <span className="ml-1">K</span>
              </span>
            </button>

            {/* Store Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <span className="hidden sm:inline">Store</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* User Dropdown Menu */}
            <UserDropdownMenu />
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default AdminHeader
