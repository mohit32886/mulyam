import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Package, Tag, Image, Settings, User } from 'lucide-react'

/**
 * Hook to fetch activity log
 */
export function useActivityLog(options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    entityType = null,
    actionType = null,
    limit = 50,
    since = null
  } = options

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (entityType) {
        query = query.eq('entity_type', entityType)
      }
      if (actionType) {
        query = query.eq('action_type', actionType)
      }
      if (since) {
        query = query.gte('created_at', since)
      }

      const { data: activities, error: fetchError } = await query

      if (fetchError) throw fetchError
      setData(activities || [])
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [entityType, actionType, limit, since])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  return { data, loading, error, refetch: fetchActivities }
}

/**
 * Hook to get activity stats
 */
export function useActivityStats() {
  const [data, setData] = useState({
    total: 0,
    today: 0,
    productChanges: 0,
    couponChanges: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Get total count
        const { count: total } = await supabase
          .from('activity_log')
          .select('*', { count: 'exact', head: true })

        // Get today's count
        const { count: todayCount } = await supabase
          .from('activity_log')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString())

        // Get product changes
        const { count: productChanges } = await supabase
          .from('activity_log')
          .select('*', { count: 'exact', head: true })
          .eq('entity_type', 'product')

        // Get coupon changes
        const { count: couponChanges } = await supabase
          .from('activity_log')
          .select('*', { count: 'exact', head: true })
          .eq('entity_type', 'coupon')

        setData({
          total: total || 0,
          today: todayCount || 0,
          productChanges: productChanges || 0,
          couponChanges: couponChanges || 0
        })
      } catch (err) {
        console.error('Error fetching activity stats:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { data, loading, error }
}

/**
 * Group activities by date
 */
export function groupActivitiesByDate(activities) {
  const groups = {}

  activities.forEach(activity => {
    const date = new Date(activity.created_at).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
  })

  return groups
}

/**
 * Activity type icons and colors
 */
export const activityTypeConfig = {
  product_created: { icon: Package, label: 'Product Created', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  product_updated: { icon: Package, label: 'Product Updated', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  product_deleted: { icon: Package, label: 'Product Deleted', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  coupon_created: { icon: Tag, label: 'Coupon Created', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  coupon_updated: { icon: Tag, label: 'Coupon Updated', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  coupon_deleted: { icon: Tag, label: 'Coupon Deleted', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  banner_created: { icon: Image, label: 'Banner Created', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  banner_updated: { icon: Image, label: 'Banner Updated', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  banner_deleted: { icon: Image, label: 'Banner Deleted', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  settings_changed: { icon: Settings, label: 'Settings Changed', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  login: { icon: User, label: 'Admin Login', color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
  default: { icon: Package, label: 'Activity', color: 'text-neutral-400', bgColor: 'bg-neutral-500/20' },
}

export default useActivityLog
