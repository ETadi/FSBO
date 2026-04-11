import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Home as HomeIcon, Camera, FileText, Star, TrendingUp, Shield, CheckCircle, ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { listings } from '../data/index.js'
import ListingCard from '../components/listings/ListingCard.jsx'
import { formatPrice } from '../utils/formatters.js'

const stats = [
  { value: '14,200+', label: 'Homes Listed', icon: HomeIcon },
  { value: '$2.1B', label: 'In Sales Facilitated', icon: TrendingUp },
  { value: '3.1%', label: 'Avg. Commission Saved', icon: Shield },
  { value: '47', label: 'States Covered', icon: CheckCircle },
]

const serviceHighlights = [
  { icon: HomeIcon, label: 'MLS Listing', desc: 'Get on the MLS', from: '$299', to: '/services' },
  { icon: Camera, label: 'Photography', desc: 'Pro photos & tours', from: '$199', to: '/services' },
  { icon: FileText, label: 'Legal & Closing', desc: 'Title & attorneys', from: '$250', to: '/services' },
  { icon: TrendingUp, label: 'Marketing', desc: 'Signs, ads & open houses', from: '$129', to: '/services' },
  { icon: Star, label: 'Home Prep', desc: 'Staging & inspection', from: '$249', to: '/services' },
  { icon: Shield, label: 'Offer Management', desc: 'Expert negotiation', from: '$199', to: '/services' },
]

const testimonials = [
  {
    quote: "We saved $31,000 in agent commissions. FSBO Market's MLS listing got us on Zillow in 24 hours, and we had multiple offers in a week. The transaction coordinator made closing completely stress-free.",
    name: 'Sarah & Michael K.',
    location: 'Tampa, FL',
    saved: '$31,000 saved',
    rating: 5,
  },
  {
    quote: "I was nervous about selling without an agent, but the platform made it easy. Used the HDR photography package and staging consultation — our home sold for $18K over asking in 8 days.",
    name: 'David C.',
    location: 'Nashville, TN',
    saved: '$22,000 saved',
    rating: 5,
  },
  {
    quote: "The a la carte model is genius. I only paid for what I needed: MLS listing, drone photos, and offer review assistance. Saved thousands and had complete control over the whole process.",
    name: 'Jennifer & Tom W.',
    location: 'San Diego, CA',
    saved: '$38,000 saved',
    rating: 5,
  },
]

const steps = [
  { n: '01', icon: HomeIcon, title: 'Create Your Listing', desc: 'Fill in your home details, upload photos, and set your price in under 10 minutes. No paperwork, no agent required.' },
  { n: '02', icon: Star, title: 'Pick Your Services', desc: 'Choose only the services you need — MLS listing, photography, legal help, and more. Pay flat fees, not commissions.' },
  { n: '03', icon: TrendingUp, title: 'Sell & Save', desc: 'Manage showings, review offers, and close on your terms. Keep the commission you earned.' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const featured = listings.filter((l) => l.featured).slice(0, 6)

  function handleSearch(e) {
    e.preventDefault()
    navigate('/listings' + (query ? `?q=${encodeURIComponent(query)}` : ''))
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-full px-4 py-1.5 text-sm text-navy-300 mb-6">
            <CheckCircle size={14} className="text-accent-400" />
            No agent commissions — keep your 3%
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Sell Your Home.<br />
            <span className="text-accent-400">Keep Your Commission.</span>
          </h1>
          <p className="text-xl text-navy-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            List your home on the MLS, access professional services à la carte, and sell on your terms. Average seller saves $24,000.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, ZIP, or neighborhood..."
                className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Search Homes
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              to="/dashboard/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              <HomeIcon size={18} />
              List Your Home Free
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 text-navy-300 hover:text-white transition-colors"
            >
              See how it works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-navy-900">Featured Listings</h2>
              <p className="text-gray-500 mt-1">Handpicked homes from our top FSBO sellers</p>
            </div>
            <Link to="/listings" className="hidden md:inline-flex items-center gap-2 text-navy-700 font-medium hover:text-navy-900 transition-colors">
              View all listings <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/listings" className="inline-flex items-center gap-2 text-navy-700 font-medium">
              View all listings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Sell in 3 Simple Steps</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No agents, no commissions, no surprises. Just a simple platform that puts you in control.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="text-center px-4">
                <div className="relative inline-block mb-5">
                  <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {n.replace('0', '')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white font-medium rounded-xl hover:bg-navy-900 transition-colors"
            >
              Learn more <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Everything You Need to Sell</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Pick only what you need. Pay flat fees, not commissions. All services from vetted professionals.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceHighlights.map(({ icon: Icon, label, desc, from, to }) => (
              <Link
                key={label}
                to={to}
                className="bg-white rounded-xl p-5 text-center shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <div className="w-12 h-12 bg-navy-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-navy-100 transition-colors">
                  <Icon size={22} className="text-navy-700" />
                </div>
                <p className="font-semibold text-navy-900 text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-500 mb-2">{desc}</p>
                <p className="text-xs font-medium text-accent-600">from {from}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-xl hover:bg-accent-600 transition-colors"
            >
              Browse all services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Real Sellers, Real Savings</h2>
            <p className="text-gray-500">Join thousands of homeowners who sold on their terms</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, location, saved, rating }) => (
              <div key={name} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-accent-500 fill-accent-500" />
                  ))}
                </div>
                <Quote size={20} className="text-navy-200 mb-3" />
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">"{quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-500">{location}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {saved}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-navy-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Sell on Your Terms?</h2>
          <p className="text-navy-300 text-lg mb-8">Create your free listing in minutes. No commitment until you're ready to publish.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard/listings/new"
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors"
            >
              List Your Home — It's Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 border border-navy-600 text-white hover:bg-navy-800 font-medium rounded-xl transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
