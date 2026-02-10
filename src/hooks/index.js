// Export all hooks

// Admin hooks (with mutations)
export { useProducts, useProduct, useProductMutations } from './useProducts'
export { useCoupons, useValidateCoupon, useCouponMutations } from './useCoupons'
export { useBanners, useBannerMutations } from './useBanners'
export { useSettings, useSetting, useSettingsMutations } from './useSettings'
export { useActivityLog, useActivityStats, groupActivitiesByDate, activityTypeConfig } from './useActivityLog'

// Frontend/Store hooks (read-only, optimized for customer site)
export {
  useStoreProducts,
  useBestsellers,
  useFeaturedProducts,
  useCollectionProducts,
  useProduct as useStoreProduct,
  useRelatedProducts,
  useStoreBanners,
  useStoreSettings,
  useValidateCouponCode,
  useProductSearch,
} from './useStore'
