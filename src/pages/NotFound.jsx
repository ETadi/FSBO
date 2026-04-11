import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-bold text-navy-100 mb-4">404</p>
      <h1 className="text-2xl font-bold text-navy-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or may have been moved.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 text-white font-medium rounded-xl hover:bg-navy-900 transition-colors">
          <Home size={16} /> Go Home
        </Link>
        <Link to="/listings" className="inline-flex items-center gap-2 px-5 py-2.5 border border-navy-700 text-navy-700 font-medium rounded-xl hover:bg-navy-50 transition-colors">
          <Search size={16} /> Browse Listings
        </Link>
      </div>
    </div>
  )
}
