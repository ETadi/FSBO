import { useMemo, useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { applyFilters } from '../utils/filters.js'
import { useSeller } from '../context/SellerContext.jsx'
import ListingCard from '../components/listings/ListingCard.jsx'
import MapListToggle from '../components/listings/MapListToggle.jsx'

// Lazy-load the map so Leaflet JS only loads when needed
const ListingsMap = lazy(() => import('../components/listings/ListingsMap.jsx'))

const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family']
const PAGE_SIZE = 12

export default function BrowseListings() {
  const { allListings } = useSeller()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('split') // 'list' | 'map' | 'split'
  const [activeListingId, setActiveListingId] = useState(null)
  const cardRefs = useRef({})

  // Page is stored in URL params so it survives back-navigation
  const page = Number(searchParams.get('page')) || 1

  function setPage(p) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (p <= 1) next.delete('page')
      else next.set('page', String(p))
      return next
    })
  }

  const states = useMemo(() => [...new Set(allListings.map((l) => l.address.state))].sort(), [allListings])

  const filters = {
    q: searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBeds: searchParams.get('beds') || '',
    minBaths: searchParams.get('baths') || '',
    state: searchParams.get('state') || '',
    propertyTypes: searchParams.getAll('type'),
    sortBy: searchParams.get('sort') || 'newest',
  }

  function setFilter(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value) next.delete(key)
      else next.set(key, value)
      next.delete('page')
      return next
    })
  }

  function toggleType(type) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      const types = next.getAll('type')
      if (types.includes(type)) {
        next.delete('type')
        types.filter((t) => t !== type).forEach((t) => next.append('type', t))
      } else {
        next.append('type', type)
      }
      next.delete('page')
      return next
    })
  }

  function clearFilters() {
    setSearchParams({})
  }

  const filtered = useMemo(() => applyFilters(allListings, filters), [allListings, searchParams.toString()])
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = filters.q || filters.minPrice || filters.maxPrice || filters.minBeds || filters.minBaths || filters.state || filters.propertyTypes.length > 0

  // When a map marker is clicked, scroll the corresponding card into view
  function handleMarkerClick(listingId) {
    setActiveListingId(listingId)
    const card = cardRefs.current[listingId]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // On mobile, default to list view
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    function handleChange(e) {
      if (e.matches && viewMode === 'split') {
        setViewMode('list')
      }
    }
    handleChange(mq)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const showMap = viewMode === 'map' || viewMode === 'split'
  const showList = viewMode === 'list' || viewMode === 'split'

  const filterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="City, ZIP, neighborhood..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilter('minPrice', e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* Beds */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
        <div className="flex gap-2">
          {['', '1', '2', '3', '4'].map((v) => (
            <button
              key={v}
              onClick={() => setFilter('beds', v)}
              className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                filters.minBeds === v ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 text-gray-700 hover:border-navy-400'
              }`}
            >
              {v === '' ? 'Any' : v + '+'}
            </button>
          ))}
        </div>
      </div>

      {/* Baths */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
        <div className="flex gap-2">
          {['', '1', '2', '3'].map((v) => (
            <button
              key={v}
              onClick={() => setFilter('baths', v)}
              className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                filters.minBaths === v ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 text-gray-700 hover:border-navy-400'
              }`}
            >
              {v === '' ? 'Any' : v + '+'}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="w-4 h-4 accent-navy-700"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
        <select
          value={filters.state}
          onChange={(e) => setFilter('state', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="">All States</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          Clear All Filters
        </button>
      )}
    </div>
  )

  return (
    <div className={`${viewMode === 'split' ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden md:block w-72 shrink-0">
          <div className="bg-white rounded-xl shadow-card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</h2>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">
                {filtered.length} {filtered.length === 1 ? 'Home' : 'Homes'} Found
                {filters.state ? ` in ${filters.state}` : ''}
                {filters.q ? ` for "${filters.q}"` : ''}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasFilters && <span className="w-5 h-5 bg-navy-700 text-white text-xs rounded-full flex items-center justify-center">!</span>}
              </button>

              {/* View mode toggle */}
              <MapListToggle view={viewMode} onChange={setViewMode} />

              <select
                value={filters.sortBy}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="sqft_desc">Largest First</option>
              </select>
            </div>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="md:hidden bg-white rounded-xl shadow-card p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
              {filterPanel}
            </div>
          )}

          {/* Active filter chips */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.q && <Chip label={`"${filters.q}"`} onRemove={() => setFilter('q', '')} />}
              {filters.minPrice && <Chip label={`Min $${Number(filters.minPrice).toLocaleString()}`} onRemove={() => setFilter('minPrice', '')} />}
              {filters.maxPrice && <Chip label={`Max $${Number(filters.maxPrice).toLocaleString()}`} onRemove={() => setFilter('maxPrice', '')} />}
              {filters.minBeds && <Chip label={`${filters.minBeds}+ beds`} onRemove={() => setFilter('beds', '')} />}
              {filters.minBaths && <Chip label={`${filters.minBaths}+ baths`} onRemove={() => setFilter('baths', '')} />}
              {filters.state && <Chip label={filters.state} onRemove={() => setFilter('state', '')} />}
              {filters.propertyTypes.map((t) => <Chip key={t} label={t} onRemove={() => toggleType(t)} />)}
            </div>
          )}

          {/* Content area — list, map, or split */}
          {paged.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-gray-500 mb-2">No homes match your filters</p>
              <button onClick={clearFilters} className="text-navy-700 hover:text-navy-900 font-medium">Clear filters</button>
            </div>
          ) : (
            <div className={viewMode === 'split' ? 'flex gap-5' : ''}>
              {/* List panel */}
              {showList && (
                <div className={viewMode === 'split' ? 'w-1/2 min-w-0' : 'w-full'}>
                  <div className={`grid gap-5 ${
                    viewMode === 'split'
                      ? 'grid-cols-1 xl:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {paged.map((listing) => (
                      <div
                        key={listing.id}
                        ref={(el) => { cardRefs.current[listing.id] = el }}
                        className={`transition-all duration-200 rounded-xl ${
                          activeListingId === listing.id
                            ? 'ring-2 ring-accent-500 ring-offset-2'
                            : ''
                        }`}
                        onMouseEnter={() => setActiveListingId(listing.id)}
                        onMouseLeave={() => setActiveListingId(null)}
                      >
                        <ListingCard listing={listing} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            p === page ? 'bg-navy-800 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Map panel */}
              {showMap && (
                <div className={`${
                  viewMode === 'split'
                    ? 'w-1/2 sticky top-20'
                    : 'w-full'
                }`}>
                  <Suspense fallback={
                    <div className="h-[calc(100vh-12rem)] rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
                      <p className="text-gray-400 font-medium">Loading map...</p>
                    </div>
                  }>
                    <ListingsMap
                      listings={filtered}
                      activeListingId={activeListingId}
                      onMarkerClick={handleMarkerClick}
                      className="h-[calc(100vh-12rem)]"
                    />
                  </Suspense>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-navy-100 text-navy-800 text-xs font-medium px-3 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-navy-900 ml-0.5"><X size={12} /></button>
    </span>
  )
}
