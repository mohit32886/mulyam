import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, MessageCircle, ShoppingBag, Package, Truck, Tag } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Button } from '../components/ui'
import { useCart } from '../context/CartContext'
import { sanitizeFormData, sanitizeText } from '../utils/sanitize'
import { checkoutFormSchema, validateField } from '../utils/validation'
import { PageSEO } from '../seo'

// Collection name mapping
const collectionNames = {
  'diva': 'Mulyam DIVA',
  'mini': 'Mulyam MINI',
  'paws': 'Mulyam PAWS',
  'custom': 'Mulyam BOND',
}

const SHIPPING_COST = 49
const FREE_SHIPPING_THRESHOLD = 1499

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totals, appliedCoupon, closeCart, clearCart } = useCart()

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Calculate shipping
  const shipping = totals.total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const finalTotal = totals.total + shipping

  // Handle input change
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Handle field blur
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateFormField(field, form[field])
  }

  // Validate single field using zod schema
  const validateFormField = (field, value) => {
    const result = validateField(checkoutFormSchema, field, value?.trim?.() ?? value)
    const error = result.success ? null : result.error
    setErrors(prev => ({ ...prev, [field]: error }))
    return result.success
  }

  // Validate all fields using zod schema
  const validateAll = () => {
    const result = checkoutFormSchema.safeParse({
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      notes: form.notes.trim() || undefined,
    })

    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true,
      address: true,
      city: true,
      pincode: true,
    })

    if (result.success) {
      setErrors({})
      return true
    }

    // Format errors from zod
    const newErrors = {}
    for (const error of result.error.errors) {
      const field = error.path[0]
      if (!newErrors[field]) {
        newErrors[field] = error.message
      }
    }
    setErrors(newErrors)
    return false
  }

  // Generate WhatsApp message with sanitized inputs
  const generateWhatsAppMessage = () => {
    // Sanitize all form data before using
    const sanitizedForm = sanitizeFormData(form)

    // Build order details with sanitized product names
    const orderItems = items.map((item, idx) => {
      const itemTotal = item.price * item.quantity
      const sanitizedName = sanitizeText(item.name)
      const collectionName = collectionNames[item.collection] || item.collection || 'Mulyam'
      return `${idx + 1}. ${sanitizedName}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${itemTotal.toLocaleString('en-IN')}\n   Collection: ${collectionName}`
    }).join('\n')

    // Build summary
    let summary = `───────────────\nSubtotal: ₹${totals.subtotal.toLocaleString('en-IN')}`

    if (shipping > 0) {
      summary += `\nShipping: ₹${shipping}`
    } else {
      summary += `\nShipping: FREE`
    }

    if (appliedCoupon && totals.discount > 0) {
      const sanitizedCode = sanitizeText(appliedCoupon.code)
      summary += `\nCoupon (${sanitizedCode}): -₹${totals.discount.toLocaleString('en-IN')}`
    }

    summary += `\nTotal: ₹${finalTotal.toLocaleString('en-IN')}`

    // Build delivery details with sanitized values
    let deliveryDetails = `DELIVERY DETAILS:\nName: ${sanitizedForm.name}\nPhone: ${sanitizedForm.phone}\nAddress: ${sanitizedForm.address}\nCity: ${sanitizedForm.city}\nPincode: ${sanitizedForm.pincode}`

    if (sanitizedForm.notes) {
      deliveryDetails += `\n\nNotes: ${sanitizedForm.notes}`
    }

    // Complete message
    const message = `Hi! I'd like to place an order from Mulyam Jewels:

ORDER DETAILS:
${orderItems}

${summary}

${deliveryDetails}

Please confirm availability and share payment details. Thank you!`

    return message
  }

  // Generate WhatsApp link
  const generateWhatsAppLink = () => {
    const message = generateWhatsAppMessage()
    return `https://wa.me/919523882449?text=${encodeURIComponent(message)}`
  }

  // Handle checkout
  const handleCheckout = (e) => {
    e.preventDefault()

    if (validateAll()) {
      // Set flag for showing toast when user returns
      localStorage.setItem('mulyam-order-sent', 'true')
      // Open WhatsApp
      window.open(generateWhatsAppLink(), '_blank')
      // Clear cart
      clearCart()
      // Navigate to home page
      navigate('/')
    }
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="font-display text-2xl font-semibold text-gray-700 mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8">
              Add some beautiful pieces to get started
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageSEO
        title="Checkout"
        description="Complete your purchase at Mulyam Jewels."
        noindex={true}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/"
          onClick={closeCart}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-semibold mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary - Left side on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          💎
                        </div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {collectionNames[item.collection] || item.collection}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity} × ₹{item.price.toLocaleString('en-IN')} = ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {appliedCoupon && totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span>-₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Shipping
                  </span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold">Total</span>
                  <span className="font-display font-semibold text-lg">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Free shipping notice */}
              {shipping > 0 && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Add ₹{(FREE_SHIPPING_THRESHOLD - totals.total).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
            </div>
          </div>

          {/* Delivery Form - Right side on desktop */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="font-display font-semibold text-lg mb-6">
                  Delivery Details
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                        errors.name && touched.name
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onBlur={() => handleBlur('phone')}
                      placeholder="10-digit mobile number"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                        errors.phone && touched.phone
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="House/Flat No., Building, Street, Landmark"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors resize-none ${
                        errors.address && touched.address
                          ? 'border-red-300 focus:ring-red-200'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.address && touched.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City & Pincode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={form.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onBlur={() => handleBlur('city')}
                        placeholder="City"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                          errors.city && touched.city
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.city && touched.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        value={form.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onBlur={() => handleBlur('pincode')}
                        placeholder="6-digit pincode"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors ${
                          errors.pincode && touched.pincode
                            ? 'border-red-300 focus:ring-red-200'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors.pincode && touched.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      placeholder="Any special instructions for your order..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tan transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="coral"
                size="lg"
                className="w-full"
              >
                <MessageCircle className="w-5 h-5" />
                Checkout on WhatsApp
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to WhatsApp to complete your order. Our team will confirm availability and share payment details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CheckoutPage
