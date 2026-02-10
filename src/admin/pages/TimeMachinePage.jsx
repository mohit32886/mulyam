import { useState, useMemo } from 'react'
import {
  Clock,
  RotateCcw,
  Filter,
  Search,
  Package,
  Tag,
  Settings,
  Image,
  User,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminBadge, useToast } from '../components/ui'
import {
  useActivityLog,
  groupActivitiesByDate,
  activityTypeConfig,
  useProductMutations,
  useCouponMutations,
  useSettingsMutations,
  useBannerMutations
} from '../../hooks'

const filterOptions = [
  { value: 'all', label: 'All Activities' },
  { value: 'product', label: 'Products' },
  { value: 'coupon', label: 'Coupons' },
  { value: 'banner', label: 'Banners' },
  { value: 'settings', label: 'Settings' },
]

function TimeMachinePage() {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState('all') // 'today', 'week', 'month', 'all'
  const [reverting, setReverting] = useState(null) // activity id being reverted

  // Mutation hooks for reverting
  const { updateProduct } = useProductMutations()
  const { updateCoupon } = useCouponMutations()
  const { setSetting } = useSettingsMutations()
  const { updateBanner } = useBannerMutations()

  // Fetch activities from Supabase
  const { data: rawActivities, loading, error, refetch } = useActivityLog({ limit: 100 })

  // Transform raw activities to include icon and styling info
  const activities = useMemo(() => {
    return rawActivities.map(activity => {
      const config = activityTypeConfig[activity.action_type] || activityTypeConfig.default
      return {
        ...activity,
        icon: config.icon,
        label: config.label,
        color: config.color,
        bgColor: config.bgColor,
        detail: activity.description || activity.entity_id || '',
        timestamp: activity.created_at,
        user: 'Admin',
        canRevert: ['product_updated', 'settings_changed', 'coupon_updated'].includes(activity.action_type),
      }
    })
  }, [rawActivities])

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = activity.detail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.label?.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchesType = filterType === 'all' || activity.action_type?.startsWith(filterType)

      // Date filter
      let matchesDate = true
      const activityDate = new Date(activity.timestamp)
      const now = new Date()

      if (dateRange === 'today') {
        matchesDate = activityDate.toDateString() === now.toDateString()
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
        matchesDate = activityDate >= weekAgo
      } else if (dateRange === 'month') {
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
        matchesDate = activityDate >= monthAgo
      }

      return matchesSearch && matchesType && matchesDate
    })
  }, [activities, searchQuery, filterType, dateRange])

  // Group by date
  const groupedActivities = useMemo(() => {
    return groupActivitiesByDate(filteredActivities.map(a => ({ ...a, created_at: a.timestamp })))
  }, [filteredActivities])

  const handleRevert = async (activity) => {
    // Check if we have previous data to restore
    if (!activity.previous_data) {
      toast.error('No previous data available for this activity')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to revert "${activity.detail}"? This will restore the previous state.`
    )
    if (!confirmed) return

    setReverting(activity.id)

    try {
      const previousData = typeof activity.previous_data === 'string'
        ? JSON.parse(activity.previous_data)
        : activity.previous_data

      switch (activity.entity_type) {
        case 'product':
          await updateProduct(activity.entity_id, previousData)
          toast.success('Product reverted successfully')
          break

        case 'coupon':
          await updateCoupon(activity.entity_id, previousData)
          toast.success('Coupon reverted successfully')
          break

        case 'banner':
          await updateBanner(activity.entity_id, previousData)
          toast.success('Banner reverted successfully')
          break

        case 'settings':
          // Settings are stored as key-value, previousData contains the old value
          if (previousData.key && previousData.value !== undefined) {
            await setSetting(previousData.key, previousData.value)
            toast.success('Setting reverted successfully')
          } else {
            // If previousData is the settings object directly
            for (const [key, value] of Object.entries(previousData)) {
              await setSetting(key, value)
            }
            toast.success('Settings reverted successfully')
          }
          break

        default:
          toast.error(`Cannot revert ${activity.entity_type} activities`)
      }

      // Refresh the activity log
      refetch()
    } catch (err) {
      console.error('Error reverting activity:', err)
      toast.error(`Failed to revert: ${err.message}`)
    } finally {
      setReverting(null)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today - 24 * 60 * 60 * 1000)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
  }

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todayCount = activities.filter(a => new Date(a.timestamp).toDateString() === today).length
    const productChanges = activities.filter(a => a.action_type?.startsWith('product')).length
    const couponChanges = activities.filter(a => a.action_type?.startsWith('coupon')).length

    return { todayCount, productChanges, couponChanges, total: activities.length }
  }, [activities])

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Error banner if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Time Machine</h1>
            <p className="text-neutral-400 mt-1">
              View activity history and restore previous states
            </p>
          </div>
          <AdminButton variant="secondary">
            <RotateCcw className="w-4 h-4" />
            Export Log
          </AdminButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <AdminCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-neutral-500">Total Activities</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.todayCount}</p>
                <p className="text-xs text-neutral-500">Today</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.productChanges}</p>
                <p className="text-xs text-neutral-500">Product Changes</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.couponChanges}</p>
                <p className="text-xs text-neutral-500">Coupon Changes</p>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Filters */}
        <AdminCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 text-sm"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>
        </AdminCard>

        {/* Activity Timeline */}
        {filteredActivities.length === 0 ? (
          <AdminCard className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No activities found</p>
            <p className="text-sm text-neutral-600 mt-1">
              Try adjusting your search or filter
            </p>
          </AdminCard>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-admin-card-hover rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-neutral-400">
                    {formatDateLabel(date)}
                  </h3>
                  <div className="flex-1 h-px bg-admin-border" />
                  <span className="text-xs text-neutral-600">
                    {dayActivities.length} activities
                  </span>
                </div>

                {/* Activities */}
                <AdminCard className="overflow-hidden">
                  {dayActivities.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className={`flex items-center gap-4 p-4 hover:bg-admin-card-hover transition-colors ${
                          index !== dayActivities.length - 1 ? 'border-b border-admin-border' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.bgColor}`}>
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{activity.label}</p>
                            <AdminBadge variant="default" className="text-xs">
                              {activity.user}
                            </AdminBadge>
                          </div>
                          <p className="text-sm text-neutral-400 truncate">
                            {activity.detail}
                          </p>
                        </div>

                        {/* Time */}
                        <span className="text-sm text-neutral-500">
                          {formatTime(activity.timestamp)}
                        </span>

                        {/* Actions */}
                        {activity.canRevert && activity.previous_data ? (
                          <button
                            onClick={() => handleRevert(activity)}
                            disabled={reverting === activity.id}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-400 hover:text-white bg-admin-card-hover rounded-md hover:bg-admin-border transition-colors disabled:opacity-50"
                          >
                            {reverting === activity.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            {reverting === activity.id ? 'Reverting...' : 'Revert'}
                          </button>
                        ) : (
                          <div className="w-20" />
                        )}

                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </div>
                    )
                  })}
                </AdminCard>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Showing {filteredActivities.length} of {activities.length} activities
        </p>
      </div>
    </AdminLayout>
  )
}

export default TimeMachinePage
