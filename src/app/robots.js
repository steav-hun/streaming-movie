import { getSiteUrl } from '@/lib/site-url'

export default function robots () {
  const baseUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}

