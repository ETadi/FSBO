import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Check, Plus, Minus, Star, ArrowRight, Home, Camera, FileText, TrendingUp, Shield, X } from 'lucide-react'
import { services, serviceCategories, providers } from '../data/index.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatters.js'

const categoryIcons = { mls: Home, photography: Camera, legal: FileText, marketing: TrendingUp, home_prep: Star, offer_management: Shield }

export default function ServicesMarketplace() {
  const { addService, removeService, isInCart, cart, cartTotal } = useCart()
  const [activeCategory, setActiveCategory] = useState(null)
  const sectionRefs = useRef({})

  function scrollToCategory(catId) {
    setActiveCategory(catId)
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const grouped = serviceCategories.map((cat) => ({
    ...cat,
    items: services.filter((s) => s.category === cat.id),
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Services Marketplace</h1>
        <p className="text-gray-500 text-lg">Build your custom selling plan. Choose only what you need — all flat fees, no commissions.</p>
      </div>

      {/* Category nav tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-gray-200 sticky top-16 bg-white z-10 pt-2">
        {serviceCategories.map((cat) => {
          const Icon = categoryIcons[cat.id] || Home
          return (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} /> {cat.label}
            </button>
          )
        })}
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 space-y-12 min-w-0">
          {grouped.map(({ id, label, description, items }) => {
            const Icon = categoryIcons[id] || Home
            return (
              <section key={id} ref={(el) => (sectionRefs.current[id] = el)} id={id}>
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-navy-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy-900">{label}</h2>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((svc) => {
                    const provider = providers.find((p) => p.id === svc.providerId)
                    const inCart = isInCart(svc.id)
                    return (
                      <ServiceCard
                        key={svc.id}
                        service={svc}
                        provider={provider}
                        inCart={inCart}
                        onAdd={() => addService(svc.id)}
                        onRemove={() => removeService(svc.id)}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        {/* Cart sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-xl shadow-card p-5 sticky top-24">
            <h3 className="font-semibold text-navy-900 mb-1 flex items-center gap-2">
              <ShoppingCart size={18} /> Your Service Plan
            </h3>
            <p className="text-xs text-gray-500 mb-4">{cart.length} service{cart.length !== 1 ? 's' : ''} selected</p>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No services added yet. Browse and add services to build your plan.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.serviceId} className="flex items-start justify-between gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 leading-tight truncate">{item.name}</p>
                      <p className="text-navy-700 font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <button onClick={() => removeService(item.serviceId)} className="text-gray-400 hover:text-red-500 shrink-0 mt-0.5">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-navy-900">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                <Link
                  to="/cart"
                  className="block w-full text-center py-2.5 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-lg text-sm transition-colors"
                >
                  Review Plan →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service, provider, inCart, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-150 ${inCart ? 'border-navy-600 shadow-md' : 'border-gray-200 shadow-card hover:shadow-card-hover'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {service.badge && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${service.badge === 'Most Popular' ? 'bg-amber-100 text-amber-700' : service.badge === 'Best Value' ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-700'}`}>
                  {service.badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-navy-900 text-sm leading-snug">{service.name}</h3>
          </div>
          <span className="text-xl font-bold text-navy-900 shrink-0">{formatPrice(service.price)}</span>
        </div>

        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>

        <div className="space-y-1 mb-3">
          {service.includes.slice(0, expanded ? undefined : 3).map((inc) => (
            <div key={inc} className="flex items-start gap-1.5 text-xs text-gray-700">
              <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
              {inc}
            </div>
          ))}
          {service.includes.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-navy-600 hover:text-navy-800 font-medium mt-1">
              {expanded ? '− Show less' : `+ ${service.includes.length - 3} more included`}
            </button>
          )}
        </div>

        {provider && (
          <div className="flex items-center gap-2 mb-3 pt-2 border-t border-gray-100">
            <div className={`w-6 h-6 ${provider.color} rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {provider.initials}
            </div>
            <div className="min-w-0">
              <Link to={`/providers/${provider.id}`} className="text-xs font-medium text-navy-700 hover:text-navy-900 truncate block">
                {provider.name}
              </Link>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-500">{provider.rating} ({provider.reviewCount.toLocaleString()})</span>
              </div>
            </div>
          </div>
        )}

        {inCart ? (
          <button
            onClick={onRemove}
            className="w-full py-2 bg-navy-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-navy-800 transition-colors"
          >
            <Check size={15} /> Added to Plan
          </button>
        ) : (
          <button
            onClick={onAdd}
            className="w-full py-2 bg-white border border-navy-700 text-navy-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-navy-50 transition-colors"
          >
            <Plus size={15} /> Add to Plan
          </button>
        )}
      </div>
    </div>
  )
}
