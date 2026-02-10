---
name: mulyam-brand
description: Brand guidelines for Mulyam Jewels website. Use when creating components, styling UI elements, choosing colors, fonts, or spacing. Apply these guidelines for consistent design across the project.
---

# Mulyam Jewels Brand Guidelines

## Overview
Design system and brand guidelines for the Mulyam Jewels e-commerce website clone. Apply these consistently across all components and pages.

---

## Color Palette

### Primary Colors
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **Tan/Beige** | `#D4A574` | `bg-[#D4A574]` | Hero backgrounds, collection headers, warm accents |
| **Coral** | `#E07A5F` | `bg-[#E07A5F]` | Announcement bar, primary CTAs, WhatsApp buttons |
| **Black** | `#1A1A1A` | `bg-[#1A1A1A]` | Footer background, primary text, dark sections |

### Neutral Colors
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **White** | `#FFFFFF` | `bg-white` | Page backgrounds, cards |
| **Light Gray** | `#F8F8F8` | `bg-[#F8F8F8]` | Section backgrounds, alternating areas |
| **Gray Border** | `#E5E5E5` | `border-[#E5E5E5]` | Borders, dividers |

### Semantic Colors
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| **Green** | `#22C55E` | `text-green-500` | In-stock indicator, success states |
| **Red** | `#EF4444` | `bg-red-500` | Discount badges, sale tags |

### Tailwind Config
```javascript
// tailwind.config.js
colors: {
  tan: '#D4A574',
  coral: '#E07A5F',
  dark: '#1A1A1A',
  'light-gray': '#F8F8F8',
}
```

---

## Typography

### Font Families
| Type | Font | Weight | Usage |
|------|------|--------|-------|
| **Display** | Playfair Display | 700 | Logo "MULYAM", main headings |
| **Heading** | Playfair Display | 600 | Section titles, product names |
| **Body** | Inter | 400-500 | Paragraphs, descriptions, UI text |
| **Accent** | Inter | 500-600 | Labels, badges, uppercase text |

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Tailwind Config
```javascript
fontFamily: {
  display: ['Playfair Display', 'serif'],
  body: ['Inter', 'sans-serif'],
}
```

### Text Styles
```jsx
// Logo
<span className="font-display font-bold text-2xl tracking-wide">MULYAM</span>

// Page Title (H1)
<h1 className="font-display font-bold text-4xl md:text-5xl">Heading</h1>

// Section Title (H2)
<h2 className="font-display font-semibold text-2xl md:text-3xl">Section</h2>

// Product Name (H3)
<h3 className="font-body font-medium text-lg">Product Name</h3>

// Body Text
<p className="font-body text-gray-600">Description text</p>

// Label/Badge
<span className="font-body text-xs uppercase tracking-wider">Label</span>
```

---

## Component Patterns

### Buttons

#### Primary Button (Black)
```jsx
<button className="bg-[#1A1A1A] text-white px-6 py-3 font-medium hover:bg-black transition-colors">
  Add to Cart
</button>
```

#### Secondary Button (Outline)
```jsx
<button className="border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 font-medium hover:bg-[#1A1A1A] hover:text-white transition-colors">
  View Details
</button>
```

#### WhatsApp Button (Coral)
```jsx
<button className="bg-[#E07A5F] text-white px-6 py-3 font-medium flex items-center gap-2 hover:bg-[#d16a4f] transition-colors">
  <WhatsAppIcon /> Buy on WhatsApp
</button>
```

### Cards

#### Product Card
```jsx
<div className="group bg-white rounded-lg overflow-hidden">
  <div className="relative aspect-square overflow-hidden">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    {/* Discount Badge */}
    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
      30% OFF
    </span>
  </div>
  <div className="p-4">
    <h3 className="font-medium text-gray-900">Product Name</h3>
    <div className="flex items-center gap-2 mt-1">
      <span className="font-semibold">₹699</span>
      <span className="text-gray-400 line-through text-sm">₹999</span>
    </div>
  </div>
</div>
```

#### Collection Card
```jsx
<div className="relative aspect-[4/5] rounded-lg overflow-hidden group cursor-pointer">
  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  <div className="absolute bottom-6 left-6 text-white">
    <span className="text-xs uppercase tracking-wider opacity-80">Collection</span>
    <h3 className="font-display text-2xl font-semibold">DIVA</h3>
  </div>
</div>
```

### Badges

#### Discount Badge
```jsx
<span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
  30% OFF
</span>
```

#### Bestseller Badge
```jsx
<span className="bg-[#E07A5F] text-white text-xs font-medium px-2 py-1 rounded">
  Bestseller
</span>
```

#### Feature Badge
```jsx
<span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
  Hypoallergenic
</span>
```

#### Out of Stock Badge
```jsx
<span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
  Out of Stock
</span>
```

### Feature Icons Section
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#D4A574]" />
    </div>
    <div>
      <p className="font-medium text-sm">Hypoallergenic</p>
      <p className="text-xs text-gray-500">Safe for sensitive skin</p>
    </div>
  </div>
</div>
```

---

## Spacing Guidelines

### Section Padding
```jsx
// Standard section
<section className="py-16 md:py-24">

// Compact section
<section className="py-12 md:py-16">

// Hero section
<section className="py-20 md:py-32">
```

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Grid Gaps
```jsx
// Product grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// Feature grid
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
```

### Component Spacing
- Card padding: `p-4` or `p-6`
- Button padding: `px-6 py-3`
- Badge padding: `px-2 py-1` or `px-3 py-1`
- Icon size: `w-5 h-5` or `w-6 h-6`

---

## Layout Patterns

### Hero with Image Background
```jsx
<section className="relative min-h-[60vh] flex items-center"
         style={{ background: 'linear-gradient(135deg, #D4A574 0%, #C49464 100%)' }}>
  <div className="max-w-7xl mx-auto px-4 text-center">
    <span className="text-sm uppercase tracking-wider text-white/80">Tagline</span>
    <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 text-white">
      Main Headline
    </h1>
    <p className="mt-4 text-white/90 max-w-xl mx-auto">
      Description text here
    </p>
  </div>
</section>
```

### Announcement Bar
```jsx
<div className="bg-[#E07A5F] text-white text-center py-2 text-sm">
  Free shipping on orders above ₹1,499!
</div>
```

### Footer
```jsx
<footer className="bg-[#1A1A1A] text-white py-12">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
    {/* Logo + description column */}
    {/* Shop links */}
    {/* Help links */}
    {/* Company links */}
    {/* Contact section */}
  </div>
</footer>
```

---

## Animation Guidelines

### Hover Transitions
```jsx
// Image zoom on hover
className="group-hover:scale-105 transition-transform duration-300"

// Color transitions
className="hover:bg-black transition-colors duration-200"

// Opacity transitions
className="hover:opacity-80 transition-opacity"
```

### Page Load
- Use subtle fade-in for sections
- Stagger product card appearances if using animations

---

## Icons

Use **Lucide React** icons consistently:
- `Search` - Search button
- `ShoppingBag` - Cart icon
- `X` - Close buttons
- `ChevronLeft/Right` - Carousel arrows
- `Instagram` - Social link
- `MessageCircle` - WhatsApp (or custom SVG)
- `Check` - Success states
- `MapPin` - Location/pincode

---

## Best Practices

1. **Always use the defined color palette** - No random colors
2. **Maintain consistent spacing** - Use the spacing scale
3. **Typography hierarchy** - Display for impact, body for readability
4. **Mobile-first** - Design for mobile, enhance for desktop
5. **Hover states** - All interactive elements need hover feedback
6. **Accessibility** - Sufficient color contrast, focus states
