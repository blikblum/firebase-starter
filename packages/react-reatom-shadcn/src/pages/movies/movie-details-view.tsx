import { ArrowLeftIcon, ClockIcon, PencilIcon, StarIcon } from 'lucide-react'
import type { Movie } from 'base/movies'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { defaultRenderMovieLink, type MovieLinkRenderer } from './movie-links'

export interface MovieDetailsViewProps {
  movie?: Movie
  loading: boolean
  error?: string
  notFound: boolean
  backHref: string
  editHref?: string
  renderLink?: MovieLinkRenderer
}

function formatRuntime(runtimeMinutes?: number): string | undefined {
  if (!runtimeMinutes) {
    return undefined
  }

  const hours = Math.floor(runtimeMinutes / 60)
  const minutes = runtimeMinutes % 60

  if (!hours) {
    return `${minutes}m`
  }

  return minutes ? `${hours}h ${minutes}m` : `${hours}h`
}

export function MovieDetailsView({
  movie,
  loading,
  error,
  notFound,
  backHref,
  editHref,
  renderLink = defaultRenderMovieLink,
}: MovieDetailsViewProps): React.JSX.Element {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Unable to load movie</EmptyTitle>
          <EmptyDescription>{error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (notFound || !movie) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ArrowLeftIcon />
          </EmptyMedia>
          <EmptyTitle>Movie not found</EmptyTitle>
          <EmptyDescription>This movie is not in your collection.</EmptyDescription>
        </EmptyHeader>
        <Button render={renderLink({ to: backHref })}>Back to movies</Button>
      </Empty>
    )
  }

  const runtime = formatRuntime(movie.runtimeMinutes)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" render={renderLink({ to: backHref })}>
          <ArrowLeftIcon />
          Back
        </Button>
        {editHref ? (
          <Button variant="outline" render={renderLink({ to: editHref })}>
            <PencilIcon />
            Edit movie
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-lg border bg-muted">
          {movie.posterUrl ? (
            <img className="aspect-[2/3] w-full object-cover" src={movie.posterUrl} alt="" />
          ) : (
            <div className="grid aspect-[2/3] place-items-center px-6 text-center text-sm text-muted-foreground">
              No poster
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {movie.watched ? <Badge variant="secondary">Watched</Badge> : null}
              {movie.rating !== undefined ? (
                <Badge variant="outline">
                  <StarIcon />
                  {movie.rating}/10
                </Badge>
              ) : null}
              {runtime ? (
                <Badge variant="outline">
                  <ClockIcon />
                  {runtime}
                </Badge>
              ) : null}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{movie.title}</h1>
              <p className="text-muted-foreground">
                {[movie.releaseYear, movie.director].filter(Boolean).join(' • ')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-muted-foreground">
              {movie.summary ?? 'No summary added.'}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {movie.notes ?? 'No notes added.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
