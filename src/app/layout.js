import './globals.css'

import { getSiteUrl } from '@/lib/site-url'

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'MerlMovie24',
    template: '%s | MerlMovie24'
  },
  description: 'Watch movies online',
  applicationName: 'MerlMovie24',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'MerlMovie24',
    description: 'Watch movies online',
    type: 'website',
    siteName: 'MerlMovie24'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MerlMovie24',
    description: 'Watch movies online'
  }
}

export default function RootLayout ({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
