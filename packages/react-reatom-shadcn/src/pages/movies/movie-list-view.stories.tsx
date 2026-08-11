import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Movie } from 'base/movies'
import { expect, fn, within } from 'storybook/test'

import { MovieListView, type MovieListViewProps } from './movie-list-view'

const movies: Movie[] = [
  {
    id: 'arrival',
    title: 'Arrival',
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

const tableMovies: Movie[] = Array.from({ length: 12 }, (_, index) => {
  const movie = movies[index % movies.length]

  return {
    ...movie,
    id: `${movie.id}-${index + 1}`,
    title: `${movie.title} ${index + 1}`,
  }
})

function InteractiveMovieListView(args: MovieListViewProps): React.JSX.Element {
  const [viewMode, setViewMode] = React.useState(args.viewMode)

  return (
    <MovieListView
      {...args}
      viewMode={viewMode}
      onViewModeChange={(nextViewMode) => {
        setViewMode(nextViewMode)
        args.onViewModeChange(nextViewMode)
      }}
    />
  )
}

const meta = {
  title: 'Pages/Movies/MovieListView',
  component: MovieListView,
  render: (args) => <InteractiveMovieListView {...args} />,
  args: {
    movies,
    search: '',
    loading: false,
    error: undefined,
    viewMode: 'cards',
    addMovieHref: '/movies/new',
    getMovieHref: (movieId: string) => `/movies/${movieId}`,
    onSearchChange: fn(),
    onViewModeChange: fn(),
  },
} satisfies Meta<typeof MovieListView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('link', { name: 'Add movie' })).toHaveAttribute(
      'href',
      '/movies/new',
    )
    await expect(canvas.getAllByRole('link', { name: 'View details' })).toHaveLength(movies.length)
  },
}

export const TableView: Story = {
  args: {
    movies: tableMovies,
    viewMode: 'table',
  },
}

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
