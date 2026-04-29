import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'

import { Catalog } from './pages/Catalog'
import { ProductDetail } from './pages/ProductDetail'
import { Favorites } from './pages/Favorites'

import { AdminLogin } from './pages/admin/Login'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminProductList } from './pages/admin/ProductList'
import { ProductForm } from './pages/admin/ProductForm'
import { CategoryList } from './pages/admin/CategoryList'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Catalog />
            </PublicLayout>
          }
        />
        <Route
          path="/produto/:id"
          element={
            <PublicLayout>
              <ProductDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/favoritos"
          element={
            <PublicLayout>
              <Favorites />
            </PublicLayout>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/produtos" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="produtos" element={<AdminProductList />} />
          <Route path="produtos/novo" element={<ProductForm />} />
          <Route path="produtos/:id/editar" element={<ProductForm />} />
          <Route path="categorias" element={<CategoryList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
