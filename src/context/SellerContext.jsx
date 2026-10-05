import { createContext, useContext, useState, useEffect } from 'react'
import { listings as staticListings } from '../data/index.js'

const SellerContext = createContext(null)

// Mock user database — persisted in localStorage
const MOCK_USERS = [
  {
    id: 'seller-001',
    name: 'Marcus Holloway',
    email: 'marcus@example.com',
    password: 'password',
    phone: '(512) 847-3291',
    memberSince: '2024-11',
    avatar: null,
  },
]

function loadUser() {
  try {
    const saved = localStorage.getItem('fsbo_user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveUser(user) {
  if (user) {
    localStorage.setItem('fsbo_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('fsbo_user')
  }
}

function loadUsers() {
  try {
    const saved = localStorage.getItem('fsbo_all_users')
    if (!saved) return MOCK_USERS
    const stored = JSON.parse(saved)
    // Always ensure seed users are present (merge by id, stored takes precedence)
    const storedIds = new Set(stored.map((u) => u.id))
    const merged = [...stored, ...MOCK_USERS.filter((u) => !storedIds.has(u.id))]
    return merged
  } catch {
    return MOCK_USERS
  }
}

function saveUsers(users) {
  localStorage.setItem('fsbo_all_users', JSON.stringify(users))
}

function loadExtraListings() {
  try {
    const saved = localStorage.getItem('fsbo_extra_listings')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveExtraListings(listings) {
  localStorage.setItem('fsbo_extra_listings', JSON.stringify(listings))
}

export function SellerProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadUser)
  const [extraListings, setExtraListings] = useState(loadExtraListings)

  // Persist extra listings to localStorage
  useEffect(() => {
    saveExtraListings(extraListings)
  }, [extraListings])

  // All listings = static mock data + user-created listings
  const allListings = [...staticListings, ...extraListings]

  const myListings = currentUser
    ? [
        ...staticListings.filter((l) => l.seller.id === currentUser.id),
        ...extraListings.filter((l) => l.seller.id === currentUser.id),
      ]
    : []

  function signIn(email, password) {
    const users = loadUsers()
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) {
      return { success: false, error: 'Invalid email or password.' }
    }
    const { password: _, ...safeUser } = user
    setCurrentUser(safeUser)
    saveUser(safeUser)
    return { success: true, user: safeUser }
  }

  function signUp(name, email, password) {
    const users = loadUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    const newUser = {
      id: 'seller-' + Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: '',
      memberSince: new Date().toISOString().slice(0, 7),
      avatar: null,
    }
    const updated = [...users, newUser]
    saveUsers(updated)
    const { password: _, ...safeUser } = newUser
    setCurrentUser(safeUser)
    saveUser(safeUser)
    return { success: true, user: safeUser }
  }

  function signOut() {
    setCurrentUser(null)
    saveUser(null)
    setExtraListings([])
  }

  function createListing(data) {
    const seller = currentUser || { id: 'guest', name: 'Guest Seller' }
    const newListing = {
      id: 'listing-new-' + Date.now(),
      slug: 'listing-new-' + Date.now(),
      status: 'active',
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
      seller: { ...seller, responseTime: 'Usually within 2 hours' },
      stats: { views: 0, saves: 0, inquiries: 0, daysOnMarket: 0 },
      openHouses: [],
    }
    setExtraListings((prev) => [...prev, newListing])
    return newListing
  }

  return (
    <SellerContext.Provider
      value={{ currentUser, allListings, myListings, signIn, signUp, signOut, createListing }}
    >
      {children}
    </SellerContext.Provider>
  )
}

export function useSeller() {
  return useContext(SellerContext)
}
