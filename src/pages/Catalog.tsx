import { useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'

export function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { categories } = useCategories()
  const { products, loading, error } = useProducts({
    category_id: selectedCategory,
    search: search || undefined,
    available: undefined, // mostra todos, inclusive esgotados
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header da página */}
      <div className="mb-10">
        <h1 className="font-display text-5xl font-medium text-charcoal mb-2">
          Coleção
        </h1>
        <p className="font-body text-muted text-sm">
          Peças selecionadas para o seu negócio — atacado para lojistas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={(id) => {
            setSelectedCategory(id)
          }}
        />

        <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Buscar peça..."
            className="input-field w-52"
          />
          <button type="submit" className="btn-primary">
            Buscar
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput('') }}
              className="btn-outline"
            >
              Limpar
            </button>
          )}
        </form>
      </div>

      {/* Resultados */}
      {loading && (
        <div className="py-20 text-center">
          <span className="font-display text-3xl text-muted animate-pulse">Carregando...</span>
        </div>
      )}

      {error && (
        <div className="py-10 text-center text-red-600 font-body text-sm">
          Erro ao carregar produtos: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-display text-3xl text-muted">Nenhuma peça encontrada</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <p className="font-body text-xs text-muted mb-6 tracking-widest uppercase">
            {products.length} {products.length === 1 ? 'peça' : 'peças'}
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
