import * as React from 'react'
import {
  createDefaultMovieInput,
  normalizeMovieInput,
  validateMovieInput,
  type MovieInput,
} from 'base/movies'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

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

type MovieFormErrors = Partial<Record<keyof MovieInput, string>>

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined
  }

  return Number(value)
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
  const [movie, setMovie] = React.useState<MovieInput>(() => initialMovie ?? createDefaultMovieInput())
  const [genresText, setGenresText] = React.useState(() => initialMovie?.genres.join(', ') ?? '')
  const [errors, setErrors] = React.useState<MovieFormErrors>({})

  React.useEffect(() => {
    if (!initialMovie) {
      return
    }

    setMovie(initialMovie)
    setGenresText(initialMovie.genres.join(', '))
    setErrors({})
  }, [initialMovie])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const nextMovie = {
      ...movie,
      genres: genresText.split(','),
    }
    const validation = validateMovieInput(nextMovie)

    setErrors(validation.errors)

    if (!validation.valid || saving) {
      return
    }

    await onSubmit(normalizeMovieInput(nextMovie))
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Movie details</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="movie-title">Title</FieldLabel>
              <Input
                id="movie-title"
                value={movie.title}
                onChange={(event) =>
                  setMovie((value) => ({ ...value, title: event.target.value }))
                }
                required
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="movie-release-year">Release year</FieldLabel>
                <Input
                  id="movie-release-year"
                  type="number"
                  min="1888"
                  max="2100"
                  value={movie.releaseYear ?? ''}
                  onChange={(event) =>
                    setMovie((value) => ({
                      ...value,
                      releaseYear: parseOptionalNumber(event.target.value),
                    }))
                  }
                />
                <FieldError>{errors.releaseYear}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="movie-runtime">Runtime</FieldLabel>
                <Input
                  id="movie-runtime"
                  type="number"
                  min="1"
                  placeholder="Minutes"
                  value={movie.runtimeMinutes ?? ''}
                  onChange={(event) =>
                    setMovie((value) => ({
                      ...value,
                      runtimeMinutes: parseOptionalNumber(event.target.value),
                    }))
                  }
                />
                <FieldError>{errors.runtimeMinutes}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="movie-director">Director</FieldLabel>
              <Input
                id="movie-director"
                value={movie.director ?? ''}
                onChange={(event) =>
                  setMovie((value) => ({ ...value, director: event.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="movie-genres">Genres</FieldLabel>
              <Input
                id="movie-genres"
                placeholder="Drama, Sci-Fi, Thriller"
                value={genresText}
                onChange={(event) => setGenresText(event.target.value)}
              />
              <FieldDescription>Separate genres with commas.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="movie-poster-url">Poster URL</FieldLabel>
              <Input
                id="movie-poster-url"
                type="url"
                value={movie.posterUrl ?? ''}
                onChange={(event) =>
                  setMovie((value) => ({ ...value, posterUrl: event.target.value }))
                }
              />
              <FieldError>{errors.posterUrl}</FieldError>
            </Field>

            <div className="grid gap-5 md:grid-cols-[1fr_auto]">
              <Field>
                <FieldLabel htmlFor="movie-rating">Rating</FieldLabel>
                <Input
                  id="movie-rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={movie.rating ?? ''}
                  onChange={(event) =>
                    setMovie((value) => ({
                      ...value,
                      rating: parseOptionalNumber(event.target.value),
                    }))
                  }
                />
                <FieldError>{errors.rating}</FieldError>
              </Field>

              <Field className="rounded-md border p-3" orientation="horizontal">
                <Checkbox
                  id="movie-watched"
                  checked={movie.watched}
                  onCheckedChange={(checked) =>
                    setMovie((value) => ({ ...value, watched: Boolean(checked) }))
                  }
                />
                <FieldContent>
                  <FieldLabel htmlFor="movie-watched">Watched</FieldLabel>
                  <FieldDescription>Mark this movie as watched.</FieldDescription>
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="movie-summary">Summary</FieldLabel>
              <Textarea
                id="movie-summary"
                value={movie.summary ?? ''}
                onChange={(event) =>
                  setMovie((value) => ({ ...value, summary: event.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="movie-notes">Notes</FieldLabel>
              <Textarea
                id="movie-notes"
                value={movie.notes ?? ''}
                onChange={(event) =>
                  setMovie((value) => ({ ...value, notes: event.target.value }))
                }
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" render={renderLink({ to: cancelHref })}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? savingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
