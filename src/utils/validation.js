import { z } from 'zod'

/**
 * Validation schemas for form inputs
 */

// ============================================
// CHECKOUT FORM VALIDATION
// ============================================
export const checkoutFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'Name contains invalid characters'),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),

  address: z
    .string()
    .min(5, 'Please enter your full address')
    .max(500, 'Address is too long'),

  city: z
    .string()
    .min(2, 'Please enter a valid city name')
    .max(100, 'City name is too long')
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, 'City contains invalid characters'),

  pincode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode'),

  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

// ============================================
// PRODUCT VALIDATION
// ============================================
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name is too long'),

  collection: z.enum(['diva', 'mini', 'paws', 'bond'], {
    errorMap: () => ({ message: 'Please select a valid collection' }),
  }),

  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category name is too long'),

  description: z.string().max(5000, 'Description is too long').optional(),

  shortDescription: z.string().max(500, 'Short description is too long').optional(),

  price: z
    .number()
    .int('Price must be a whole number')
    .min(0, 'Price cannot be negative')
    .max(1000000, 'Price is too high'),

  originalPrice: z
    .number()
    .int('Original price must be a whole number')
    .min(0, 'Original price cannot be negative')
    .max(1000000, 'Original price is too high')
    .optional()
    .nullable(),

  costPrice: z
    .number()
    .int('Cost price must be a whole number')
    .min(0, 'Cost price cannot be negative')
    .max(1000000, 'Cost price is too high')
    .optional()
    .nullable(),

  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/i, 'SKU can only contain letters, numbers, and hyphens')
    .max(50, 'SKU is too long')
    .optional()
    .nullable(),

  color: z.string().max(50, 'Color name is too long').optional(),
  material: z.string().max(100, 'Material name is too long').optional(),
  plating: z.string().max(100, 'Plating name is too long').optional(),
  size: z.string().max(50, 'Size description is too long').optional(),

  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock is too high')
    .optional(),

  inStock: z.boolean().optional(),
  isLive: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isSellingFast: z.boolean().optional(),

  images: z
    .array(z.string().url('Invalid image URL'))
    .max(20, 'Too many images')
    .optional(),
})

// ============================================
// COUPON VALIDATION
// ============================================
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code is too long')
    .regex(/^[A-Z0-9]+$/, 'Coupon code can only contain uppercase letters and numbers')
    .transform((val) => val.toUpperCase()),

  type: z.enum(['percentage', 'fixed', 'freeShipping'], {
    errorMap: () => ({ message: 'Please select a valid discount type' }),
  }),

  value: z
    .number()
    .int('Value must be a whole number')
    .min(0, 'Value cannot be negative')
    .max(100000, 'Value is too high'),

  minOrder: z
    .number()
    .int('Minimum order must be a whole number')
    .min(0, 'Minimum order cannot be negative')
    .optional(),

  maxDiscount: z
    .number()
    .int('Maximum discount must be a whole number')
    .min(0, 'Maximum discount cannot be negative')
    .optional()
    .nullable(),

  usageLimit: z
    .number()
    .int('Usage limit must be a whole number')
    .min(0, 'Usage limit cannot be negative')
    .optional()
    .nullable(),

  isActive: z.boolean().optional(),
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate data against a schema and return formatted errors
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {{ success: boolean, data?: Object, errors?: Object }}
 */
export function validate(schema, data) {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Format errors as { fieldName: errorMessage }
  const errors = {}
  for (const error of result.error.errors) {
    const path = error.path.join('.')
    if (!errors[path]) {
      errors[path] = error.message
    }
  }

  return { success: false, errors }
}

/**
 * Validate a single field
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} field - Field name to validate
 * @param {any} value - Value to validate
 * @returns {{ success: boolean, error?: string }}
 */
export function validateField(schema, field, value) {
  // Create a partial schema for single field validation
  const fieldSchema = schema.shape?.[field]
  if (!fieldSchema) {
    return { success: true }
  }

  const result = fieldSchema.safeParse(value)

  if (result.success) {
    return { success: true }
  }

  return { success: false, error: result.error.errors[0]?.message }
}

export default {
  checkoutFormSchema,
  productSchema,
  couponSchema,
  validate,
  validateField,
}
