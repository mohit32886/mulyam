import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { ProtectedRoute, AccountNav, OrderStatusBadge } from '../../components/account'
import { useOrder } from '../../hooks/medusa/useOrders'

function OrderDetailPage() {
  const { orderId } = useParams()
  const { order, loading } = useOrder(orderId)

  const items = order?.items || []
  const shippingAddress = order?.shipping_address
  const total = order?.total ? Number(order.total) / 100 : 0
  const subtotal = order?.subtotal ? Number(order.subtotal) / 100 : 0
  const shippingTotal = order?.shipping_total ? Number(order.shipping_total) / 100 : 0
  const taxTotal = order?.tax_total ? Number(order.tax_total) / 100 : 0

  return (
    <Layout>
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-2xl font-semibold mb-6">My Account</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <Link
                to="/account/orders"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-dark transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>

              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-tan animate-spin" />
                </div>
              )}

              {!loading && !order && (
                <div className="text-center py-16">
                  <p className="text-gray-500">Order not found.</p>
                </div>
              )}

              {!loading && order && (
                <div className="space-y-6">
                  {/* Order header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold">
                        Order #{order.display_id || order.id?.slice(-8)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on{' '}
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.fulfillment_status || order.status} />
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Items
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          {item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title || item.product_title}
                            </p>
                            {item.variant_title && item.variant_title !== 'Default' && (
                              <p className="text-xs text-gray-500">{item.variant_title}</p>
                            )}
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {'\u20B9'}{(Number(item.total || item.unit_price * item.quantity) / 100).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {shippingAddress && (
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
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

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="font-medium text-sm text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{'\u20B9'}{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shippingTotal === 0 ? 'Free' : `\u20B9${shippingTotal.toLocaleString('en-IN')}`}</span>
                      </div>
                      {taxTotal > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>{'\u20B9'}{taxTotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{'\u20B9'}{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  )
}

export default OrderDetailPage
