import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useFavorites } from '../hooks/useFavorites'
import { ProductCard } from '../components/ProductCard'
import { Product } from '../types'

export function Favorites() {
  const { favorites } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(id, name)')
        .in('id', favorites)

      setProducts(data ?? [])
      setLoading(false)
    }

    fetchFavorites()
  }, [favorites])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-medium text-charcoal mb-2">
          Favoritos
        </h1>
        <p className="font-body text-muted text-sm">
          Peças que você salvou para consultar depois
        </p>
      </div>

      {loading && (
        <div className="py-20 text-center">
          <span className="font-display text-3xl text-muted animate-pulse">Carregando...</span>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center gap-6">
          <span className="font-display text-6xl text-gray-200">♡</span>
          <p className="font-display text-2xl text-muted">Nenhuma peça favoritada ainda</p>
          <Link to="/" className="btn-primary">Ver catálogo</Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <p className="font-body text-xs text-muted mb-6 tracking-widest uppercase">
            {products.length} {products.length === 1 ? 'peça salva' : 'peças salvas'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
