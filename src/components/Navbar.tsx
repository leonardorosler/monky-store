import { Link, useLocation } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export function Navbar() {
  const { favorites } = useFavorites()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-charcoal">
            Atacado
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-body text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive('/') ? 'text-accent' : 'text-charcoal hover:text-accent'
              }`}
            >
              Catálogo
            </Link>

            <Link
              to="/favoritos"
              className={`relative font-body text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive('/favoritos') ? 'text-accent' : 'text-charcoal hover:text-accent'
              }`}
            >
              Favoritos
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-accent text-ivory text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
