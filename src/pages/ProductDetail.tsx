import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useFavorites } from '../hooks/useFavorites'

const WHATSAPP_NUMBER = '5553999882722'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProduct(id ?? '')
  const { isFavorite, toggleFavorite } = useFavorites()
  const [selectedImage, setSelectedImage] = useState(0)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="font-display text-3xl text-muted animate-pulse">Carregando...</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-display text-3xl text-muted">Peça não encontrada</p>
        <Link to="/" className="btn-outline">Voltar ao catálogo</Link>
      </div>
    )
  }

  const favorited = isFavorite(product.id)
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price)

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse na peça: *${product.name}*`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-muted mb-8">
        <Link to="/" className="hover:text-charcoal transition-colors">Catálogo</Link>
        <span>/</span>
        {product.category && (
          <>
            <span>{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Galeria de imagens */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex flex-col gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-20 border-2 overflow-hidden flex-shrink-0 transition-colors duration-200 ${
                    i === selectedImage ? 'border-charcoal' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Imagem principal */}
          <div className="flex-1 aspect-[3/4] bg-gray-100 overflow-hidden">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-6xl text-gray-300">✦</span>
              </div>
            )}
          </div>
        </div>

        {/* Dados do produto */}
        <div className="flex flex-col">
          {product.category && (
            <span className="font-body text-xs text-muted uppercase tracking-widest mb-2">
              {product.category.name}
            </span>
          )}

          <h1 className="font-display text-4xl font-medium text-charcoal leading-tight mb-2">
            {product.name}
          </h1>

          <p className="font-body text-2xl font-semibold text-charcoal mb-6">
            {formattedPrice}
          </p>

          {!product.available && (
            <div className="inline-block tag bg-gray-100 text-muted mb-6">
              Esgotado no momento
            </div>
          )}

          {product.description && (
            <p className="font-body text-sm text-muted leading-relaxed mb-6 border-t border-border pt-6">
              {product.description}
            </p>
          )}

          {/* Tamanhos */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <p className="font-body text-xs text-muted uppercase tracking-widest mb-2">Tamanhos</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <span key={size} className="font-body text-sm border border-border px-3 py-1.5 text-charcoal">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cores */}
          {product.colors.length > 0 && (
            <div className="mb-8">
              <p className="font-body text-xs text-muted uppercase tracking-widest mb-2">Cores disponíveis</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <span key={color} className="font-body text-sm text-muted border border-border px-3 py-1.5">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex gap-3 mt-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
            >
              <WhatsAppIcon />
              Solicitar via WhatsApp
            </a>

            <button
              onClick={() => toggleFavorite(product.id)}
              className={`btn-outline flex items-center gap-2 ${favorited ? 'border-accent text-accent' : ''}`}
            >
              <HeartIcon filled={favorited} />
              {favorited ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>

          <p className="font-body text-xs text-muted mt-4">
            * Preço para atacado. Mínimo por grade sob consulta.
          </p>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
