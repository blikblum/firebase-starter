import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Movie } from 'base/movies'
import { fn } from 'storybook/test'

import { MovieListView } from './movie-list-view'

const movies: Movie[] = [
  {
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
    notes: 'Good pacing and sound design.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'portrait',
    title: 'Portrait of a Lady on Fire',
    titleSearch: 'portrait of a lady on fire',
    releaseYear: 2019,
    director: 'Celine Sciamma',
    genres: ['Drama', 'Romance'],
    runtimeMinutes: 122,
    posterUrl: undefined,
    rating: 8.5,
    watched: true,
    summary: 'A painter is commissioned to paint a wedding portrait on an isolated island.',
    notes: undefined,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
]

const meta = {
  title: 'Pages/Movies/MovieListView',
  component: MovieListView,
  args: {
    movies,
    search: '',
    loading: false,
    error: undefined,
    addMovieHref: '/movies/new',
    getMovieHref: (movieId: string) => `/movies/${movieId}`,
    onSearchChange: fn(),
  },
} satisfies Meta<typeof MovieListView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: {
    movies: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    movies: [],
  },
}

export const ErrorState: Story = {
  args: {
    movies: [],
    error: 'Missing or insufficient permissions.',
  },
}
