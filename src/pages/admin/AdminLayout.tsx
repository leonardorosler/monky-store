import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-charcoal text-ivory flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="font-display text-xl font-medium text-ivory hover:text-accent transition-colors">
            Atacado
          </Link>
          <p className="font-body text-xs text-white/40 mt-0.5">Painel Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink
            to="/admin/produtos"
            active={isActive('/admin/produtos')}
          >
            Produtos
          </SidebarLink>
          <SidebarLink
            to="/admin/categorias"
            active={isActive('/admin/categorias')}
          >
            Categorias
          </SidebarLink>
          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              to="/"
              className="block font-body text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-2"
            >
              ← Ver catálogo
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="font-body text-sm text-white/50 hover:text-white/80 transition-colors w-full text-left px-3 py-2"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 bg-ivory overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

function SidebarLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`block font-body text-sm px-3 py-2 transition-colors duration-200 ${
        active
          ? 'bg-accent text-ivory'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  )
}
