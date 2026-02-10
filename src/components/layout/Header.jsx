import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, Instagram, MessageCircle } from 'lucide-react'

const navLinks = [
  { to: '/diva', label: 'Mulyam DIVA' },
  { to: '/mini', label: 'Mulyam MINI' },
  { to: '/paws', label: 'Mulyam PAWS' },
  { to: '/collections/custom', label: 'Mulyam BOND' },
]

function Header({ onSearchClick, onCartClick, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo & Search */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Mulyam Jewels"
                className="h-7"
              />
            </Link>
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-dark" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors ${
                    isActive ? 'text-coral' : 'text-dark hover:text-coral'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919523882449"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-dark" />
            </a>
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Follow on Instagram"
            >
              <Instagram className="w-5 h-5 text-dark" />
            </a>
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-14">
          {/* Left: Menu + Logo + Search */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="w-5 h-5 text-dark" />
            </button>
            <Link to="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Mulyam Jewels"
                className="h-5"
              />
            </Link>
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-dark" />
            </button>
          </div>

          {/* Right: Social + Cart */}
          <div className="flex items-center gap-1">
            <a
              href="https://wa.me/919523882449"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-dark" />
            </a>
            <a
              href="https://instagram.com/mulyam_jewels"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Follow on Instagram"
            >
              <Instagram className="w-5 h-5 text-dark" />
            </a>
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Slide-in Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white animate-slide-in-left">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-border">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-dark" />
              </button>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img
                  src="/logo.svg"
                  alt="Mulyam Jewels"
                  className="h-6"
                />
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onSearchClick()
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-dark" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <nav className="px-6 py-8 overflow-y-auto h-[calc(100%-4rem)] flex flex-col">
              {/* Shop By Category Section */}
              <div className="mb-8">
                <h3 className="font-display italic text-lg text-dark mb-4">
                  Shop By Category
                </h3>
                <div className="space-y-3 pl-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-base transition-colors ${
                          isActive ? 'text-coral' : 'text-gray-600 hover:text-dark'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="mb-8">
                <h3 className="font-display font-semibold text-lg text-dark mb-4">
                  Contact Us
                </h3>
                <div className="space-y-3 pl-1">
                  <a
                    href="https://instagram.com/mulyam_jewels"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-dark transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://wa.me/919523882449"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-dark transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Whatsapp</span>
                  </a>
                </div>
              </div>

              {/* Footer Links */}
              <div className="mt-auto pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center mb-3">
                  © 2026 Mulyam Jewels. All rights reserved.
                </p>
                <div className="flex justify-center gap-6">
                  <Link
                    to="/privacy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-500 hover:text-dark transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-500 hover:text-dark transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
    </header>
  )
}

export default Header
