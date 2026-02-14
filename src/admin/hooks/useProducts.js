import { useState, useEffect, useCallback } from 'react'
import { supabase, logActivity } from '../../lib/supabase'

/**
 * Hook to fetch all products
 */
export function useProducts(options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { collection, category, isLive = null } = options

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (collection) {
        query = query.eq('collection', collection)
      }
      if (category) {
        query = query.eq('category', category)
      }
      if (isLive !== null) {
        query = query.eq('is_live', isLive)
      }

      const { data: products, error: fetchError } = await query

      if (fetchError) throw fetchError
      setData(products || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [collection, category, isLive])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { data, loading, error, refetch: fetchProducts }
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)

        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError
        setData(product)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return { data, loading, error }
}

/**
 * Hook for product mutations (create, update, delete)
 */
export function useProductMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true)
      setError(null)

      // Generate ID from name if not provided
      const id = productData.id || productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const product = {
        ...productData,
        id,
        slug: productData.slug || id,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (insertError) throw insertError

      // Log activity
      await logActivity('product_created', 'product', data.id, 'Product Created', data.name, {
        newData: data
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    try {
      setLoading(true)
      setError(null)

      // Get previous data for activity log
      const { data: previousData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Log activity
      await logActivity('product_updated', 'product', id, 'Product Updated', data.name, {
        previousData,
        newData: data,
        canRevert: true
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      // Get product data for activity log
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Log activity
      await logActivity('product_deleted', 'product', id, 'Product Deleted', productData?.name || id, {
        previousData: productData
      })

      return { error: null }
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleStock = useCallback(async (id, inStock) => {
    return updateProduct(id, { in_stock: inStock })
  }, [updateProduct])

  const toggleLive = useCallback(async (id, isLive) => {
    return updateProduct(id, { is_live: isLive })
  }, [updateProduct])

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    toggleLive,
    loading,
    error
  }
}

export default useProducts
