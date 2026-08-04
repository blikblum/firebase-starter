export interface MovieInput {
  title: string
  releaseYear?: number
  director?: string
  genres: string[]
  runtimeMinutes?: number
  posterUrl?: string
  rating?: number
  watched: boolean
  summary?: string
  notes?: string
}

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
  const normalized = normalizeMovieInput(input)
  const errors: MovieValidationResult['errors'] = {}

  if (!normalized.title) {
    errors.title = 'Title is required.'
  }

  if (
    normalized.releaseYear !== undefined &&
    (!Number.isInteger(normalized.releaseYear) ||
      normalized.releaseYear < 1888 ||
      normalized.releaseYear > 2100)
  ) {
    errors.releaseYear = 'Use a valid release year.'
  }

  if (
    normalized.runtimeMinutes !== undefined &&
    (!Number.isInteger(normalized.runtimeMinutes) || normalized.runtimeMinutes <= 0)
  ) {
    errors.runtimeMinutes = 'Runtime must be a positive number of minutes.'
  }

  if (
    normalized.rating !== undefined &&
    (!Number.isFinite(normalized.rating) || normalized.rating < 0 || normalized.rating > 10)
  ) {
    errors.rating = 'Rating must be between 0 and 10.'
  }

  if (normalized.posterUrl && !isHttpUrl(normalized.posterUrl)) {
    errors.posterUrl = 'Use a valid poster URL.'
  }

  return {
    valid: Object.keys(errors).length === 0,
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
