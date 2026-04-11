import { createContext, useContext, useState } from 'react'
import { listings as allListings } from '../data/index.js'

const SellerContext = createContext(null)

const DEMO_SELLER = {
  id: 'seller-001',
  name: 'Marcus Holloway',
  email: 'mholloway@email.com',
  phone: '(512) 847-3291',
  memberSince: '2024-11',
}

export function SellerProvider({ children }) {
  const [seller] = useState(DEMO_SELLER)
  const [extraListings, setExtraListings] = useState([])

  const myListings = [
    ...allListings.filter((l) => l.seller.id === seller.id),
    ...extraListings,
  ]

  function createListing(data) {
    const newListing = {
      id: 'listing-new-' + Date.now(),
      slug: 'listing-new-' + Date.now(),
      status: 'active',
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
      seller: { ...DEMO_SELLER, responseTime: 'Usually within 2 hours' },
      stats: { views: 0, saves: 0, inquiries: 0, daysOnMarket: 0 },
      openHouses: [],
    }
    setExtraListings((prev) => [...prev, newListing])
    return newListing
  }

  return (
    <SellerContext.Provider value={{ seller, myListings, createListing }}>
      {children}
    </SellerContext.Provider>
  )
}

export function useSeller() {
  return useContext(SellerContext)
}
