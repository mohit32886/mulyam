import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { AdminButton, AdminInput } from '../components/ui'

function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-400 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-black font-serif font-bold text-3xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white">MULYAM</h1>
          <p className="text-neutral-400 mt-1">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-admin-card border border-admin-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />

            <AdminInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <AdminButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </AdminButton>
          </form>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-6">
          Mulyam Jewels Admin v1.0
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage
