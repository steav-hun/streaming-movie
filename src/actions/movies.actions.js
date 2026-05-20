'use server'

import {
  getTrendingMoviesDay,
  getPopularMovies,
  getNowPlayingMovies,
  getMovieById,
  getMovieVideos,
  pickPlayableVideoUrl,
  localeToTmdbLanguage,
  searchMulti,
  getSimilarMovies,
  getRecommendedMovies,
  getMovieWatchProviders,
  getMovieGenresList,
  discoverMovies
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

export async function fetchSearchMulti (locale, query, page = 1) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, results: [], totalPages: 0, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const { results, totalPages } = await searchMulti(query, language, page)
    return { ok: true, results, totalPages, error: null }
  } catch (err) {
    console.error('[fetchSearchMulti]', err)
    return {
      ok: false,
      results: [],
      totalPages: 0,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

export async function fetchSimilarMovies (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const movies = await getSimilarMovies(id, language)
    return { ok: true, movies, error: null }
  } catch (err) {
    console.error('[fetchSimilarMovies]', err)
    return { ok: false, movies: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchRecommendedMovies (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const movies = await getRecommendedMovies(id, language)
    return { ok: true, movies, error: null }
  } catch (err) {
    console.error('[fetchRecommendedMovies]', err)
    return { ok: false, movies: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchMovieWatchProviders (id) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, data: null, error: MISSING_TOKEN }
  }
  try {
    const data = await getMovieWatchProviders(id)
    return { ok: true, data, error: null }
  } catch (err) {
    console.error('[fetchMovieWatchProviders]', err)
    return { ok: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchMovieGenres (locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, genres: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const genres = await getMovieGenresList(language)
    return { ok: true, genres, error: null }
  } catch (err) {
    console.error('[fetchMovieGenres]', err)
    return { ok: false, genres: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchDiscoverMovies (locale, page = 1, withGenres = '') {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, movies: [], totalPages: 0, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const { results, totalPages } = await discoverMovies({
      language,
      page,
      withGenres: withGenres || undefined,
      sortBy: 'popularity.desc'
    })
    return { ok: true, movies: results, totalPages, error: null }
  } catch (err) {
    console.error('[fetchDiscoverMovies]', err)
    return {
      ok: false,
      movies: [],
      totalPages: 0,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}
