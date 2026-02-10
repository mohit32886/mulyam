import { createContext, useState, useEffect } from 'react'

export const AdminAuthContext = createContext(null)

const ADMIN_CREDENTIALS = {
  username: 'mulyam',
  password: 'divaminipaws',
}

const AUTH_STORAGE_KEY = 'mulyam_admin_auth'

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.isAuthenticated) {
          setIsAuthenticated(true)
          setUser(data.user)
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const userData = { username, name: 'Admin' }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isAuthenticated: true, user: userData })
      )
      return { success: true }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
