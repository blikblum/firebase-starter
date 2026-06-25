import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Movie } from 'base/movies'

import { MovieDetailsView } from './movie-details-view'

const movie: Movie = {
  id: 'arrival',
  title: 'Arrival',
  titleSearch: 'arrival',
  releaseYear: 2016,
  director: 'Denis Villeneuve',
  genres: ['Drama', 'Sci-Fi'],
  runtimeMinutes: 116,
  posterUrl: undefined,
  rating: 9,
  watched: true,
  summary: 'A linguist works with the military to communicate with alien visitors.',
  notes: 'Rewatch with headphones.',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const meta = {
  title: 'Pages/Movies/MovieDetailsView',
  component: MovieDetailsView,
  args: {
    movie,
    loading: false,
    error: undefined,
    notFound: false,
    backHref: '/movies',
    editHref: '/movies/arrival/edit',
  },
} satisfies Meta<typeof MovieDetailsView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    movie: undefined,
    loading: true,
  },
}

export const NotFound: Story = {
  args: {
    movie: undefined,
    notFound: true,
  },
}

export const ErrorState: Story = {
  args: {
    movie: undefined,
    error: 'Unable to load movie.',
  },
}
