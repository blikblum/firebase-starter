import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { useStore } from '@/helpers/reatom'
import { moviesListAtom, moviesSearchAtom } from '@/stores/movies'
import { listenToMovies } from '@/stores/movies.service'

import { MovieListView } from './movie-list-view'
import type { MovieLinkProps } from './movie-links'

const RouterLink = (props: MovieLinkProps): React.ReactElement => {
  return <Link {...props} />
}

export function MovieListPage(): React.JSX.Element {
  const search = useStore(moviesSearchAtom)
  const moviesState = useStore(moviesListAtom)

  React.useEffect(() => {
    return listenToMovies()
  }, [search])

  return (
    <MovieListView
      movies={moviesState.data}
      search={search}
      loading={moviesState.loading}
      error={moviesState.error}
      addMovieHref="/movies/new"
      getMovieHref={(movieId) => `/movies/${movieId}`}
      onSearchChange={(value) => moviesSearchAtom.set(value)}
      renderLink={RouterLink}
    />
  )
}
