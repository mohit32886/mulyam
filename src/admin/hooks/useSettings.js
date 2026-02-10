import { useState, useEffect, useCallback } from 'react'
import { supabase, logActivity } from '../../lib/supabase'

/**
 * Hook to fetch all settings
 */
export function useSettings() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: settings, error: fetchError } = await supabase
        .from('settings')
        .select('*')

      if (fetchError) throw fetchError

      // Convert array to object
      const settingsObj = (settings || []).reduce((acc, { key, value }) => ({
        ...acc,
        [key]: value
      }), {})

      setData(settingsObj)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { data, loading, error, refetch: fetchSettings }
}

/**
 * Hook to fetch a single setting
 */
export function useSetting(key) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!key) {
      setLoading(false)
      return
    }

    async function fetchSetting() {
      try {
        setLoading(true)
        setError(null)

        const { data: setting, error: fetchError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', key)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        setData(setting?.value || null)
      } catch (err) {
        console.error('Error fetching setting:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSetting()
  }, [key])

  return { data, loading, error }
}

/**
 * Hook for settings mutations
 */
export function useSettingsMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setSetting = useCallback(async (key, value) => {
    try {
      setLoading(true)
      setError(null)

      // Get previous value for logging
      const { data: previousSetting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

      const { data, error: upsertError } = await supabase
        .from('settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
        .single()

      if (upsertError) throw upsertError

      await logActivity('settings_changed', 'settings', key, 'Settings Changed', `Updated ${key}`, {
        previousData: previousSetting?.value,
        newData: value,
        canRevert: true
      })

      return { data, error: null }
    } catch (err) {
      console.error('Error setting value:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const setMultipleSettings = useCallback(async (settingsObj) => {
    try {
      setLoading(true)
      setError(null)

      const entries = Object.entries(settingsObj)
      const results = []

      for (const [key, value] of entries) {
        const { data, error } = await supabase
          .from('settings')
          .upsert({ key, value, updated_at: new Date().toISOString() })
          .select()
          .single()

        if (error) throw error
        results.push(data)
      }

      await logActivity('settings_changed', 'settings', null, 'Settings Changed', `Updated ${entries.length} settings`, {
        newData: settingsObj,
        canRevert: true
      })

      return { data: results, error: null }
    } catch (err) {
      console.error('Error setting multiple values:', err)
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSetting = useCallback(async (key) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from('settings')
        .delete()
        .eq('key', key)

      if (deleteError) throw deleteError

      return { error: null }
    } catch (err) {
      console.error('Error deleting setting:', err)
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    setSetting,
    setMultipleSettings,
    deleteSetting,
    loading,
    error
  }
}

export default useSettings
