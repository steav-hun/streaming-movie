'use server'

import {
  getTrendingMoviesDay,
  getPopularMovies,
  getNowPlayingMovies,
  getMovieById,
  getMovieVideos,
  pickPlayableVideoUrl,
  localeToTmdbLanguage
} from '@/services/tmdb.service'

const MISSING_TOKEN = 'Missing TMDB_ACCESS_TOKEN in environment variables.'

function handleServiceError (err) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  return {
    ok: false,
    movies: [],
    movie: null,
    totalPages: 0,
    error: message.includes('TMDB_ACCESS_TOKEN') ? MISSING_TOKEN : message
  }
}

export async function fetchTrendingMovies (locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const movies = await getTrendingMoviesDay(language)
    return { ok: true, movies, error: null }
  } catch (err) {
    console.error('[fetchTrendingMovies]', err)
    const r = handleServiceError(err)
    return { ok: false, movies: [], error: r.error }
  }
}

export async function fetchPopularMovies (locale, page = 1) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], totalPages: 0, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const { results, totalPages } = await getPopularMovies(language, page)
    return { ok: true, movies: results, totalPages, error: null }
  } catch (err) {
    console.error('[fetchPopularMovies]', err)
    const r = handleServiceError(err)
    return { ok: false, movies: [], totalPages: 0, error: r.error }
  }
}

export async function fetchNowPlayingMovies (locale, page = 1) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], totalPages: 0, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const { results, totalPages } = await getNowPlayingMovies(language, page)
    return { ok: true, movies: results, totalPages, error: null }
  } catch (err) {
    console.error('[fetchNowPlayingMovies]', err)
    const r = handleServiceError(err)
    return { ok: false, movies: [], totalPages: 0, error: r.error }
  }
}

export async function fetchMovieById (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movie: null, videoUrl: null, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const movie = await getMovieById(id, language)
    if (!movie) {
      return { ok: true, movie: null, videoUrl: null, error: null }
    }
    let videoUrl = pickPlayableVideoUrl(movie.videos?.results ?? [])
    if (!videoUrl) {
      const more = await getMovieVideos(id)
      videoUrl = pickPlayableVideoUrl(more)
    }
    return { ok: true, movie, videoUrl, error: null }
  } catch (err) {
    console.error('[fetchMovieById]', err)
    return {
      ok: false,
      movie: null,
      videoUrl: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}
