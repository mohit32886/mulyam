import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import medusa from '../lib/medusa-client'

const MedusaCartContext = createContext(null)

const CART_ID_KEY = 'mulyam-medusa-cart-id'

export function MedusaCartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async () => {
      try {
        const savedCartId = localStorage.getItem(CART_ID_KEY)

        if (savedCartId) {
          try {
            const { cart: existingCart } = await medusa.store.cart.retrieve(savedCartId)
            setCart(existingCart)
            setLoading(false)
            return
          } catch (err) {
            // Cart no longer valid, create a new one
            localStorage.removeItem(CART_ID_KEY)
          }
        }

        // Create a new cart
        const { cart: newCart } = await medusa.store.cart.create({})
        localStorage.setItem(CART_ID_KEY, newCart.id)
        setCart(newCart)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    initCart()
  }, [])

  const addToCart = useCallback(async (variantId, quantity = 1) => {
    if (!cart?.id) return
    try {
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      setCart(updatedCart)
      setIsOpen(true)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [cart?.id])

  const removeFromCart = useCallback(async (lineItemId) => {
    if (!cart?.id) return
    try {
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.deleteLineItem(cart.id, lineItemId)
      setCart(updatedCart)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [cart?.id])

  const updateQuantity = useCallback(async (lineItemId, quantity) => {
    if (!cart?.id) return
    if (quantity < 1) {
      return removeFromCart(lineItemId)
    }
    try {
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.updateLineItem(cart.id, lineItemId, {
        quantity,
      })
      setCart(updatedCart)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [cart?.id, removeFromCart])

  const clearCart = useCallback(async () => {
    try {
      setError(null)
      const { cart: newCart } = await medusa.store.cart.create({})
      localStorage.setItem(CART_ID_KEY, newCart.id)
      setCart(newCart)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  // Cart drawer controls
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  // Computed totals from Medusa cart (amounts are in paise, divide by 100 for display)
  const totals = useMemo(() => {
    if (!cart) {
      return {
        subtotal: 0,
        total: 0,
        shippingTotal: 0,
        itemTotal: 0,
        discount: 0,
        itemCount: 0,
      }
    }

    const itemCount = (cart.items || []).reduce((sum, item) => sum + item.quantity, 0)

    return {
      subtotal: (cart.subtotal || 0) / 100,
      total: (cart.total || 0) / 100,
      shippingTotal: (cart.shipping_total || 0) / 100,
      itemTotal: (cart.item_total || 0) / 100,
      discount: (cart.discount_total || 0) / 100,
      itemCount,
    }
  }, [cart])

  // Map cart items to a format compatible with existing UI
  const items = useMemo(() => {
    if (!cart?.items) return []
    return cart.items.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      name: item.title,
      variant: item.variant?.title,
      price: (item.unit_price || 0) / 100,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
    }))
  }, [cart])

  const value = {
    cart,
    items,
    loading,
    error,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    totals,
  }

  return <MedusaCartContext.Provider value={value}>{children}</MedusaCartContext.Provider>
}

export function useMedusaCart() {
  const context = useContext(MedusaCartContext)
  if (!context) {
    throw new Error('useMedusaCart must be used within a MedusaCartProvider')
  }
  return context
}

export default MedusaCartContext
