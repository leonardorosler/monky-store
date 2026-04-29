export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  category_id: string | null
  category?: Category
  price: number
  sizes: string[]
  colors: string[]
  images: string[]
  available: boolean
  created_at: string
}

export interface ProductFilters {
  category_id?: string
  available?: boolean
  search?: string
}
