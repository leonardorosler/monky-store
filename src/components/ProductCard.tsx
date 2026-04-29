import { Link } from 'react-router-dom'
import { Product } from '../types'
import { useFavorites } from '../hooks/useFavorites'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(product.id)

  const mainImage = product.images?.[0] ?? null
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price)

  return (
    <div className="group relative flex flex-col">
      {/* Imagem */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-gray-300">✦</span>
          </div>
        )}

        {/* Badge indisponível */}
        {!product.available && (
          <div className="absolute inset-0 bg-ivory/70 flex items-center justify-center">
            <span className="tag bg-charcoal text-ivory">Esgotado</span>
          </div>
        )}

        {/* Botão favoritar */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(product.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-ivory/90 hover:bg-ivory transition-colors duration-200 shadow-sm"
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        {product.category && (
          <span className="text-xs font-body text-muted uppercase tracking-widest">
            {product.category.name}
          </span>
        )}

        <Link
          to={`/produto/${product.id}`}
          className="font-display text-lg font-medium text-charcoal leading-tight hover:text-accent transition-colors duration-200"
        >
          {product.name}
        </Link>

        <span className="font-body text-base font-semibold text-charcoal">
          {formattedPrice}
        </span>

        {/* Tamanhos */}
        {product.sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {product.sizes.map(size => (
              <span key={size} className="text-[11px] font-body text-muted border border-border px-1.5 py-0.5">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? '#B5883A' : 'none'}
      stroke={filled ? '#B5883A' : '#1A1A1A'}
      strokeWidth="1.5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
