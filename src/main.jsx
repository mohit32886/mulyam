import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './admin/context'
import { ToastProvider } from './admin/components/ui'
import ScrollToTop from './components/ScrollToTop'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AdminAuthProvider>
        <ToastProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
