import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { loginSchema, validateField } from '../../utils/validation'
import { useSEO } from '../../hooks/useSEO'

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/account'
  const { login, isAuthenticated } = useAuth()
  const seo = useSEO({ title: 'Sign In', url: '/login', noindex: true })

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate(redirectTo, { replace: true })
    return null
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    if (serverError) setServerError('')
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const result = validateField(loginSchema, field, form[field]?.trim())
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const result = loginSchema.safeParse({
      email: form.email.trim(),
      password: form.password,
    })

    if (!result.success) {
      const newErrors = {}
      for (const err of result.error.issues) {
        const field = err.path[0]
        if (!newErrors[field]) newErrors[field] = err.message
      }
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    const { success, error } = await login(result.data.email, result.data.password)
    setSubmitting(false)

    if (success) {
      navigate(redirectTo, { replace: true })
    } else {
      setServerError(error || 'Invalid email or password')
    }
  }

  return (
    <Layout>
      {seo}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your Mulyam Jewels account</p>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="login-email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                  errors.email && touched.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                id="login-password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                  errors.password && touched.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/account/register" className="text-dark font-medium hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </Layout>
  )
}

export default LoginPage
