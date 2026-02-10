/**
 * Brand Constants
 * ================
 * Central source of truth for brand values used in JavaScript.
 * For CSS styling, use Tailwind classes or CSS variables from index.css.
 *
 * Usage:
 *   import { COLORS, DEFAULTS } from '../constants/brand'
 */

// ===========================
// FRONTEND BRAND COLORS
// New Palette:
// - Cream:   #F1EEE9 (lightest - backgrounds)
// - Beige:   #E7E1D7 (light - cards, sections)
// - Taupe:   #BBA993 (medium - borders, secondary)
// - Caramel: #B19071 (primary accent - CTAs)
// - Dark:    #050304 (text)
// ===========================
export const COLORS = {
  // New primary colors
  cream: '#F1EEE9',
  beige: '#E7E1D7',
  taupe: '#BBA993',
  caramel: '#B19071',
  caramelDark: '#9A7A61',
  dark: '#050304',
  white: '#FFFFFF',

  // Legacy aliases (for backwards compatibility)
  tan: '#B19071',
  tanDark: '#9A7A61',
  coral: '#B19071',
  coralDark: '#9A7A61',
  lightGray: '#F1EEE9',
  grayBorder: '#E7E1D7',

  // Admin theme colors
  admin: {
    bg: '#0a0a0f',
    card: '#12121a',
    cardHover: '#1a1a24',
    border: '#2a2a35',
    accent: '#f97316',
    accentHover: '#ea580c',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    text: '#ffffff',
    textMuted: '#a1a1aa',
    textDim: '#71717a',
  },
}

// ===========================
// DEFAULT VALUES
// ===========================
// Use these when setting initial/default values in JavaScript
export const DEFAULTS = {
  // Banner defaults
  bannerBackgroundColor: COLORS.caramel,
  bannerTextColor: COLORS.white,
}

// ===========================
// CSS CLASS NAMES
// ===========================
// Reference for commonly used Tailwind classes
export const CSS_CLASSES = {
  // New primary background colors
  bgCream: 'bg-cream',
  bgBeige: 'bg-beige',
  bgTaupe: 'bg-taupe',
  bgCaramel: 'bg-caramel',
  bgDark: 'bg-dark',
  bgBrandGradient: 'bg-brand-gradient',

  // Legacy aliases
  bgTan: 'bg-tan',
  bgCoral: 'bg-coral',
  bgLightGray: 'bg-light-gray',

  // Admin backgrounds
  bgAdmin: 'bg-admin-bg',
  bgAdminCard: 'bg-admin-card',
  bgAdminCardHover: 'hover:bg-admin-card-hover',

  // New primary text colors
  textCream: 'text-cream',
  textBeige: 'text-beige',
  textTaupe: 'text-taupe',
  textCaramel: 'text-caramel',
  textDark: 'text-dark',

  // Legacy aliases
  textTan: 'text-tan',
  textCoral: 'text-coral',

  // Admin text
  textAdminMuted: 'text-admin-text-muted',
  textAdminDim: 'text-admin-text-dim',

  // Border colors
  borderBeige: 'border-beige',
  borderTaupe: 'border-taupe',
  borderAdmin: 'border-admin-border',
}
