import { createFileRoute } from '@tanstack/react-router'

import { AddMoviePage } from '../../pages/movies/AddMoviePage'

export const Route = createFileRoute('/_app/movies/new')({
  component: AddMoviePage,
})
