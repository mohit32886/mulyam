/**
 * Frontend Store Hooks
 *
 * These hooks fetch data from Supabase and transform it to the format
 * expected by the customer-facing frontend (camelCase).
 */

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

// Transform Supabase product (snake_case) to frontend format (camelCase)
const transformProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  originalPrice: p.original_price,
  collection: p.collection,
  category: p.category,
  material: p.material,
  plating: p.plating,
  color: p.color,
  sku: p.sku,
  description: p.description,
  images: p.images || [],
  inStock: p.in_stock,
  isBestseller: p.is_bestseller,
  isNewArrival: p.is_new_arrival,
  isTrending: p.is_trending,
  isSellingFast: p.is_selling_fast,
  stock: p.stock,
  isLive: p.is_live,
  createdAt: p.created_at,
})

// Transform banner from Supabase to frontend format
const transformBanner = (b) => ({
  id: b.id,
  text: b.text,
  link: b.link,
  type: b.type,
  bgColor: b.bg_color,
  textColor: b.text_color,
  isActive: b.is_active,
  position: b.position,
})

/**
 * Fetch all live products from Supabase
 */
export function useStoreProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_live', true)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setProducts((data || []).map(transformProduct))
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}

/**
 * Fetch bestseller products
 */
export function useBestsellers(limit = 8) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_live', true)
          .eq('is_bestseller', true)
          .limit(limit)

        if (fetchError) throw fetchError

        setProducts((data || []).map(transformProduct))
      } catch (err) {
        console.error('Error fetching bestsellers:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBestsellers()
  }, [limit])

  return { products, loading, error }
}

/**
 * Fetch products by collection
 */
export function useCollectionProducts(collectionId) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!collectionId) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_live', true)
          .eq('collection', collectionId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setProducts((data || []).map(transformProduct))
      } catch (err) {
        console.error('Error fetching collection products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [collectionId])

  return { products, loading, error }
}

/**
 * Fetch a single product by ID
 */
export function useProduct(productId) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (fetchError) throw fetchError

        setProduct(data ? transformProduct(data) : null)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.message)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return { product, loading, error }
}

/**
 * Fetch related products (same collection, excluding current product)
 */
export function useRelatedProducts(productId, limit = 4) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchRelated = async () => {
      try {
        setLoading(true)

        // First get the current product to find its collection
        const { data: currentProduct, error: productError } = await supabase
          .from('products')
          .select('collection')
          .eq('id', productId)
          .single()

        if (productError) throw productError

        if (!currentProduct) {
          setProducts([])
          return
        }

        // Then fetch related products from the same collection
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_live', true)
          .eq('collection', currentProduct.collection)
          .neq('id', productId)
          .limit(limit)

        if (fetchError) throw fetchError

        setProducts((data || []).map(transformProduct))
      } catch (err) {
        console.error('Error fetching related products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [productId, limit])

  return { products, loading, error }
}

/**
 * Fetch active banners for the announcement bar
 */
export function useStoreBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('position', { ascending: true })

        if (fetchError) throw fetchError

        setBanners((data || []).map(transformBanner))
      } catch (err) {
        console.error('Error fetching banners:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  return { banners, loading, error }
}

/**
 * Fetch store settings (shipping, contact info, etc.)
 */
export function useStoreSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Mulyam Jewels',
    whatsapp: '919523882449',
    instagram: '@mulyam_jewels',
    email: 'Founders@mulyamjewels.com',
    shippingCost: 49,
    freeShippingAbove: 1499,
    bannerRotationSpeed: 3,
    homepageSections: [
      { id: 'hero', name: 'Hero', enabled: true },
      { id: 'collections', name: 'Collections', enabled: true },
      { id: 'featured', name: 'Featured Products', enabled: true },
      { id: 'why-choose', name: 'Why Choose Us', enabled: true },
      { id: 'cta', name: 'CTA Banner', enabled: true },
    ],
    featuredProductIds: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('settings')
          .select('*')

        if (fetchError) throw fetchError

        // Convert array of {key, value} to object
        const settingsObj = {}
        ;(data || []).forEach(row => {
          settingsObj[row.key] = row.value
        })

        // Parse homepage sections
        let homepageSections = prev.homepageSections
        if (settingsObj.homepage_sections) {
          try {
            const parsed = typeof settingsObj.homepage_sections === 'string'
              ? JSON.parse(settingsObj.homepage_sections)
              : settingsObj.homepage_sections
            if (Array.isArray(parsed) && parsed.length > 0) {
              homepageSections = parsed
            }
          } catch {}
        }

        // Parse featured product IDs
        let featuredProductIds = prev.featuredProductIds
        if (settingsObj.featured_products) {
          try {
            const parsed = typeof settingsObj.featured_products === 'string'
              ? JSON.parse(settingsObj.featured_products)
              : settingsObj.featured_products
            if (Array.isArray(parsed)) {
              featuredProductIds = parsed
            }
          } catch {}
        }

        setSettings(prev => ({
          ...prev,
          storeName: settingsObj.store_name || prev.storeName,
          whatsapp: settingsObj.whatsapp || prev.whatsapp,
          instagram: settingsObj.instagram || prev.instagram,
          email: settingsObj.email || prev.email,
          shippingCost: parseInt(settingsObj.shipping_cost) || prev.shippingCost,
          freeShippingAbove: parseInt(settingsObj.free_shipping_above) || prev.freeShippingAbove,
          bannerRotationSpeed: parseInt(settingsObj.banner_rotation_speed) || prev.bannerRotationSpeed,
          homepageSections,
          featuredProductIds,
        }))
      } catch (err) {
        console.error('Error fetching settings:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

/**
 * Validate and apply a coupon code
 */
export function useValidateCouponCode() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const validateCoupon = async (code, cartTotal) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('Invalid coupon code')
        }
        throw fetchError
      }

      // Check if coupon is valid
      const now = new Date()

      if (data.start_date && new Date(data.start_date) > now) {
        throw new Error('Coupon is not yet active')
      }

      if (data.end_date && new Date(data.end_date) < now) {
        throw new Error('Coupon has expired')
      }

      if (data.min_order && cartTotal < data.min_order) {
        throw new Error(`Minimum order value is ₹${data.min_order}`)
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        throw new Error('Coupon usage limit reached')
      }

      // Calculate discount
      let discount = 0
      if (data.type === 'percentage') {
        discount = Math.round(cartTotal * (data.value / 100))
        if (data.max_discount) {
          discount = Math.min(discount, data.max_discount)
        }
      } else if (data.type === 'fixed') {
        discount = data.value
      }
      // For freeShipping type, discount stays 0 (handled separately)

      return {
        valid: true,
        coupon: {
          id: data.id,
          code: data.code,
          discountType: data.type,
          discountValue: data.value,
          maxDiscount: data.max_discount,
        },
        discount,
      }
    } catch (err) {
      setError(err.message)
      return { valid: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { validateCoupon, loading, error }
}

/**
 * Fetch available coupons for display in cart
 * Only returns active, non-expired coupons that are visible to users
 */
export function useAvailableCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCoupons() {
      try {
        setLoading(true)
        const now = new Date().toISOString()

        const { data, error: fetchError } = await supabase
          .from('coupons')
          .select('id, code, type, value, min_order, max_discount, end_date, description')
          .eq('is_active', true)
          .or(`end_date.is.null,end_date.gte.${now}`)
          .order('value', { ascending: false })

        if (fetchError) throw fetchError

        // Format coupons for display
        const formattedCoupons = (data || []).map(coupon => ({
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrder: coupon.min_order,
          maxDiscount: coupon.max_discount,
          endDate: coupon.end_date,
          description: coupon.description || formatCouponDescription(coupon),
        }))

        setCoupons(formattedCoupons)
      } catch (err) {
        console.error('Error fetching available coupons:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCoupons()
  }, [])

  return { coupons, loading, error }
}

// Helper to format coupon description
function formatCouponDescription(coupon) {
  let desc = ''
  if (coupon.type === 'percentage') {
    desc = `${coupon.value}% off`
    if (coupon.max_discount) {
      desc += ` (up to ₹${coupon.max_discount})`
    }
  } else if (coupon.type === 'fixed') {
    desc = `₹${coupon.value} off`
  } else if (coupon.type === 'freeShipping') {
    desc = 'Free shipping'
  }
  if (coupon.min_order) {
    desc += ` on orders above ₹${coupon.min_order}`
  }
  return desc
}

/**
 * Search products by query
 */
export function useProductSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    const searchProducts = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('is_live', true)
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
          .limit(10)

        if (fetchError) throw fetchError

        setResults((data || []).map(transformProduct))
      } catch (err) {
        console.error('Error searching products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return { results, loading, error }
}

/**
 * Fetch featured products (configured in admin settings)
 */
export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)

        // First, get the featured product IDs from settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'featured_products')
          .single()

        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError

        let featuredIds = []
        if (settingsData?.value) {
          try {
            featuredIds = typeof settingsData.value === 'string'
              ? JSON.parse(settingsData.value)
              : settingsData.value
          } catch {}
        }

        // If no featured products configured, fall back to bestsellers
        if (!featuredIds || featuredIds.length === 0) {
          const { data: bestsellersData, error: bestsellersError } = await supabase
            .from('products')
            .select('*')
            .eq('is_live', true)
            .eq('is_bestseller', true)
            .limit(limit)

          if (bestsellersError) throw bestsellersError
          setProducts((bestsellersData || []).map(transformProduct))
          return
        }

        // Fetch products by IDs
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', featuredIds.slice(0, limit))
          .eq('is_live', true)

        if (productsError) throw productsError

        // Sort products in the order they were featured
        const sortedProducts = featuredIds
          .map(id => productsData?.find(p => p.id === id))
          .filter(Boolean)
          .map(transformProduct)

        setProducts(sortedProducts)
      } catch (err) {
        console.error('Error fetching featured products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [limit])

  return { products, loading, error }
}
