import { getSiteUrl } from '@/lib/site-url'
import { getPopularMovies, getPopularTv, localeToTmdbLanguage } from '@/services/tmdb.service'

const LOCALES = ['en', 'km']
const TOP_N = 24

export default async function sitemap () {
  const baseUrl = getSiteUrl()
  const now = new Date()

  const staticPaths = []
  for (const loc of LOCALES) {
    staticPaths.push(
      { path: `/${loc}`, priority: 1 },
      { path: `/${loc}/movies`, priority: 0.8 },
      { path: `/${loc}/movies/browse`, priority: 0.75 },
      { path: `/${loc}/tv-shows`, priority: 0.8 },
      { path: `/${loc}/search`, priority: 0.4 },
      { path: `/${loc}/watchlist`, priority: 0.5 }
    )
  }

  const entries = staticPaths.map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority
  }))

  const token = process.env.TMDB_ACCESS_TOKEN
  if (!token) {
    return entries
  }

  const lang = localeToTmdbLanguage('en')
  try {
    const [{ results: movies }, { results: shows }] = await Promise.all([
      getPopularMovies(lang, 1),
      getPopularTv(lang, 1)
    ])
    const movieSlice = (movies ?? []).slice(0, TOP_N)
    const tvSlice = (shows ?? []).slice(0, TOP_N)

    for (const loc of LOCALES) {
      for (const m of movieSlice) {
        entries.push({
          url: `${baseUrl}/${loc}/movies/${m.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.65
        })
      }
      for (const s of tvSlice) {
        entries.push({
          url: `${baseUrl}/${loc}/tv-shows/${s.id}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.65
        })
      }
    }
  } catch (err) {
    console.error('[sitemap] TMDB fetch failed', err)
  }

  return entries
}
