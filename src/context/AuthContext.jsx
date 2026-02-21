import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import medusa from '../lib/medusa-client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { customer: existingCustomer } = await medusa.store.customer.retrieve()
        setCustomer(existingCustomer)
      } catch (err) {
        // No active session - that's fine
        setCustomer(null)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      await medusa.auth.login("customer", "emailpass", { email, password })
      const { customer: loggedInCustomer } = await medusa.store.customer.retrieve()
      setCustomer(loggedInCustomer)
      return { success: true }
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ first_name, last_name, email, password, phone }) => {
    try {
      setError(null)
      setLoading(true)
      await medusa.auth.register("customer", "emailpass", { email, password })
      // Auto-login after registration
      await medusa.auth.login("customer", "emailpass", { email, password })
      // Update customer profile with name and phone
      const { customer: newCustomer } = await medusa.store.customer.update({
        first_name,
        last_name,
        phone,
      })
      setCustomer(newCustomer)
      return { success: true }
    } catch (err) {
      const message = err.message || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await medusa.auth.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setCustomer(null)
      setError(null)
    }
  }, [])

  const value = {
    customer,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!customer,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
