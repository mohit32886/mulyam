import { Routes, Route, Navigate } from 'react-router-dom'

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
} from './pages'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Login - public */}
      <Route path="/login" element={<AdminLoginPage />} />

      {/* Protected admin routes - at root since this is a separate domain */}
      <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/catalogue" element={<ProtectedRoute><CataloguePage /></ProtectedRoute>} />
      <Route path="/catalogue/new" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
      <Route path="/catalogue/content-studio" element={<ProtectedRoute><ContentStudioPage /></ProtectedRoute>} />
      <Route path="/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/images" element={<ProtectedRoute><ImagesPage /></ProtectedRoute>} />
      <Route path="/time-machine" element={<ProtectedRoute><TimeMachinePage /></ProtectedRoute>} />

      {/* 404 - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
