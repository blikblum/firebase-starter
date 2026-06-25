import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

import { MovieListPage } from '../../pages/movies/MovieListPage'

export const Route = createFileRoute('/_app/movies')({
  component: MoviesRoute,
})

function MoviesRoute(): React.JSX.Element {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (pathname === '/movies' || pathname === '/movies/') {
    return <MovieListPage />
  }

  return <Outlet />
}
