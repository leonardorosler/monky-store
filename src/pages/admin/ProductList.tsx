import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useProducts } from '../../hooks/useProducts'

export function AdminProductList() {
  const { products, loading, error, refetch } = useProducts()

  async function toggleAvailable(id: string, current: boolean) {
    await supabase.from('products').update({ available: !current }).eq('id', id)
    refetch()
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Deletar "${name}"? Essa ação não pode ser desfeita.`)) return
    await supabase.from('products').delete().eq('id', id)
    refetch()
  }

  const formattedPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-medium text-charcoal">Produtos</h1>
          <p className="font-body text-sm text-muted mt-0.5">Gerencie as peças do catálogo</p>
        </div>
        <Link to="/admin/produtos/novo" className="btn-primary">
          + Novo produto
        </Link>
      </div>

      {loading && (
        <div className="py-20 text-center">
          <span className="font-display text-2xl text-muted animate-pulse">Carregando...</span>
        </div>
      )}

      {error && (
        <p className="text-red-600 font-body text-sm">Erro: {error}</p>
      )}

      {!loading && products.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-muted">Nenhum produto cadastrado ainda</p>
          <Link to="/admin/produtos/novo" className="btn-primary mt-6 inline-block">
            Cadastrar primeiro produto
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="border border-border">
          {/* Header */}
          <div className="grid grid-cols-[80px_1fr_140px_100px_100px_120px] gap-4 px-5 py-3 bg-gray-50 border-b border-border font-body text-xs text-muted uppercase tracking-widest">
            <span>Foto</span>
            <span>Produto</span>
            <span>Categoria</span>
            <span>Preço</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          {products.map(product => (
            <div
              key={product.id}
              className="grid grid-cols-[80px_1fr_140px_100px_100px_120px] gap-4 px-5 py-4 border-b border-border last:border-0 items-center hover:bg-gray-50/50 transition-colors"
            >
              {/* Imagem */}
              <div className="w-14 h-14 bg-gray-100 overflow-hidden flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">✦</div>
                )}
              </div>

              {/* Nome */}
              <div>
                <p className="font-body text-sm font-medium text-charcoal">{product.name}</p>
                {product.description && (
                  <p className="font-body text-xs text-muted mt-0.5 line-clamp-1">{product.description}</p>
                )}
              </div>

              {/* Categoria */}
              <span className="font-body text-sm text-muted">
                {product.category?.name ?? '—'}
              </span>

              {/* Preço */}
              <span className="font-body text-sm font-medium text-charcoal">
                {formattedPrice(product.price)}
              </span>

              {/* Status */}
              <button
                onClick={() => toggleAvailable(product.id, product.available)}
                className={`font-body text-xs px-3 py-1 border transition-colors duration-200 text-center ${
                  product.available
                    ? 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100'
                    : 'border-gray-300 text-muted bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {product.available ? 'Disponível' : 'Esgotado'}
              </button>

              {/* Ações */}
              <div className="flex gap-2">
                <Link
                  to={`/admin/produtos/${product.id}/editar`}
                  className="font-body text-xs text-charcoal border border-border px-3 py-1.5 hover:border-charcoal transition-colors"
                >
                  Editar
                </Link>
                <button
                  onClick={() => deleteProduct(product.id, product.name)}
                  className="font-body text-xs text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Del.
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
