import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import { CartDrawer } from '../cart'
import { SearchModal } from '../search'
import { Toast } from '../ui'
import { useCart } from '../../context/CartContext'
import { useStoreBanners, useStoreSettings } from '../../hooks'

const ORDER_SENT_KEY = 'mulyam-order-sent'

function Layout({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [showOrderToast, setShowOrderToast] = useState(false)
  const { totals, openCart } = useCart()
  const location = useLocation()

  // Hide announcement bar on homepage
  const isHomePage = location.pathname === '/'

  // Fetch announcement banners and settings from Supabase
  const { banners } = useStoreBanners({ type: 'announcement' })
  const { settings } = useStoreSettings()

  // Check for order sent flag on mount
  useEffect(() => {
    const orderSent = localStorage.getItem(ORDER_SENT_KEY)
    if (orderSent === 'true') {
      setShowOrderToast(true)
      localStorage.removeItem(ORDER_SENT_KEY)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {!isHomePage && (
        <AnnouncementBar
          banners={banners || []}
          rotationInterval={(settings.bannerRotationSpeed || 3) * 1000}
        />
      )}
      <Header
        onSearchClick={() => setSearchOpen(true)}
        onCartClick={openCart}
        cartCount={totals.itemCount}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Order Sent Toast */}
      <Toast
        message="Order sent to WhatsApp! We'll confirm your order shortly."
        type="success"
        isVisible={showOrderToast}
        onClose={() => setShowOrderToast(false)}
        duration={5000}
      />
    </div>
  )
}

export default Layout
