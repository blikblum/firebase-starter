import type { Meta, StoryObj } from '@storybook/react-vite'

import { MovieForm } from './movie-form'

const meta = {
  title: 'Pages/Movies/MovieForm',
  component: MovieForm,
  args: {
    saving: false,
    error: undefined,
    cancelHref: '/movies',
    onSubmit: async () => undefined,
  },
} satisfies Meta<typeof MovieForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Saving: Story = {
  args: {
    saving: true,
  },
}

export const Editing: Story = {
  args: {
    cancelHref: '/movies/arrival',
    initialMovie: {
      title: 'Arrival',
      releaseYear: 2016,
      director: 'Denis Villeneuve',
      genres: ['Drama', 'Sci-Fi'],
      runtimeMinutes: 116,
      posterUrl: '',
      rating: 9,
      watched: true,
      summary: 'A linguist works with the military to communicate with alien visitors.',
      notes: 'Rewatch with headphones.',
    },
    submitLabel: 'Save changes',
    savingLabel: 'Saving changes...',
  },
}

export const ErrorState: Story = {
  args: {
    error: 'Unable to add movie.',
  },
}
