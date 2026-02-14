import { useState, useEffect, useCallback } from 'react'
import { supabase, logActivity } from '../../lib/supabase'

/**
 * Hook to fetch all banners
 */
export function useBanners(options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { position = null, isActive = null } = options

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true })

      if (position) {
        query = query.eq('position', position)
      }
      if (isActive !== null) {
        query = query.eq('is_active', isActive)
      }

      const { data: banners, error: fetchError } = await query

      if (fetchError) throw fetchError
      setData(banners || [])
    } catch (err) {
      console.error('Error fetching banners:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [position, isActive])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  return { data, loading, error, refetch: fetchBanners }
}

/**
 * Hook for banner mutations
 */
export function useBannerMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBanner = useCallback(async (bannerData) => {
    try {
      setLoading(true)
      setError(null)

      const banner = {
        ...bannerData,
        created_at: new Date().toISOString(),
      }

      const { data, error: insertError } = await supabase
        .from('banners')
        .insert(banner)
        .select()
        .single()

      if (insertError) throw insertError

      await logActivity('banner_created', 'banner', data.id, 'Banner Created', data.title, {
        newData: data
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error creating banner:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBanner = useCallback(async (id, updates) => {
    try {
      setLoading(true)
      setError(null)

      const { data: previousData } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      const { data, error: updateError } = await supabase
        .from('banners')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      await logActivity('banner_updated', 'banner', id, 'Banner Updated', data.title, {
        previousData,
        newData: data,
        canRevert: true
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error updating banner:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBanner = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const { data: bannerData } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single()

      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await logActivity('banner_deleted', 'banner', id, 'Banner Deleted', bannerData?.title || id, {
        previousData: bannerData
      })

      return { error: null }
    } catch (err) {
      console.error('Error deleting banner:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const reorderBanners = useCallback(async (orderedIds) => {
    try {
      setLoading(true)
      setError(null)

      const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index
      }))

      for (const update of updates) {
        await supabase
          .from('banners')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      }

      return { error: null }
    } catch (err) {
      console.error('Error reordering banners:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    loading,
    error
  }
}

export default useBanners
