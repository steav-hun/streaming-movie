import { getTranslations } from 'next-intl/server'

export const revalidate = 3600
import MovieCard from '@/components/movie/MovieCard'
import { fetchPopularMovies } from '@/actions/movies.actions'

export async function generateMetadata ({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return {
    title: `${t('movies')} — MovieStream`
  }
}

export default async function MoviesPage ({ params }) {
  const { locale } = await params
  const t = await getTranslations('home')
  const res = await fetchPopularMovies(locale)
  const movies = res.ok ? res.movies : []

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-16">
      <h1 className="text-2xl font-semibold mb-6">{t('popular')}</h1>
      {res.error && (
        <p className="text-amber-400 text-sm mb-4">{res.error}</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
