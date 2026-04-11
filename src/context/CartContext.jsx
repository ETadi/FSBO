import { createContext, useContext, useState, useEffect } from 'react'
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

  function addService(serviceId) {
    if (cart.find((i) => i.serviceId === serviceId)) return
    const svc = services.find((s) => s.id === serviceId)
    if (!svc) return
    setCart((prev) => [...prev, { serviceId, name: svc.name, price: svc.price, category: svc.category }])
  }

  function removeService(serviceId) {
    setCart((prev) => prev.filter((i) => i.serviceId !== serviceId))
  }

  function isInCart(serviceId) {
    return cart.some((i) => i.serviceId === serviceId)
  }

  function clearCart() {
    setCart([])
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0)

  return (
    <CartContext.Provider value={{ cart, addService, removeService, isInCart, clearCart, cartTotal, itemCount: cart.length }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
