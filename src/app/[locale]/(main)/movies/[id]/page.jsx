import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { fetchMovieById } from '@/actions/movies.actions'
import { MovieTrailerPlayer } from '@/components/movie/MovieTrailerPlayer'

export const revalidate = 3600

export async function generateMetadata ({ params }) {
  const { locale, id } = await params
  const res = await fetchMovieById(id, locale)
  const movie = res.movie
  if (!movie) {
    return { title: res.ok ? 'Not found' : 'MovieStream' }
  }
  return {
    title: `${movie.title} — MovieStream`,
    description: movie.overview
  }
}

export default async function MovieDetailPage ({ params }) {
  const { locale, id } = await params

  const movieRes = await fetchMovieById(id, locale)

  if (!movieRes.ok) {
    return (
      <div className="pt-28 min-h-screen max-w-4xl mx-auto px-4 pb-16">
        <p className="text-amber-400">{movieRes.error}</p>
      </div>
    )
  }

  const movie = movieRes.movie
  if (!movie) {
    notFound()
  }

  const videoUrl = movieRes.videoUrl

  const t = await getTranslations('home')
  const tNav = await getTranslations('nav')

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

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
          href="/movies"
          className="text-sm text-zinc-400 hover:text-white mb-6 inline-block"
        >
          ← {tNav('movies')}
        </Link>
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-zinc-400 text-sm mb-2">
          {movie.release_date?.slice(0, 4)} · ★{' '}
          {Number(movie.vote_average).toFixed(1)}
          {movie.runtime ? ` · ${movie.runtime} min` : ''}
        </p>
        <p className="text-zinc-300 leading-relaxed mb-8">{movie.overview}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#watch"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            ▶ {t('watchNow')}
          </a>
        </div>

        <section id="watch" className="mt-14 scroll-mt-28 border-t border-zinc-800 pt-10">
          <MovieTrailerPlayer videoUrl={videoUrl} />
        </section>
      </div>
    </div>
  )
}
