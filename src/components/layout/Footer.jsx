import { Link } from 'react-router-dom'
import { Instagram, MessageCircle } from 'lucide-react'

const shopLinks = [
  { to: '/diva', label: 'DIVA' },
  { to: '/mini', label: 'MINI' },
  { to: '/paws', label: 'PAWS' },
  { to: '/collections/custom', label: 'BOND' },
]

const helpLinks = [
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns & Refunds' },
  { to: '/cancellation', label: 'Cancellation' },
  { to: '/warranty', label: 'Warranty' },
  { to: '/care-guide', label: 'Care Guide' },
  { to: '/faq', label: 'FAQs' },
]

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/collaborations', label: 'Collaborations' },
]

function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <img
                src="/logo.svg"
                alt="Mulyam Jewels"
                className="h-6 brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Elegant demi-fine jewelry crafted with intention. For women, kids, pets & personalized pieces.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com/mulyam_jewels"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Follow on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/919523882449"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-white/50 mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-white/50 mb-4">
              Help
            </h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-white/50 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="font-body text-xs uppercase tracking-wider text-white/50 mb-4">
              Get in Touch
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Questions? We're here to help.
            </p>
            <a
              href="https://wa.me/919523882449"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-caramel text-white px-4 py-2 rounded text-sm font-medium hover:bg-caramel-dark transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            © 2026 Mulyam Jewels. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-white/50 text-xs hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white/50 text-xs hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
