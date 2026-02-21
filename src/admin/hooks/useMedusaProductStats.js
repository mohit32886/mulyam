import { useState, useEffect } from 'react'
import medusa from '../../lib/medusa-client'

const REGION_ID = 'reg_01KHYC1EE382WKBKE27QDHNJFY'

export function useMedusaProductStats() {
  const [stats, setStats] = useState({ total: 0, published: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Use limit=1 with offset=0 to just get the count, not full payloads
        const { count } = await medusa.store.product.list({
          limit: 1,
          offset: 0,
          region_id: REGION_ID,
        })
        setStats({
          total: count || 0,
          published: count || 0, // Store API only returns published products
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
