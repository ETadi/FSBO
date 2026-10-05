import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PriceMarker from './PriceMarker.jsx'

// Child component that fits bounds when listings change
function FitBounds({ listings }) {
  const map = useMap()

  useEffect(() => {
    if (listings.length === 0) return

    const bounds = L.latLngBounds(
      listings.map((l) => [l.address.coordinates.lat, l.address.coordinates.lng])
    )

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
  }, [listings, map])

  return null
}

export default function ListingsMap({
  listings,
  activeListingId,
  onMarkerClick,
  className = '',
}) {
  // Only show listings that have coordinates
  const mappable = useMemo(
    () => listings.filter((l) => l.address?.coordinates),
    [listings]
  )

  // Center of the US as default
  const defaultCenter = [39.8283, -98.5795]
  const defaultZoom = 4

  if (mappable.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center p-6">
          <p className="text-gray-500 font-medium">No mappable listings</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-card ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds listings={mappable} />
        {mappable.map((listing) => (
          <PriceMarker
            key={listing.id}
            listing={listing}
            isActive={listing.id === activeListingId}
            onClick={onMarkerClick}
          />
        ))}
      </MapContainer>
    </div>
  )
}
