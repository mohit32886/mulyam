import { useState, useEffect } from 'react'
import medusa from '../../lib/medusa-client'

export function useProducts(options = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { products, count } = await medusa.store.product.list({
          limit: options.limit || 20,
          offset: options.offset || 0,
          ...(options.collection_id && { collection_id: [options.collection_id] }),
          ...(options.category_id && { category_id: [options.category_id] }),
        })
        setProducts(products)
        setCount(count)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [options.collection_id, options.category_id, options.limit, options.offset])

  return { products, loading, error, count }
}

export function useProduct(handle) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!handle) return
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Medusa v2 supports fetching by handle
        const { products } = await medusa.store.product.list({ handle })
        setProduct(products?.[0] || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [handle])

  return { product, loading, error }
}
