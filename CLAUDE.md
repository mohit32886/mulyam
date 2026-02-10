# Mulyam Jewels - Project Guidelines

## Project Overview
React + Tailwind clone of mulyamjewels.com - a demi-fine jewelry e-commerce site for women, kids, and pets.

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **Icons**: Lucide React

## Commands
```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## File Structure
```
src/
├── components/       # Reusable components organized by feature
│   ├── layout/       # Header, Footer, AnnouncementBar, Layout
│   ├── ui/           # Button, Badge, ProductCard, PriceDisplay
│   ├── home/         # Homepage-specific components
│   ├── collection/   # Collection page components
│   ├── product/      # Product detail components
│   └── cart/         # Cart drawer and items
├── pages/            # Route-level page components
├── data/             # Mock data (products, collections)
├── context/          # React context providers (CartContext)
└── hooks/            # Custom hooks (useCart)
```

## Coding Standards

### Components
- Functional components with hooks only
- Accept `className` prop for style extensibility
- Use destructuring for props
- Keep components focused and single-responsibility

### Styling
- Tailwind CSS for ALL styling (no separate CSS files)
- Use custom theme colors defined in tailwind.config.js
- Mobile-first responsive design (sm:, md:, lg: breakpoints)

### Icons
- Use Lucide React consistently
- Import only needed icons: `import { ShoppingBag, Search } from 'lucide-react'`

### Data
- Products stored in `src/data/products.js`
- Collections metadata in `src/data/collections.js`
- Use consistent ID format: lowercase-kebab-case

## Brand Reference
**Use `/mulyam-brand` skill** for design consistency including:
- Color palette (tan, coral, black, white)
- Typography (Playfair Display, Inter)
- Component patterns
- Spacing guidelines

## Key URLs
- **Original Site**: https://mulyamjewels.com/
- **WhatsApp**: wa.me/919523882449
- **Instagram**: instagram.com/mulyam_jewels

## Currency
- All prices in INR (₹)
- Format: `₹699` or `Rs 699`
- Show original price struck through when discounted

## Progress Tracking
Check `PROGRESS.md` for implementation status and verification checkpoints.

---

## Admin Portal

### Overview
The admin portal (`/admin/*`) is a dark-themed dashboard for managing products, offers, and store settings.

### Admin Routes
| Route | Page |
|-------|------|
| `/admin` | Dashboard |
| `/admin/catalogue` | Product list with inline editing |
| `/admin/catalogue/new` | Add new product form |
| `/admin/catalogue/content-studio` | AI content generator |
| `/admin/offers` | Banners & coupons |
| `/admin/settings` | Store configuration |

### Admin Theme Colors
| Name | Value | Usage |
|------|-------|-------|
| Background | `#0a0a0f` | Page background |
| Card | `#12121a` | Card backgrounds |
| Border | `#2a2a35` | Borders |
| Orange | `#f97316` | Primary CTAs |
| Green | `#22c55e` | Live status |
| Yellow | `#eab308` | Draft status |

### Admin File Structure
```
src/admin/
├── components/
│   ├── layout/      # AdminLayout, AdminHeader
│   ├── ui/          # AdminCard, AdminTable, AdminToggle
│   ├── catalogue/   # ProductTable, ProductEditPanel
│   ├── offers/      # BannerManager, CouponTable
│   └── settings/    # Various settings components
├── pages/           # Admin page components
├── context/         # AdminAuthContext
└── hooks/           # useAdminAuth
```

### Admin Implementation Plan
See `ADMIN-PLAN.md` for detailed feature checklist and implementation phases.
