import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'km'],
  defaultLocale: 'en',
  /** Required so EN and KM both use a URL prefix; language switcher can swap `/en/...` ↔ `/km/...` */
  localePrefix: 'always'
})
