import {
  addDoc,
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAt,
  endAt,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type Query,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {
  createMovieDocument,
  createMovieUpdateDocument,
  normalizeMovieSearchText,
  validateMovieInput,
  type Movie,
  type MovieDocument,
  type MovieInput,
} from 'base/movies'

import {
  addMovieStateAtom,
  editMovieStateAtom,
  movieDetailsAtom,
  moviesListAtom,
  moviesSearchAtom,
} from './movies'

let unsubscribeMovies: Unsubscribe | undefined
let unsubscribeMovieDetails: Unsubscribe | undefined

function getCurrentUserId(): string {
  const uid = getAuth().currentUser?.uid

  if (!uid) {
    throw new Error('You must be signed in to access movies.')
  }

  return uid
}

function getMoviesCollection(userId: string): CollectionReference<DocumentData> {
  return collection(getFirestore(), 'users', userId, 'movies')
}

function toMovie(snapshot: QueryDocumentSnapshot<DocumentData>): Movie {
  return {
    ...(snapshot.data() as MovieDocument),
    id: snapshot.id,
  }
}

function getMoviesQuery(userId: string): Query<DocumentData> {
  const moviesCollection = getMoviesCollection(userId)
  const search = normalizeMovieSearchText(moviesSearchAtom())

  if (!search) {
    return query(moviesCollection, orderBy('titleSearch', 'asc'), limit(50))
  }

  return query(
    moviesCollection,
    orderBy('titleSearch', 'asc'),
    startAt(search),
    endAt(`${search}\uf8ff`),
    limit(50),
  )
}

export function listenToMovies(): Unsubscribe {
  unsubscribeMovies?.()

  moviesListAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  try {
    unsubscribeMovies = onSnapshot(getMoviesQuery(getCurrentUserId()), {
      next(snapshot) {
        moviesListAtom.set({
          data: snapshot.docs.map(toMovie),
          loading: false,
          error: undefined,
        })
      },
      error(error) {
        moviesListAtom.set({
          data: [],
          loading: false,
          error: error.message,
        })
      },
    })
  } catch (error) {
    moviesListAtom.set({
      data: [],
      loading: false,
      error: error instanceof Error ? error.message : `${error}`,
    })
    unsubscribeMovies = undefined
  }

  return () => {
    unsubscribeMovies?.()
    unsubscribeMovies = undefined
  }
}

export function listenToMovieDetails(movieId: string): Unsubscribe {
  unsubscribeMovieDetails?.()

  movieDetailsAtom.set({
    movieId,
    data: undefined,
    loading: true,
    error: undefined,
    notFound: false,
  })

  try {
    const movieRef = doc(getMoviesCollection(getCurrentUserId()), movieId)

    unsubscribeMovieDetails = onSnapshot(movieRef, {
      next(snapshot) {
        movieDetailsAtom.set({
          movieId,
          data: snapshot.exists()
            ? {
                ...(snapshot.data() as MovieDocument),
                id: snapshot.id,
              }
            : undefined,
          loading: false,
          error: undefined,
          notFound: !snapshot.exists(),
        })
      },
      error(error) {
        movieDetailsAtom.set({
          movieId,
          data: undefined,
          loading: false,
          error: error.message,
          notFound: false,
        })
      },
    })
  } catch (error) {
    movieDetailsAtom.set({
      movieId,
      data: undefined,
      loading: false,
      error: error instanceof Error ? error.message : `${error}`,
      notFound: false,
    })
    unsubscribeMovieDetails = undefined
  }

  return () => {
    unsubscribeMovieDetails?.()
    unsubscribeMovieDetails = undefined
  }
}

export async function addMovie(input: MovieInput): Promise<string | undefined> {
  const validation = validateMovieInput(input)

  if (!validation.valid) {
    addMovieStateAtom.set({
      saving: false,
      error: Object.values(validation.errors)[0] ?? 'Check the movie details.',
    })

    return undefined
  }

  addMovieStateAtom.set({
    saving: true,
    error: undefined,
  })

  try {
    const movieRef = await addDoc(
      getMoviesCollection(getCurrentUserId()),
      createMovieDocument(input),
    )

    addMovieStateAtom.set({
      saving: false,
      error: undefined,
    })

    return movieRef.id
  } catch (error) {
    addMovieStateAtom.set({
      saving: false,
      error: error instanceof Error ? error.message : `${error}`,
    })

    return undefined
  }
}

export async function updateMovie(movieId: string, input: MovieInput): Promise<boolean> {
  const validation = validateMovieInput(input)

  if (!validation.valid) {
    editMovieStateAtom.set({
      saving: false,
      error: Object.values(validation.errors)[0] ?? 'Check the movie details.',
    })

    return false
  }

  editMovieStateAtom.set({
    saving: true,
    error: undefined,
  })

  try {
    const movieRef = doc(getMoviesCollection(getCurrentUserId()), movieId)

    await updateDoc(movieRef, createMovieUpdateDocument(input))

    editMovieStateAtom.set({
      saving: false,
      error: undefined,
    })

    return true
  } catch (error) {
    editMovieStateAtom.set({
      saving: false,
      error: error instanceof Error ? error.message : `${error}`,
    })

    return false
  }
}
