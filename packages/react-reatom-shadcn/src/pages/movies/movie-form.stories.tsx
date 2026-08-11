import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { MovieForm } from './movie-form'

const meta = {
  title: 'Pages/Movies/MovieForm',
  component: MovieForm,
  args: {
    saving: false,
    error: undefined,
    cancelHref: '/movies',
    onSubmit: fn(async () => undefined),
  },
} satisfies Meta<typeof MovieForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ValidationErrors: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Release year'), '1800')
    await userEvent.type(canvas.getByLabelText('Runtime'), '0')
    await userEvent.type(canvas.getByLabelText('Poster URL'), 'ftp://example.com/poster.jpg')
    await userEvent.type(canvas.getByLabelText('Rating'), '11')
    await userEvent.click(canvas.getByRole('button', { name: 'Add movie' }))

    await expect(canvas.getByText('Title is required.')).toBeVisible()
    await expect(canvas.getByText('Use a valid release year.')).toBeVisible()
    await expect(
      canvas.getByText('Runtime must be a positive number of minutes.'),
    ).toBeVisible()
    await expect(canvas.getByText('Use a valid poster URL.')).toBeVisible()
    await expect(canvas.getByText('Rating must be between 0 and 10.')).toBeVisible()
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const SuccessfulSubmission: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Title'), '  Arrival  ')
    await userEvent.type(canvas.getByLabelText('Release year'), '2016')
    await userEvent.type(canvas.getByLabelText('Runtime'), '116')
    await userEvent.type(canvas.getByLabelText('Director'), '  Denis Villeneuve  ')
    await userEvent.type(canvas.getByLabelText('Genres'), 'Drama, Sci-Fi, ')
    await userEvent.type(canvas.getByLabelText('Rating'), '9')
    await userEvent.click(canvas.getByLabelText('Watched'))
    await userEvent.click(canvas.getByRole('button', { name: 'Add movie' }))

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        title: 'Arrival',
        releaseYear: 2016,
        director: 'Denis Villeneuve',
        genres: ['Drama', 'Sci-Fi'],
        runtimeMinutes: 116,
        posterUrl: undefined,
        rating: 9,
        watched: true,
        summary: undefined,
        notes: undefined,
      }),
    )
  },
}

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
