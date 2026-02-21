import { useState } from 'react'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { checkoutContactSchema, validateField } from '../../utils/validation'

function ContactInfoStep({ initialEmail, initialPhone, onSubmit, loading }) {
  const [form, setForm] = useState({
    email: initialEmail || '',
    phone: initialPhone || '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10)
    }
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const result = validateField(checkoutContactSchema, field, form[field]?.trim())
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = checkoutContactSchema.safeParse({
      email: form.email.trim(),
      phone: form.phone.trim(),
    })

    setTouched({ email: true, phone: true })

    if (!result.success) {
      const newErrors = {}
      for (const err of result.error.issues) {
        const field = err.path[0]
        if (!newErrors[field]) newErrors[field] = err.message
      }
      setErrors(newErrors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold mb-1">Contact Information</h2>
        <p className="text-sm text-gray-500 mb-5">We'll use this to send your order confirmation.</p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            id="checkout-email"
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
        <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">
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
              id="checkout-phone"
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

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Continue to Address'}
        {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </form>
  )
}

export default ContactInfoStep
