# Production Deployment Checklist

> Last updated: 2026-02-21

## P0 — Must Fix Before Launch

- [ ] **Remove secrets from git** — `.env` is committed with Supabase keys, Cloudinary creds, Medusa publishable key. Remove from git history, add to `.gitignore`
- [ ] **Set real JWT/Cookie secrets** — `mulyam-medusa/medusa-config.ts` defaults to `"supersecret"`. Generate and set `JWT_SECRET` + `COOKIE_SECRET` in production env
- [ ] **Set production URLs** — Frontend hardcodes `localhost:9000` fallbacks in:
  - `src/lib/medusa-client.js:3`
  - `src/hooks/medusa/useCheckout.js:98`
  - `src/admin/components/layout/AdminHeader.jsx:78`
- [ ] **Enable HTTPS** — `nginx.conf` has SSL commented out. Configure certs and enable
- [ ] **Set up frontend hosting** — No Vercel/Netlify/Cloudflare Pages config exists for storefront or admin builds

## P1 — Should Fix

- [ ] **Password reset flow** — Auth has login/register but no forgot-password UI. Medusa provides the APIs, just need frontend pages
- [ ] **Migrate remaining Supabase data** — Banners, Settings, Coupons, Activity Log still on Supabase. Admin uses dual data sources
- [ ] **Fix search to use Medusa** — `src/components/search/SearchModal.jsx` queries Supabase products instead of Medusa
- [ ] **Add CI/CD pipeline** — No GitHub Actions or deployment automation
- [ ] **SEO basics** — Missing `robots.txt`, `sitemap.xml`, OG meta tags, per-page titles
- [ ] **Coupon entry at checkout** — Coupons exist in admin but no customer-facing input in checkout flow

## P2 — Nice to Have

- [ ] **Wishlist** — No persistence or UI
- [ ] **Image optimization** — No lazy loading / srcset / responsive images
- [ ] **Error reporting** — No Sentry or similar
- [ ] **Analytics** — No GA / Plausible
- [ ] **404 page** — Currently redirects to home instead of showing a proper error page
- [ ] **Email unsubscribe** — Notifications are one-way, no preference management

## Environment Variables Needed for Production

### Frontend (`.env.production`)

```env
VITE_MEDUSA_BACKEND_URL=https://api.mulyamjewels.com
VITE_MEDUSA_PUBLISHABLE_KEY=pk_...
VITE_STOREFRONT_URL=https://mulyamjewels.com
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...
```

### Backend (`mulyam-medusa/.env`)

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<generate-random-64-char>
COOKIE_SECRET=<generate-random-64-char>
RAZORPAY_KEY_ID=<live-key>
RAZORPAY_KEY_SECRET=<live-secret>
RESEND_API_KEY=<production-key>
STORE_CORS=https://mulyamjewels.com
ADMIN_CORS=https://admin.mulyamjewels.com
```

## Deployment Architecture

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   DNS + CDN     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     mulyamjewels.com  admin.mulyam...  api.mulyam...
              │              │              │
     ┌────────▼───────┐ ┌───▼──────┐ ┌────▼─────────┐
     │  Cloudflare    │ │Cloudflare│ │    VPS/DO     │
     │  Pages (SPA)   │ │Pages(SPA)│ │ Docker Compose│
     │  dist/store/   │ │dist/admin│ │  Medusa + PG  │
     └────────────────┘ └──────────┘ │  + Redis      │
                                     │  + Nginx      │
                                     └──────────────┘
```

## Suggested Order of Attack

1. Secure & configure — gitignore `.env`, set production secrets + URLs
2. Deploy backend — Docker Compose prod is ready, needs real env vars + SSL
3. Deploy frontend — Pick hosting (Cloudflare Pages), add deploy config
4. Password reset — Quick win using Medusa auth APIs
5. Migrate remaining Supabase — Or keep if acceptable for v1
6. SEO & monitoring — Meta tags, sitemap, error tracking
