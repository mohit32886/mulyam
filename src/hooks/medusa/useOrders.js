import { useState, useEffect, useCallback } from 'react'
import medusa from '../../lib/medusa-client'
import { createLogger } from '../../lib/logger'

const log = createLogger('orders')

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const { orders } = await medusa.store.order.list()
        setOrders(orders)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [refreshKey])

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  return { orders, loading, error, refetch }
}

export function useOrder(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const { order } = await medusa.store.order.retrieve(orderId)
        setOrder(order)
      } catch (err) {
        log.error('Failed to fetch order:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  return { order, loading }
}
