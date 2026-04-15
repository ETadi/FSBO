import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { services } from '../data/index.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('fsbo-cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('fsbo-cart', JSON.stringify(cart))
  }, [cart])

  const addService = useCallback((serviceId) => {
    setCart((prev) => {
      if (prev.find((i) => i.serviceId === serviceId)) return prev
      const svc = services.find((s) => s.id === serviceId)
      if (!svc) return prev
      return [...prev, { serviceId, name: svc.name, price: svc.price, category: svc.category }]
    })
  }, [])

  const removeService = useCallback((serviceId) => {
    setCart((prev) => prev.filter((i) => i.serviceId !== serviceId))
  }, [])

  const isInCart = useCallback((serviceId) => {
    return cart.some((i) => i.serviceId === serviceId)
  }, [cart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const value = useMemo(() => ({
    cart,
    addService,
    removeService,
    isInCart,
    clearCart,
    cartTotal: cart.reduce((sum, i) => sum + i.price, 0),
    itemCount: cart.length,
  }), [cart, addService, removeService, isInCart, clearCart])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
