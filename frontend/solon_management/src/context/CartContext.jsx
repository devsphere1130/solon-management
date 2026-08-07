import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContextValue.js'

const STORAGE_KEY = 'devsphere_cart'

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function buildCartItem(product, { quantity = 1, variantName } = {}) {
  const variant = product.variants?.find((item) => item.name === variantName) ?? product.variants?.[0]
  const itemId = `${product.id}:${variant?.name ?? 'standard'}`
  const unitPrice = Number(variant?.price ?? product.price) || 0

  return {
    id: itemId,
    productId: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    badge: product.badge,
    image: product.images?.[0],
    variant: {
      name: variant?.name ?? 'Standard',
    },
    quantity,
    unitPrice,
    originalPrice: Number(product.originalPrice) || unitPrice,
    stock: Number(product.stock) || 1,
    routineProductIds: product.routineProductIds ?? [],
    addedAt: Date.now(),
  }
}

function clampQuantity(quantity, stock) {
  return Math.max(1, Math.min(Number(quantity) || 1, Math.max(1, Number(stock) || 1)))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [lastRemoved, setLastRemoved] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, options = {}) => {
    const incoming = buildCartItem(product, options)
    const quantityToAdd = clampQuantity(options.quantity ?? 1, incoming.stock)

    setItems((current) => {
      const existing = current.find((item) => item.id === incoming.id)

      if (!existing) {
        return [{ ...incoming, quantity: quantityToAdd }, ...current]
      }

      return current.map((item) =>
        item.id === incoming.id
          ? {
              ...item,
              ...incoming,
              quantity: clampQuantity(item.quantity + quantityToAdd, incoming.stock),
            }
          : item,
      )
    })

    return incoming
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, quantity: clampQuantity(quantity, item.stock) } : item)),
    )
  }, [])

  const removeItem = useCallback((itemId) => {
    setItems((current) => {
      const removed = current.find((item) => item.id === itemId)
      if (removed) setLastRemoved(removed)
      return current.filter((item) => item.id !== itemId)
    })
  }, [])

  const moveToWishlist = useCallback((itemId) => {
    setItems((current) => {
      const removed = current.find((item) => item.id === itemId)
      if (removed) setLastRemoved({ ...removed, wishlist: true })
      return current.filter((item) => item.id !== itemId)
    })
  }, [])

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return
    setItems((current) => {
      if (current.some((item) => item.id === lastRemoved.id)) return current
      return [lastRemoved, ...current]
    })
    setLastRemoved(null)
  }, [lastRemoved])

  const clearLastRemoved = useCallback(() => {
    setLastRemoved(null)
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const originalSubtotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
    const itemDiscount = Math.max(0, originalSubtotal - subtotal)

    return {
      itemCount,
      subtotal,
      originalSubtotal,
      itemDiscount,
    }
  }, [items])

  const value = useMemo(
    () => ({
      items,
      totals,
      lastRemoved,
      addItem,
      updateQuantity,
      removeItem,
      moveToWishlist,
      undoRemove,
      clearLastRemoved,
      clearCart,
    }),
    [items, totals, lastRemoved, addItem, updateQuantity, removeItem, moveToWishlist, undoRemove, clearLastRemoved, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
