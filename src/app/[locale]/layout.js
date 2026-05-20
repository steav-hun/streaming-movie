import { Inter, Battambang } from 'next/font/google'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { HtmlLang } from '@/components/layout/HtmlLang'
import { getSiteUrl } from '@/lib/site-url'
import { getSiteName } from '@/lib/site-meta'

const inter = Inter({ subsets: ['latin'] })
const battambang = Battambang({
  subsets: ['khmer'],
  weight: ['400', '700'],
  variable: '--font-khmer'
})

export async function generateMetadata ({ params }) {
  const { locale } = await params
  const siteName = getSiteName()
  const description = 'Watch trailers and discover movies & TV — browse by genre, build a watchlist, and see where to stream.'
  const baseUrl = new URL(getSiteUrl())

  return {
    metadataBase: baseUrl,
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        km: '/km'
      }
    },
    openGraph: {
      title: siteName,
      description,
      type: 'website',
      siteName,
      locale
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description
    }
  }
}

export function generateStaticParams () {
  return [{ locale: 'en' }, { locale: 'km' }]
}

export default async function LocaleLayout ({ children, params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  const fontClass = locale === 'km' ? battambang.className : inter.className

  return (
    <div
      className={`${fontClass} bg-zinc-950 text-white min-h-screen flex flex-col`}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <HtmlLang />
        <Navbar />
        <main className="flex-1">{children}</main>
      </NextIntlClientProvider>
      <Footer />
    </div>
  )
}