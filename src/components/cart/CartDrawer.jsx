import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, MessageCircle, Tag, Loader2, Check, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import CartItem from './CartItem'
import { Button } from '../ui'

function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    totals,
    getWhatsAppOrderLink,
    clearCart,
    appliedCoupon,
    couponLoading,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState(null)

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeCart()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  // Clear coupon message after 3 seconds
  useEffect(() => {
    if (couponMessage) {
      const timer = setTimeout(() => setCouponMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [couponMessage])

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    const result = await applyCoupon(couponCode.trim())

    if (result.success) {
      setCouponMessage({
        type: 'success',
        text: `Coupon applied! You saved Rs ${result.discount.toLocaleString('en-IN')}`,
      })
      setCouponCode('')
    } else {
      setCouponMessage({
        type: 'error',
        text: result.error || 'Invalid coupon code',
      })
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponMessage(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display font-semibold text-lg">
              Your Cart ({totals.itemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && !totals.hasFreeShipping && (
          <div className="px-4 py-3 bg-tan/10">
            <p className="text-sm text-center">
              Add{' '}
              <span className="font-semibold text-coral">
                Rs {totals.amountToFreeShipping.toLocaleString('en-IN')}
              </span>{' '}
              more for free shipping!
            </p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-coral transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (totals.total / 1499) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {totals.hasFreeShipping && items.length > 0 && (
          <div className="px-4 py-3 bg-green-50 text-green-700 text-sm text-center font-medium">
            You've unlocked free shipping!
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="font-display font-semibold text-lg text-gray-600">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                Add some beautiful pieces to get started
              </p>
              <Button
                variant="primary"
                className="mt-6"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 bg-white">
            {/* Coupon Code Section */}
            <div className="mb-4">
              {appliedCoupon ? (
                // Applied Coupon Display
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-sm text-green-600">
                      (-Rs {totals.discount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800 p-1"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Coupon Input Form
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent"
                      disabled={couponLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-dark text-white text-sm font-medium rounded-lg hover:bg-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {couponLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </form>
              )}

              {/* Coupon Message */}
              {couponMessage && (
                <div
                  className={`mt-2 text-sm flex items-center gap-1 ${
                    couponMessage.type === 'success'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {couponMessage.type === 'success' && <Check className="w-4 h-4" />}
                  {couponMessage.text}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs {totals.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount</span>
                  <span>-Rs {totals.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-dark">Total</span>
                <span className="font-display font-semibold text-lg text-dark">
                  Rs {totals.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Shipping calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/checkout" onClick={closeCart} className="block">
                <Button variant="coral" size="lg" className="w-full">
                  <ArrowRight className="w-5 h-5" />
                  Proceed to Checkout
                </Button>
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
