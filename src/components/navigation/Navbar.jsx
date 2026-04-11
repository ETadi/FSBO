import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'

const navLinks = [
  { to: '/listings', label: 'Browse Homes' },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-navy-900 text-xl">
            <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            <span>FSBO<span className="text-accent-500">Market</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-navy-800' : 'text-gray-600 hover:text-navy-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-navy-800 transition-colors">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-900 transition-colors"
            >
              Seller Portal
            </Link>

            <button
              onClick={() => navigate('/listings')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors"
            >
              List Your Home
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-navy-800"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg text-center"
            >
              Seller Portal
            </Link>
            <Link
              to="/listings"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg text-center"
            >
              List Your Home
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
