import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import {
  fetchTvById,
  fetchSimilarTv,
  fetchRecommendedTv,
  fetchTvWatchProviders
} from '@/actions/tv.actions'
import { MovieTrailerPlayer } from '@/components/movie/MovieTrailerPlayer'
import { MediaRow } from '@/components/media/MediaRow'
import { WatchProviders } from '@/components/media/WatchProviders'
import { TVCard } from '@/components/tv/TVCard'
import { DetailWatchlistRow } from '@/components/watchlist/DetailWatchlistRow'
import { getSiteName, getWatchRegion } from '@/lib/site-meta'

export const revalidate = 3600

function episodeRuntimeMins (show) {
  const arr = show.episode_run_time
  if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'number') {
    return arr[0]
  }
  return null
}

export async function generateMetadata ({ params }) {
  const { locale, id } = await params
  const siteName = getSiteName()
  const res = await fetchTvById(id, locale)
  const show = res.show
  if (!show) {
    return { title: res.ok ? 'Not found' : siteName }
  }
  const ogImage = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : show.poster_path
      ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
      : undefined
  return {
    title: `${show.name} — ${siteName}`,
    description: show.overview,
    openGraph: ogImage
      ? { images: [{ url: ogImage, alt: show.name }] }
      : undefined
  }
}

export default async function TvDetailPage ({ params }) {
  const { locale, id } = await params

  const showRes = await fetchTvById(id, locale)

  if (!showRes.ok) {
    return (
      <div className="pt-28 min-h-screen max-w-4xl mx-auto px-4 pb-16">
        <p className="text-amber-400">{showRes.error}</p>
      </div>
    )
  }

  const show = showRes.show
  if (!show) {
    notFound()
  }

  const videoUrl = showRes.videoUrl

  const [similarRes, recRes, provRes, t, tNav, tDetail] = await Promise.all([
    fetchSimilarTv(id, locale),
    fetchRecommendedTv(id, locale),
    fetchTvWatchProviders(id),
    getTranslations('home'),
    getTranslations('nav'),
    getTranslations('detail')
  ])

  const similar = similarRes.ok ? similarRes.shows.slice(0, 12) : []
  const recommended = recRes.ok ? recRes.shows.slice(0, 12) : []
  const providerData = provRes.ok ? provRes.data : null
  const region = getWatchRegion()

  const backdrop = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : null

  const runMins = episodeRuntimeMins(show)
  const cast = (show.aggregate_credits?.cast ?? []).slice(0, 16)

  return (
    <div className="min-h-screen pb-16">
      <div className="relative h-[45vh] min-h-[280px] w-full">
        {backdrop ? (
          <>
            <Image
              src={backdrop}
              alt=""
              fill
              className="object-cover opacity-60"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 -mt-24 relative z-10">
        <Link
          href="/tv-shows"
          className="text-sm text-zinc-400 hover:text-white mb-6 inline-block"
        >
          ← {tNav('tvShows')}
        </Link>
        <h1 className="text-3xl font-bold mb-4">{show.name}</h1>
        <p className="text-zinc-400 text-sm mb-2">
          {show.first_air_date?.slice(0, 4)}
          {show.last_air_date ? ` – ${show.last_air_date.slice(0, 4)}` : ''}
          {' · ★ '}
          {Number(show.vote_average).toFixed(1)}
          {typeof show.number_of_seasons === 'number'
            ? ` · ${show.number_of_seasons} season${show.number_of_seasons !== 1 ? 's' : ''}`
            : ''}
          {runMins ? ` · ~${runMins} min/ep` : ''}
        </p>
        <p className="text-zinc-300 leading-relaxed mb-8">{show.overview}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#watch"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            ▶ {t('watchNow')}
          </a>
          <DetailWatchlistRow
            id={show.id}
            mediaType="tv"
            title={show.name}
            posterPath={show.poster_path ?? null}
          />
        </div>

        {cast.length > 0 && (
          <section className="mt-12 border-t border-zinc-800 pt-8">
            <h2 className="text-lg font-semibold text-white mb-4">{tDetail('cast')}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {cast.map(person => {
                const src = person.profile_path
                  ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                  : null
                return (
                  <div
                    key={`${person.id}-${person.roles?.[0]?.character ?? ''}`}
                    className="shrink-0 w-24 text-center"
                  >
                    <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-zinc-800 mb-2">
                      {src ? (
                        <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                      ) : null}
                    </div>
                    <p className="text-xs font-medium text-white line-clamp-2">{person.name}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">
                      {person.roles?.[0]?.character ?? person.character ?? ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <section id="watch" className="mt-14 scroll-mt-28 border-t border-zinc-800 pt-10">
          <MovieTrailerPlayer videoUrl={videoUrl} />
        </section>

        <WatchProviders data={providerData} region={region} tDetail={tDetail} />

        {similar.length > 0 && (
          <MediaRow title={tDetail('similar')}>
            {similar.map(s => (
              <div key={s.id} className="shrink-0 w-36 snap-start">
                <TVCard show={s} />
              </div>
            ))}
          </MediaRow>
        )}

        {recommended.length > 0 && (
          <MediaRow title={tDetail('recommendations')}>
            {recommended.map(s => (
              <div key={s.id} className="shrink-0 w-36 snap-start">
                <TVCard show={s} />
              </div>
            ))}
          </MediaRow>
        )}
      </div>
    </div>
  )
}
