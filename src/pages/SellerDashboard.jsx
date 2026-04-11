import { Link } from 'react-router-dom'
import { Plus, Eye, MessageSquare, Heart, TrendingUp, Home, Edit, ArrowRight } from 'lucide-react'
import { useSeller } from '../context/SellerContext.jsx'
import { formatPrice, formatDate } from '../utils/formatters.js'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-navy-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function SellerDashboard() {
  const { seller, myListings } = useSeller()
  const totalViews = myListings.reduce((s, l) => s + (l.stats?.views || 0), 0)
  const totalInquiries = myListings.reduce((s, l) => s + (l.stats?.inquiries || 0), 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Welcome back, {seller.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your listings and activity.</p>
        </div>
        <Link
          to="/dashboard/listings/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Plus size={18} /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Home} label="Total Listings" value={myListings.length} sub="All time" color="bg-navy-700" />
        <StatCard icon={TrendingUp} label="Active Listings" value={myListings.filter((l) => l.status === 'active').length} sub="Currently live" color="bg-green-500" />
        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} sub="This month" color="bg-blue-500" />
        <StatCard icon={MessageSquare} label="Inquiries" value={totalInquiries} sub="Total received" color="bg-purple-500" />
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy-900">My Listings</h2>
          <Link to="/listings" className="text-sm text-navy-700 hover:text-navy-900 flex items-center gap-1">
            View on site <ArrowRight size={14} />
          </Link>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-16">
            <Home size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-2">No listings yet</p>
            <Link to="/dashboard/listings/new" className="text-navy-700 hover:text-navy-900 text-sm font-medium">
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Property</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Views</th>
                  <th className="px-6 py-3 text-right">Inquiries</th>
                  <th className="px-6 py-3 text-right">Days Active</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                          <img
                            src={listing.photos?.[0]?.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-xs leading-tight">{listing.address.street}</p>
                          <p className="text-gray-400 text-xs">{listing.address.city}, {listing.address.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-navy-900">{formatPrice(listing.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'active' ? 'bg-green-100 text-green-700'
                        : listing.status === 'draft' ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">{listing.stats?.views?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{listing.stats?.inquiries || 0}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{listing.stats?.daysOnMarket || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/listings/${listing.id}`} className="text-xs text-navy-700 hover:text-navy-900 font-medium">View</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/dashboard/listings/${listing.id}/edit`} className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
                          <Edit size={12} /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upsell services */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-1">Boost Your Listing Performance</h3>
        <p className="text-navy-300 text-sm mb-4">Add professional services to sell faster and for more money.</p>
        <Link to="/services" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl text-sm transition-colors">
          Browse Services <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
