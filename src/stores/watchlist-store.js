import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle (item) {
        const { id, mediaType, title, posterPath } = item
        const exists = get().items.some(
          i => i.id === id && i.mediaType === mediaType
        )
        if (exists) {
          set({
            items: get().items.filter(
              i => !(i.id === id && i.mediaType === mediaType)
            )
          })
          return false
        }
        set({
          items: [
            ...get().items,
            {
              id,
              mediaType,
              title: title ?? '',
              posterPath: posterPath ?? null,
              addedAt: Date.now()
            }
          ]
        })
        return true
      },

      remove (id, mediaType) {
        set({
          items: get().items.filter(
            i => !(i.id === id && i.mediaType === mediaType)
          )
        })
      },

      has (id, mediaType) {
        return get().items.some(
          i => i.id === id && i.mediaType === mediaType
        )
      }
    }),
    { name: 'merlmovie24-watchlist-v1' }
  )
)
