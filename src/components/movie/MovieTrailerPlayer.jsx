'use client'

import { useTranslations } from 'next-intl'

function youtubeVideoIdFromUrl (url) {
  if (!url || typeof url !== 'string') return null
  const t = url.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(t)) return t
  try {
    const u = new URL(t)
    const host = u.hostname.toLowerCase()
    if (host === 'youtu.be') {
      return u.pathname.replace(/^\//, '').split('/')[0] ?? null
    }
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const embed = u.pathname.match(/\/embed\/([^/?]+)/)
      return embed ? embed[1] : null
    }
  } catch {
    return null
  }
  return null
}

function vimeoIdFromUrl (url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url.trim())
    if (!u.hostname.toLowerCase().includes('vimeo.com')) return null
    const parts = u.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    return id && /^\d+$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function MovieTrailerPlayer ({ videoUrl }) {
  const t = useTranslations('movie')

  const ytId = videoUrl ? youtubeVideoIdFromUrl(videoUrl) : null
  const vimeoId =
    videoUrl && !ytId ? vimeoIdFromUrl(videoUrl) : null

  if (!videoUrl) {
    return (
      <p className="text-zinc-500 text-sm">{t('noTrailer')}</p>
    )
  }

  if (ytId) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">{t('trailerHeading')}</h2>
        <div className="relative w-full overflow-hidden rounded-xl bg-black pb-[56.25%] shadow-xl ring-1 ring-zinc-800">
          <iframe
            title={t('trailerHeading')}
            src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="text-xs text-zinc-500">{t('trailerNote')}</p>
      </div>
    )
  }

  if (vimeoId) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">{t('trailerHeading')}</h2>
        <div className="relative w-full overflow-hidden rounded-xl bg-black pb-[56.25%] shadow-xl ring-1 ring-zinc-800">
          <iframe
            title={t('trailerHeading')}
            src={`https://player.vimeo.com/video/${vimeoId}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="text-xs text-zinc-500">{t('trailerNote')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-zinc-500 text-sm">{t('noTrailer')}</p>
      <p className="text-xs text-zinc-600">{t('unsupportedVideo')}</p>
    </div>
  )
}
