import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <span>FSBO<span className="text-accent-500">Market</span></span>
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed">
              Sell your home on your terms. Keep your commission. Get the services you actually need.
            </p>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">For Sellers</h4>
            <ul className="space-y-2">
              {[
                { to: '/dashboard', label: 'List Your Home' },
                { to: '/services', label: 'Browse Services' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/how-it-works', label: 'How It Works' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-navy-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyers */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">For Buyers</h4>
            <ul className="space-y-2">
              {[
                { to: '/listings', label: 'Search Homes' },
                { to: '/how-it-works', label: 'How Buying Works' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-navy-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((label) => (
                <li key={label}>
                  <span className="text-navy-400 text-sm cursor-default">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm">© 2025 FSBOMarket, Inc. All rights reserved.</p>
          <p className="text-navy-500 text-xs">
            FSBOMarket is not a licensed real estate broker. Service providers on our platform are independent companies.
          </p>
        </div>
      </div>
    </footer>
  )
}
