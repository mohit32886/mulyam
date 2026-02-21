import { useState } from 'react'
import { Pencil, X, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import medusa from '../../lib/medusa-client'
import { profileUpdateSchema, validateField } from '../../utils/validation'

function ProfileSection() {
  const { customer } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    phone: customer?.phone || '',
  })
  const [errors, setErrors] = useState({})

  const startEditing = () => {
    setForm({
      first_name: customer?.first_name || '',
      last_name: customer?.last_name || '',
      phone: customer?.phone || '',
    })
    setErrors({})
    setError('')
    setSuccess('')
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setErrors({})
    setError('')
  }

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
    const result = validateField(profileUpdateSchema, field, form[field]?.trim())
    if (!result.success) {
      setErrors(prev => ({ ...prev, [field]: result.error }))
    }
  }

  const handleSave = async () => {
    const result = profileUpdateSchema.safeParse({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
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

    setSaving(true)
    setError('')
    try {
      await medusa.store.customer.update({
        first_name: result.data.first_name,
        last_name: result.data.last_name,
        phone: result.data.phone || undefined,
      })
      setSuccess('Profile updated successfully')
      setEditing(false)
      // Refresh customer data by reloading
      window.location.reload()
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!customer) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        {!editing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEditing}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-dark transition-colors"
              disabled={saving}
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 rounded-lg mb-4">{success}</div>
      )}

      <div className="space-y-4">
        {/* Name */}
        {editing ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                onBlur={() => handleBlur('first_name')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan text-sm ${
                  errors.first_name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                onBlur={() => handleBlur('last_name')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan text-sm ${
                  errors.last_name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Name</p>
            <p className="text-sm text-gray-900">{customer.first_name} {customer.last_name}</p>
          </div>
        )}

        {/* Email (always read-only) */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-0.5">Email</p>
          <p className="text-sm text-gray-900">{customer.email}</p>
        </div>

        {/* Phone */}
        {editing ? (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-xs">
                +91
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="10-digit mobile number"
                className={`w-full px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-tan text-sm ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Phone</p>
            <p className="text-sm text-gray-900">{customer.phone ? `+91 ${customer.phone}` : '—'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSection
