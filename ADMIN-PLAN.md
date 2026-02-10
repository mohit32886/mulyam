# Mulyam Admin Portal Clone - Implementation Plan

## Overview

Clone the admin portal at `mulyamjewels.com/admin` as a React application with the same dark theme design and functionality.

---

## Admin Portal Structure (Discovered)

### Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Main admin dashboard with stats and quick links |
| `/admin/catalogue` | Catalogue | Product list with filters, search, and inline editing |
| `/admin/catalogue/new` | Add Product | Form to create new product |
| `/admin/catalogue/content-studio` | Content Studio | AI-powered name/description generator |
| `/admin/offers` | Offers | Promotional banners and coupons management |
| `/admin/settings` | Settings | Store configuration (brand, shipping, homepage) |
| `/admin/images` | Images | Image management (Coming Soon) |
| `/admin/time-machine` | Time Machine | Version history (Coming Soon) |

### Authentication
- Simple login form with username/password
- Session-based authentication

---

## Feature Checklist

### Phase 1: Admin Layout & Authentication
- [ ] **Admin Layout Component**
  - [ ] Dark theme (neutral-900 background)
  - [ ] Top navigation bar with logo
  - [ ] Navigation links (Catalogue, Images, Offers, Time Machine, Settings)
  - [ ] Search shortcut button (Cmd K)
  - [ ] Store link (external)
  - [ ] User avatar dropdown

- [ ] **Login Page**
  - [ ] Login form (username, password)
  - [ ] "Sign In" button with loading state
  - [ ] Simple auth context (mock authentication)

### Phase 2: Dashboard Page
- [ ] **Dashboard Layout**
  - [ ] "M" logo with "MULYAM" title
  - [ ] "Admin Dashboard" subtitle

- [ ] **Stats Cards Row**
  - [ ] Total Products card (blue icon)
  - [ ] Live products card (green icon)
  - [ ] Draft products card (yellow icon)
  - [ ] Out of Stock card (red icon)

- [ ] **Quick Links Grid**
  - [ ] CATALOGUE section
    - [ ] All Products link
    - [ ] Add Product link
    - [ ] Content Studio link
  - [ ] STORE section
    - [ ] Offers & Coupons link
    - [ ] Settings link
  - [ ] MEDIA section (disabled/coming soon)
    - [ ] Images link
    - [ ] Time Machine link
  - [ ] COMING SOON section
    - [ ] Orders Management (text only)
    - [ ] Analytics Dashboard (text only)
    - [ ] Customer Insights (text only)

- [ ] **Footer**
  - [ ] Version text "v1.0 - January 2025"

### Phase 3: Catalogue Page
- [ ] **Page Header**
  - [ ] "Catalogue" title
  - [ ] Stats tabs (Products, Live, Draft, Issues)
  - [ ] Data export button
  - [ ] Add Product button

- [ ] **Filter Bar**
  - [ ] Search input with icon
  - [ ] Collection dropdown (All, DIVA, MINI, PAWS)
  - [ ] Category dropdown (All, Earrings, Bracelets, Necklaces, Rings, Anklets)
  - [ ] Stock filter dropdown (All, In Stock, Out of Stock)
  - [ ] Sort dropdown (Newest, Oldest, Name, SKU, Price)

- [ ] **Product Table**
  - [ ] Checkbox column (bulk select)
  - [ ] Product column (image, name, SKU, collection, category, badges)
  - [ ] Price column (current price, compare price strikethrough)
  - [ ] Stock column (editable button)
  - [ ] In Stock toggle
  - [ ] Status badge (Live/Draft)
  - [ ] Live toggle
  - [ ] Row click → opens edit panel

- [ ] **Pagination**
  - [ ] "Showing X to Y of Z" text
  - [ ] Next/Previous buttons

- [ ] **Edit Product Slide Panel**
  - [ ] Product image and title header
  - [ ] SKU display
  - [ ] Tab navigation (Details, Pricing, Inventory, Content)
  - [ ] **Details Tab**
    - [ ] Collection dropdown
    - [ ] Category dropdown
    - [ ] Status dropdown (Draft, Live, End of Life)
    - [ ] Color input
    - [ ] Material input
    - [ ] Plating input
  - [ ] **Pricing Tab**
    - [ ] Price input (Rs.)
    - [ ] Compare Price input
    - [ ] Discount percentage display
  - [ ] **Inventory Tab**
    - [ ] Stock Quantity input
    - [ ] In Stock toggle
  - [ ] **Content Tab**
    - [ ] Product Name input with Generate button
    - [ ] Short Description textarea with Generate button
  - [ ] Action buttons (Delete, Cancel, Save Changes)

### Phase 4: Add Product Page
- [ ] **Breadcrumb Navigation**
  - [ ] Catalogue > New Product

- [ ] **Page Header**
  - [ ] "Add New Product" title
  - [ ] Subtitle text

- [ ] **Form Sections**
  - [ ] **Basic Information**
    - [ ] Name input (required)
    - [ ] Collection dropdown (required)
    - [ ] Category dropdown (required)
    - [ ] Description textarea
  - [ ] **Pricing**
    - [ ] Price input (INR, required)
    - [ ] Compare Price input
    - [ ] Cost Price input
  - [ ] **Details**
    - [ ] Tag dropdown (No Tag, New, Bestseller, Limited, Trending)
    - [ ] Color input
    - [ ] Material input
    - [ ] Plating input
    - [ ] Size input
    - [ ] Weight input

- [ ] **Notice Banner**
  - [ ] "Changes to catalog data require approval" warning

- [ ] **Action Buttons**
  - [ ] Cancel button
  - [ ] Submit for Review button

### Phase 5: Content Studio Page
- [ ] **Page Header**
  - [ ] "Content Studio" title
  - [ ] Description text
  - [ ] Back to Catalogue link

- [ ] **Stats Tabs**
  - [ ] Total count
  - [ ] Needs Name count
  - [ ] Needs Desc count
  - [ ] Complete count

- [ ] **Filter Bar**
  - [ ] Search input
  - [ ] Collection filter
  - [ ] Category filter

- [ ] **Product Table**
  - [ ] Checkbox column
  - [ ] Product column (image, name, SKU)
  - [ ] Name Status column (Complete/Needs Name badge)
  - [ ] Description Status column (Complete/Needs Desc badge)
  - [ ] Actions column (Regen Name, Generate/Regen Desc buttons)

- [ ] **Pagination**

### Phase 6: Offers Page
- [ ] **Page Header**
  - [ ] "Offers" title
  - [ ] Description text

- [ ] **Promotional Banner Section**
  - [ ] Section title with icon
  - [ ] Enabled/Disabled toggle
  - [ ] Preview banner display
  - [ ] Banner Items list
    - [ ] Drag handle
    - [ ] Banner text
    - [ ] Active toggle
    - [ ] Edit/Delete buttons
  - [ ] Add Item button
  - [ ] Settings panel
    - [ ] Background Color picker
    - [ ] Text Color picker
    - [ ] Transition Speed input (seconds)
  - [ ] Save Settings button

- [ ] **Coupons Section**
  - [ ] Section title with icon
  - [ ] New Coupon button
  - [ ] Stats cards (Total, Active, Expired, Redeemed)
  - [ ] Search and filter bar
  - [ ] Coupons table
    - [ ] Code column (code + description)
    - [ ] Discount column
    - [ ] Conditions column
    - [ ] Usage column
    - [ ] Status badge column
    - [ ] Actions column (Deactivate, Edit, Delete)

### Phase 7: Settings Page
- [ ] **Page Header**
  - [ ] "Settings" title
  - [ ] Description text

- [ ] **Settings Dropdown Menu** (in nav)
  - [ ] Brand section (Store Name, WhatsApp, Social Links)
  - [ ] Shipping section (Free Shipping, Delivery Info)
  - [ ] Display section (Homepage Order, Featured Products, Collection Order)

- [ ] **Brand & Contact Section**
  - [ ] Section title with Edit button
  - [ ] Maintenance Mode toggle
  - [ ] Store Name (read-only)
  - [ ] WhatsApp Number
  - [ ] Instagram Handle
  - [ ] Contact Email

- [ ] **Shipping Section**
  - [ ] Section title with Edit button
  - [ ] Shipping Cost display
  - [ ] Free Shipping Above threshold
  - [ ] Preview text

- [ ] **Homepage Sections**
  - [ ] Section title
  - [ ] Draggable section list
    - [ ] Drag handle
    - [ ] Visibility toggle
    - [ ] Section icon
    - [ ] Section name (Hero, Collections, Featured Products, Why Choose Us, CTA Banner)
    - [ ] Up/Down arrow buttons
  - [ ] Note about disabled sections

- [ ] **Featured Products Section**
  - [ ] Section title
  - [ ] Add Product button
  - [ ] Display Count dropdown
  - [ ] Draggable product list
    - [ ] Drag handle
    - [ ] Position number
    - [ ] Product image
    - [ ] Product name and price
    - [ ] Remove button
  - [ ] Counter text (X/15 selected)

- [ ] **Collection Order Section**
  - [ ] Section title
  - [ ] Collection tabs (DIVA, MINI, PAWS)
  - [ ] Draggable product order list

---

## Design System (Admin Theme)

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Background | `#0a0a0f` | Page background |
| Card Background | `#12121a` / `#1a1a24` | Card/panel backgrounds |
| Border | `#2a2a35` | Borders, dividers |
| Text Primary | `#ffffff` | Headings, primary text |
| Text Secondary | `#9ca3af` | Secondary text, labels |
| Text Muted | `#6b7280` | Muted text |
| Accent Orange | `#f97316` | Primary buttons, CTAs |
| Accent Green | `#22c55e` | Success, Live status |
| Accent Yellow | `#eab308` | Warning, Draft status |
| Accent Blue | `#3b82f6` | Info, links |
| Accent Red | `#ef4444` | Error, delete actions |

### Typography
- Headings: Inter/System font, semibold
- Body: Inter/System font, regular
- Monospace: For SKUs, codes

### Component Patterns
- Cards: Rounded-lg, subtle border, dark background
- Buttons: Rounded-md, various color variants
- Inputs: Dark background, border on focus
- Tables: Dark theme with hover states
- Toggles: Pill-shaped switch components
- Badges: Small rounded pills with color coding

---

## File Structure (Proposed)

```
src/
├── admin/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminHeader.jsx
│   │   │   └── AdminSidebar.jsx
│   │   ├── ui/
│   │   │   ├── AdminCard.jsx
│   │   │   ├── AdminTable.jsx
│   │   │   ├── AdminBadge.jsx
│   │   │   ├── AdminButton.jsx
│   │   │   ├── AdminInput.jsx
│   │   │   ├── AdminSelect.jsx
│   │   │   ├── AdminToggle.jsx
│   │   │   └── AdminTabs.jsx
│   │   ├── catalogue/
│   │   │   ├── ProductTable.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductEditPanel.jsx
│   │   │   └── ProductForm.jsx
│   │   ├── offers/
│   │   │   ├── BannerManager.jsx
│   │   │   └── CouponTable.jsx
│   │   └── settings/
│   │       ├── BrandSettings.jsx
│   │       ├── ShippingSettings.jsx
│   │       ├── HomepageSections.jsx
│   │       └── FeaturedProducts.jsx
│   ├── pages/
│   │   ├── AdminLoginPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CataloguePage.jsx
│   │   ├── AddProductPage.jsx
│   │   ├── ContentStudioPage.jsx
│   │   ├── OffersPage.jsx
│   │   └── SettingsPage.jsx
│   ├── context/
│   │   └── AdminAuthContext.jsx
│   └── hooks/
│       └── useAdminAuth.js
```

---

## Implementation Order

1. **Phase 1**: Admin Layout & Login (foundation)
2. **Phase 2**: Dashboard Page (quick win, establishes design)
3. **Phase 3**: Catalogue Page (core functionality)
4. **Phase 4**: Add Product Page
5. **Phase 5**: Content Studio Page
6. **Phase 6**: Offers Page
7. **Phase 7**: Settings Page

---

## Data Management

Since this is a frontend clone, we'll use:
- **Local Storage** for persisting admin data changes
- **Mock API functions** that read/write to localStorage
- **Existing products.js** data as the initial product catalogue

---

## Notes

- Images page and Time Machine page are marked as "Coming Soon" in the original - we'll include placeholder pages
- The admin uses a slide-out panel for editing products (not a separate page)
- All tables support inline editing for quick changes
- The design follows a consistent dark theme throughout

---

## Screenshots Reference

Screenshots captured and saved to:
- `.playwright-mcp/page-*-admin-dashboard.png`
- `.playwright-mcp/page-*-admin-catalogue.png`
- `.playwright-mcp/page-*-admin-add-product.png`
- `.playwright-mcp/page-*-admin-content-studio.png`
- `.playwright-mcp/page-*-admin-offers.png`
- `.playwright-mcp/page-*-admin-settings.png`
- `.playwright-mcp/page-*-admin-edit-product-details.png`
