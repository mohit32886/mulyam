import { useState, useEffect, useCallback } from 'react'
import { supabase, logActivity } from '../lib/supabase'

/**
 * Hook to fetch all coupons
 */
export function useCoupons(options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { isActive = null } = options

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (isActive !== null) {
        query = query.eq('is_active', isActive)
      }

      const { data: coupons, error: fetchError } = await query

      if (fetchError) throw fetchError
      setData(coupons || [])
    } catch (err) {
      console.error('Error fetching coupons:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isActive])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  return { data, loading, error, refetch: fetchCoupons }
}

/**
 * Hook to validate a coupon code
 */
export function useValidateCoupon() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const validateCoupon = useCallback(async (code, orderTotal = 0) => {
    try {
      setLoading(true)
      setError(null)

      const { data: coupon, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return { valid: false, error: 'Invalid coupon code' }
        }
        throw fetchError
      }

      // Check validity
      const now = new Date()

      if (coupon.start_date && new Date(coupon.start_date) > now) {
        return { valid: false, error: 'Coupon is not yet active' }
      }

      if (coupon.end_date && new Date(coupon.end_date) < now) {
        return { valid: false, error: 'Coupon has expired' }
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, error: 'Coupon usage limit reached' }
      }

      if (coupon.min_order && orderTotal < coupon.min_order) {
        return { valid: false, error: `Minimum order of ₹${coupon.min_order} required` }
      }

      // Calculate discount
      let discount = 0
      if (coupon.type === 'percentage') {
        discount = (orderTotal * coupon.value) / 100
        if (coupon.max_discount) {
          discount = Math.min(discount, coupon.max_discount)
        }
      } else if (coupon.type === 'fixed') {
        discount = coupon.value
      }

      return {
        valid: true,
        coupon,
        discount,
        finalTotal: Math.max(0, orderTotal - discount)
      }
    } catch (err) {
      console.error('Error validating coupon:', err)
      setError(err.message)
      return { valid: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return { validateCoupon, loading, error }
}

/**
 * Hook for coupon mutations
 */
export function useCouponMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createCoupon = useCallback(async (couponData) => {
    try {
      setLoading(true)
      setError(null)

      const coupon = {
        ...couponData,
        code: couponData.code.toUpperCase(),
        used_count: 0,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase
        .from('coupons')
        .insert(coupon)
        .select()
        .single()

      if (insertError) throw insertError

      await logActivity('coupon_created', 'coupon', data.id, 'Coupon Created', `${data.code} - ${data.type === 'percentage' ? data.value + '%' : '₹' + data.value}`, {
        newData: data
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error creating coupon:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCoupon = useCallback(async (id, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data: previousData } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error: updateError } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      await logActivity('coupon_updated', 'coupon', id, 'Coupon Updated', data.code, {
        previousData,
        newData: data,
        canRevert: true
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error updating coupon:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCoupon = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const { data: couponData } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single()

      const { error: deleteError } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await logActivity('coupon_deleted', 'coupon', id, 'Coupon Deleted', couponData?.code || id, {
        previousData: couponData
      })

      return { error: null }
    } catch (err) {
      console.error('Error deleting coupon:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const incrementUsage = useCallback(async (id) => {
    try {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('used_count')
        .eq('id', id)
        .single()

      await supabase
        .from('coupons')
        .update({ used_count: (coupon?.used_count || 0) + 1 })
        .eq('id', id)

      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  }, [])

  return {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    incrementUsage,
    loading,
    error
  }
}

export default useCoupons
