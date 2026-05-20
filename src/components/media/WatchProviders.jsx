import Image from 'next/image'

const LOGO = 'https://image.tmdb.org/t/p/w45'

function ProviderList ({ providers }) {
  if (!providers?.length) return null
  return (
    <ul className="flex flex-wrap gap-2">
      {providers.map(p => (
        <li
          key={`${p.provider_id}-${p.provider_name}`}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-zinc-200"
        >
          {p.logo_path ? (
            <Image
              src={`${LOGO}${p.logo_path}`}
              alt=""
              width={24}
              height={24}
              className="rounded"
            />
          ) : null}
          <span>{p.provider_name}</span>
        </li>
      ))}
    </ul>
  )
}

export function WatchProviders ({ data, region, tDetail }) {
  const regionPack = data?.results?.[region]

  if (!regionPack) {
    return (
      <section className="mt-12 border-t border-zinc-800 pt-8">
        <h2 className="text-lg font-semibold text-white mb-3">{tDetail('whereToWatch')}</h2>
        <p className="text-sm text-zinc-500">{tDetail('noProviders')}</p>
      </section>
    )
  }

  const streaming = regionPack.flatrate ?? []
  const rent = regionPack.rent ?? []
  const buy = regionPack.buy ?? []

  if (streaming.length === 0 && rent.length === 0 && buy.length === 0) {
    return (
      <section className="mt-12 border-t border-zinc-800 pt-8">
        <h2 className="text-lg font-semibold text-white mb-3">{tDetail('whereToWatch')}</h2>
        <p className="text-sm text-zinc-500">{tDetail('noProviders')}</p>
      </section>
    )
  }

  return (
    <section className="mt-12 border-t border-zinc-800 pt-8">
      <h2 className="text-lg font-semibold text-white mb-4">{tDetail('whereToWatch')}</h2>
      <div className="space-y-4">
        {streaming.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              {tDetail('streaming')}
            </h3>
            <ProviderList providers={streaming} />
          </div>
        )}
        {rent.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              {tDetail('rent')}
            </h3>
            <ProviderList providers={rent} />
          </div>
        )}
        {buy.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
              {tDetail('buy')}
            </h3>
            <ProviderList providers={buy} />
          </div>
        )}
      </div>
    </section>
  )
}
