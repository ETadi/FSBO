import { Link } from 'react-router-dom'
import { Check, X, ArrowRight } from 'lucide-react'
import { services, serviceCategories } from '../data/index.js'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/formatters.js'

const tiers = [
  {
    name: 'Basic',
    price: 0,
    desc: 'Get your listing in front of buyers — no cost to start.',
    features: [
      { label: 'Listing on FSBOMarket', yes: true },
      { label: 'Up to 10 photos', yes: true },
      { label: 'Buyer contact form', yes: true },
      { label: 'Email support', yes: true },
      { label: 'MLS listing', yes: false },
      { label: 'Photos included', yes: false },
      { label: 'Yard sign + lockbox', yes: false },
      { label: 'Social media ads', yes: false },
      { label: 'Contract review', yes: false },
      { label: 'Dedicated support', yes: false },
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Professional',
    price: 499,
    desc: 'Everything you need for a confident, successful sale.',
    features: [
      { label: 'Listing on FSBOMarket', yes: true },
      { label: 'Unlimited photos', yes: true },
      { label: 'Buyer contact form', yes: true },
      { label: 'Priority email support', yes: true },
      { label: 'Flat-fee MLS (3 months)', yes: true },
      { label: '25 basic photos included', yes: true },
      { label: 'Yard sign + lockbox', yes: true },
      { label: 'Social media ads', yes: false },
      { label: 'Contract review', yes: false },
      { label: 'Dedicated support', yes: false },
    ],
    cta: 'Get Professional',
    popular: true,
  },
  {
    name: 'Premium',
    price: 999,
    desc: 'White-glove service for sellers who want it all.',
    features: [
      { label: 'Listing on FSBOMarket', yes: true },
      { label: 'Unlimited photos', yes: true },
      { label: 'Buyer contact form', yes: true },
      { label: 'Dedicated agent support', yes: true },
      { label: 'Flat-fee MLS (6 months)', yes: true },
      { label: '40 HDR photos included', yes: true },
      { label: 'Yard sign + lockbox', yes: true },
      { label: 'Social media ads', yes: true },
      { label: 'Contract review', yes: true },
      { label: 'Dedicated support', yes: true },
    ],
    cta: 'Go Premium',
    popular: false,
  },
]

export default function Pricing() {
  const { addService, isInCart } = useCart()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-navy-900 mb-3">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Choose a package or build your own plan with à la carte services. No hidden fees. No commission.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {tiers.map((tier) => (
          <div key={tier.name} className={`relative bg-white rounded-2xl shadow-card p-7 flex flex-col ${tier.popular ? 'ring-2 ring-navy-700' : ''}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-navy-700 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-navy-900 mb-1">{tier.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                {tier.price === 0 ? (
                  <span className="text-4xl font-bold text-navy-900">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-navy-900">{formatPrice(tier.price)}</span>
                    <span className="text-gray-400">one-time</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500">{tier.desc}</p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-6">
              {tier.features.map(({ label, yes }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  {yes
                    ? <Check size={15} className="text-green-500 shrink-0" />
                    : <X size={15} className="text-gray-300 shrink-0" />}
                  <span className={yes ? 'text-gray-800' : 'text-gray-400'}>{label}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/dashboard/listings/new"
              className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                tier.popular
                  ? 'bg-navy-800 text-white hover:bg-navy-900'
                  : 'border border-navy-700 text-navy-700 hover:bg-navy-50'
              }`}
            >
              {tier.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* A La Carte */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-2">À La Carte Services</h2>
          <p className="text-gray-500">Add any service individually to any plan.</p>
        </div>
        {serviceCategories.map((cat) => {
          const catServices = services.filter((s) => s.category === cat.id)
          return (
            <div key={cat.id} className="mb-6">
              <h3 className="font-semibold text-navy-800 mb-3 text-base">{cat.label}</h3>
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                {catServices.map((svc, i) => (
                  <div key={svc.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="flex-1 min-w-0 mr-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{svc.name}</span>
                        {svc.badge && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{svc.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{svc.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-navy-900">{formatPrice(svc.price)}</span>
                      <button
                        onClick={() => addService(svc.id)}
                        disabled={isInCart(svc.id)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          isInCart(svc.id)
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-navy-800 text-white hover:bg-navy-900'
                        }`}
                      >
                        {isInCart(svc.id) ? 'Added ✓' : 'Add'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Do I need an agent to sell my home?', a: 'No — in most states, you can sell your home without a real estate agent. FSBOMarket provides all the tools and services you need to sell successfully on your own.' },
            { q: 'What is a flat-fee MLS listing?', a: 'A flat-fee MLS listing gets your home listed on the Multiple Listing Service (MLS) for a one-time flat fee instead of a percentage-based commission. Your home is then syndicated to Zillow, Realtor.com, Redfin, and hundreds of other sites.' },
            { q: 'Will I still need to pay a buyer\'s agent commission?', a: 'Potentially. If the buyer is represented by an agent, they may expect a commission (typically 2–3%). This is negotiable and should be discussed with the buyer\'s agent. Many buyers today are unrepresented or willing to negotiate.' },
            { q: 'Are the service providers vetted?', a: 'Yes. Every provider on FSBOMarket is licensed, verified, and reviewed by real sellers. We check licenses, insurance, and monitor reviews to ensure quality.' },
            { q: 'Can I change my listing after publishing?', a: 'Absolutely. You can edit your listing details, photos, and price at any time from your seller dashboard. With MLS listings, changes are typically reflected within 24 hours.' },
            { q: 'Is a lawyer required to sell my home?', a: 'It depends on your state. Some states (like New York and Georgia) legally require an attorney at closing. Others do not. Our service providers can advise you based on your state\'s requirements.' },
          ].map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl shadow-card group">
              <summary className="px-5 py-4 cursor-pointer font-medium text-navy-900 list-none flex items-center justify-between">
                {q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">›</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
