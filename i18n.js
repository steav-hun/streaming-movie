import { getRequestConfig } from 'next-intl/server'
import { routing } from './src/i18n/routing.js'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  }
})