import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, Settings, Home, LogOut } from 'lucide-react'
import { useSeller } from '../context/SellerContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/listings/new', label: 'Create Listing', icon: Plus },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { currentUser } = useSeller()
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-navy-800">
          <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Seller Portal</p>
          <p className="font-semibold text-white">{currentUser?.name || 'Guest'}</p>
          <p className="text-sm text-navy-400">{currentUser?.email || 'Not signed in'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-navy-700 text-white' : 'text-navy-300 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-navy-800 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white transition-colors w-full"
          >
            <Home size={18} />
            Back to Site
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
