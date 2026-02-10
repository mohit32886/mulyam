import { createContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)

  // Check for existing Supabase session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsAuthenticated(!!session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUser(null)
    setSession(null)
  }, [])

  // Verify session is still valid (call this periodically or on sensitive operations)
  const verifySession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      setIsAuthenticated(false)
      setUser(null)
      setSession(null)
      return false
    }
    return true
  }, [])

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        login,
        logout,
        verifySession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
