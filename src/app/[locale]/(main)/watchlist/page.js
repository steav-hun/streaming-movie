import { getTranslations } from 'next-intl/server'
import { WatchlistView } from '@/components/watchlist/WatchlistView'
import { getSiteName } from '@/lib/site-meta'

export async function generateMetadata ({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'watchlistPage' })
  return { title: `${t('title')} — ${getSiteName()}` }
}

export default function WatchlistPage () {
  return <WatchlistView />
}
