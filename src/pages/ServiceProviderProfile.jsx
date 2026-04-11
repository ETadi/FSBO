import { useParams, Link } from 'react-router-dom'
import { Star, CheckCircle, Phone, Mail, Globe, Shield, ArrowLeft, Plus, Check } from 'lucide-react'
import { providers, services, reviews } from '../data/index.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, formatDate } from '../utils/formatters.js'

export default function ServiceProviderProfile() {
  const { id } = useParams()
  const provider = providers.find((p) => p.id === id)
  const { addService, removeService, isInCart } = useCart()

  if (!provider) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Provider not found</div>
  }

  const providerServices = services.filter((s) => provider.serviceIds.includes(s.id))
  const providerReviews = reviews.filter((r) => r.providerId === id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/services" className="inline-flex items-center gap-2 text-navy-700 hover:text-navy-900 text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Back to Services
      </Link>

      {/* Hero */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-start gap-5 flex-wrap">
          <div className={`w-16 h-16 ${provider.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
            {provider.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold">{provider.name}</h1>
              {provider.verified && (
                <span className="flex items-center gap-1 bg-navy-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Shield size={12} /> Verified
                </span>
              )}
            </div>
            <p className="text-navy-300 mb-3">{provider.tagline}</p>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(provider.rating) ? 'text-amber-400 fill-amber-400' : 'text-navy-600'} />
                ))}
                <span className="ml-1 font-semibold">{provider.rating}</span>
                <span className="text-navy-400">({provider.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <span className="text-navy-400">·</span>
              <span className="text-navy-300">{provider.completedDeals.toLocaleString()} completed deals</span>
              <span className="text-navy-400">·</span>
              <span className="text-navy-300">Founded {provider.founded}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-xl font-semibold text-navy-900 mb-3">About {provider.name}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{provider.description}</p>
            <h3 className="font-semibold text-navy-800 mb-2">Why Choose Us</h3>
            <div className="space-y-2">
              {provider.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providerServices.map((svc) => {
                const inCart = isInCart(svc.id)
                return (
                  <div key={svc.id} className={`bg-white rounded-xl border-2 p-4 ${inCart ? 'border-navy-600' : 'border-gray-200 shadow-card'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-navy-900 text-sm">{svc.name}</h3>
                      <span className="text-lg font-bold text-navy-900 ml-2">{formatPrice(svc.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{svc.description}</p>
                    {inCart ? (
                      <button onClick={() => removeService(svc.id)}
                        className="w-full py-1.5 bg-navy-700 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1 hover:bg-navy-800">
                        <Check size={13} /> Added
                      </button>
                    ) : (
                      <button onClick={() => addService(svc.id)}
                        className="w-full py-1.5 border border-navy-700 text-navy-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1 hover:bg-navy-50">
                        <Plus size={13} /> Add to Plan
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-semibold text-navy-900 mb-4">
              Customer Reviews <span className="text-gray-400 font-normal text-base">({providerReviews.length})</span>
            </h2>
            <div className="space-y-4">
              {providerReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-xl shadow-card p-5">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{rev.authorName}</p>
                      <p className="text-xs text-gray-500">{rev.authorCity} · {formatDate(rev.date)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{rev.text}</p>
                  {rev.verified && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle size={11} /> Verified purchase
                    </p>
                  )}
                </div>
              ))}
              {providerReviews.length === 0 && (
                <p className="text-gray-400 text-sm">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-card p-5 sticky top-24">
            <h3 className="font-semibold text-navy-900 mb-4">Contact</h3>
            <div className="space-y-3 mb-5">
              <a href={`tel:${provider.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-navy-700">
                <Phone size={16} className="text-navy-500" /> {provider.phone}
              </a>
              <a href={`mailto:${provider.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-navy-700 break-all">
                <Mail size={16} className="text-navy-500" /> {provider.email}
              </a>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              {[
                ['Location', provider.location],
                ['Response Time', provider.responseTime],
                ['License', provider.licenseInfo],
                ['Founded', provider.founded],
              ].map(([label, value]) => (
                <div key={label} className="text-sm">
                  <span className="text-gray-500">{label}: </span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {provider.badges.map((badge) => (
                <span key={badge} className="bg-navy-50 text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full border border-navy-200">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
