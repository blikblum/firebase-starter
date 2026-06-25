import { FilmIcon, PlusIcon, SearchIcon } from 'lucide-react'
import type { Movie } from 'base/movies'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { defaultRenderMovieLink, type MovieLinkRenderer } from './movie-links'

export interface MovieListViewProps {
  movies: Movie[]
  search: string
  loading: boolean
  error?: string
  onSearchChange: (search: string) => void
  getMovieHref: (movieId: string) => string
  addMovieHref: string
  renderLink?: MovieLinkRenderer
}

export function MovieListView({
  movies,
  search,
  loading,
  error,
  onSearchChange,
  getMovieHref,
  addMovieHref,
  renderLink = defaultRenderMovieLink,
}: MovieListViewProps): React.JSX.Element {
  const hasMovies = movies.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Collection</p>
          <h1 className="text-3xl font-semibold tracking-tight">Movies</h1>
        </div>
        <Button render={renderLink({ to: addMovieHref })}>
          <PlusIcon />
          Add movie
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          type="search"
          placeholder="Search by title"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading && !hasMovies ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : null}

      {!loading && !hasMovies ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilmIcon />
            </EmptyMedia>
            <EmptyTitle>{search ? 'No matching movies' : 'No movies yet'}</EmptyTitle>
            <EmptyDescription>
              {search
                ? 'Try a different title prefix.'
                : 'Add the first movie to start the collection.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={renderLink({ to: addMovieHref })}>
              <PlusIcon />
              Add movie
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {hasMovies ? (
        <div className="grid gap-4 md:grid-cols-2">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="truncate text-xl">{movie.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {[movie.releaseYear, movie.director].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                  {movie.watched ? <Badge variant="secondary">Watched</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 4).map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="line-clamp-3 min-h-16 text-sm text-muted-foreground">
                  {movie.summary ?? 'No summary added.'}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  render={renderLink({ to: getMovieHref(movie.id) })}
                >
                  View details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}
