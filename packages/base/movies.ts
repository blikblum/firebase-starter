import { z } from 'zod'

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional()

const optionalPosterUrlSchema = z
  .string()
  .trim()
  .refine((value) => !value || isHttpUrl(value), 'Use a valid poster URL.')
  .transform((value) => value || undefined)
  .optional()

export const movieInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  releaseYear: z
    .number({ error: 'Use a valid release year.' })
    .int('Use a valid release year.')
    .min(1888, 'Use a valid release year.')
    .max(2100, 'Use a valid release year.')
    .optional(),
  director: optionalTextSchema,
  genres: z.array(z.string()).transform((genres) =>
    genres.map((genre) => genre.trim()).filter(Boolean),
  ),
  runtimeMinutes: z
    .number({ error: 'Runtime must be a positive number of minutes.' })
    .int('Runtime must be a positive number of minutes.')
    .positive('Runtime must be a positive number of minutes.')
    .optional(),
  posterUrl: optionalPosterUrlSchema,
  rating: z
    .number({ error: 'Rating must be between 0 and 10.' })
    .finite('Rating must be between 0 and 10.')
    .min(0, 'Rating must be between 0 and 10.')
    .max(10, 'Rating must be between 0 and 10.')
    .optional(),
  watched: z.boolean(),
  summary: optionalTextSchema,
  notes: optionalTextSchema,
})

export type MovieInput = z.output<typeof movieInputSchema>

export interface MovieDocument extends MovieInput {
  createdAt: string
  updatedAt: string
}

export interface MovieUpdateDocument extends MovieInput {
  updatedAt: string
}

export interface Movie extends MovieDocument {
  id: string
}

export interface MovieValidationResult {
  valid: boolean
  errors: Partial<Record<keyof MovieInput, string>>
}

export function createDefaultMovieInput(): MovieInput {
  return {
    title: '',
    releaseYear: undefined,
    director: '',
    genres: [],
    runtimeMinutes: undefined,
    posterUrl: '',
    rating: undefined,
    watched: false,
    summary: '',
    notes: '',
  }
}

export function normalizeMovieInput(input: MovieInput): MovieInput {
  return {
    title: input.title.trim(),
    releaseYear: input.releaseYear,
    director: input.director?.trim() || undefined,
    genres: input.genres.map((genre) => genre.trim()).filter(Boolean),
    runtimeMinutes: input.runtimeMinutes,
    posterUrl: input.posterUrl?.trim() || undefined,
    rating: input.rating,
    watched: input.watched,
    summary: input.summary?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  }
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim())
}

export function validateMovieInput(input: MovieInput): MovieValidationResult {
  const result = movieInputSchema.safeParse(input)
  const errors: MovieValidationResult['errors'] = {}

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]

      if (typeof field === 'string' && field in input) {
        const movieField = field as keyof MovieInput
        errors[movieField] ??= issue.message
      }
    }
  }

  return {
    valid: result.success,
    errors,
  }
}

export function createMovieDocument(input: MovieInput, now = new Date()): MovieDocument {
  const normalized = normalizeMovieInput(input)
  const timestamp = now.toISOString()

  return {
    ...normalized,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function createMovieUpdateDocument(input: MovieInput, now = new Date()): MovieUpdateDocument {
  const normalized = normalizeMovieInput(input)

  return {
    ...normalized,
    updatedAt: now.toISOString(),
  }
}
