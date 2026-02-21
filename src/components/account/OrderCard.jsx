import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge'

function OrderCard({ order }) {
  const total = order.total ? Number(order.total) / 100 : 0
  const itemCount = order.items?.length || 0
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-medium text-gray-900">
              #{order.display_id || order.id?.slice(-8)}
            </span>
            <OrderStatusBadge status={order.fulfillment_status || order.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{date}</span>
            <span>&middot;</span>
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span>&middot;</span>
            <span className="font-medium text-gray-700">{'\u20B9'}{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </Link>
  )
}

export default OrderCard
