import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { registerSchema, validateField } from '../../utils/validation'
import { useSEO } from '../../hooks/useSEO'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const seo = useSEO({ title: 'Create Account', url: '/register', noindex: true })

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  if (isAuthenticated) {
    navigate('/account', { replace: true })
    return null
  }

  const handleChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10)
    }
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    if (serverError) setServerError('')
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const result = validateField(registerSchema, field, form[field]?.trim())
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]))
    setTouched(allTouched)

    const result = registerSchema.safeParse({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
    })

    if (!result.success) {
      const newErrors = {}
      for (const err of result.error.errors) {
        const field = err.path[0]
        if (!newErrors[field]) newErrors[field] = err.message
      }
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    const { success, error } = await register(result.data)
    setSubmitting(false)

    if (success) {
      navigate('/account', { replace: true })
    } else {
      setServerError(error || 'Registration failed. Please try again.')
    }
  }

  return (
    <Layout>
      {seo}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Mulyam Jewels for a seamless shopping experience</p>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-first-name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="reg-first-name"
                  value={form.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  onBlur={() => handleBlur('first_name')}
                  placeholder="First name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                    errors.first_name && touched.first_name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.first_name && touched.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-last-name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="reg-last-name"
                value={form.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                onBlur={() => handleBlur('last_name')}
                placeholder="Last name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                  errors.last_name && touched.last_name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                }`}
              />
              {errors.last_name && touched.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                id="reg-email"
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

          {/* Phone */}
          <div>
            <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  id="reg-phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                    errors.phone && touched.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                id="reg-password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Min 8 characters"
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/account/login" className="text-dark font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </Layout>
  )
}

export default RegisterPage
