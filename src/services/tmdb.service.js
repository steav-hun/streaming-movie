const TMDB_BASE = 'https://api.themoviedb.org/3'

const REVALIDATE_SECONDS = 60 * 60

function getAccessToken () {
  const token = process.env.TMDB_ACCESS_TOKEN
  if (!token) {
    throw new Error('TMDB_ACCESS_TOKEN is not set')
  }
  return token
}

/**
 * Maps next-intl locale segment to TMDB `language` query param.
 * @see https://developer.themoviedb.org/reference/discover-movie
 */
export function localeToTmdbLanguage (locale) {
  // TMDB falls back to "original language" when a translation doesn't exist.
  // For a Khmer UI, the expected fallback is English (not Thai/original),
  // so we request English for all non-English locales.
  if (locale === 'en') return 'en-US'
  return 'en-US'
}

async function tmdbFetch (path, searchParams = {}) {
  const url = new URL(`${TMDB_BASE}${path}`)
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json'
    },
    next: { revalidate: REVALIDATE_SECONDS }
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

export async function getTrendingMoviesDay (language = 'en-US') {
  const data = await tmdbFetch('/trending/movie/day', { language })
  return data.results ?? []
}

export async function getPopularMovies (language = 'en-US', page = 1) {
  const data = await tmdbFetch('/movie/popular', { language, page })
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 1
  }
}

export async function getNowPlayingMovies (language = 'en-US', page = 1) {
  const data = await tmdbFetch('/movie/now_playing', { language, page })
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 1
  }
}

export async function getPopularTv (language = 'en-US', page = 1) {
  const data = await tmdbFetch('/tv/popular', { language, page })
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 1
  }
}

export async function getTvById (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return null
  }

  const url = new URL(`${TMDB_BASE}/tv/${numericId}`)
  url.searchParams.set('language', language)
  url.searchParams.set('append_to_response', 'videos,aggregate_credits')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json'
    },
    next: { revalidate: REVALIDATE_SECONDS }
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

export async function getTvVideos (id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/tv/${numericId}/videos`)
  return data.results ?? []
}

export async function getSimilarTv (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/tv/${numericId}/similar`, { language })
  return data.results ?? []
}

export async function getRecommendedTv (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/tv/${numericId}/recommendations`, { language })
  return data.results ?? []
}

export async function getTvWatchProviders (id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return null
  }
  return tmdbFetch(`/tv/${numericId}/watch/providers`)
}

export async function getMovieById (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return null
  }

  const url = new URL(`${TMDB_BASE}/movie/${numericId}`)
  url.searchParams.set('language', language)
  url.searchParams.set('append_to_response', 'videos,credits')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      Accept: 'application/json'
    },
    next: { revalidate: REVALIDATE_SECONDS }
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

export async function getMovieVideos (id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/movie/${numericId}/videos`)
  return data.results ?? []
}

export async function searchMulti (query, language = 'en-US', page = 1) {
  const q = typeof query === 'string' ? query.trim() : ''
  if (!q) {
    return { results: [], totalPages: 0 }
  }
  const data = await tmdbFetch('/search/multi', {
    query: q,
    language,
    page,
    include_adult: 'false'
  })
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 1
  }
}

export async function getSimilarMovies (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/movie/${numericId}/similar`, { language })
  return data.results ?? []
}

export async function getRecommendedMovies (id, language = 'en-US') {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return []
  }
  const data = await tmdbFetch(`/movie/${numericId}/recommendations`, {
    language
  })
  return data.results ?? []
}

export async function getMovieWatchProviders (id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || numericId < 1) {
    return null
  }
  return tmdbFetch(`/movie/${numericId}/watch/providers`)
}

export async function getMovieGenresList (language = 'en-US') {
  const data = await tmdbFetch('/genre/movie/list', { language })
  return data.genres ?? []
}

/**
 * @param {object} opts
 * @param {string} opts.language
 * @param {number} opts.page
 * @param {string} [opts.withGenres] comma-separated genre ids
 * @param {string} [opts.sortBy] e.g. popularity.desc
 */
export async function discoverMovies ({
  language = 'en-US',
  page = 1,
  withGenres,
  sortBy = 'popularity.desc'
}) {
  const params = {
    language,
    page,
    sort_by: sortBy,
    include_adult: 'false',
    include_video: 'false'
  }
  if (withGenres != null && String(withGenres).length > 0) {
    params.with_genres = String(withGenres)
  }
  const data = await tmdbFetch('/discover/movie', params)
  return {
    results: data.results ?? [],
    totalPages: data.total_pages ?? 1
  }
}

const siteKey = s => (s && String(s).toLowerCase()) || ''

/** Prefer official YouTube trailer, then Vimeo; site names from TMDB vary in casing. */
export function pickPlayableVideoUrl (videos) {
  if (!Array.isArray(videos) || videos.length === 0) {
    return null
  }

  const score = v => {
    let s = 0
    if (v.type === 'Trailer') s += 5
    else if (v.type === 'Teaser') s += 4
    else if (v.type === 'Clip') s += 3
    else if (v.type === 'Featurette') s += 2
    if (v.official) s += 2
    return s
  }

  const yt = videos.filter(
    v => siteKey(v.site) === 'youtube' && typeof v.key === 'string' && v.key.length > 0
  )
  if (yt.length > 0) {
    yt.sort((a, b) => score(b) - score(a))
    return `https://www.youtube.com/watch?v=${yt[0].key}`
  }

  const vm = videos.filter(
    v => siteKey(v.site) === 'vimeo' && typeof v.key === 'string' && v.key.length > 0
  )
  if (vm.length > 0) {
    vm.sort((a, b) => score(b) - score(a))
    return `https://vimeo.com/${vm[0].key}`
  }

  return null
}

/** @deprecated use pickPlayableVideoUrl */
export function pickYoutubeTrailerUrl (videos) {
  return pickPlayableVideoUrl(videos)
}
