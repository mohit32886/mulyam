import { Package, Tag, Truck } from 'lucide-react'

function OrderSummary({ items, totals, appliedCoupon, shippingCost }) {
  // shippingCost: null = not yet selected, 0 = free, >0 = paid
  const displayShipping = shippingCost != null
  const finalTotal = (totals.total * 100 + (shippingCost || 0)) / 100

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
      <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {item.thumbnail || item.images?.[0] ? (
                <img
                  src={item.thumbnail || item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-tan/10 text-tan text-xs font-medium">
                  MJ
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">
                {'\u20B9'}{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>{'\u20B9'}{totals.subtotal.toLocaleString('en-IN')}</span>
        </div>

        {appliedCoupon && totals.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Coupon ({appliedCoupon.code})
            </span>
            <span>-{'\u20B9'}{totals.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipping
          </span>
          {displayShipping ? (
            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
              {shippingCost === 0 ? 'FREE' : `\u20B9${(shippingCost / 100).toLocaleString('en-IN')}`}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Calculated at shipping step</span>
          )}
        </div>

        <div className="flex justify-between pt-3 border-t border-gray-200">
          <span className="font-semibold">Total</span>
          <span className="font-display font-semibold text-lg">
            {displayShipping
              ? `\u20B9${finalTotal.toLocaleString('en-IN')}`
              : `\u20B9${totals.total.toLocaleString('en-IN')}+`
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
