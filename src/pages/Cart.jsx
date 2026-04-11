import { Link } from 'react-router-dom'
import { ShoppingCart, X, ArrowRight, CheckCircle, Star } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { services, providers } from '../data/index.js'
import { formatPrice } from '../utils/formatters.js'

export default function Cart() {
  const { cart, removeService, clearCart, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingCart size={56} className="text-gray-300 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Your service plan is empty</h2>
        <p className="text-gray-500 mb-8">Browse our services marketplace to build your custom selling plan.</p>
        <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-medium rounded-xl hover:bg-navy-900 transition-colors">
          Browse Services <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-navy-900 mb-8">Your Service Plan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const svc = services.find((s) => s.id === item.serviceId)
            const provider = svc ? providers.find((p) => p.id === svc.providerId) : null
            return (
              <div key={item.serviceId} className="bg-white rounded-xl shadow-card p-5 flex gap-4">
                <div className={`w-10 h-10 ${provider?.color || 'bg-navy-700'} rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {provider?.initials || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-navy-900 text-sm">{item.name}</h3>
                      {provider && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          by <Link to={`/providers/${provider.id}`} className="text-navy-600 hover:text-navy-800">{provider.name}</Link>
                          {' · '}
                          <Star size={10} className="inline text-amber-400 fill-amber-400" /> {provider.rating}
                        </p>
                      )}
                    </div>
                    <button onClick={() => removeService(item.serviceId)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <X size={18} />
                    </button>
                  </div>
                  {svc && (
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>Turnaround: {svc.turnaround}</span>
                      <span>Duration: {svc.duration}</span>
                    </div>
                  )}
                  <p className="text-lg font-bold text-navy-900 mt-2">{formatPrice(item.price)}</p>
                </div>
              </div>
            )
          })}

          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium mt-2">
            Remove all services
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-card p-5 sticky top-24">
            <h2 className="font-semibold text-navy-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.serviceId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[65%]">{item.name}</span>
                  <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-navy-900">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">One-time flat fees. No recurring charges.</p>
            </div>

            <button className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl text-sm transition-colors mb-3">
              Proceed to Checkout
            </button>
            <Link to="/services" className="block text-center text-sm text-navy-700 hover:text-navy-900 font-medium">
              Add more services
            </Link>

            <div className="mt-5 space-y-2">
              {[
                'All providers are licensed & verified',
                'Flat fees — no hidden charges',
                'Cancel anytime before work begins',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle size={13} className="text-green-500 shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
