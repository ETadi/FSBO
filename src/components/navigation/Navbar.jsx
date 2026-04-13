import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, Menu, X, ChevronDown, User, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useSeller } from '../../context/SellerContext.jsx'
import AuthModal from '../auth/AuthModal.jsx'

const navLinks = [
  { to: '/listings', label: 'Browse Homes' },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const { currentUser, signOut } = useSeller()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState({ open: false, tab: 'signin' })
  const [userDropdown, setUserDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openSignIn() {
    setAuthModal({ open: true, tab: 'signin' })
    setMenuOpen(false)
  }

  function openSignUp() {
    setAuthModal({ open: true, tab: 'signup' })
    setMenuOpen(false)
  }

  function handleSignOut() {
    signOut()
    setUserDropdown(false)
    navigate('/')
  }

  // User avatar initials
  const initials = currentUser
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <>
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

              {currentUser ? (
                /* ── Logged-in user avatar + dropdown ── */
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-navy-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={15} className="text-gray-400" />
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/dashboard/listings/new"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <PlusCircle size={15} className="text-gray-400" />
                        List a Home
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Logged-out sign in / CTA ── */
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={openSignIn}
                    className="px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignUp}
                    className="px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors"
                  >
                    List Your Home
                  </button>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-navy-800"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 pt-2 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-9 h-9 bg-navy-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg text-center"
                  >
                    Seller Dashboard
                  </Link>
                  <Link
                    to="/dashboard/listings/new"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg text-center"
                  >
                    List a Home
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false) }}
                    className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openSignIn}
                    className="px-4 py-2 border border-navy-200 text-navy-800 text-sm font-medium rounded-lg text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignUp}
                    className="px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg text-center"
                  >
                    List Your Home — Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        defaultTab={authModal.tab}
        onClose={() => setAuthModal({ ...authModal, open: false })}
      />
    </>
  )
}
