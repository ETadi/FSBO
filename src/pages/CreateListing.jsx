import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, Home, Camera, DollarSign, Star, Eye, X } from 'lucide-react'
import { useSeller } from '../context/SellerContext.jsx'
import { services, serviceCategories } from '../data/index.js'
import { formatPrice } from '../utils/formatters.js'

const STEPS = [
  { n: 1, label: 'Property Details', icon: Home },
  { n: 2, label: 'Photos', icon: Camera },
  { n: 3, label: 'Pricing', icon: DollarSign },
  { n: 4, label: 'Services', icon: Star },
  { n: 5, label: 'Review & Publish', icon: Eye },
]

const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']
const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const PLACEHOLDER_PHOTOS = [
  { id: 'ph-1', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', caption: 'Front exterior', primary: true },
  { id: 'ph-2', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', caption: 'Kitchen', primary: false },
  { id: 'ph-3', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80', caption: 'Living room', primary: false },
]

export default function CreateListing() {
  const navigate = useNavigate()
  const { createListing } = useSeller()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  const [details, setDetails] = useState({
    propertyType: 'Single Family', street: '', city: '', state: 'TX', zip: '',
    beds: '', baths: '', sqft: '', lotSqft: '', yearBuilt: '', garage: 0,
    basement: false, pool: false, fireplace: false, description: ''
  })
  const [photos, setPhotos] = useState(PLACEHOLDER_PHOTOS)
  const fileInputRef = useRef(null)

  function handleFileBrowse() {
    fileInputRef.current?.click()
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            url: ev.target.result,
            caption: file.name.replace(/\.[^.]+$/, ''),
            primary: prev.length === 0,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'))
    if (files.length) {
      const fakeEvent = { target: { files }, preventDefault: () => {} }
      handleFilesSelected(fakeEvent)
    }
  }

  function removePhoto(id) {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      // if we removed the primary, make the first one primary
      if (next.length > 0 && !next.some((p) => p.primary)) {
        next[0].primary = true
      }
      return next
    })
  }

  function setPrimaryPhoto(id) {
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, primary: p.id === id }))
    )
  }
  const [pricing, setPricing] = useState({ askingPrice: '', hoa: false, hoaMonthly: '', taxes: '', timeline: 'ASAP' })
  const [selectedServices, setSelectedServices] = useState([])

  function toggleService(id) {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const servicesTotalCost = selectedServices.reduce((sum, id) => {
    const svc = services.find((s) => s.id === id)
    return sum + (svc?.price || 0)
  }, 0)

  function handlePublish() {
    createListing({
      address: { street: details.street || '123 Sample Street', city: details.city || 'Austin', state: details.state, zip: details.zip || '78704', neighborhood: '' },
      price: Number(details.askingPrice) || Number(pricing.askingPrice) || 350000,
      pricePerSqft: Math.round((Number(pricing.askingPrice) || 350000) / (Number(details.sqft) || 1800)),
      hoa: { monthly: pricing.hoa ? Number(pricing.hoaMonthly) : 0, required: pricing.hoa },
      taxes: { annual: Number(pricing.taxes) || 4000 },
      specs: { beds: Number(details.beds) || 3, baths: Number(details.baths) || 2, halfBaths: 0, sqft: Number(details.sqft) || 1800, lotSqft: Number(details.lotSqft) || 6000, garage: details.garage, yearBuilt: Number(details.yearBuilt) || 2010 },
      details: { propertyType: details.propertyType, style: 'Contemporary', basement: details.basement, pool: details.pool, fireplace: details.fireplace, cooling: 'Central Air', heating: 'Forced Air', laundry: 'In Unit', exterior: 'Vinyl', roof: 'Composition', mlsNumber: 'NEW-2025-' + Math.floor(Math.random() * 90000 + 10000) },
      description: details.description || 'Beautiful home in a great location.',
      features: [],
      photos: photos,
      services: selectedServices,
      status: 'active',
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Listing Published!</h2>
          <p className="text-gray-500 mb-6">Your home is now live. Buyers can find your listing in the marketplace.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-navy-800 text-white font-medium rounded-xl hover:bg-navy-900 transition-colors">
              Go to Dashboard
            </button>
            <button onClick={() => navigate('/listings')} className="px-6 py-3 border border-navy-700 text-navy-700 font-medium rounded-xl hover:bg-navy-50 transition-colors">
              Browse Listings
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">Create New Listing</h1>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map(({ n, label, icon: Icon }) => (
          <div key={n} className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              step === n ? 'bg-navy-800 text-white' : step > n ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > n ? <CheckCircle size={15} /> : <Icon size={15} />}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{n}</span>
            </div>
            {n < 5 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 1 — Property Details */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-navy-900">Property Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button key={type} onClick={() => setDetails({ ...details, propertyType: type })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${details.propertyType === type ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 text-gray-700 hover:border-navy-400'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Street Address" value={details.street} onChange={(v) => setDetails({ ...details, street: v })} placeholder="123 Main Street" />
            <Field label="City" value={details.city} onChange={(v) => setDetails({ ...details, city: v })} placeholder="Austin" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select value={details.state} onChange={(e) => setDetails({ ...details, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {US_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Field label="ZIP Code" value={details.zip} onChange={(v) => setDetails({ ...details, zip: v })} placeholder="78704" />
            <Field label="Bedrooms" value={details.beds} type="number" onChange={(v) => setDetails({ ...details, beds: v })} placeholder="3" />
            <Field label="Bathrooms" value={details.baths} type="number" onChange={(v) => setDetails({ ...details, baths: v })} placeholder="2" />
            <Field label="Square Footage" value={details.sqft} type="number" onChange={(v) => setDetails({ ...details, sqft: v })} placeholder="1,800" />
            <Field label="Year Built" value={details.yearBuilt} type="number" onChange={(v) => setDetails({ ...details, yearBuilt: v })} placeholder="2010" />
          </div>
          <div className="flex flex-wrap gap-4">
            {[['basement', 'Basement'], ['pool', 'Pool'], ['fireplace', 'Fireplace']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={details[key]} onChange={(e) => setDetails({ ...details, [key]: e.target.checked })}
                  className="w-4 h-4 accent-navy-700" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
            <textarea rows={4} value={details.description} onChange={(e) => setDetails({ ...details, description: e.target.value })}
              maxLength={500} placeholder="Describe your home in detail — highlights, neighborhood, recent updates..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none" />
            <p className="text-xs text-gray-400 mt-1">{details.description.length}/500</p>
          </div>
        </div>
      )}

      {/* Step 2 — Photos */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-navy-900">Photos</h2>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
          />

          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-navy-400 hover:bg-navy-50/30 transition-colors cursor-pointer"
            onClick={handleFileBrowse}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDrop={handleDrop}
          >
            <Camera size={32} className="text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-700 mb-1">Drag & drop photos here</p>
            <p className="text-sm text-gray-400 mb-3">or click to browse from your computer</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleFileBrowse() }}
              className="px-4 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-900 transition-colors"
            >
              Browse Files
            </button>
          </div>

          {photos.length > 0 && (
            <>
              <p className="text-sm text-gray-500">{photos.length} photo{photos.length !== 1 ? 's' : ''} — click a photo to set as primary</p>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative rounded-xl overflow-hidden h-28 cursor-pointer ring-2 transition-all ${
                      photo.primary ? 'ring-accent-500' : 'ring-transparent hover:ring-navy-300'
                    }`}
                    onClick={() => setPrimaryPhoto(photo.id)}
                  >
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    {photo.primary && (
                      <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs px-2 py-0.5 rounded font-medium">Primary</span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePhoto(photo.id) }}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                      <p className="text-white text-xs truncate">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3 — Pricing */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-navy-900">Pricing</h2>
          <Field label="Asking Price ($)" value={pricing.askingPrice} type="number" onChange={(v) => setPricing({ ...pricing, askingPrice: v })} placeholder="350,000" />
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={pricing.hoa} onChange={(e) => setPricing({ ...pricing, hoa: e.target.checked })} className="w-4 h-4 accent-navy-700" />
              <span className="text-sm font-medium text-gray-700">This property has an HOA</span>
            </label>
            {pricing.hoa && (
              <Field label="Monthly HOA Fee ($)" value={pricing.hoaMonthly} type="number" onChange={(v) => setPricing({ ...pricing, hoaMonthly: v })} placeholder="200" />
            )}
          </div>
          <Field label="Annual Property Taxes ($)" value={pricing.taxes} type="number" onChange={(v) => setPricing({ ...pricing, taxes: v })} placeholder="4,000" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Timeline</label>
            <div className="grid grid-cols-2 gap-2">
              {['ASAP', '1–3 months', '3–6 months', '6+ months'].map((t) => (
                <button key={t} onClick={() => setPricing({ ...pricing, timeline: t })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${pricing.timeline === t ? 'bg-navy-800 text-white border-navy-800' : 'border-gray-200 text-gray-700 hover:border-navy-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Services */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-navy-900 mb-1">Add Services (Optional)</h2>
            <p className="text-sm text-gray-500">You can add or change services at any time from the Services Marketplace.</p>
          </div>
          {serviceCategories.map((cat) => {
            const catServices = services.filter((s) => s.category === cat.id)
            return (
              <div key={cat.id}>
                <h3 className="font-medium text-navy-800 mb-2">{cat.label}</h3>
                <div className="space-y-2">
                  {catServices.map((svc) => (
                    <label key={svc.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${selectedServices.includes(svc.id) ? 'border-navy-600 bg-navy-50' : 'border-gray-200 hover:border-navy-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedServices.includes(svc.id)} onChange={() => toggleService(svc.id)} className="w-4 h-4 accent-navy-700" />
                        <span className="text-sm font-medium text-gray-900">{svc.name}</span>
                      </div>
                      <span className="text-sm font-bold text-navy-900">{formatPrice(svc.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
          {selectedServices.length > 0 && (
            <div className="bg-navy-50 rounded-xl p-4 flex items-center justify-between">
              <span className="font-medium text-navy-900">{selectedServices.length} services selected</span>
              <span className="font-bold text-navy-900">{formatPrice(servicesTotalCost)}</span>
            </div>
          )}
        </div>
      )}

      {/* Step 5 — Review */}
      {step === 5 && (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-navy-900">Review Your Listing</h2>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            <Row label="Property Type" value={details.propertyType} />
            <Row label="Address" value={`${details.street || '(not entered)'}, ${details.city || ''}, ${details.state} ${details.zip}`} />
            <Row label="Bedrooms" value={details.beds || '—'} />
            <Row label="Bathrooms" value={details.baths || '—'} />
            <Row label="Square Footage" value={details.sqft ? `${Number(details.sqft).toLocaleString()} sq ft` : '—'} />
            <Row label="Year Built" value={details.yearBuilt || '—'} />
            <Row label="Asking Price" value={pricing.askingPrice ? formatPrice(Number(pricing.askingPrice)) : '—'} />
            <Row label="Timeline" value={pricing.timeline} />
            <Row label="Services Added" value={selectedServices.length > 0 ? `${selectedServices.length} (${formatPrice(servicesTotalCost)})` : 'None'} />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            By publishing, your listing will be visible to buyers on FSBOMarket. You can edit or unpublish at any time from your dashboard.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          Back
        </button>
        {step < 5 ? (
          <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 bg-navy-800 text-white font-medium rounded-xl text-sm hover:bg-navy-900 transition-colors">
            Continue →
          </button>
        ) : (
          <button onClick={handlePublish} className="px-8 py-2.5 bg-accent-500 text-white font-semibold rounded-xl text-sm hover:bg-accent-600 transition-colors">
            Publish Listing 🎉
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}
