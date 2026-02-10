# Supabase Migration Plan

## Overview
Migrate Mulyam Jewels admin portal from localStorage to Supabase for proper persistence.

## Current State
- **Storage**: localStorage (browser-based, per-device)
- **Data**: Products, Coupons, Banners, Settings, Activity Log
- **Issues**: Data lost on browser clear, no cross-device sync, no real persistence

## Target State
- **Storage**: Supabase PostgreSQL (cloud database)
- **Benefits**: Real persistence, cross-device access, scalable, queryable

---

## Phase 0: Setup (CURRENT) ✅

### Files Created
```
supabase/
├── migrations/
│   └── 001_initial_schema.sql    # Database schema
scripts/
├── test-supabase-js.mjs          # Connection test
├── setup-supabase.mjs            # Table checker
└── poc-supabase-crud.mjs         # CRUD POC
src/lib/
└── supabase.js                   # Supabase client + APIs
```

### Action Required
1. **Run SQL migration** in Supabase SQL Editor
   - Go to: https://supabase.com/dashboard/project/erajddcokavyzuviikmw/sql/new
   - Paste contents of `supabase/migrations/001_initial_schema.sql`
   - Click **Run**

2. **Test POC**
   ```bash
   node scripts/poc-supabase-crud.mjs
   ```

---

## Phase 1: Environment Setup

### 1.1 Create `.env` file
```env
VITE_SUPABASE_URL=https://erajddcokavyzuviikmw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fm9bO40dPbmTCZ-Klgbu2g_98kvh0-N
```

### 1.2 Add to `.gitignore`
```
.env
.env.local
```

---

## Phase 2: Seed Initial Data

### 2.1 Create seed script
Migrate existing `src/data/products.js` to Supabase:

```javascript
// scripts/seed-products.mjs
import { createClient } from '@supabase/supabase-js'
import { products } from '../src/data/products.js'

// Transform and insert products
```

### 2.2 Run seed
```bash
node scripts/seed-products.mjs
```

---

## Phase 3: Create React Hooks

### 3.1 `useProducts` hook
```
src/hooks/useProducts.js
- useProducts()           → fetch all products
- useProduct(id)          → fetch single product
- useProductsByCollection → fetch by collection
- useCreateProduct()      → create mutation
- useUpdateProduct()      → update mutation
- useDeleteProduct()      → delete mutation
```

### 3.2 `useCoupons` hook
```
src/hooks/useCoupons.js
- useCoupons()
- useCreateCoupon()
- useUpdateCoupon()
- useDeleteCoupon()
- useValidateCoupon(code)
```

### 3.3 `useBanners` hook
```
src/hooks/useBanners.js
- useBanners()
- useBannersByPosition(position)
- useCreateBanner()
- useUpdateBanner()
- useDeleteBanner()
```

### 3.4 `useSettings` hook
```
src/hooks/useSettings.js
- useSettings()
- useSetting(key)
- useUpdateSettings()
```

### 3.5 `useActivityLog` hook
```
src/hooks/useActivityLog.js
- useActivityLog(filters)
- useLogActivity()
```

---

## Phase 4: Migrate Admin Pages

### Files to Update

| Page | Current | Changes |
|------|---------|---------|
| `CataloguePage.jsx` | localStorage | Use `useProducts()` hook |
| `AddProductPage.jsx` | localStorage | Use `useCreateProduct()` |
| `EditProductPanel.jsx` | props | Use `useUpdateProduct()` |
| `ContentStudioPage.jsx` | localStorage | Use `useProducts()` |
| `OffersPage.jsx` | localStorage | Use `useCoupons()`, `useBanners()` |
| `SettingsPage.jsx` | localStorage | Use `useSettings()` |
| `TimeMachinePage.jsx` | mock data | Use `useActivityLog()` |
| `ImagesPage.jsx` | static data | Use `useProducts()` for images |
| `AdminDashboard.jsx` | localStorage | Use `useProducts()` for stats |

### Migration Pattern
```jsx
// BEFORE (localStorage)
const [products, setProducts] = useState(() => {
  const stored = localStorage.getItem('key')
  return stored ? JSON.parse(stored) : initialData
})

// AFTER (Supabase)
const { data: products, isLoading, error, mutate } = useProducts()
```

---

## Phase 5: Migrate Customer Pages

### Files to Update

| Page | Changes |
|------|---------|
| `HomePage.jsx` | Fetch bestsellers from Supabase |
| `CollectionPage.jsx` | Fetch products by collection |
| `ProductPage.jsx` | Fetch single product |
| `CartContext.jsx` | Validate coupons via Supabase |

---

## Phase 6: Real-time Features (Optional)

### Supabase Realtime
```javascript
// Subscribe to product changes
supabase
  .channel('products')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' },
    payload => {
      // Update local state
    })
  .subscribe()
```

---

## Phase 7: Cleanup

### Remove
- [ ] localStorage code from all pages
- [ ] `PRODUCTS_STORAGE_KEY` and similar constants
- [ ] Static fallback logic
- [ ] Mock data generators in TimeMachine

### Keep
- [ ] `src/data/products.js` as backup/reference
- [ ] Supabase client in `src/lib/supabase.js`

---

## File Changes Summary

### New Files
```
.env
src/lib/supabase.js              ✅ Created
src/hooks/useProducts.js
src/hooks/useCoupons.js
src/hooks/useBanners.js
src/hooks/useSettings.js
src/hooks/useActivityLog.js
scripts/seed-products.mjs
supabase/migrations/001_*.sql    ✅ Created
```

### Modified Files
```
src/admin/pages/CataloguePage.jsx
src/admin/pages/AddProductPage.jsx
src/admin/pages/ContentStudioPage.jsx
src/admin/pages/OffersPage.jsx
src/admin/pages/SettingsPage.jsx
src/admin/pages/TimeMachinePage.jsx
src/admin/pages/ImagesPage.jsx
src/admin/pages/AdminDashboard.jsx
src/admin/components/catalogue/EditProductPanel.jsx
src/pages/HomePage.jsx
src/pages/CollectionPage.jsx
src/pages/ProductPage.jsx
src/context/CartContext.jsx
```

---

## Testing Checklist

### Admin Portal
- [ ] Dashboard shows correct stats
- [ ] Catalogue lists all products
- [ ] Add product creates in database
- [ ] Edit product updates in database
- [ ] Delete product removes from database
- [ ] Coupons CRUD works
- [ ] Banners CRUD works
- [ ] Settings save/load works
- [ ] Activity log shows real data

### Customer Site
- [ ] Homepage loads products
- [ ] Collection pages filter correctly
- [ ] Product detail pages load
- [ ] Cart coupon validation works

---

## Rollback Plan

If issues occur:
1. Revert to localStorage branch
2. Keep Supabase data intact
3. Debug and fix issues
4. Re-attempt migration

---

## Timeline Estimate

| Phase | Effort |
|-------|--------|
| Phase 0: Setup | ✅ Done |
| Phase 1: Environment | 10 min |
| Phase 2: Seed Data | 30 min |
| Phase 3: React Hooks | 2 hours |
| Phase 4: Admin Pages | 3 hours |
| Phase 5: Customer Pages | 1 hour |
| Phase 6: Realtime | Optional |
| Phase 7: Cleanup | 30 min |

**Total: ~7 hours**

---

## Next Steps

1. **Run the SQL migration** (Phase 0)
2. **Test POC script** to verify CRUD works
3. **Create .env file** (Phase 1)
4. **Start Phase 3** - Create React hooks
