import { Package, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { Button } from '../../components/ui'
import { ProtectedRoute, AccountNav, OrderCard } from '../../components/account'
import { useOrders } from '../../hooks/medusa/useOrders'

function OrdersPage() {
  const { orders, loading, error } = useOrders()

  return (
    <Layout>
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="font-display text-2xl font-semibold mb-6">My Account</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold mb-4">My Orders</h2>

              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-tan animate-spin" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  Failed to load orders. Please try again.
                </div>
              )}

              {!loading && !error && orders.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Link to="/">
                    <Button variant="primary" size="md">Start Shopping</Button>
                  </Link>
                </div>
              )}

              {!loading && !error && orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  )
}

export default OrdersPage
