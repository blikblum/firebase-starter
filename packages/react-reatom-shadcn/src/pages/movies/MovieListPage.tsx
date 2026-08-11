import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { useStore } from '@/helpers/reatom'
import { moviesListAtom, moviesSearchAtom } from '@/stores/movies'
import { fetchMovies } from '@/stores/movies.service'

import { MovieListView, type MovieListViewMode } from './movie-list-view'
import type { MovieLinkProps } from './movie-links'

const RouterLink = (props: MovieLinkProps): React.ReactElement => {
  return <Link {...props} />
}

const getMovieHref = (movieId: string): string => `/movies/${movieId}`

export function MovieListPage(): React.JSX.Element {
  const search = useStore(moviesSearchAtom)
  const moviesState = useStore(moviesListAtom)
  const [viewMode, setViewMode] = React.useState<MovieListViewMode>('cards')

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMovies()
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [search])

  return (
    <MovieListView
      movies={moviesState.data}
      search={search}
      loading={moviesState.loading}
      error={moviesState.error}
      viewMode={viewMode}
      addMovieHref="/movies/new"
      getMovieHref={getMovieHref}
      onSearchChange={(value) => moviesSearchAtom.set(value)}
      onViewModeChange={setViewMode}
      renderLink={RouterLink}
    />
  )
}
