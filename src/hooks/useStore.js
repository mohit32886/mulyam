/**
 * Frontend Store Hooks
 *
 * Product data hooks fetch from Medusa.js backend.
 * Banners, settings, and coupons still use Supabase (admin-managed).
 */

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import medusa from '../lib/medusa-client'

// Pricing context – passed to every product.list() call
const REGION_ID = 'reg_01KHYC1EE382WKBKE27QDHNJFY'
const PRICING_FIELDS = '+variants.calculated_price'

// ---------------------------------------------------------------------------
// Medusa product → frontend format transformer
// ---------------------------------------------------------------------------

const transformMedusaProduct = (p) => {
  const variant = p.variants?.[0]
  // Medusa v2: price comes from calculated_price (requires region_id + fields)
  const calcPrice = variant?.calculated_price
  const price = calcPrice ? calcPrice.calculated_amount / 100 : 0

  // Extract option values from variant
  const getOptionValue = (title) => {
    if (!variant?.options) return null
    const opt = variant.options.find((o) => o.option?.title === title)
    return opt?.value || null
  }

  return {
    id: p.handle || p.id,
    medusaId: p.id,
    name: p.title,
    price,
    originalPrice: p.metadata?.original_price || null,
    collection: p.collection?.handle || null,
    category: p.categories?.[0]?.name || p.metadata?.category || null,
    material: p.metadata?.material || null,
    plating: p.metadata?.plating || null,
    color: getOptionValue('Color'),
    size: getOptionValue('Size'),
    sku: variant?.sku || null,
    description: p.description || '',
    images: (p.images || []).map((img) => img.url),
    thumbnail: p.thumbnail,
    inStock: true, // Medusa validates stock at cart time
    isBestseller: p.metadata?.is_bestseller || false,
    isNewArrival: false,
    isTrending: false,
    isSellingFast: false,
    stock: 0,
    isLive: true,
    createdAt: p.created_at,
    // Medusa-specific fields for cart integration
    variantId: variant?.id,
    variants: p.variants,
  }
}

// ---------------------------------------------------------------------------
// Product Hooks (Medusa)
// ---------------------------------------------------------------------------

/**
 * Fetch all published products from Medusa
 */
export function useStoreProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { products: data } = await medusa.store.product.list({
          limit: 100,
          order: '-created_at',
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })
        setProducts((data || []).map(transformMedusaProduct))
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
        // Fetch all products and filter by metadata.is_bestseller
        const { products: data } = await medusa.store.product.list({
          limit: 100,
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })

        const bestsellers = (data || [])
          .filter((p) => p.metadata?.is_bestseller)
          .slice(0, limit)
          .map(transformMedusaProduct)

        setProducts(bestsellers)
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
 * Fetch products by collection handle
 */
export function useCollectionProducts(collectionHandle) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!collectionHandle) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)

        // First resolve collection handle to ID
        const { collections } = await medusa.store.collection.list({
          handle: [collectionHandle],
        })
        const collection = collections?.[0]

        if (!collection) {
          setProducts([])
          return
        }

        // Then fetch products by collection ID
        const { products: data } = await medusa.store.product.list({
          collection_id: [collection.id],
          limit: 100,
          order: '-created_at',
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })

        setProducts((data || []).map(transformMedusaProduct))
      } catch (err) {
        console.error('Error fetching collection products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [collectionHandle])

  return { products, loading, error }
}

/**
 * Fetch a single product by handle
 */
export function useProduct(productHandle) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productHandle) {
      setProduct(null)
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { products } = await medusa.store.product.list({
          handle: productHandle,
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })

        setProduct(products?.[0] ? transformMedusaProduct(products[0]) : null)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.message)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productHandle])

  return { product, loading, error }
}

/**
 * Fetch related products (same collection, excluding current product)
 */
export function useRelatedProducts(productHandle, limit = 4) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productHandle) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchRelated = async () => {
      try {
        setLoading(true)

        // First get the current product to find its collection
        const { products: currentProducts } = await medusa.store.product.list({
          handle: productHandle,
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })
        const current = currentProducts?.[0]

        if (!current?.collection_id) {
          setProducts([])
          return
        }

        // Fetch products from the same collection
        const { products: data } = await medusa.store.product.list({
          collection_id: [current.collection_id],
          limit: limit + 1, // Fetch one extra to account for excluding current
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })

        const related = (data || [])
          .filter((p) => p.id !== current.id)
          .slice(0, limit)
          .map(transformMedusaProduct)

        setProducts(related)
      } catch (err) {
        console.error('Error fetching related products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [productHandle, limit])

  return { products, loading, error }
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
        const { products: data } = await medusa.store.product.list({
          q: query,
          limit: 10,
          region_id: REGION_ID,
          fields: PRICING_FIELDS,
        })

        setResults((data || []).map(transformMedusaProduct))
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
 * Fetch featured products (bestsellers or curated list)
 */
export function useFeaturedProducts(limit = 8) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)

        // Try to get featured product handles from Supabase settings
        let featuredIds = []
        try {
          const { data: settingsData } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'featured_products')
            .single()

          if (settingsData?.value) {
            featuredIds =
              typeof settingsData.value === 'string'
                ? JSON.parse(settingsData.value)
                : settingsData.value
          }
        } catch {
          // Settings not available, fall through to bestsellers
        }

        if (featuredIds?.length > 0) {
          // Fetch specific products by handle
          const allFeatured = []
          for (const id of featuredIds.slice(0, limit)) {
            try {
              const { products: found } = await medusa.store.product.list({
                handle: id,
                region_id: REGION_ID,
                fields: PRICING_FIELDS,
              })
              if (found?.[0]) allFeatured.push(found[0])
            } catch {
              // Skip products that don't exist
            }
          }
          setProducts(allFeatured.map(transformMedusaProduct))
        } else {
          // Fall back to bestsellers from Medusa
          const { products: data } = await medusa.store.product.list({
            limit: 100,
            region_id: REGION_ID,
            fields: PRICING_FIELDS,
          })

          const bestsellers = (data || [])
            .filter((p) => p.metadata?.is_bestseller)
            .slice(0, limit)
            .map(transformMedusaProduct)

          // If no bestsellers, just show newest products
          if (bestsellers.length === 0) {
            setProducts((data || []).slice(0, limit).map(transformMedusaProduct))
          } else {
            setProducts(bestsellers)
          }
        }
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

// ---------------------------------------------------------------------------
// Banner & Settings Hooks (still Supabase)
// ---------------------------------------------------------------------------

// Transform banner from Supabase to frontend format
const transformBanner = (b) => ({
  id: b.id,
  text: b.title || b.text,
  subtitle: b.subtitle,
  link: b.link_url || b.link,
  type: b.type,
  bgColor: b.background_color || b.bg_color,
  textColor: b.text_color,
  isActive: b.is_active,
  position: b.position,
})

/**
 * Fetch active banners for the announcement bar
 */
export function useStoreBanners({ type } = {}) {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)

        if (type) {
          query = query.eq('type', type)
        }

        query = query.order('position', { ascending: true })

        const { data, error: fetchError } = await query

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
  }, [type])

  return { banners, loading, error }
}

/**
 * Fetch store settings
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

        const settingsObj = {}
        ;(data || []).forEach((row) => {
          settingsObj[row.key] = row.value
        })

        setSettings((prev) => {
          let homepageSections = prev.homepageSections
          if (settingsObj.homepage_sections) {
            try {
              const parsed =
                typeof settingsObj.homepage_sections === 'string'
                  ? JSON.parse(settingsObj.homepage_sections)
                  : settingsObj.homepage_sections
              if (Array.isArray(parsed) && parsed.length > 0) {
                homepageSections = parsed
              }
            } catch {}
          }

          let featuredProductIds = prev.featuredProductIds
          if (settingsObj.featured_products) {
            try {
              const parsed =
                typeof settingsObj.featured_products === 'string'
                  ? JSON.parse(settingsObj.featured_products)
                  : settingsObj.featured_products
              if (Array.isArray(parsed)) {
                featuredProductIds = parsed
              }
            } catch {}
          }

          return {
            ...prev,
            storeName: settingsObj.store_name || prev.storeName,
            whatsapp: settingsObj.whatsapp || prev.whatsapp,
            instagram: settingsObj.instagram || prev.instagram,
            email: settingsObj.email || prev.email,
            shippingCost: parseInt(settingsObj.shipping_cost) || prev.shippingCost,
            freeShippingAbove:
              parseInt(settingsObj.free_shipping_above) || prev.freeShippingAbove,
            bannerRotationSpeed:
              parseInt(settingsObj.banner_rotation_speed) || prev.bannerRotationSpeed,
            homepageSections,
            featuredProductIds,
          }
        })
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

// ---------------------------------------------------------------------------
// Coupon Hooks (still Supabase)
// ---------------------------------------------------------------------------

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

      let discount = 0
      if (data.type === 'percentage') {
        discount = Math.round(cartTotal * (data.value / 100))
        if (data.max_discount) {
          discount = Math.min(discount, data.max_discount)
        }
      } else if (data.type === 'fixed') {
        discount = data.value
      }

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
          .select(
            'id, code, type, value, min_order, max_discount, start_date, end_date, description'
          )
          .eq('is_active', true)
          .or(`start_date.is.null,start_date.lte.${now}`)
          .or(`end_date.is.null,end_date.gte.${now}`)
          .order('value', { ascending: false })

        if (fetchError) throw fetchError

        const formattedCoupons = (data || []).map((coupon) => ({
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
