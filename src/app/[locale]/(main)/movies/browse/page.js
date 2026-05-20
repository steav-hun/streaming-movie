import { getTranslations } from 'next-intl/server'
import MovieCard from '@/components/movie/MovieCard'
import { fetchMovieGenres, fetchDiscoverMovies } from '@/actions/movies.actions'
import { Link } from '@/i18n/navigation'
import { getSiteName } from '@/lib/site-meta'

export const revalidate = 3600

export async function generateMetadata ({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'browse' })
  const site = getSiteName()
  return {
    title: `${t('title')} — ${site}`
  }
}

export default async function MoviesBrowsePage ({ params, searchParams }) {
  const { locale } = await params
  const sp = await searchParams
  const genreId = typeof sp?.genre === 'string' ? sp.genre : ''
  const page = Math.max(1, Number(sp?.page) || 1)

  const t = await getTranslations('browse')
  const tCat = await getTranslations('moviesCatalog')

  const genresRes = await fetchMovieGenres(locale)
  const genres = genresRes.ok ? genresRes.genres : []

  const discoverRes = await fetchDiscoverMovies(locale, page, genreId)
  const movies = discoverRes.ok ? discoverRes.movies : []
  const totalPages = discoverRes.totalPages || 1

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-16">
      <h1 className="text-2xl font-semibold mb-4">{t('title')}</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/movies/browse"
          className={`text-xs px-3 py-1.5 rounded-full border transition
            ${!genreId
              ? 'bg-white text-black border-white'
              : 'border-zinc-600 text-zinc-300 hover:border-zinc-400'
            }`}
        >
          {t('allGenres')}
        </Link>
        {genres.map(g => (
          <Link
            key={g.id}
            href={`/movies/browse?genre=${g.id}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition
              ${String(g.id) === genreId
                ? 'bg-white text-black border-white'
                : 'border-zinc-600 text-zinc-300 hover:border-zinc-400'
              }`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      {genresRes.error && (
        <p className="text-amber-400 text-sm mb-4">{genresRes.error}</p>
      )}
      {discoverRes.error && (
        <p className="text-amber-400 text-sm mb-4">{discoverRes.error}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={
                genreId
                  ? `/movies/browse?genre=${encodeURIComponent(genreId)}&page=${page - 1}`
                  : `/movies/browse?page=${page - 1}`
              }
              className="px-4 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700"
            >
              ← {tCat('prev')}
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 text-sm">{tCat('prev')}</span>
          )}
          <span className="px-4 py-2 text-sm text-zinc-400">
            {tCat('pageOf', { page, total: totalPages })}
          </span>
          {page < totalPages ? (
            <Link
              href={
                genreId
                  ? `/movies/browse?genre=${encodeURIComponent(genreId)}&page=${page + 1}`
                  : `/movies/browse?page=${page + 1}`
              }
              className="px-4 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700"
            >
              {tCat('next')} →
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 text-sm">{tCat('next')}</span>
          )}
        </nav>
      )}
    </div>
  )
}
