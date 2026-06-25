import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { useStore } from '@/helpers/reatom'
import { movieDetailsAtom } from '@/stores/movies'
import { listenToMovieDetails } from '@/stores/movies.service'

import { MovieDetailsView } from './movie-details-view'
import type { MovieLinkProps } from './movie-links'

const RouterLink = (props: MovieLinkProps): React.ReactElement => {
  return <Link {...props} />
}

export function MovieDetailsPage({ movieId }: { movieId: string }): React.JSX.Element {
  const movieDetails = useStore(movieDetailsAtom)

  React.useEffect(() => {
    return listenToMovieDetails(movieId)
  }, [movieId])

  return (
    <MovieDetailsView
      movie={movieDetails.movieId === movieId ? movieDetails.data : undefined}
      loading={movieDetails.loading}
      error={movieDetails.error}
      notFound={movieDetails.notFound}
      backHref="/movies"
      editHref={`/movies/${movieId}/edit`}
      renderLink={RouterLink}
    />
  )
}
