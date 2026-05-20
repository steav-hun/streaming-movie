'use server'

import {
  getPopularTv,
  getTvById,
  getTvVideos,
  pickPlayableVideoUrl,
  localeToTmdbLanguage,
  getSimilarTv,
  getRecommendedTv,
  getTvWatchProviders
} from '@/services/tmdb.service'

const MISSING_TOKEN = 'Missing TMDB_ACCESS_TOKEN in environment variables.'

function handleServiceError (err) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  return {
    ok: false,
    shows: [],
    show: null,
    totalPages: 0,
    error: message.includes('TMDB_ACCESS_TOKEN') ? MISSING_TOKEN : message
  }
}

export async function fetchPopularTv (locale, page = 1) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, shows: [], totalPages: 0, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const { results, totalPages } = await getPopularTv(language, page)
    return { ok: true, shows: results, totalPages, error: null }
  } catch (err) {
    console.error('[fetchPopularTv]', err)
    const r = handleServiceError(err)
    return { ok: false, shows: [], totalPages: 0, error: r.error }
  }
}

export async function fetchTvById (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, show: null, videoUrl: null, error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const show = await getTvById(id, language)
    if (!show) {
      return { ok: true, show: null, videoUrl: null, error: null }
    }
    let videoUrl = pickPlayableVideoUrl(show.videos?.results ?? [])
    if (!videoUrl) {
      const more = await getTvVideos(id)
      videoUrl = pickPlayableVideoUrl(more)
    }
    return { ok: true, show, videoUrl, error: null }
  } catch (err) {
    console.error('[fetchTvById]', err)
    return {
      ok: false,
      show: null,
      videoUrl: null,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

export async function fetchSimilarTv (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, shows: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const shows = await getSimilarTv(id, language)
    return { ok: true, shows, error: null }
  } catch (err) {
    console.error('[fetchSimilarTv]', err)
    return { ok: false, shows: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchRecommendedTv (id, locale) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, shows: [], error: MISSING_TOKEN }
  }
  const language = localeToTmdbLanguage(locale)
  try {
    const shows = await getRecommendedTv(id, language)
    return { ok: true, shows, error: null }
  } catch (err) {
    console.error('[fetchRecommendedTv]', err)
    return { ok: false, shows: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchTvWatchProviders (id) {
  if (!process.env.TMDB_ACCESS_TOKEN) {
    return { ok: false, data: null, error: MISSING_TOKEN }
  }
  try {
    const data = await getTvWatchProviders(id)
    return { ok: true, data, error: null }
  } catch (err) {
    console.error('[fetchTvWatchProviders]', err)
    return { ok: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
