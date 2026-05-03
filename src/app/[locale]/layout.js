import { Inter, Battambang } from 'next/font/google'
import { setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { HtmlLang } from '@/components/layout/HtmlLang'

const inter = Inter({ subsets: ['latin'] })
const battambang = Battambang({
  subsets: ['khmer'],
  weight: ['400', '700'],
  variable: '--font-khmer'
})

export const metadata = {
  title: 'MovieStream',
  description: 'Watch movies online'
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