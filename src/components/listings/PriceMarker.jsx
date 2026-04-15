import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { formatPriceShort, formatPrice, formatSqft } from '../../utils/formatters.js'
import { Bed, Bath, Square } from 'lucide-react'

export default function PriceMarker({ listing, isActive, onClick }) {
  const { id, address, price, specs, photos, details } = listing
  const photo = photos.find((p) => p.primary) || photos[0]
  const priceLabel = formatPriceShort(price)

  const icon = useMemo(() => {
    return L.divIcon({
      className: '',
      html: `<div class="price-marker ${isActive ? 'active' : ''}">${priceLabel}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })
  }, [priceLabel, isActive])

  return (
    <Marker
      position={[address.coordinates.lat, address.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(id),
      }}
    >
      <Popup className="map-popup" closeButton={false} autoPan={false}>
        <Link to={`/listings/${id}`} className="block no-underline text-inherit">
          <div className="w-[260px]">
            <div className="h-36 overflow-hidden bg-gray-200">
              <img
                src={photo?.url}
                alt={address.street}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="text-lg font-bold text-gray-900 mb-0.5">{formatPrice(price)}</p>
              <p className="text-xs text-gray-500 mb-2 truncate">
                {address.street}, {address.city}, {address.state}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Bed size={12} /> {specs.beds} bd
                </span>
                <span className="flex items-center gap-1">
                  <Bath size={12} /> {specs.baths} ba
                </span>
                <span className="flex items-center gap-1">
                  <Square size={12} /> {formatSqft(specs.sqft)}
                </span>
              </div>
              <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {details.propertyType}
              </span>
            </div>
          </div>
        </Link>
      </Popup>
    </Marker>
  )
}
