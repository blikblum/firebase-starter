import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

import { MovieDetailsPage } from '../../pages/movies/MovieDetailsPage'

export const Route = createFileRoute('/_app/movies/$movieId')({
  component: MovieRoute,
})

function MovieRoute(): React.JSX.Element {
  const { movieId } = Route.useParams()
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname === `/movies/${movieId}` || pathname === `/movies/${movieId}/`) {
    return <MovieDetailsPage movieId={movieId} />
  }

  return <Outlet />
}
