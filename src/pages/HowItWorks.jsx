import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Camera, DollarSign, FileText, CheckCircle, Search, MessageSquare, ArrowRight } from 'lucide-react'

const sellerSteps = [
  {
    icon: Home,
    title: 'Create Your Listing',
    time: '10 minutes',
    desc: 'Enter your home details, upload photos, and set your asking price. Our intuitive listing builder walks you through every field. No real estate experience required.',
    tip: 'Tip: Homes with 25+ professional photos get 3x more views.',
  },
  {
    icon: Camera,
    title: 'Choose Your Services',
    time: 'Pick and choose',
    desc: 'Browse our à la carte marketplace and add only the services you need — MLS listing, photography, legal review, or all of the above. Every service has a flat fee with no surprises.',
    tip: 'Tip: The Professional package ($499) includes MLS + photos + yard sign — our best value.',
  },
  {
    icon: DollarSign,
    title: 'Manage Showings & Offers',
    time: 'On your schedule',
    desc: 'Receive buyer inquiries directly to your inbox, schedule showings on your terms, and review offers as they come in. Use our offer review service for expert guidance.',
    tip: 'Tip: Responding to inquiries within 2 hours increases your chances of a showing by 40%.',
  },
  {
    icon: FileText,
    title: 'Close the Deal',
    time: 'With support',
    desc: 'Work with our title company and attorney partners to navigate the closing process. Our transaction coordinator service handles all the paperwork and deadlines for a smooth close.',
    tip: 'Tip: A pre-listing inspection and title search help avoid last-minute deal-killers.',
  },
]

const buyerSteps = [
  {
    icon: Search,
    title: 'Search Verified Listings',
    desc: 'Browse FSBO listings across the country. Filter by price, location, size, and property type. Every listing is submitted by the actual homeowner.',
  },
  {
    icon: MessageSquare,
    title: 'Contact Sellers Directly',
    desc: 'Use the built-in contact form or call/text sellers directly. No agent middleman means faster responses and more transparent communication.',
  },
  {
    icon: CheckCircle,
    title: 'Make an Offer',
    desc: 'Submit your offer directly to the seller. We recommend working with a real estate attorney to prepare your purchase agreement and protect your interests.',
  },
]

export default function HowItWorks() {
  const [tab, setTab] = useState('sellers')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-navy-900 mb-3">How FSBOMarket Works</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Whether you're selling or buying, we've made the process simple, transparent, and affordable.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-12">
        {[['sellers', 'For Sellers'], ['buyers', 'For Buyers']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              tab === id ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'sellers' && (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 mb-12">
            {sellerSteps.map(({ icon: Icon, title, time, desc, tip }, i) => (
              <div key={title} className="flex gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {i + 1}
                  </div>
                  {i < sellerSteps.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-navy-900">{title}</h2>
                    <span className="bg-navy-100 text-navy-700 text-xs font-medium px-2.5 py-1 rounded-full">{time}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-3">{desc}</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-800">
                    {tip}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/dashboard/listings/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors">
              Start Your Listing <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {tab === 'buyers' && (
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {buyerSteps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-white rounded-xl shadow-card p-6 text-center">
                <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-white" />
                </div>
                <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Step {i + 1}</p>
                <h3 className="font-semibold text-navy-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-800">
            <strong>Note for Buyers:</strong> FSBOMarket is a listing platform. We do not represent buyers or sellers as a real estate agent. We recommend working with a licensed attorney or buyer's agent in your state to protect your interests in any transaction.
          </div>

          <div className="text-center">
            <Link to="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-xl transition-colors">
              Browse Listings <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Common Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Is FSBOMarket available in my state?', a: 'We currently serve sellers in 47 states. MLS listing coverage varies by market — check our services page for MLS availability in your area.' },
            { q: 'Do I need a real estate license to sell my own home?', a: 'No. Homeowners can legally sell their own property without a real estate license in all 50 states.' },
            { q: 'How is FSBOMarket different from Zillow or Realtor.com?', a: 'Zillow and Realtor.com are listing aggregators — they show listings from agents and MLS feeds. FSBOMarket is a direct FSBO platform where sellers list directly. We also offer the service marketplace to help you access professional services without hiring a full-commission agent.' },
            { q: 'What if I change my mind and want to hire an agent?', a: 'No problem. You can deactivate your FSBOMarket listing at any time and list with an agent instead. We don\'t lock you in.' },
            { q: 'How do I know if a listing price is fair?', a: 'We recommend ordering a professional appraisal or using a comparative market analysis (CMA) tool. Our home prep services include a certified appraisal option.' },
            { q: 'What disclosures am I required to make?', a: 'Disclosure requirements vary by state. As a seller, you are generally required to disclose known material defects. We strongly recommend reviewing your state\'s disclosure requirements and consulting with a real estate attorney.' },
            { q: 'Can buyers finance a FSBO home?', a: 'Yes. Buyers can use conventional loans, FHA, VA, and other financing options to purchase FSBO homes. The process is the same as buying from an agent-listed home.' },
            { q: 'What happens at closing?', a: 'Closing typically occurs at a title company or attorney\'s office. Both buyer and seller sign documents, funds are transferred, and ownership changes hands. Our transaction coordinator service can guide you through the entire closing process.' },
          ].map(({ q, a }) => (
            <details key={q} className="bg-white rounded-xl shadow-card group">
              <summary className="px-5 py-4 cursor-pointer font-medium text-navy-900 list-none flex items-center justify-between">
                {q}
                <span className="text-gray-400 text-lg">›</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
