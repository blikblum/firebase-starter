import * as React from 'react'
import { FilmIcon, LayoutGridIcon, PlusIcon, SearchIcon, Table2Icon } from 'lucide-react'
import type { Movie } from 'base/movies'

import { DataTable } from '@/components/data-table'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { defaultRenderMovieLink, type MovieLinkRenderer } from './movie-links'
import { createMovieTableColumns } from './movie-table-columns'

export type MovieListViewMode = 'cards' | 'table'

export interface MovieListViewProps {
  movies: Movie[]
  search: string
  loading: boolean
  hasLoaded: boolean
  error?: string
  viewMode: MovieListViewMode
  onSearchChange: (search: string) => void
  onViewModeChange: (viewMode: MovieListViewMode) => void
  getMovieHref: (movieId: string) => string
  addMovieHref: string
  renderLink?: MovieLinkRenderer
}

export function MovieListView({
  movies,
  search,
  loading,
  hasLoaded,
  error,
  viewMode,
  onSearchChange,
  onViewModeChange,
  getMovieHref,
  addMovieHref,
  renderLink = defaultRenderMovieLink,
}: MovieListViewProps): React.JSX.Element {
  const hasMovies = movies.length > 0
  const hasSearch = search.trim().length > 0
  const showInitialLoading = useDelayedInitialLoading(loading && !hasLoaded)
  const movieTableColumns = React.useMemo(
    () => createMovieTableColumns({ getMovieHref, renderLink }),
    [getMovieHref, renderLink],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Collection</p>
          <h1 className="text-3xl font-semibold tracking-tight">Movies</h1>
        </div>
        <Button nativeButton={false} render={renderLink({ to: addMovieHref })}>
          <PlusIcon />
          Add movie
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            type="search"
            placeholder="Search by title"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <ToggleGroup
          aria-label="Movie view"
          variant="outline"
          spacing={0}
          value={[viewMode]}
          onValueChange={(value) => {
            const nextViewMode = value[0]

            if (nextViewMode === 'cards' || nextViewMode === 'table') {
              onViewModeChange(nextViewMode)
            }
          }}
        >
          <ToggleGroupItem value="cards" aria-label="Show movies as cards">
            <LayoutGridIcon />
            <span className="hidden sm:inline">Cards</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Show movies as a table">
            <Table2Icon />
            <span className="hidden sm:inline">Table</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {!showInitialLoading && error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {showInitialLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : null}

      {!showInitialLoading && hasLoaded && !hasMovies ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilmIcon />
            </EmptyMedia>
            <EmptyTitle>{hasSearch ? 'No matching movies' : 'No movies yet'}</EmptyTitle>
            <EmptyDescription>
              {hasSearch
                ? 'Try a different title or keyword.'
                : 'Add the first movie to start the collection.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={renderLink({ to: addMovieHref })}>
              <PlusIcon />
              Add movie
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}

      {!showInitialLoading && hasMovies && viewMode === 'cards' ? (
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
                  nativeButton={false}
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

      {!showInitialLoading && hasMovies && viewMode === 'table' ? (
        <DataTable columns={movieTableColumns} data={movies} showColumnToggle />
      ) : null}
    </div>
  )
}

const INITIAL_LOADING_DELAY_MS = 200
const MINIMUM_LOADING_DURATION_MS = 300

function useDelayedInitialLoading(pending: boolean): boolean {
  const [visible, setVisible] = React.useState(false)
  const shownAtRef = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    let timeoutId: number | undefined

    if (pending && !visible) {
      timeoutId = window.setTimeout(() => {
        shownAtRef.current = window.performance.now()
        setVisible(true)
      }, INITIAL_LOADING_DELAY_MS)
    } else if (!pending && visible) {
      const shownAt = shownAtRef.current ?? window.performance.now()
      const elapsed = window.performance.now() - shownAt
      const remaining = Math.max(0, MINIMUM_LOADING_DURATION_MS - elapsed)

      timeoutId = window.setTimeout(() => {
        shownAtRef.current = undefined
        setVisible(false)
      }, remaining)
    } else if (!pending) {
      shownAtRef.current = undefined
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [pending, visible])

  return visible
}
