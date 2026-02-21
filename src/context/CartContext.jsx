import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import medusa from '../lib/medusa-client'
import { useValidateCouponCode } from '../hooks'

const CartContext = createContext(null)

const CART_ID_KEY = 'mulyam-cart-id'
const COUPON_STORAGE_KEY = 'mulyam-coupon'
const FREE_SHIPPING_THRESHOLD = 1499
const SALES_CHANNEL_ID = 'sc_01KHYCN8M4SY8KR1EE3WCW8QEX' // Mulyam Jewels Online Store
const REGION_ID = 'reg_01KHYC1EE382WKBKE27QDHNJFY' // India

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(true)
  const [cartError, setCartError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const { validateCoupon, loading: couponLoading, error: couponError } = useValidateCouponCode()

  // Initialize or restore cart on mount
  useEffect(() => {
    const initCart = async () => {
      try {
        const savedCartId = localStorage.getItem(CART_ID_KEY)

        if (savedCartId) {
          try {
            const { cart: existingCart } = await medusa.store.cart.retrieve(savedCartId)
            if (existingCart?.completed_at) {
              // Cart already completed, create new one
              throw new Error('Cart completed')
            }
            setCart(existingCart)
            setCartLoading(false)
            return
          } catch {
            localStorage.removeItem(CART_ID_KEY)
          }
        }

        // Create a new cart
        const { cart: newCart } = await medusa.store.cart.create({
          sales_channel_id: SALES_CHANNEL_ID,
          region_id: REGION_ID,
        })
        localStorage.setItem(CART_ID_KEY, newCart.id)
        setCart(newCart)
      } catch (err) {
        setCartError(err.message)
      } finally {
        setCartLoading(false)
      }
    }

    initCart()
  }, [])

  // Restore coupon from localStorage
  useEffect(() => {
    try {
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY)
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon))
      }
    } catch {}
  }, [])

  // Save coupon to localStorage on changes
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY)
      }
    } catch {}
  }, [appliedCoupon])

  // Add item to cart
  // Accepts either:
  //   addToCart(product)           - product object with variantId
  //   addToCart(variantId, qty)    - direct variant ID
  const addToCart = useCallback(async (productOrVariantId, quantity = 1) => {
    if (!cart?.id) return

    let variantId
    if (typeof productOrVariantId === 'string') {
      variantId = productOrVariantId
    } else if (productOrVariantId?.variantId) {
      variantId = productOrVariantId.variantId
    } else if (productOrVariantId?.variants?.[0]?.id) {
      variantId = productOrVariantId.variants[0].id
    } else {
      console.error('addToCart: could not determine variant ID', productOrVariantId)
      return
    }

    try {
      setCartError(null)
      const { cart: updatedCart } = await medusa.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      setCart(updatedCart)
      setIsOpen(true)
    } catch (err) {
      setCartError(err.message)
      throw err
    }
  }, [cart?.id])

  // Remove item from cart by line item ID
  const removeFromCart = useCallback(async (lineItemId) => {
    if (!cart?.id) return
    try {
      setCartError(null)
      const { parent: updatedCart } = await medusa.store.cart.deleteLineItem(cart.id, lineItemId)
      setCart(updatedCart)
    } catch (err) {
      setCartError(err.message)
    }
  }, [cart?.id])

  // Update item quantity
  const updateQuantity = useCallback(async (lineItemId, quantity) => {
    if (!cart?.id) return
    if (quantity < 1) {
      return removeFromCart(lineItemId)
    }
    try {
      setCartError(null)
      const { cart: updatedCart } = await medusa.store.cart.updateLineItem(
        cart.id,
        lineItemId,
        { quantity }
      )
      setCart(updatedCart)
    } catch (err) {
      setCartError(err.message)
    }
  }, [cart?.id, removeFromCart])

  // Clear cart - creates a new empty cart
  const clearCart = useCallback(async () => {
    try {
      setCartError(null)
      const { cart: newCart } = await medusa.store.cart.create({
          sales_channel_id: SALES_CHANNEL_ID,
          region_id: REGION_ID,
        })
      localStorage.setItem(CART_ID_KEY, newCart.id)
      setCart(newCart)
      setAppliedCoupon(null)
      setCouponDiscount(0)
    } catch (err) {
      setCartError(err.message)
    }
  }, [])

  // Refresh cart from Medusa (used after checkout updates like address/shipping)
  const refreshCart = useCallback(async () => {
    if (!cart?.id) return
    try {
      const { cart: freshCart } = await medusa.store.cart.retrieve(cart.id)
      setCart(freshCart)
      return freshCart
    } catch (err) {
      setCartError(err.message)
    }
  }, [cart?.id])

  // Cart drawer controls
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  // Map Medusa cart items to the format UI components expect
  const items = useMemo(() => {
    if (!cart?.items) return []
    return cart.items.map((item) => ({
      id: item.id, // line item ID (used for update/remove)
      variantId: item.variant_id,
      name: item.title || item.product_title,
      sku: item.variant_sku || '',
      material: item.product?.metadata?.material || '',
      price: (item.unit_price || 0) / 100,
      quantity: item.quantity,
      images: item.thumbnail ? [item.thumbnail] : [],
      thumbnail: item.thumbnail,
    }))
  }, [cart?.items])

  // Compute subtotal from Medusa cart (in rupees)
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  // Apply coupon code (still Supabase-based)
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
      if (appliedCoupon.discountType === 'percentage') {
        let discount = Math.round(subtotal * (appliedCoupon.discountValue / 100))
        if (appliedCoupon.maxDiscount) {
          discount = Math.min(discount, appliedCoupon.maxDiscount)
        }
        setCouponDiscount(discount)
      } else if (appliedCoupon.discountType === 'fixed') {
        setCouponDiscount(Math.min(appliedCoupon.discountValue, subtotal))
      }
    } else if (subtotal === 0) {
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

  // Generate WhatsApp order message (fallback option)
  const getWhatsAppOrderLink = useCallback(() => {
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
  }, [items, totals, appliedCoupon, couponDiscount])

  const value = {
    // Medusa cart object (for checkout flow)
    cart,
    cartLoading,
    cartError,
    // UI-friendly items
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
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
