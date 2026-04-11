import { Link } from 'react-router-dom'
import { Bed, Bath, Square, Heart, MapPin } from 'lucide-react'
import { formatPrice, formatSqft, formatDaysOnMarket } from '../../utils/formatters.js'

export default function ListingCard({ listing }) {
  const { id, address, price, specs, details, photos, stats, featured } = listing
  const photo = photos.find((p) => p.primary) || photos[0]
  const dom = formatDaysOnMarket(stats.daysOnMarket)

  return (
    <Link to={`/listings/${id}`} className="group block bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Photo */}
      <div className="relative h-52 overflow-hidden rounded-t-xl bg-gray-200">
        <img
          src={photo?.url}
          alt={address.street}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded-md">Featured</span>
          )}
          {dom === 'New' && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">New</span>
          )}
        </div>
        {/* Save */}
        <button
          onClick={(e) => { e.preventDefault() }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart size={16} className="text-gray-400" />
        </button>
        {/* Property type */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
            {details.propertyType}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-2xl font-bold text-navy-900 mb-1">{formatPrice(price)}</p>
        <div className="flex items-start gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-1">{address.street}, {address.city}, {address.state} {address.zip}</span>
        </div>
        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <Bed size={15} className="text-gray-400" /> {specs.beds} bd
          </span>
          <span className="flex items-center gap-1">
            <Bath size={15} className="text-gray-400" /> {specs.baths} ba
          </span>
          <span className="flex items-center gap-1">
            <Square size={15} className="text-gray-400" /> {formatSqft(specs.sqft)}
          </span>
          {dom !== 'New' && (
            <span className="ml-auto text-xs text-gray-400">{dom} on market</span>
          )}
        </div>
      </div>
    </Link>
  )
}
