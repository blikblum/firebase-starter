import { atom } from '@reatom/core'
import type { Movie } from 'base/movies'

export interface MoviesListState {
  data: Movie[]
  loading: boolean
  error?: string
}

export interface MovieDetailsState {
  movieId?: string
  data?: Movie
  loading: boolean
  error?: string
  notFound: boolean
}

export interface AddMovieState {
  saving: boolean
  error?: string
}

export interface EditMovieState {
  saving: boolean
  error?: string
}

export const moviesSearchAtom = atom('', 'moviesSearch')

export const moviesListAtom = atom<MoviesListState>(
  {
    data: [],
    loading: false,
    error: undefined,
  },
  'moviesList',
)

export const movieDetailsAtom = atom<MovieDetailsState>(
  {
    movieId: undefined,
    data: undefined,
    loading: false,
    error: undefined,
    notFound: false,
  },
  'movieDetails',
)

export const addMovieStateAtom = atom<AddMovieState>(
  {
    saving: false,
    error: undefined,
  },
  'addMovieState',
)

export const editMovieStateAtom = atom<EditMovieState>(
  {
    saving: false,
    error: undefined,
  },
  'editMovieState',
)
