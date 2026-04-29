import { useState, useEffect } from 'react'

const STORAGE_KEY = 'catalogo_favoritos'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function toggleFavorite(productId: string) {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  function isFavorite(productId: string) {
    return favorites.includes(productId)
  }

  return { favorites, toggleFavorite, isFavorite }
}
