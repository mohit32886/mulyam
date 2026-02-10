import { Routes, Route, Navigate } from 'react-router-dom'

// Pages
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import ShippingPage from './pages/ShippingPage'
import ReturnsPage from './pages/ReturnsPage'
import SizeGuidePage from './pages/SizeGuidePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import WarrantyPage from './pages/WarrantyPage'
import CareGuidePage from './pages/CareGuidePage'
import CancellationPage from './pages/CancellationPage'
import CollaborationsPage from './pages/CollaborationsPage'

// Admin Pages
import {
  AdminLoginPage,
  AdminDashboard,
  CataloguePage,
  AddProductPage,
  ContentStudioPage,
  OffersPage,
  SettingsPage,
  ImagesPage,
  TimeMachinePage,
} from './admin/pages'

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Collections */}
      <Route path="/diva" element={<CollectionPage />} />
      <Route path="/mini" element={<CollectionPage />} />
      <Route path="/paws" element={<CollectionPage />} />
      <Route path="/collections/custom" element={<CollectionPage />} />

      {/* Generic collection route */}
      <Route path="/:collectionId" element={<CollectionPage />} />

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

      {/* Checkout */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Redirects for legacy URLs */}
      <Route path="/bond" element={<Navigate to="/collections/custom" replace />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/catalogue" element={<CataloguePage />} />
      <Route path="/admin/catalogue/new" element={<AddProductPage />} />
      <Route path="/admin/catalogue/content-studio" element={<ContentStudioPage />} />
      <Route path="/admin/offers" element={<OffersPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/images" element={<ImagesPage />} />
      <Route path="/admin/time-machine" element={<TimeMachinePage />} />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
