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

// Admin Pages & Components
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
import ProtectedRoute from './admin/components/ProtectedRoute'

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

      {/* Checkout */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Admin Routes - Login is public, others are protected */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/catalogue" element={<ProtectedRoute><CataloguePage /></ProtectedRoute>} />
      <Route path="/admin/catalogue/new" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
      <Route path="/admin/catalogue/content-studio" element={<ProtectedRoute><ContentStudioPage /></ProtectedRoute>} />
      <Route path="/admin/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/admin/images" element={<ProtectedRoute><ImagesPage /></ProtectedRoute>} />
      <Route path="/admin/time-machine" element={<ProtectedRoute><TimeMachinePage /></ProtectedRoute>} />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
