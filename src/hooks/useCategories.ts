import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Category } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    setCategories(data ?? [])
    setLoading(false)
  }

  async function createCategory(name: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single()

    if (error) throw error
    setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  async function updateCategory(id: string, name: string) {
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)

    if (error) throw error
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, loading, createCategory, updateCategory, deleteCategory, refetch: fetchCategories }
}
