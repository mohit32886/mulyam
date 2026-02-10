import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { AdminButton, AdminInput, AdminSelect, AdminToggle } from '../ui'

function CouponModal({ isOpen, onClose, onSave, coupon = null }) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    maxUses: 0,
    isActive: true,
  })

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue || 10,
        minOrderAmount: coupon.minOrderAmount || 0,
        maxUses: coupon.maxUses || 0,
        isActive: coupon.isActive !== false,
      })
    } else {
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        maxUses: 0,
        isActive: true,
      })
    }
  }, [coupon, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: coupon?.id || Date.now().toString(),
      usedCount: coupon?.usedCount || 0,
    })
  }

  if (!isOpen) return null

  const isEditing = !!coupon

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50">
        <div className="bg-admin-card border border-admin-border rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Coupon' : 'New Coupon'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Coupon Code *
              </label>
              <AdminInput
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., WELCOME10"
                required
              />
              <p className="text-xs text-neutral-600 mt-1">
                Customers will enter this code at checkout
              </p>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Description
              </label>
              <AdminInput
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="e.g., Welcome discount for new customers"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Discount Type
                </label>
                <AdminSelect
                  value={formData.discountType}
                  onChange={(e) => handleChange('discountType', e.target.value)}
                  options={[
                    { value: 'percentage', label: 'Percentage (%)' },
                    { value: 'fixed', label: 'Flat Amount (Rs)' },
                    { value: 'freeShipping', label: 'Free Shipping' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  {formData.discountType === 'percentage' ? 'Discount (%)' : 'Discount (Rs)'}
                </label>
                <AdminInput
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => handleChange('discountValue', parseInt(e.target.value) || 0)}
                  disabled={formData.discountType === 'freeShipping'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Min Order Amount (Rs)
                </label>
                <AdminInput
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => handleChange('minOrderAmount', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-neutral-600 mt-1">0 = No minimum</p>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Max Uses
                </label>
                <AdminInput
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => handleChange('maxUses', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-neutral-600 mt-1">0 = Unlimited</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-admin-card-hover rounded-lg">
              <div>
                <p className="text-white">Active</p>
                <p className="text-sm text-neutral-500">Coupon can be used at checkout</p>
              </div>
              <AdminToggle
                checked={formData.isActive}
                onChange={(checked) => handleChange('isActive', checked)}
              />
            </div>

            {/* Preview */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-400">
                Preview: {formData.code || 'CODE'} - {' '}
                {formData.discountType === 'freeShipping'
                  ? 'Free Shipping'
                  : formData.discountType === 'percentage'
                    ? `${formData.discountValue}% off`
                    : `Rs ${formData.discountValue} off`
                }
                {formData.minOrderAmount > 0 && ` on orders above Rs ${formData.minOrderAmount}`}
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-admin-border">
            <AdminButton variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Create Coupon'}
            </AdminButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default CouponModal
