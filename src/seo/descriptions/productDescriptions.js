// Collection-specific vocabulary for SEO descriptions
const collectionVocabulary = {
  diva: {
    adjectives: ['elegant', 'sophisticated', 'stunning', 'timeless', 'chic'],
    audience: 'the modern woman',
    style: 'statement-making',
    occasions: ['everyday wear', 'special occasions', 'office', 'parties']
  },
  mini: {
    adjectives: ['adorable', 'playful', 'charming', 'delightful', 'sweet'],
    audience: 'little ones',
    style: 'fun and safe',
    occasions: ['birthday parties', 'everyday wear', 'photo sessions', 'special days']
  },
  paws: {
    adjectives: ['stylish', 'comfortable', 'durable', 'fashionable', 'trendy'],
    audience: 'your furry friend',
    style: 'pet-safe and trendy',
    occasions: ['daily walks', 'photo shoots', 'special outings', 'pet events']
  },
  bond: {
    adjectives: ['meaningful', 'personalized', 'unique', 'heartfelt', 'customized'],
    audience: 'those who cherish memories',
    style: 'deeply personal',
    occasions: ['gifting', 'anniversaries', 'milestones', 'self-expression']
  },
  custom: {
    adjectives: ['meaningful', 'personalized', 'unique', 'heartfelt', 'customized'],
    audience: 'those who cherish memories',
    style: 'deeply personal',
    occasions: ['gifting', 'anniversaries', 'milestones', 'self-expression']
  }
}

// Category-specific description templates
const categoryTemplates = {
  bracelets: {
    intro: 'Adorn your wrist with this {adjective}',
    features: 'Features {plating} finish on {material} for lasting brilliance.',
    fit: 'Available in {size} size for a perfect fit.'
  },
  earrings: {
    intro: 'Elevate your look with these {adjective}',
    features: 'Crafted with {plating} on {material}, designed for all-day comfort.',
    fit: 'Lightweight design perfect for sensitive ears.'
  },
  necklaces: {
    intro: 'Make a statement with this {adjective}',
    features: 'Premium {plating} on {material} ensures lasting shine.',
    fit: 'Adjustable length for versatile styling.'
  },
  rings: {
    intro: 'Add sparkle to your fingers with this {adjective}',
    features: '{plating} finish on hypoallergenic {material}.',
    fit: 'Available in {size} for a comfortable fit.'
  },
  anklets: {
    intro: 'Accentuate your ankles with this {adjective}',
    features: 'Beautiful {plating} on durable {material}.',
    fit: 'Adjustable design for the perfect fit.'
  },
  default: {
    intro: 'Discover this {adjective}',
    features: 'Made with {plating} on premium {material}.',
    fit: 'Designed for everyday elegance.'
  }
}

// Helper to pick consistent item from array based on product ID
const pickFromArray = (arr, seed) => {
  const index = Math.abs(hashCode(seed)) % arr.length
  return arr[index]
}

// Simple hash function for consistent selection
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash
}

/**
 * Generate a full SEO-friendly product description
 *
 * @param {object} product - Product object
 * @param {object} collection - Collection object (optional)
 * @returns {string} Full product description
 */
export function generateProductDescription(product, collection) {
  const collectionKey = product.collection || 'diva'
  const vocab = collectionVocabulary[collectionKey] || collectionVocabulary.diva
  const template = categoryTemplates[product.category] || categoryTemplates.default
  const adjective = pickFromArray(vocab.adjectives, product.id || product.name)

  const parts = []

  // Intro with product name
  const intro = template.intro.replace('{adjective}', adjective)
  const collectionName = collection?.name || collectionKey.toUpperCase()
  parts.push(`${intro} ${product.name} from the ${collectionName} collection.`)

  // Features
  const features = template.features
    .replace('{plating}', product.plating || '18K Gold Plated')
    .replace('{material}', product.material || 'Stainless Steel')
  parts.push(features)

  // Size/fit if available
  if (product.size) {
    const fit = template.fit.replace('{size}', product.size)
    parts.push(fit)
  }

  // Audience
  parts.push(`Perfect for ${vocab.audience}.`)

  // Badges context
  const badges = []
  if (product.isBestseller) badges.push('Bestseller')
  if (product.isNew) badges.push('New Arrival')
  if (badges.length > 0) {
    parts.push(`${badges.join(' | ')} - loved by our customers!`)
  }

  // Call to action with USPs
  parts.push('Hypoallergenic, waterproof, and built for everyday wear. Shop with confidence - 6 months warranty included.')

  return parts.join(' ')
}

/**
 * Generate a short meta description for SEO (max 160 chars)
 *
 * @param {object} product - Product object
 * @param {object} collection - Collection object (optional)
 * @returns {string} Meta description under 160 characters
 */
export function generateMetaDescription(product, collection) {
  const collectionKey = product.collection || 'diva'
  const vocab = collectionVocabulary[collectionKey] || collectionVocabulary.diva
  const adjective = pickFromArray(vocab.adjectives, product.id || product.name)
  const collectionName = collection?.name || collectionKey.toUpperCase()

  let desc = `Shop ${product.name} - ${adjective} ${product.category || 'jewelry'} from ${collectionName} collection. ${product.plating || '18K Gold Plated'}, hypoallergenic. Rs ${product.price}`

  // Ensure under 160 chars
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '...'
  }

  return desc
}
