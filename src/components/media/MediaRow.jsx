export function MediaRow ({ title, children }) {
  return (
    <section className="mt-12 border-t border-zinc-800 pt-8">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-ps-4 -mx-1 px-1">
        {children}
      </div>
    </section>
  )
}
