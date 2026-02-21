import { useState, useCallback } from 'react'
import medusa from '../../lib/medusa-client'

export function useCheckout(cartId) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  const setEmail = useCallback(async (email) => {
    if (!cartId) return
    try {
      setLoading(true)
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.update(cartId, { email })
      return updatedCart
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const setAddresses = useCallback(async (shippingAddress, billingAddress) => {
    if (!cartId) return
    try {
      setLoading(true)
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.update(cartId, {
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
      })
      return updatedCart
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const getShippingOptions = useCallback(async () => {
    if (!cartId) return []
    try {
      setLoading(true)
      setError(null)
      const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId })
      return shipping_options || []
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [cartId])

  const setShippingMethod = useCallback(async (optionId) => {
    if (!cartId) return
    try {
      setLoading(true)
      setError(null)
      const { cart: updatedCart } = await medusa.store.cart.addShippingMethod(cartId, {
        option_id: optionId,
      })
      return updatedCart
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [cartId])

  // initPayment accepts the full cart object (SDK needs payment_collection from it)
  const initPayment = useCallback(async (cart, providerId) => {
    if (!cart) return
    try {
      setLoading(true)
      setError(null)
      const { payment_collection } = await medusa.store.payment.initiatePaymentSession(
        cart,
        { provider_id: providerId }
      )
      return payment_collection
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update payment session with Razorpay confirmation data before completing
  const updatePaymentSession = useCallback(async (paymentSessionId, razorpayData) => {
    try {
      setLoading(true)
      setError(null)
      const baseUrl = medusa.client?.baseUrl || 'http://localhost:9000'
      const publishableKey = medusa.client?.publishableKey || ''
      const res = await fetch(`${baseUrl}/store/razorpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': publishableKey,
        },
        body: JSON.stringify({
          payment_session_id: paymentSessionId,
          ...razorpayData,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to update payment session')
      }
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const completeCheckout = useCallback(async () => {
    if (!cartId) return
    try {
      setLoading(true)
      setError(null)
      const result = await medusa.store.cart.complete(cartId)
      if (result.type === 'order') {
        setOrder(result.order)
        return { success: true, order: result.order }
      }
      return { success: false, error: 'Checkout could not be completed' }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [cartId])

  return {
    setEmail,
    setAddresses,
    getShippingOptions,
    setShippingMethod,
    initPayment,
    updatePaymentSession,
    completeCheckout,
    order,
    loading,
    error,
    setError,
  }
}
