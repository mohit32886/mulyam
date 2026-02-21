const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  requires_action: 'bg-yellow-100 text-yellow-700',
  fulfilled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700',
}

const statusLabels = {
  pending: 'Pending',
  requires_action: 'Processing',
  fulfilled: 'Shipped',
  completed: 'Delivered',
  canceled: 'Canceled',
}

function OrderStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700'
  const label = statusLabels[status] || status

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}

export default OrderStatusBadge
