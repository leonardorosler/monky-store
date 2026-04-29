import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useCategories } from '../../hooks/useCategories'
import { ImageUpload } from '../../components/ImageUpload'
import { Product } from '../../types'

const EMPTY_FORM = {
  name: '',
  description: '',
  category_id: '',
  price: '',
  sizes: '',
  colors: '',
  images: [] as string[],
  available: true,
}

export function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { categories } = useCategories()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)

  // Carregar produto para edição
  useEffect(() => {
    if (!id) return

    async function loadProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Produto não encontrado.')
        setFetchingProduct(false)
        return
      }

      const p = data as Product
      setForm({
        name: p.name,
        description: p.description ?? '',
        category_id: p.category_id ?? '',
        price: String(p.price),
        sizes: p.sizes.join(', '),
        colors: p.colors.join(', '),
        images: p.images,
        available: p.available,
      })
      setFetchingProduct(false)
    }

    loadProduct()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Normalizar arrays
    const sizes = form.sizes
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean)

    const colors = form.colors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      price: parseFloat(form.price) || 0,
      sizes,
      colors,
      images: form.images,
      available: form.available,
    }

    let error

    if (isEditing) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    navigate('/admin/produtos')
  }

  if (fetchingProduct) {
    return (
      <div className="p-8">
        <span className="font-display text-2xl text-muted animate-pulse">Carregando produto...</span>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium text-charcoal">
          {isEditing ? 'Editar produto' : 'Novo produto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
            Nome da peça *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Ex: Blusa floral manga curta"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
            Descrição
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Detalhes do produto, tecido, estilo..."
          />
        </div>

        {/* Categoria e Preço na mesma linha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
              Categoria
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Sem categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
              Preço (R$) *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="29.90"
            />
          </div>
        </div>

        {/* Tamanhos */}
        <div>
          <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
            Tamanhos (separados por vírgula)
          </label>
          <input
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            className="input-field"
            placeholder="P, M, G, GG"
          />
        </div>

        {/* Cores */}
        <div>
          <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
            Cores disponíveis (separadas por vírgula)
          </label>
          <input
            name="colors"
            value={form.colors}
            onChange={handleChange}
            className="input-field"
            placeholder="Preto, Branco, Azul marinho"
          />
        </div>

        {/* Imagens */}
        <div>
          <label className="font-body text-xs text-muted uppercase tracking-widest block mb-1.5">
            Imagens
          </label>
          <ImageUpload
            images={form.images}
            onChange={(images) => setForm(prev => ({ ...prev, images }))}
          />
        </div>

        {/* Disponível */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="w-4 h-4 accent-charcoal"
          />
          <label htmlFor="available" className="font-body text-sm text-charcoal">
            Disponível no catálogo
          </label>
        </div>

        {error && (
          <p className="font-body text-sm text-red-600">{error}</p>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
            {loading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/produtos')}
            className="btn-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
