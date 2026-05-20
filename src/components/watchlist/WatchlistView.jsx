'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useWatchlistStore } from '@/stores/watchlist-store'

export function WatchlistView () {
  const t = useTranslations('watchlistPage')
  const items = useWatchlistStore(s => s.items)
  const remove = useWatchlistStore(s => s.remove)

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>
        <p className="text-zinc-400">{t('empty')}</p>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen max-w-4xl mx-auto px-4 pb-16">
      <h1 className="text-2xl font-semibold mb-8">{t('title')}</h1>
      <ul className="space-y-4">
        {items.map(item => {
          const href =
            item.mediaType === 'tv'
              ? `/tv-shows/${item.id}`
              : `/movies/${item.id}`
          const poster = item.posterPath
            ? `https://image.tmdb.org/t/p/w185${item.posterPath}`
            : null
          return (
            <li
              key={`${item.mediaType}:${item.id}`}
              className="flex gap-4 items-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-3"
            >
              <Link href={href} className="shrink-0">
                <div className="relative w-16 aspect-2/3 rounded overflow-hidden bg-zinc-800">
                  {poster ? (
                    <Image src={poster} alt="" fill className="object-cover" sizes="64px" />
                  ) : null}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={href} className="font-medium text-white hover:underline line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-xs text-zinc-500 mt-0.5 uppercase">{item.mediaType}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id, item.mediaType)}
                className="text-sm text-zinc-400 hover:text-red-400 shrink-0"
              >
                {t('remove')}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
