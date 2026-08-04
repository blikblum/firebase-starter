import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { documentMatches, execute, field, type PipelineResult } from 'firebase/firestore/pipelines'
import { getAuth } from 'firebase/auth'
import {
  createMovieDocument,
  createMovieUpdateDocument,
  validateMovieInput,
  type Movie,
  type MovieDocument,
  type MovieInput,
} from 'base/movies'
import { shouldUseEmulators } from '../setup/firebase'

import {
  addMovieStateAtom,
  editMovieStateAtom,
  movieDetailsAtom,
  moviesListAtom,
  moviesSearchAtom,
} from './movies'

let unsubscribeMovieDetails: Unsubscribe | undefined
let latestMoviesRequest = 0

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

function toMovieSearchResult(result: PipelineResult<DocumentData>): Movie {
  if (!result.id) {
    throw new Error('Movie search returned a result without a document ID.')
  }

  return {
    ...(result.data() as MovieDocument),
    id: result.id,
  }
}

function matchesMovieTitle(movie: Movie, search: string): boolean {
  const title = movie.title.toLocaleLowerCase()
  const terms = search.toLocaleLowerCase().split(/\s+/).filter(Boolean)

  return terms.every((term) => title.includes(term))
}

async function searchMoviesInEmulator(
  moviesCollection: CollectionReference<DocumentData>,
  search: string,
): Promise<Movie[]> {
  const snapshot = await getDocs(query(moviesCollection, orderBy('title', 'asc')))

  return snapshot.docs
    .map(toMovie)
    .filter((movie) => matchesMovieTitle(movie, search))
    .slice(0, 50)
}



export async function fetchMovies(): Promise<void> {
  const requestId = ++latestMoviesRequest
  const search = moviesSearchAtom().trim()

  moviesListAtom.set((state) => ({
    ...state,
    loading: true,
    error: undefined,
  }))

  try {
    const moviesCollection = getMoviesCollection(getCurrentUserId())
    const data = search
      ? shouldUseEmulators()
        ? await searchMoviesInEmulator(moviesCollection, search)
        : (
          await execute(
            getFirestore()
              .pipeline()
              .collection(moviesCollection.path)
              .search({
                query: documentMatches(search),
                sort: field('title').ascending(),
                limit: 50,
              }),
          )
        ).results.map(toMovieSearchResult)
      : (await getDocs(query(moviesCollection, orderBy('title', 'asc'), limit(50)))).docs.map(
        toMovie,
      )

    if (requestId !== latestMoviesRequest || moviesSearchAtom().trim() !== search) {
      return
    }

    moviesListAtom.set({
      data,
      loading: false,
      error: undefined,
    })
  } catch (error) {
    if (requestId !== latestMoviesRequest || moviesSearchAtom().trim() !== search) {
      return
    }

    moviesListAtom.set({
      data: [],
      loading: false,
      error: error instanceof Error ? error.message : `${error}`,
    })
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

    await updateDoc(movieRef, { ...createMovieUpdateDocument(input) })

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
