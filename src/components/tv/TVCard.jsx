'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Play, Plus, Star } from 'lucide-react'
import { useWatchlistStore } from '@/stores/watchlist-store'

export function TVCard ({ show }) {
  const t = useTranslations('home')
  const toggle = useWatchlistStore(s => s.toggle)
  const has = useWatchlistStore(s => s.has(show.id, 'tv'))

  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
    : null

  const rating = Number(show.vote_average)
  const ratingLabel = Number.isFinite(rating) ? rating.toFixed(1) : '—'

  return (
    <Link href={`/tv-shows/${show.id}`} className="group block">
      <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-zinc-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={show.name}
            fill
            className="object-cover transition-transform duration-300
              group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-zinc-500">
            No poster
          </div>
        )}

        <div className="absolute inset-0 bg-card-gradient opacity-0
          group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex flex-col justify-end p-3
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">

          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">
              {ratingLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span
              className="inline-flex items-center gap-1 bg-white text-black
              text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <Play size={11} className="fill-black" />
              {t('watchNow')}
            </span>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                toggle({
                  id: show.id,
                  mediaType: 'tv',
                  title: show.name,
                  posterPath: show.poster_path ?? null
                })
              }}
              className={`p-1.5 rounded-full border border-zinc-600 transition-colors
                ${has ? 'bg-brand-red text-white' : 'bg-zinc-800/80 hover:bg-zinc-700'}`}
              aria-pressed={has}
              aria-label={t('addWatchlist')}
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1
        group-hover:text-white transition-colors">
        {show.name}
      </p>
      <p className="text-xs text-zinc-500 mt-0.5">
        {show.first_air_date?.slice(0, 4)}
      </p>
    </Link>
  )
}
