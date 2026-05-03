import { getTranslations } from 'next-intl/server'

export default async function Footer () {
  const t = await getTranslations('footer')

  return (
    <footer className="border-t border-zinc-800 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} MovieStream. {t('rights')}</p>
      </div>
    </footer>
  )
}
