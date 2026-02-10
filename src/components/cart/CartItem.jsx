import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* Product Image */}
      <div className="w-20 h-20 bg-tan/10 rounded flex-shrink-0 flex items-center justify-center">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-2xl">💍</span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-dark line-clamp-2">{item.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{item.material}</p>
        <p className="font-semibold text-sm mt-1">
          Rs {item.price.toLocaleString('en-IN')}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors self-start"
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default CartItem
