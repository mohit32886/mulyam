import { useState, useMemo } from 'react'
import { Megaphone, Tag, Plus, Edit2, Trash2, Power, GripVertical, Search, Loader2, AlertCircle } from 'lucide-react'
import { AdminLayout } from '../components/layout'
import { AdminCard, AdminButton, AdminBadge, useToast } from '../components/ui'
import { CouponModal, BannerItemModal } from '../components/offers'
import { useCoupons, useCouponMutations, useBanners, useBannerMutations, useSettings, useSettingsMutations } from '../../hooks'

function OffersPage() {
  const toast = useToast()

  // Fetch data from Supabase
  const { data: coupons, loading: couponsLoading, error: couponsError, refetch: refetchCoupons } = useCoupons()
  const { data: banners, loading: bannersLoading, error: bannersError, refetch: refetchBanners } = useBanners()
  const { data: settings } = useSettings()

  // Mutations
  const { createCoupon, updateCoupon, deleteCoupon, loading: couponMutating } = useCouponMutations()
  const { createBanner, updateBanner, deleteBanner, loading: bannerMutating } = useBannerMutations()
  const { setSetting } = useSettingsMutations()

  // Local state
  const [bannerEnabled, setBannerEnabled] = useState(settings?.banner_enabled !== false)
  const [couponSearch, setCouponSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)

  // Banner settings
  const bannerSettings = settings?.banner_settings || { bgColor: '#B19071', textColor: '#FFFFFF', transitionSpeed: 5 }

  // Filter coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon => {
      const matchesSearch = coupon.code.toLowerCase().includes(couponSearch.toLowerCase())
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && coupon.is_active) ||
                           (statusFilter === 'inactive' && !coupon.is_active)
      const matchesType = typeFilter === 'all' || coupon.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [coupons, couponSearch, statusFilter, typeFilter])

  // Stats
  const couponStats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter((c) => c.is_active).length,
    inactive: coupons.filter((c) => !c.is_active).length,
    redeemed: coupons.reduce((sum, c) => sum + (c.used_count || 0), 0),
  }), [coupons])

  // Coupon handlers
  const handleSaveCoupon = async (couponData) => {
    // Transform from modal format to DB format
    const dbCoupon = {
      code: couponData.code.toUpperCase(),
      type: couponData.discountType,
      value: couponData.discountValue,
      min_order: couponData.minOrderAmount || 0,
      max_discount: couponData.maxDiscount || null,
      usage_limit: couponData.maxUses || null,
      is_active: couponData.isActive !== false,
      start_date: couponData.startDate || null,
      end_date: couponData.endDate || null,
    }

    if (editingCoupon) {
      const { error } = await updateCoupon(editingCoupon.id, dbCoupon)
      if (error) {
        toast.error('Failed to update coupon')
      } else {
        toast.success('Coupon updated successfully')
        refetchCoupons()
      }
    } else {
      const { error } = await createCoupon(dbCoupon)
      if (error) {
        toast.error('Failed to create coupon')
      } else {
        toast.success('Coupon created successfully')
        refetchCoupons()
      }
    }
    setIsCouponModalOpen(false)
    setEditingCoupon(null)
  }

  const handleEditCoupon = (coupon) => {
    // Transform from DB format to modal format
    setEditingCoupon({
      ...coupon,
      discountType: coupon.type,
      discountValue: coupon.value,
      minOrderAmount: coupon.min_order,
      maxUses: coupon.usage_limit,
      isActive: coupon.is_active,
    })
    setIsCouponModalOpen(true)
  }

  const handleDeleteCoupon = async (couponId) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const { error } = await deleteCoupon(couponId)
      if (error) {
        toast.error('Failed to delete coupon')
      } else {
        toast.success('Coupon deleted')
        refetchCoupons()
      }
    }
  }

  const handleToggleCoupon = async (couponId, currentState) => {
    const { error } = await updateCoupon(couponId, { is_active: !currentState })
    if (error) {
      toast.error('Failed to toggle coupon')
    } else {
      refetchCoupons()
    }
  }

  // Banner handlers
  const handleSaveBanner = async (bannerData) => {
    const dbBanner = {
      title: bannerData.title,
      subtitle: bannerData.subtitle || null,
      link_url: bannerData.linkUrl || null,
      link_text: bannerData.linkText || 'Shop Now',
      position: bannerData.position || 'announcement',
      background_color: bannerData.backgroundColor || '#B19071',
      text_color: bannerData.textColor || '#FFFFFF',
      image: bannerData.image || null,
      is_active: bannerData.isActive !== false,
    }

    if (editingBanner) {
      const { error } = await updateBanner(editingBanner.id, dbBanner)
      if (error) {
        toast.error('Failed to update banner')
      } else {
        toast.success('Banner updated successfully')
        refetchBanners()
      }
    } else {
      const { error } = await createBanner(dbBanner)
      if (error) {
        toast.error('Failed to create banner')
      } else {
        toast.success('Banner created successfully')
        refetchBanners()
      }
    }
    setIsBannerModalOpen(false)
    setEditingBanner(null)
  }

  const handleEditBanner = (banner) => {
    setEditingBanner({
      ...banner,
      linkUrl: banner.link_url,
      linkText: banner.link_text,
      backgroundColor: banner.background_color,
      textColor: banner.text_color,
      isActive: banner.is_active,
    })
    setIsBannerModalOpen(true)
  }

  const handleDeleteBanner = async (bannerId) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      const { error } = await deleteBanner(bannerId)
      if (error) {
        toast.error('Failed to delete banner')
      } else {
        toast.success('Banner deleted')
        refetchBanners()
      }
    }
  }

  const handleToggleBanner = async (bannerId, currentState) => {
    const { error } = await updateBanner(bannerId, { is_active: !currentState })
    if (error) {
      toast.error('Failed to toggle banner')
    } else {
      refetchBanners()
    }
  }

  const handleToggleBannerEnabled = async () => {
    const newState = !bannerEnabled
    setBannerEnabled(newState)
    await setSetting('banner_enabled', newState)
  }

  const formatDiscount = (coupon) => {
    if (coupon.type === 'percentage') return `${coupon.value}%`
    if (coupon.type === 'fixed') return `₹${coupon.value}`
    return 'Free Shipping'
  }

  const formatConditions = (coupon) => {
    if (coupon.min_order > 0) return `Min ₹${coupon.min_order}`
    return 'No minimum'
  }

  const formatUsage = (coupon) => {
    if (!coupon.usage_limit) return `${coupon.used_count || 0} / ∞`
    return `${coupon.used_count || 0} / ${coupon.usage_limit}`
  }

  // Loading state
  if (couponsLoading || bannersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  // Error state
  if (couponsError || bannersError) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load data</h2>
          <p className="text-neutral-400 mb-4">{couponsError || bannersError}</p>
          <AdminButton onClick={() => { refetchCoupons(); refetchBanners() }}>Try Again</AdminButton>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Offers</h1>
          <p className="text-neutral-400 mt-1">
            Manage promotional banners and discount coupons
          </p>
        </div>

        {/* Promotional Banner Section */}
        <AdminCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-neutral-400" />
              <h2 className="text-lg font-semibold text-white">Promotional Banner</h2>
            </div>
            <AdminButton
              variant={bannerEnabled ? 'success' : 'secondary'}
              size="sm"
              onClick={handleToggleBannerEnabled}
            >
              {bannerEnabled ? 'Enabled' : 'Disabled'}
            </AdminButton>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">Preview</p>
            <div
              className="py-3 text-center rounded-lg"
              style={{
                backgroundColor: bannerSettings.bgColor,
                color: bannerSettings.textColor,
              }}
            >
              {banners.find(b => b.is_active)?.title || 'No active banner'}
            </div>
          </div>

          {/* Banner Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-500 uppercase tracking-wider">Banner Items</p>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingBanner(null)
                  setIsBannerModalOpen(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </AdminButton>
            </div>
            <div className="space-y-2">
              {banners.length === 0 ? (
                <p className="text-neutral-500 text-center py-4">No banner items yet</p>
              ) : (
                banners.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-admin-card-hover rounded-lg">
                    <GripVertical className="w-4 h-4 text-neutral-600 cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-neutral-500 truncate">{item.subtitle}</p>
                      )}
                    </div>
                    <AdminBadge variant={item.is_active ? 'success' : 'default'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </AdminBadge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleBanner(item.id, item.is_active)}
                        className={`p-1.5 rounded ${item.is_active ? 'text-green-400' : 'text-neutral-500'} hover:bg-admin-border`}
                        disabled={bannerMutating}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditBanner(item)}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-admin-border rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-admin-border rounded"
                        disabled={bannerMutating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </AdminCard>

        {/* Coupons Section */}
        <AdminCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-neutral-400" />
              <h2 className="text-lg font-semibold text-white">Discount Coupons</h2>
            </div>
            <AdminButton
              onClick={() => {
                setEditingCoupon(null)
                setIsCouponModalOpen(true)
              }}
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </AdminButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: couponStats.total, color: 'text-white' },
              { label: 'Active', value: couponStats.active, color: 'text-green-400' },
              { label: 'Inactive', value: couponStats.inactive, color: 'text-neutral-400' },
              { label: 'Redeemed', value: couponStats.redeemed, color: 'text-orange-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-admin-card-hover rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white placeholder-neutral-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-admin-card-hover border border-admin-border rounded-md text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="freeShipping">Free Shipping</option>
            </select>
          </div>

          {/* Coupons List */}
          <div className="space-y-2">
            {filteredCoupons.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No coupons found</p>
            ) : (
              filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center gap-4 p-4 bg-admin-card-hover rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-orange-400 font-mono">{coupon.code}</code>
                      <AdminBadge variant={coupon.is_active ? 'success' : 'default'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </AdminBadge>
                    </div>
                    <p className="text-sm text-neutral-400">
                      {formatDiscount(coupon)} off · {formatConditions(coupon)} · Used: {formatUsage(coupon)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                      className={`p-2 rounded ${coupon.is_active ? 'text-green-400' : 'text-neutral-500'} hover:bg-admin-border`}
                      disabled={couponMutating}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="p-2 text-neutral-400 hover:text-white hover:bg-admin-border rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-admin-border rounded"
                      disabled={couponMutating}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminCard>
      </div>

      {/* Modals */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => {
          setIsCouponModalOpen(false)
          setEditingCoupon(null)
        }}
        onSave={handleSaveCoupon}
        coupon={editingCoupon}
      />

      <BannerItemModal
        isOpen={isBannerModalOpen}
        onClose={() => {
          setIsBannerModalOpen(false)
          setEditingBanner(null)
        }}
        onSave={handleSaveBanner}
        banner={editingBanner}
      />
    </AdminLayout>
  )
}

export default OffersPage
