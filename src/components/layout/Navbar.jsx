'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Search, Menu, X, Bell, User } from 'lucide-react'
import { getSiteName } from '@/lib/site-meta'

const navLinks = [
  { key: 'home', href: '/', isActive: p => p === '/' },
  {
    key: 'movies',
    href: '/movies',
    isActive: p => p === '/movies' || p.startsWith('/movies/')
  },
  { key: 'tvShows', href: '/tv-shows', isActive: p => p.startsWith('/tv-shows') }
]

export default function Navbar () {
  const siteName = getSiteName()
  const t = useTranslations('nav')
  const tSearch = useTranslations('search')
  const pathname = usePathname()
  const locale = useLocale()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  function switchLocale (newLocale) {
    if (newLocale === locale) return
    const path = pathname ?? '/'
    const suffix = typeof window !== 'undefined'
      ? `${window.location.search}${window.location.hash}`
      : ''
    router.replace(`${path}${suffix}`, { locale: newLocale })
  }

  function submitSearch (e) {
    e.preventDefault()
    const raw = searchInputRef.current?.value?.trim() ?? ''
    if (!raw) return
    setSearchOpen(false)
    setMenuOpen(false)
    router.push(`/search?q=${encodeURIComponent(raw)}`)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b
      from-black/90 to-transparent backdrop-blur-sm">

      <div className="w-full h-10 bg-zinc-900/50 border-b border-zinc-800
        flex items-center justify-center">
        <span className="text-xs text-zinc-500 border border-dashed
          border-zinc-700 px-4 py-0.5 rounded">
          📢 Advertisement — 728x90
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="text-brand-red font-bold text-2xl
          tracking-tight shrink-0">
          {siteName}
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <li key={link.key}>
              <Link
                href={link.href}
                className={`text-sm transition-colors hover:text-white
                  ${link.isActive(pathname) ? 'text-white font-medium' : 'text-zinc-400'}`}
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/movies/browse"
              className={`text-sm transition-colors hover:text-white
                ${pathname?.startsWith('/movies/browse')
                  ? 'text-white font-medium'
                  : 'text-zinc-400'}`}
            >
              {t('browse')}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3 ml-auto">

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-expanded={searchOpen}
            aria-label={t('search')}
          >
            <Search size={18} />
          </button>

          <div className="flex items-center gap-1 border border-zinc-700
            rounded-full px-2 py-1 text-xs">
            <button
              type="button"
              onClick={() => switchLocale('en')}
              className={`px-2 py-0.5 rounded-full transition-colors
                ${locale === 'en'
                  ? 'bg-white text-black font-medium'
                  : 'text-zinc-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLocale('km')}
              className={`px-2 py-0.5 rounded-full transition-colors
                ${locale === 'km'
                  ? 'bg-white text-black font-medium'
                  : 'text-zinc-400 hover:text-white'}`}
            >
              ខ្មែរ
            </button>
          </div>

          <Link
            href="/watchlist"
            className="hidden md:inline text-sm text-zinc-400 hover:text-white"
          >
            {t('watchlist')}
          </Link>

          <button type="button" className="hidden md:block p-2 text-zinc-400 hover:text-white">
            <Bell size={18} />
          </button>

          <button type="button" className="p-1.5 bg-brand-red rounded-full text-white">
            <User size={16} />
          </button>

          <button
            type="button"
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-zinc-800 px-4 py-3 bg-black/95">
          <form
            onSubmit={submitSearch}
            className="max-w-xl mx-auto flex items-center gap-2
              bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2"
          >
            <Search size={16} className="text-zinc-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              placeholder={tSearch('placeholder')}
              className="flex-1 bg-transparent text-sm text-white
                placeholder:text-zinc-500 outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-xs font-medium text-white bg-zinc-700 px-3 py-1 rounded-md
                hover:bg-zinc-600"
            >
              {t('search')}
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 px-4 py-4">
          <ul className="space-y-3">
            {navLinks.map(link => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-zinc-300 hover:text-white py-1"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/movies/browse"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-zinc-300 hover:text-white py-1"
              >
                {t('browse')}
              </Link>
            </li>
            <li>
              <Link
                href="/watchlist"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-zinc-300 hover:text-white py-1"
              >
                {t('watchlist')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
