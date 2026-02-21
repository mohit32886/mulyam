import { Link } from 'react-router-dom'
import { CheckCircle, Package, MapPin, ShoppingBag } from 'lucide-react'
import { Button } from '../ui'

function OrderConfirmation({ order }) {
  if (!order) return null

  const shippingAddress = order.shipping_address
  const items = order.items || []
  const total = order.total ? Number(order.total) / 100 : 0

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Success icon */}
      <div className="mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      </div>

      <h1 className="font-display text-2xl font-semibold mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-1">Thank you for your order.</p>
      <p className="text-sm text-gray-500 mb-8">
        Order ID: <span className="font-mono font-medium text-gray-700">{order.display_id || order.id}</span>
      </p>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-xl p-5 text-left mb-4">
        <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Items Ordered
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title || item.product_title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {'\u20B9'}{(Number(item.total || item.unit_price * item.quantity) / 100).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total Paid</span>
          <span>{'\u20B9'}{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="bg-gray-50 rounded-xl p-5 text-left mb-8">
          <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivering To
          </h3>
          <p className="text-sm text-gray-900">
            {shippingAddress.first_name} {shippingAddress.last_name}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.address_1}
            {shippingAddress.address_2 && `, ${shippingAddress.address_2}`}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.city}, {shippingAddress.province} - {shippingAddress.postal_code}
          </p>
          {shippingAddress.phone && (
            <p className="text-sm text-gray-600 mt-1">Phone: +91 {shippingAddress.phone}</p>
          )}
        </div>
      )}

      {/* CTA */}
      <Link to="/">
        <Button variant="primary" size="lg" className="w-full">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </Link>

      <p className="text-xs text-gray-500 mt-4">
        You will receive an order confirmation email shortly.
      </p>
    </div>
  )
}

export default OrderConfirmation
