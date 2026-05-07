import { getSiteUrl } from '@/lib/site-url'

export default function sitemap () {
  const baseUrl = getSiteUrl()
  const now = new Date()

  const routes = [
    '/en',
    '/en/movies',
    '/km',
    '/km/movies'
  ]

  return routes.map(pathname => ({
    url: `${baseUrl}${pathname}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: pathname === '/en' || pathname === '/km' ? 1 : 0.7
  }))
}

