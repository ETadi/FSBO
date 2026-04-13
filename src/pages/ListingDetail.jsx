import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Bed, Bath, Square, Home, MapPin, Calendar, Eye, Heart, Share2,
  Phone, Mail, ChevronRight, Star, X, CheckCircle
} from 'lucide-react'
import { services } from '../data/index.js'
import { useSeller } from '../context/SellerContext.jsx'
import { formatPrice, formatSqft, formatDate } from '../utils/formatters.js'
import ListingCard from '../components/listings/ListingCard.jsx'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { allListings } = useSeller()
  const listing = allListings.find((l) => l.id === id)

  const [activePhoto, setActivePhoto] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-gray-500 mb-4">Listing not found</p>
        <button onClick={() => navigate('/listings')} className="text-navy-700 hover:text-navy-900 font-medium">
          ← Back to listings
        </button>
      </div>
    )
  }

  const { address, price, specs, details, description, features, photos, seller, stats: lstats, openHouses, services: svcIds } = listing
  const listingServices = (svcIds || []).map((sid) => services.find((s) => s.id === sid)).filter(Boolean)
  const similar = allListings.filter((l) => l.id !== id && l.address.state === address.state).slice(0, 4)

  function handleContact(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-navy-700">Home</Link>
        <ChevronRight size={14} />
        <Link to="/listings" className="hover:text-navy-700">Browse Listings</Link>
        <ChevronRight size={14} />
        <Link to={`/listings?state=${address.state}`} className="hover:text-navy-700">{address.city}, {address.state}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate max-w-xs">{address.street}</span>
      </nav>

      {/* Photo Gallery */}
      <div className="grid grid-cols-4 gap-2 mb-6 rounded-xl overflow-hidden h-80 md:h-96">
        <div className="col-span-3 cursor-pointer" onClick={() => setLightboxOpen(true)}>
          <img
            src={photos[activePhoto]?.url}
            alt={address.street}
            className="w-full h-full object-cover hover:brightness-95 transition"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80' }}
          />
        </div>
        <div className="col-span-1 grid grid-rows-3 gap-2 max-h-full">
          {photos.slice(1, 4).map((photo, i) => (
            <div
              key={photo.id}
              className="relative cursor-pointer overflow-hidden"
              onClick={() => { setActivePhoto(i + 1); setLightboxOpen(true) }}
            >
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover hover:brightness-90 transition"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' }} />
              {i === 2 && photos.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                  +{photos.length - 4} photos
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"><X size={24} /></button>
          <img src={photos[activePhoto]?.url} alt="" className="max-h-[85vh] max-w-5xl object-contain px-4"
            onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-6 flex gap-2">
            {photos.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setActivePhoto(i) }}
                className={`w-2 h-2 rounded-full ${i === activePhoto ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      )}

      {/* Title + Price */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>
            <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={13} /> {lstats.views.toLocaleString()} views</span>
            <span className="text-xs text-gray-500">{lstats.daysOnMarket} days on market</span>
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-1">{formatPrice(price)}</h1>
          <p className="text-gray-600 flex items-center gap-1"><MapPin size={16} /> {address.street}, {address.city}, {address.state} {address.zip}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Heart size={16} /> Save
          </button>
        </div>
      </div>

      {/* Specs bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 bg-navy-50 rounded-xl p-4 mb-8">
        {[
          { icon: Bed, label: `${specs.beds} Beds` },
          { icon: Bath, label: `${specs.baths} Baths` },
          { icon: Square, label: formatSqft(specs.sqft) },
          { icon: Home, label: details.propertyType },
          { icon: Calendar, label: `Built ${specs.yearBuilt}` },
          { icon: MapPin, label: specs.lotSqft > 0 ? `${specs.lotSqft.toLocaleString()} sqft lot` : 'Condo' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <Icon size={20} className="text-navy-600" />
            <span className="text-sm font-medium text-navy-900">{label}</span>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-3">About This Home</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-3">Features & Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={15} className="text-green-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </section>

          {/* Property Details */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-3">Property Details</h2>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {[
                ['Property Type', details.propertyType],
                ['Style', details.style],
                ['Year Built', specs.yearBuilt],
                ['Cooling', details.cooling],
                ['Heating', details.heating],
                ['Laundry', details.laundry],
                ['Exterior', details.exterior],
                ['Roof', details.roof],
                ['MLS #', details.mlsNumber],
                ['HOA', listing.hoa?.required ? `$${listing.hoa.monthly}/mo` : 'None'],
                ['Annual Taxes', `$${listing.taxes?.annual?.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 odd:bg-white text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Open Houses */}
          {openHouses && openHouses.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-navy-900 mb-3">Open Houses</h2>
              {openHouses.map((oh, i) => (
                <div key={i} className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <Calendar size={24} className="text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{formatDate(oh.date)}</p>
                    <p className="text-sm text-gray-600">{oh.startTime} – {oh.endTime}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Map Placeholder */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-3">Location</h2>
            <div className="h-56 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-2">
              <MapPin size={32} className="text-navy-400" />
              <p className="text-gray-500 font-medium">{address.city}, {address.state}</p>
              <p className="text-xs text-gray-400">Interactive map coming soon</p>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Contact form */}
          <div className="bg-white rounded-xl shadow-card p-5 sticky top-24">
            <h3 className="font-semibold text-navy-900 mb-1">Contact Seller</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center text-xs font-bold text-navy-700">
                {seller.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                <p className="text-xs text-gray-500">{seller.responseTime}</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1">Message Sent!</p>
                <p className="text-sm text-gray-500">The seller will respond within {seller.responseTime.toLowerCase()}.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-3">
                <input required type="text" placeholder="Your name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                <input required type="email" placeholder="Your email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                <input type="tel" placeholder="Your phone (optional)" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                <textarea required rows={3} placeholder={`I'm interested in ${address.street}...`}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none" />
                <button type="submit"
                  className="w-full py-2.5 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-lg text-sm transition-colors">
                  Send Message
                </button>
              </form>
            )}

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <a href={`tel:${seller.phone}`} className="flex items-center gap-1 hover:text-navy-700">
                <Phone size={13} /> {seller.phone}
              </a>
            </div>
          </div>

          {/* Services on this listing */}
          {listingServices.length > 0 && (
            <div className="bg-white rounded-xl shadow-card p-5">
              <h3 className="font-semibold text-navy-900 mb-3">Seller's Services</h3>
              <div className="space-y-2">
                {listingServices.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    <span className="text-gray-700">{s.name}</span>
                  </div>
                ))}
              </div>
              <Link to="/services" className="mt-4 block text-center text-sm text-navy-700 hover:text-navy-900 font-medium">
                Get these services →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Similar Listings */}
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </div>
  )
}
