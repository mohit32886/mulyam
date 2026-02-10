// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================
// PRODUCTS API
// ============================================
export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByCollection(collection) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('collection', collection)
      .eq('is_live', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Bulk operations
  async bulkInsert(products) {
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) throw error
    return data
  }
}

// ============================================
// COUPONS API
// ============================================
export const couponsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getByCode(code) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  async create(coupon) {
    const { data, error } = await supabase
      .from('coupons')
      .insert({ ...coupon, code: coupon.code.toUpperCase() })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async incrementUsage(id) {
    const { data, error } = await supabase
      .rpc('increment_coupon_usage', { coupon_id: id })

    if (error) throw error
    return data
  }
}

// ============================================
// BANNERS API
// ============================================
export const bannersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data
  },

  async getByPosition(position) {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('position', position)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data
  },

  async create(banner) {
    const { data, error } = await supabase
      .from('banners')
      .insert(banner)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// ============================================
// SETTINGS API
// ============================================
export const settingsApi = {
  async get(key) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.value || null
  },

  async set(key, value) {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')

    if (error) throw error
    return data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
  }
}

// ============================================
// ACTIVITY LOG API
// ============================================
export const activityApi = {
  async getAll(options = {}) {
    let query = supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })

    if (options.limit) query = query.limit(options.limit)
    if (options.entityType) query = query.eq('entity_type', options.entityType)
    if (options.since) query = query.gte('created_at', options.since)

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async log(activity) {
    const { data, error } = await supabase
      .from('activity_log')
      .insert(activity)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ============================================
// HELPER: Log activity after operations
// ============================================
export async function logActivity(actionType, entityType, entityId, label, detail, options = {}) {
  try {
    await activityApi.log({
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      label,
      detail,
      previous_data: options.previousData || null,
      new_data: options.newData || null,
      can_revert: options.canRevert || false,
      user_name: options.userName || 'Admin'
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
