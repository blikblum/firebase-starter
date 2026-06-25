import { Link, useNavigate } from '@tanstack/react-router'
import type { MovieInput } from 'base/movies'

import { useStore } from '@/helpers/reatom'
import { addMovieStateAtom } from '@/stores/movies'
import { addMovie } from '@/stores/movies.service'

import { MovieForm } from './movie-form'
import type { MovieLinkProps } from './movie-links'

const RouterLink = (props: MovieLinkProps): React.ReactElement => {
  return <Link {...props} />
}

export function AddMoviePage(): React.JSX.Element {
  const navigate = useNavigate()
  const addMovieState = useStore(addMovieStateAtom)

  const handleSubmit = async (movie: MovieInput): Promise<void> => {
    const movieId = await addMovie(movie)

    if (movieId) {
      await navigate({ to: '/movies/$movieId', params: { movieId } })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">Collection</p>
        <h1 className="text-3xl font-semibold tracking-tight">Add movie</h1>
      </div>
      <MovieForm
        saving={addMovieState.saving}
        error={addMovieState.error}
        cancelHref="/movies"
        onSubmit={handleSubmit}
        renderLink={RouterLink}
      />
    </div>
  )
}
