/**
 * Utility functions for transforming between snake_case (database) and camelCase (JS/React)
 */

/**
 * Convert a snake_case string to camelCase
 * @param {string} str - The snake_case string
 * @returns {string} - The camelCase string
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert a camelCase string to snake_case
 * @param {string} str - The camelCase string
 * @returns {string} - The snake_case string
 */
export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Transform object keys from snake_case to camelCase
 * @param {Object} obj - Object with snake_case keys
 * @returns {Object} - Object with camelCase keys
 */
export function transformKeysToCamel(obj) {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeysToCamel)
  if (typeof obj !== 'object') return obj

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key)
    const value = obj[key]
    acc[camelKey] = typeof value === 'object' ? transformKeysToCamel(value) : value
    return acc
  }, {})
}

/**
 * Transform object keys from camelCase to snake_case
 * @param {Object} obj - Object with camelCase keys
 * @returns {Object} - Object with snake_case keys
 */
export function transformKeysToSnake(obj) {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(transformKeysToSnake)
  if (typeof obj !== 'object') return obj

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key)
    const value = obj[key]
    acc[snakeKey] = typeof value === 'object' ? transformKeysToSnake(value) : value
    return acc
  }, {})
}

/**
 * Product-specific transformation from database format to frontend format
 * Handles the specific field mappings for products
 * @param {Object} dbProduct - Product from database (snake_case)
 * @returns {Object} - Product for frontend (camelCase)
 */
export function transformProductFromDb(dbProduct) {
  if (!dbProduct) return null

  return {
    ...dbProduct,
    // Map specific fields that need transformation
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    collection: dbProduct.collection,
    category: dbProduct.category,
    description: dbProduct.description,
    shortDescription: dbProduct.short_description,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    costPrice: dbProduct.cost_price,
    discount: dbProduct.discount,
    color: dbProduct.color,
    material: dbProduct.material,
    plating: dbProduct.plating,
    size: dbProduct.size,
    weight: dbProduct.weight,
    sku: dbProduct.sku,
    images: dbProduct.images,
    inStock: dbProduct.in_stock,
    isLive: dbProduct.is_live,
    isBestseller: dbProduct.is_bestseller,
    isNew: dbProduct.is_new,
    isNewArrival: dbProduct.is_new_arrival,
    isTrending: dbProduct.is_trending,
    isSellingFast: dbProduct.is_selling_fast,
    stock: dbProduct.stock,
    tag: dbProduct.tag,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  }
}

/**
 * Product-specific transformation from frontend format to database format
 * Handles the specific field mappings for products
 * @param {Object} product - Product from frontend (camelCase)
 * @returns {Object} - Product for database (snake_case)
 */
export function transformProductToDb(product) {
  if (!product) return null

  const dbProduct = {}

  // Only include fields that have values
  if (product.name !== undefined) dbProduct.name = product.name
  if (product.slug !== undefined) dbProduct.slug = product.slug
  if (product.collection !== undefined) dbProduct.collection = product.collection
  if (product.category !== undefined) dbProduct.category = product.category
  if (product.description !== undefined) dbProduct.description = product.description
  if (product.shortDescription !== undefined) dbProduct.short_description = product.shortDescription
  if (product.price !== undefined) dbProduct.price = product.price
  if (product.originalPrice !== undefined) dbProduct.original_price = product.originalPrice
  if (product.costPrice !== undefined) dbProduct.cost_price = product.costPrice
  if (product.discount !== undefined) dbProduct.discount = product.discount
  if (product.color !== undefined) dbProduct.color = product.color
  if (product.material !== undefined) dbProduct.material = product.material
  if (product.plating !== undefined) dbProduct.plating = product.plating
  if (product.size !== undefined) dbProduct.size = product.size
  if (product.weight !== undefined) dbProduct.weight = product.weight
  if (product.sku !== undefined) dbProduct.sku = product.sku
  if (product.images !== undefined) dbProduct.images = product.images
  if (product.inStock !== undefined) dbProduct.in_stock = product.inStock
  if (product.isLive !== undefined) dbProduct.is_live = product.isLive
  if (product.isBestseller !== undefined) dbProduct.is_bestseller = product.isBestseller
  if (product.isNew !== undefined) dbProduct.is_new = product.isNew
  if (product.isNewArrival !== undefined) dbProduct.is_new_arrival = product.isNewArrival
  if (product.isTrending !== undefined) dbProduct.is_trending = product.isTrending
  if (product.isSellingFast !== undefined) dbProduct.is_selling_fast = product.isSellingFast
  if (product.stock !== undefined) dbProduct.stock = product.stock
  if (product.tag !== undefined) dbProduct.tag = product.tag

  // Handle status field specially
  if (product.status !== undefined) {
    dbProduct.is_live = product.status === 'live'
  }

  return dbProduct
}

/**
 * Transform an array of products from database format
 * @param {Array} products - Array of products from database
 * @returns {Array} - Array of products for frontend
 */
export function transformProductsFromDb(products) {
  if (!products) return []
  return products.map(transformProductFromDb)
}

export default {
  snakeToCamel,
  camelToSnake,
  transformKeysToCamel,
  transformKeysToSnake,
  transformProductFromDb,
  transformProductToDb,
  transformProductsFromDb,
}
