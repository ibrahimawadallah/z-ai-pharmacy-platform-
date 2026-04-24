/**
 * Input Validation Schemas for UAE Drug Database API
 * 
 * Uses Zod for runtime validation and type safety
 */

import { z } from 'zod'

// ============================================
// COMMON VALIDATORS
// ============================================

// Sanitized string that trims and limits length
const sanitizedString = (minLength: number, maxLength: number) =>
  z
    .string()
    .trim()
    .min(minLength)
    .max(maxLength)
    .transform(str => str.replace(/\s+/g, ' ')) // Normalize whitespace

// Email validation
const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .toLowerCase()
  .max(255)

// Password validation (strong password requirements)
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .refine(
    password => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    password => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    password => /[0-9]/.test(password),
    'Password must contain at least one number'
  )

// Simple password (for login - no complexity requirements)
const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password is too long')

// UUID validation
const cuidSchema = z.string().startsWith('cm', 'Invalid ID format')

// ============================================
// DRUG SEARCH VALIDATION
// ============================================

export const drugSearchSchema = z.object({
  query: sanitizedString(1, 200),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['Active', 'Deleted', 'Grace', 'all']).optional().default('Active'),
  dosageForm: z.string().max(100).optional(),
  pregnancyCategory: z.enum(['A', 'B', 'C', 'D', 'X', 'N']).optional(),
  sortBy: z.enum(['genericName', 'packageName', 'packagePricePublic', 'createdAt']).optional().default('genericName'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
})

export type DrugSearchInput = z.infer<typeof drugSearchSchema>

export const drugDetailSchema = z.object({
  drugCode: z.string().min(1, 'Drug code is required').max(50)
})

export type DrugDetailInput = z.infer<typeof drugDetailSchema>

// Drug interaction check validation
export const drugInteractionSchema = z.object({
  primaryDrugCode: z.string().min(1).max(50),
  secondaryDrugCodes: z.array(z.string().min(1).max(50)).min(1).max(10)
})

export type DrugInteractionInput = z.infer<typeof drugInteractionSchema>

// ============================================
// ICD-10 VALIDATION
// ============================================

// ICD-10 code format: letter followed by 2 digits, optionally followed by a dot and more characters
const icd10CodeRegex = /^[A-Z]\d{2}(\.[A-Z0-9]{1,4})?$/

export const icd10SearchSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .refine(
      val => icd10CodeRegex.test(val) || val.length >= 1,
      'Invalid ICD-10 code format'
    )
    .optional(),
  query: sanitizedString(1, 200).optional(),
  category: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
}).refine(
  data => data.code || data.query,
  'Either code or query is required'
)

export type ICD10SearchInput = z.infer<typeof icd10SearchSchema>

export const icd10CodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(icd10CodeRegex, 'Invalid ICD-10 code format. Example: N39.0, I10')
})

export type ICD10CodeInput = z.infer<typeof icd10CodeSchema>

// ============================================
// USER AUTHENTICATION VALIDATION
// ============================================

export const userSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: sanitizedString(2, 100),
  role: z.enum(['user', 'pharmacist']).default('user'),
  licenseNumber: z.string().max(50).optional()
}).refine(
  data => {
    // Pharmacists must provide a license number
    if (data.role === 'pharmacist' && !data.licenseNumber) {
      return false
    }
    return true
  },
  { message: 'License number is required for pharmacist registration' }
)

export type UserSignupInput = z.infer<typeof userSignupSchema>

export const userLoginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema
})

export type UserLoginInput = z.infer<typeof userLoginSchema>

export const userUpdateSchema = z.object({
  name: sanitizedString(2, 100).optional(),
  image: z.string().url().max(500).optional()
})

export type UserUpdateInput = z.infer<typeof userUpdateSchema>

export const passwordChangeSchema = z.object({
  currentPassword: loginPasswordSchema,
  newPassword: passwordSchema
}).refine(
  data => data.currentPassword !== data.newPassword,
  { message: 'New password must be different from current password' }
)

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>

// ============================================
// FAVORITE DRUG VALIDATION
// ============================================

export const addFavoriteSchema = z.object({
  drugCode: z.string().min(1, 'Drug code is required').max(50),
  drugName: sanitizedString(1, 200),
  notes: z.string().max(500).optional()
})

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>

export const updateFavoriteSchema = z.object({
  notes: z.string().max(500).optional()
})

export type UpdateFavoriteInput = z.infer<typeof updateFavoriteSchema>

export const removeFavoriteSchema = z.object({
  drugCode: z.string().min(1, 'Drug code is required').max(50)
})

export type RemoveFavoriteInput = z.infer<typeof removeFavoriteSchema>

export const getFavoritesSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
})

export type GetFavoritesInput = z.infer<typeof getFavoritesSchema>

// ============================================
// COURSE PROGRESS VALIDATION
// ============================================

export const courseProgressSchema = z.object({
  courseId: sanitizedString(1, 100),
  lessonId: sanitizedString(1, 100),
  completed: z.boolean().default(false)
})

export type CourseProgressInput = z.infer<typeof courseProgressSchema>

export const quizResultSchema = z.object({
  courseId: sanitizedString(1, 100),
  lessonId: sanitizedString(1, 100),
  score: z.number().int().min(0).max(100)
})

export type QuizResultInput = z.infer<typeof quizResultSchema>

export const getCourseProgressSchema = z.object({
  courseId: sanitizedString(1, 100).optional()
})

export type GetCourseProgressInput = z.infer<typeof getCourseProgressSchema>

// ============================================
// SEARCH HISTORY VALIDATION
// ============================================

export const searchHistorySchema = z.object({
  query: sanitizedString(1, 200),
  searchType: z.enum(['drug', 'icd10'])
})

export type SearchHistoryInput = z.infer<typeof searchHistorySchema>

export const getSearchHistorySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10)
})

export type GetSearchHistoryInput = z.infer<typeof getSearchHistorySchema>

// ============================================
// AUDIT LOG VALIDATION
// ============================================

export const AUDIT_ACTIONS = [
  'drug_search',
  'interaction_check',
  'dosage_calculate',
  'icd10_search',
  'favorite_add',
  'favorite_remove',
  'course_start',
  'course_complete',
  'quiz_attempt',
  'login',
  'logout',
  'signup',
  'ai_consultation',
  'patient_create',
  'patient_view',
  'patient_update',
  'patient_delete',
  'patient_attach_to_chat',
  'audit_export'
] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const auditLogSchema = z.object({
  action: z.enum(AUDIT_ACTIONS),
  resource: z.string().max(200).optional(),
  details: z.record(z.string(), z.unknown()).optional()
})

export type AuditLogInput = z.infer<typeof auditLogSchema>

// ============================================
// VALIDATION HELPER FUNCTIONS
// ============================================

import { NextRequest } from 'next/server'

export interface ValidationResult<T> {
  success: true
  data: T
}

export interface ValidationError {
  success: false
  error: string
  details?: z.ZodError['issues']
}

/**
 * Validate search params from a Next.js request
 */
export function validateSearchParams<T extends z.ZodSchema>(
  schema: T,
  request: NextRequest
): ValidationResult<z.infer<T>> | ValidationError {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  return validate(schema, searchParams)
}

/**
 * Validate JSON body from a Next.js request
 */
export async function validateBody<T extends z.ZodSchema>(
  schema: T,
  request: NextRequest
): Promise<ValidationResult<z.infer<T>> | ValidationError> {
  try {
    const body = await request.json()
    return validate(schema, body)
  } catch {
    return {
      success: false,
      error: 'Invalid JSON body'
    }
  }
}

/**
 * Generic validation function
 */
export function validate<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): ValidationResult<z.infer<T>> | ValidationError {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return {
      success: true,
      data: result.data
    }
  }
  
  return {
    success: false,
    error: formatZodError(result.error),
    details: result.error.issues
  }
}

/**
 * Format Zod errors into a readable string
 */
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map(err => {
      const path = err.path.join('.')
      return path ? `${path}: ${err.message}` : err.message
    })
    .join('; ')
}

/**
 * Create a validation response for API routes
 */
export function validationErrorResponse(error: ValidationError): Response {
  return new Response(
    JSON.stringify({
      error: 'Validation Error',
      message: error.error,
      details: error.details?.map(d => ({
        path: d.path.join('.'),
        message: d.message
      }))
    }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

/**
 * Combine search params and body validation
 */
export async function validateRequest<TParams extends z.ZodSchema, TBody extends z.ZodSchema>(
  paramsSchema: TParams,
  bodySchema: TBody,
  request: NextRequest
): Promise<
  | { success: true; params: z.infer<TParams>; body: z.infer<TBody> }
  | ValidationError
> {
  const paramsResult = validateSearchParams(paramsSchema, request)
  if (!paramsResult.success) {
    return paramsResult
  }
  
  const bodyResult = await validateBody(bodySchema, request)
  if (!bodyResult.success) {
    return bodyResult
  }
  
  return {
    success: true,
    params: paramsResult.data,
    body: bodyResult.data
  }
}
