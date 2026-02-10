import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useValidateCouponCode } from '../hooks'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'mulyam-cart'
const COUPON_STORAGE_KEY = 'mulyam-coupon'
const FREE_SHIPPING_THRESHOLD = 1499

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const { validateCoupon, loading: couponLoading, error: couponError } = useValidateCouponCode()

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }

      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY)
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }, [items])

  // Save coupon to localStorage on changes
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Error saving coupon:', error)
    }
  }, [appliedCoupon])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentItems, { ...product, quantity }]
    })

    // Open cart drawer when item is added
    setIsOpen(true)
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    )
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // Clear entire cart
  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  // Open/close cart drawer
  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  // Calculate subtotal (before discount)
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  // Apply coupon code
  const applyCoupon = useCallback(async (code) => {
    const result = await validateCoupon(code, subtotal)

    if (result.valid) {
      setAppliedCoupon(result.coupon)
      setCouponDiscount(result.discount)
      return { success: true, discount: result.discount }
    }

    return { success: false, error: result.error }
  }, [validateCoupon, subtotal])

  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }, [])

  // Re-calculate discount when cart changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      // Recalculate discount based on new subtotal
      if (appliedCoupon.discountType === 'percentage') {
        let discount = Math.round(subtotal * (appliedCoupon.discountValue / 100))
        if (appliedCoupon.maxDiscount) {
          discount = Math.min(discount, appliedCoupon.maxDiscount)
        }
        setCouponDiscount(discount)
      } else if (appliedCoupon.discountType === 'fixed') {
        // Fixed discount - ensure it doesn't exceed subtotal
        setCouponDiscount(Math.min(appliedCoupon.discountValue, subtotal))
      }
      // freeShipping type doesn't affect cart total (handled at checkout)
    } else if (subtotal === 0) {
      // Clear coupon if cart is empty
      setAppliedCoupon(null)
      setCouponDiscount(0)
    }
  }, [subtotal, appliedCoupon])

  // Calculate totals
  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAfterDiscount = Math.max(0, subtotal - couponDiscount)
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAfterDiscount)
    const hasFreeShipping = totalAfterDiscount >= FREE_SHIPPING_THRESHOLD

    return {
      subtotal,
      discount: couponDiscount,
      total: totalAfterDiscount,
      itemCount,
      amountToFreeShipping,
      hasFreeShipping,
    }
  }, [items, subtotal, couponDiscount])

  // Generate WhatsApp order message
  const getWhatsAppOrderLink = () => {
    if (items.length === 0) return ''

    const itemsList = items
      .map(
        (item) =>
          `- ${item.name} (${item.sku}) x${item.quantity} = Rs ${(
            item.price * item.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n')

    let message = `Hi! I'd like to place an order:\n\n${itemsList}\n\nSubtotal: Rs ${totals.subtotal.toLocaleString('en-IN')}`

    if (appliedCoupon && couponDiscount > 0) {
      message += `\nCoupon (${appliedCoupon.code}): -Rs ${couponDiscount.toLocaleString('en-IN')}`
      message += `\nTotal: Rs ${totals.total.toLocaleString('en-IN')}`
    }

    return `https://wa.me/919523882449?text=${encodeURIComponent(message)}`
  }

  const value = {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    totals,
    getWhatsAppOrderLink,
    // Coupon related
    appliedCoupon,
    couponLoading,
    couponError,
    applyCoupon,
    removeCoupon,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
