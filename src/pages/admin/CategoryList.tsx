import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'

export function CategoryList() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    setError(null)
    try {
      await createCategory(newName.trim())
      setNewName('')
    } catch (err: any) {
      setError(err.message)
    }
    setSaving(false)
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return
    setSaving(true)
    try {
      await updateCategory(id, editingName.trim())
      setEditingId(null)
    } catch (err: any) {
      setError(err.message)
    }
    setSaving(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar categoria "${name}"? Os produtos vinculados ficarão sem categoria.`)) return
    try {
      await deleteCategory(id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  function startEditing(id: string, name: string) {
    setEditingId(id)
    setEditingName(name)
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium text-charcoal">Categorias</h1>
        <p className="font-body text-sm text-muted mt-0.5">Organize as peças do catálogo</p>
      </div>

      {/* Criar nova categoria */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nome da nova categoria"
          className="input-field flex-1"
        />
        <button type="submit" disabled={saving || !newName.trim()} className="btn-primary disabled:opacity-60">
          Criar
        </button>
      </form>

      {error && (
        <p className="font-body text-sm text-red-600 mb-4">{error}</p>
      )}

      {loading && (
        <p className="font-display text-xl text-muted animate-pulse">Carregando...</p>
      )}

      {/* Lista */}
      {!loading && categories.length === 0 && (
        <p className="font-body text-sm text-muted">Nenhuma categoria ainda. Crie a primeira acima.</p>
      )}

      <div className="space-y-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center gap-3 border border-border px-4 py-3 bg-white"
          >
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  className="input-field flex-1"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleUpdate(cat.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  disabled={saving}
                  className="font-body text-xs text-green-700 border border-green-300 px-3 py-1.5 hover:bg-green-50 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="font-body text-xs text-muted border border-border px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <span className="font-body text-sm text-charcoal flex-1">{cat.name}</span>
                <button
                  onClick={() => startEditing(cat.id, cat.name)}
                  className="font-body text-xs text-charcoal border border-border px-3 py-1.5 hover:border-charcoal transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="font-body text-xs text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Deletar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
