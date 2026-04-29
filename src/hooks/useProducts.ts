import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Product, ProductFilters } from '../types'

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [filters?.category_id, filters?.search, filters?.available])

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('products')
        .select('*, category:categories(id, name)')
        .order('created_at', { ascending: false })

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available)
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchProduct() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(id, name)')
        .eq('id', id)
        .single()

      if (error) setError(error.message)
      else setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  return { product, loading, error }
}
