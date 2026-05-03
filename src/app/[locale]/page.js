import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export const revalidate = 3600
import MovieCard from '@/components/movie/MovieCard'
import BannerAd from '@/components/ads/BannerAd'
import { fetchTrendingMovies, fetchNowPlayingMovies } from '@/actions/movies.actions'

export default async function HomePage ({ params }) {
  const { locale } = await params
  const t = await getTranslations('home')

  const [trendingRes, newRes] = await Promise.all([
    fetchTrendingMovies(locale),
    fetchNowPlayingMovies(locale)
  ])

  const trending = trendingRes.ok ? trendingRes.movies.slice(0, 12) : []
  const newMovies = newRes.ok ? newRes.movies.slice(0, 12) : []
  const featured = trending[0]
  const apiError = trendingRes.error || newRes.error

  return (
    <div className="pt-24 min-h-screen">

      <section className="relative h-[70vh] flex items-center px-8 mb-8 overflow-hidden">
        {featured?.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w1280${featured.backdrop_path}`}
              alt=""
              fill
              className="object-cover opacity-50"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-zinc-900/90" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-r from-zinc-900 to-zinc-800" />
        )}
        <div className="relative z-10 max-w-lg">
          <span className="text-brand-red text-xs font-bold uppercase
            tracking-widest mb-3 block">
            {t('trending')}
          </span>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            {featured?.title ?? 'MovieStream'}
          </h1>
          <p className="text-zinc-400 mb-6 leading-relaxed line-clamp-4">
            {featured?.overview ?? t('popular')}
          </p>
          <div className="flex gap-3">
            <button type="button" className="flex items-center gap-2 bg-white text-black
              font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition">
              ▶ {t('watchNow')}
            </button>
            <button type="button" className="flex items-center gap-2 bg-zinc-700/60
              font-medium px-6 py-3 rounded-lg hover:bg-zinc-700 transition
              border border-zinc-600">
              + {t('addWatchlist')}
            </button>
          </div>
        </div>
      </section>

      {apiError && (
        <div className="max-w-7xl mx-auto mb-6 rounded-lg border border-amber-700/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
          {apiError}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 space-y-10 pb-16">

        <BannerAd size="infeed" />

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('trending')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trending.slice(0, 6).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <BannerAd size="infeed" />

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('newRelease')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newMovies.slice(0, 6).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
