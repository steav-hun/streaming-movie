import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { fetchSearchMulti } from '@/actions/movies.actions'
import { getSiteName } from '@/lib/site-meta'

export const revalidate = 0

export async function generateMetadata ({ params, searchParams }) {
  const { locale } = await params
  const sp = await searchParams
  const q = typeof sp?.q === 'string' ? sp.q : ''
  const t = await getTranslations({ locale, namespace: 'search' })
  const site = getSiteName()
  return {
    title: q ? `${q} — ${t('resultsTitle')} | ${site}` : `${t('resultsTitle')} | ${site}`
  }
}

export default async function SearchPage ({ params, searchParams }) {
  const { locale } = await params
  const sp = await searchParams
  const q = typeof sp?.q === 'string' ? sp.q.trim() : ''
  const page = Math.max(1, Number(sp?.page) || 1)

  const t = await getTranslations('search')
  const tNav = await getTranslations('nav')

  if (!q) {
    return (
      <div className="pt-28 min-h-screen max-w-3xl mx-auto px-4 pb-16">
        <h1 className="text-xl font-semibold mb-2">{t('resultsTitle')}</h1>
        <p className="text-zinc-400 text-sm">{t('enterQuery')}</p>
        <Link href="/" className="inline-block mt-6 text-sm text-brand-red hover:underline">
          ← {tNav('home')}
        </Link>
      </div>
    )
  }

  const res = await fetchSearchMulti(locale, q, page)
  const items = (res.results ?? []).filter(
    r => r.media_type === 'movie' || r.media_type === 'tv'
  )
  const totalPages = res.totalPages ?? 1

  return (
    <div className="pt-28 min-h-screen max-w-3xl mx-auto px-4 pb-16">
      <h1 className="text-xl font-semibold mb-2">
        {t('resultsFor', { query: q })}
      </h1>
      {res.error && (
        <p className="text-amber-400 text-sm mb-4">{res.error}</p>
      )}
      {!res.error && items.length === 0 && (
        <p className="text-zinc-400">{t('noResult')}</p>
      )}
      <ul className="mt-6 space-y-3">
        {items.map(entry => {
          const isTv = entry.media_type === 'tv'
          const title = isTv ? entry.name : entry.title
          const href = isTv ? `/tv-shows/${entry.id}` : `/movies/${entry.id}`
          const date = isTv ? entry.first_air_date : entry.release_date
          const poster = entry.poster_path
            ? `https://image.tmdb.org/t/p/w92${entry.poster_path}`
            : null
          return (
            <li key={`${entry.media_type}-${entry.id}`}>
              <Link
                href={href}
                className="flex gap-3 items-center rounded-lg border border-zinc-800 bg-zinc-900/40 p-3
                  hover:border-zinc-600 transition"
              >
                <div className="relative w-12 aspect-2/3 shrink-0 overflow-hidden rounded bg-zinc-800">
                  {poster ? (
                    <Image src={poster} alt="" fill className="object-cover" sizes="48px" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white line-clamp-1">{title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {isTv ? 'TV' : 'Movie'}
                    {date ? ` · ${date.slice(0, 4)}` : ''}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700"
            >
              ← {t('prev')}
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 text-sm">{t('prev')}</span>
          )}
          <span className="px-4 py-2 text-sm text-zinc-400">
            {t('pageOf', { page, total: totalPages })}
          </span>
          {page < totalPages ? (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700"
            >
              {t('next')} →
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-600 text-sm">{t('next')}</span>
          )}
        </nav>
      )}
    </div>
  )
}
