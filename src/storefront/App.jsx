import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import HomePage from '../pages/HomePage'
import CollectionPage from '../pages/CollectionPage'
import ProductPage from '../pages/ProductPage'
import CheckoutPage from '../pages/CheckoutPage'
import AboutPage from '../pages/AboutPage'
import FAQPage from '../pages/FAQPage'
import ContactPage from '../pages/ContactPage'
import ShippingPage from '../pages/ShippingPage'
import ReturnsPage from '../pages/ReturnsPage'
import SizeGuidePage from '../pages/SizeGuidePage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import WarrantyPage from '../pages/WarrantyPage'
import CareGuidePage from '../pages/CareGuidePage'
import CancellationPage from '../pages/CancellationPage'
import CollaborationsPage from '../pages/CollaborationsPage'
import LoginPage from '../pages/account/LoginPage'
import RegisterPage from '../pages/account/RegisterPage'
import AccountPage from '../pages/account/AccountPage'
import OrdersPage from '../pages/account/OrdersPage'
import OrderDetailPage from '../pages/account/OrderDetailPage'

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Collections - explicit routes for SEO-friendly URLs */}
      <Route path="/collections/diva" element={<CollectionPage />} />
      <Route path="/collections/mini" element={<CollectionPage />} />
      <Route path="/collections/paws" element={<CollectionPage />} />
      <Route path="/collections/custom" element={<CollectionPage />} />
      <Route path="/collections/:collectionId" element={<CollectionPage />} />

      {/* Legacy collection URLs - redirect to new format */}
      <Route path="/diva" element={<Navigate to="/collections/diva" replace />} />
      <Route path="/mini" element={<Navigate to="/collections/mini" replace />} />
      <Route path="/paws" element={<Navigate to="/collections/paws" replace />} />
      <Route path="/bond" element={<Navigate to="/collections/custom" replace />} />

      {/* Product Detail */}
      <Route path="/products/:productId" element={<ProductPage />} />

      {/* Static Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/size-guide" element={<SizeGuidePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/warranty" element={<WarrantyPage />} />
      <Route path="/care-guide" element={<CareGuidePage />} />
      <Route path="/cancellation" element={<CancellationPage />} />
      <Route path="/collaborations" element={<CollaborationsPage />} />

      {/* Account */}
      <Route path="/account/login" element={<LoginPage />} />
      <Route path="/account/register" element={<RegisterPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/orders" element={<OrdersPage />} />
      <Route path="/account/orders/:orderId" element={<OrderDetailPage />} />

      {/* Checkout */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
