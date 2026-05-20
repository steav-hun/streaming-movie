const DEFAULT_SITE_NAME = 'MerlMovie24'

export function getSiteName () {
  return (
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() ||
    DEFAULT_SITE_NAME
  )
}

export function getWatchRegion () {
  return process.env.WATCH_REGION?.trim() || 'US'
}
