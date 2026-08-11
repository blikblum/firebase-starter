import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createDefaultMovieInput,
  movieInputSchema,
  type MovieInput,
} from 'base/movies'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormCheckbox } from '@/components/form/form-checkbox'
import { FormInput } from '@/components/form/form-input'
import { FormTextarea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'

import { defaultRenderMovieLink, type MovieLinkRenderer } from './movie-links'

export interface MovieFormProps {
  saving: boolean
  error?: string
  cancelHref: string
  initialMovie?: MovieInput
  submitLabel?: string
  savingLabel?: string
  onSubmit: (movie: MovieInput) => Promise<void>
  renderLink?: MovieLinkRenderer
}

const optionalFormNumber = (schema: z.ZodOptional<z.ZodNumber>) =>
  z.union([schema, z.nan().transform(() => undefined)])

const movieFormSchema = z
  .object({
    title: movieInputSchema.shape.title,
    releaseYear: optionalFormNumber(movieInputSchema.shape.releaseYear),
    director: movieInputSchema.shape.director,
    genresText: z.string(),
    runtimeMinutes: optionalFormNumber(movieInputSchema.shape.runtimeMinutes),
    posterUrl: movieInputSchema.shape.posterUrl,
    rating: optionalFormNumber(movieInputSchema.shape.rating),
    watched: movieInputSchema.shape.watched,
    summary: movieInputSchema.shape.summary,
    notes: movieInputSchema.shape.notes,
  })
  .transform(({ genresText, ...movie }) => ({
    ...movie,
    genres: genresText.split(','),
  }))
  .pipe(movieInputSchema)

type MovieFormValues = z.input<typeof movieFormSchema>

function toMovieFormValues(movie = createDefaultMovieInput()): MovieFormValues {
  return {
    title: movie.title,
    releaseYear: movie.releaseYear,
    director: movie.director ?? '',
    genresText: movie.genres.join(', '),
    runtimeMinutes: movie.runtimeMinutes,
    posterUrl: movie.posterUrl ?? '',
    rating: movie.rating,
    watched: movie.watched,
    summary: movie.summary ?? '',
    notes: movie.notes ?? '',
  }
}

export function MovieForm({
  saving,
  error,
  cancelHref,
  initialMovie,
  submitLabel = 'Add movie',
  savingLabel = 'Saving...',
  onSubmit,
  renderLink = defaultRenderMovieLink,
}: MovieFormProps): React.JSX.Element {
  const form = useForm<MovieFormValues, undefined, MovieInput>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: toMovieFormValues(initialMovie),
  })
  const { isSubmitting } = form.formState
  const { reset } = form

  React.useEffect(() => {
    reset(toMovieFormValues(initialMovie))
  }, [initialMovie, reset])

  const handleSubmit = form.handleSubmit(async (movie) => {
    if (saving) {
      return
    }

    await onSubmit(movie)
  })

  return (
    <FormProvider {...form}>
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Movie details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FormInput<MovieFormValues>
                name="title"
                label="Title"
                id="movie-title"
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <FormInput<MovieFormValues>
                  name="releaseYear"
                  label="Release year"
                  id="movie-release-year"
                  type="number"
                  min="1888"
                  max="2100"
                  registerOptions={{ valueAsNumber: true }}
                />

                <FormInput<MovieFormValues>
                  name="runtimeMinutes"
                  label="Runtime"
                  id="movie-runtime"
                  type="number"
                  min="1"
                  placeholder="Minutes"
                  registerOptions={{ valueAsNumber: true }}
                />
              </div>

              <FormInput<MovieFormValues>
                name="director"
                label="Director"
                id="movie-director"
              />

              <FormInput<MovieFormValues>
                name="genresText"
                label="Genres"
                id="movie-genres"
                placeholder="Drama, Sci-Fi, Thriller"
                description="Separate genres with commas."
              />

              <FormInput<MovieFormValues>
                name="posterUrl"
                label="Poster URL"
                id="movie-poster-url"
                type="url"
              />

              <div className="grid gap-5 md:grid-cols-[1fr_auto]">
                <FormInput<MovieFormValues>
                  name="rating"
                  label="Rating"
                  id="movie-rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  registerOptions={{ valueAsNumber: true }}
                />

                <FormCheckbox<MovieFormValues>
                  name="watched"
                  label="Watched"
                  id="movie-watched"
                  description="Mark this movie as watched."
                  variant="card"
                />
              </div>

              <FormTextarea<MovieFormValues>
                name="summary"
                label="Summary"
                id="movie-summary"
              />

              <FormTextarea<MovieFormValues>
                name="notes"
                label="Notes"
                id="movie-notes"
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" render={renderLink({ to: cancelHref })}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || isSubmitting}>
            {saving || isSubmitting ? savingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
