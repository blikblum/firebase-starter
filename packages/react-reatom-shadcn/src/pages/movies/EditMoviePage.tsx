import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { MovieInput } from 'base/movies'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useStore } from '@/helpers/reatom'
import { editMovieStateAtom, movieDetailsAtom } from '@/stores/movies'
import { listenToMovieDetails, updateMovie } from '@/stores/movies.service'

import { MovieForm } from './movie-form'
import type { MovieLinkProps } from './movie-links'

const RouterLink = (props: MovieLinkProps): React.ReactElement => {
  return <Link {...props} />
}

export function EditMoviePage({ movieId }: { movieId: string }): React.JSX.Element {
  const navigate = useNavigate()
  const movieDetails = useStore(movieDetailsAtom)
  const editMovieState = useStore(editMovieStateAtom)

  React.useEffect(() => {
    editMovieStateAtom.set({
      saving: false,
      error: undefined,
    })

    return listenToMovieDetails(movieId)
  }, [movieId])

  const handleSubmit = async (movie: MovieInput): Promise<void> => {
    const updated = await updateMovie(movieId, movie)

    if (updated) {
      await navigate({ to: '/movies/$movieId', params: { movieId } })
    }
  }

  if (movieDetails.loading || movieDetails.movieId !== movieId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    )
  }

  if (movieDetails.error) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Unable to load movie</EmptyTitle>
          <EmptyDescription>{movieDetails.error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (movieDetails.notFound || !movieDetails.data) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Movie not found</EmptyTitle>
          <EmptyDescription>This movie is not in your collection.</EmptyDescription>
        </EmptyHeader>
        <Button render={RouterLink({ to: '/movies' })}>Back to movies</Button>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Collection</p>
        <h1 className="text-3xl font-semibold tracking-tight">Edit movie</h1>
      </div>
      <MovieForm
        saving={editMovieState.saving}
        error={editMovieState.error}
        cancelHref={`/movies/${movieId}`}
        initialMovie={movieDetails.data}
        submitLabel="Save changes"
        savingLabel="Saving changes..."
        onSubmit={handleSubmit}
        renderLink={RouterLink}
      />
    </div>
  )
}
