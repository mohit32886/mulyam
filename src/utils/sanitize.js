/**
 * Utility functions for sanitizing user input
 */

/**
 * Sanitize a string by removing potentially dangerous characters
 * Preserves common punctuation and unicode characters for Indian names/addresses
 * @param {string} input - The string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return ''

  // Remove control characters and null bytes
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Remove potentially dangerous HTML/script content
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  return sanitized
}

/**
 * Sanitize a phone number - only allow digits
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - The sanitized phone number (digits only)
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return ''
  return phone.replace(/\D/g, '').slice(0, 15) // Max 15 digits for international
}

/**
 * Sanitize a pincode - only allow digits
 * @param {string} pincode - The pincode to sanitize
 * @returns {string} - The sanitized pincode (digits only)
 */
export function sanitizePincode(pincode) {
  if (!pincode || typeof pincode !== 'string') return ''
  return pincode.replace(/\D/g, '').slice(0, 6)
}

/**
 * Escape special characters for use in URLs/messages
 * @param {string} input - The string to escape
 * @returns {string} - The escaped string
 */
export function escapeForMessage(input) {
  if (!input || typeof input !== 'string') return ''
  return sanitizeText(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Sanitize form data object
 * @param {Object} formData - Object with form field values
 * @returns {Object} - Object with sanitized values
 */
export function sanitizeFormData(formData) {
  const sanitized = {}

  for (const [key, value] of Object.entries(formData)) {
    if (key === 'phone') {
      sanitized[key] = sanitizePhone(value)
    } else if (key === 'pincode') {
      sanitized[key] = sanitizePincode(value)
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

export default {
  sanitizeText,
  sanitizePhone,
  sanitizePincode,
  escapeForMessage,
  sanitizeFormData,
}
