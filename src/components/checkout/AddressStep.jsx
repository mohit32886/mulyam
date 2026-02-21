import { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../ui'
import { checkoutAddressSchema, validateField } from '../../utils/validation'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

function AddressStep({ initialAddress, initialPhone, onSubmit, onBack, loading }) {
  const [form, setForm] = useState({
    first_name: initialAddress?.first_name || '',
    last_name: initialAddress?.last_name || '',
    address_1: initialAddress?.address_1 || '',
    address_2: initialAddress?.address_2 || '',
    city: initialAddress?.city || '',
    province: initialAddress?.province || '',
    postal_code: initialAddress?.postal_code || '',
    phone: initialAddress?.phone || initialPhone || '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10)
    }
    if (field === 'postal_code') {
      value = value.replace(/\D/g, '').slice(0, 6)
    }
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const result = validateField(checkoutAddressSchema, field, form[field]?.trim?.() ?? form[field])
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = {}
    for (const [key, val] of Object.entries(form)) {
      trimmed[key] = typeof val === 'string' ? val.trim() : val
    }

    const result = checkoutAddressSchema.safeParse(trimmed)

    // Mark all touched
    const allTouched = {}
    for (const key of Object.keys(form)) allTouched[key] = true
    setTouched(allTouched)

    if (!result.success) {
      const newErrors = {}
      for (const err of result.error.issues) {
        const field = err.path[0]
        if (!newErrors[field]) newErrors[field] = err.message
      }
      setErrors(newErrors)
      return
    }

    onSubmit({
      ...result.data,
      country_code: 'in',
    })
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
      errors[field] && touched[field] ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-semibold mb-1">Shipping Address</h2>
        <p className="text-sm text-gray-500 mb-5">Where should we deliver your order?</p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="addr-first-name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addr-first-name"
            value={form.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            onBlur={() => handleBlur('first_name')}
            placeholder="First name"
            className={inputClass('first_name')}
          />
          {errors.first_name && touched.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>
        <div>
          <label htmlFor="addr-last-name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addr-last-name"
            value={form.last_name}
            onChange={(e) => handleChange('last_name', e.target.value)}
            onBlur={() => handleBlur('last_name')}
            placeholder="Last name"
            className={inputClass('last_name')}
          />
          {errors.last_name && touched.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>

      {/* Address line 1 */}
      <div>
        <label htmlFor="addr-address1" className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="addr-address1"
          value={form.address_1}
          onChange={(e) => handleChange('address_1', e.target.value)}
          onBlur={() => handleBlur('address_1')}
          placeholder="House/Flat No., Building, Street"
          className={inputClass('address_1')}
        />
        {errors.address_1 && touched.address_1 && (
          <p className="text-red-500 text-sm mt-1">{errors.address_1}</p>
        )}
      </div>

      {/* Address line 2 */}
      <div>
        <label htmlFor="addr-address2" className="block text-sm font-medium text-gray-700 mb-1">
          Apartment, Landmark <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          id="addr-address2"
          value={form.address_2}
          onChange={(e) => handleChange('address_2', e.target.value)}
          placeholder="Apartment, suite, landmark, etc."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors"
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="addr-city" className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addr-city"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            placeholder="City"
            className={inputClass('city')}
          />
          {errors.city && touched.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="addr-state" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="addr-state"
            value={form.province}
            onChange={(e) => handleChange('province', e.target.value)}
            onBlur={() => handleBlur('province')}
            className={inputClass('province')}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.province && touched.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
          )}
        </div>
      </div>

      {/* Pincode + Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="addr-pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="addr-pincode"
            value={form.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            onBlur={() => handleBlur('postal_code')}
            placeholder="6-digit pincode"
            className={inputClass('postal_code')}
          />
          {errors.postal_code && touched.postal_code && (
            <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
          )}
        </div>
        <div>
          <label htmlFor="addr-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="addr-phone"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="10-digit mobile"
            className={inputClass('phone')}
          />
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-[2]"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue to Shipping'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </form>
  )
}

export default AddressStep
