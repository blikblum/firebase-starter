import { createFileRoute } from '@tanstack/react-router'

import { EditMoviePage } from '../../pages/movies/EditMoviePage'

export const Route = createFileRoute('/_app/movies/$movieId/edit')({
  component: EditMovieRoute,
})

function EditMovieRoute(): React.JSX.Element {
  const { movieId } = Route.useParams()

  return <EditMoviePage movieId={movieId} />
}
