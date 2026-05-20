'use client'

import { useTranslations } from 'next-intl'
import { useWatchlistStore } from '@/stores/watchlist-store'

export function DetailWatchlistRow ({ id, mediaType, title, posterPath }) {
  const t = useTranslations('home')
  const has = useWatchlistStore(s => s.has(id, mediaType))
  const toggle = useWatchlistStore(s => s.toggle)

  return (
    <button
      type="button"
      onClick={() =>
        toggle({ id, mediaType, title, posterPath })}
      className={`inline-flex items-center gap-2 font-medium px-6 py-3 rounded-lg border transition
        ${has
          ? 'bg-brand-red/20 border-brand-red text-white'
          : 'bg-zinc-700/60 border-zinc-600 hover:bg-zinc-700'
        }`}
    >
      {has ? t('savedWatchlist') : `+ ${t('addWatchlist')}`}
    </button>
  )
}
