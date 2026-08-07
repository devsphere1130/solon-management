import { useCallback, useEffect, useMemo, useState } from 'react'
import { WishlistContext } from './wishlistContextValue.js'

const STORAGE_KEY = 'devsphere_wishlist'

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readStoredWishlist)
  const [lastRemoved, setLastRemoved] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems((current) => {
      if (current.some((item) => item.productId === product.id)) {
        return current
      }

      return [
        {
          id: `${product.id}:${Date.now()}`,
          productId: product.id,
          priceAtSave: Number(product.price) || 0,
          addedAt: new Date().toISOString(),
        },
        ...current,
      ]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((current) => {
      const removed = current.find((item) => item.productId === productId)
      if (removed) setLastRemoved(removed)
      return current.filter((item) => item.productId !== productId)
    })
  }, [])

  const toggleItem = useCallback(
    (product) => {
      setItems((current) => {
        const exists = current.some((item) => item.productId === product.id)

        if (!exists) {
          return [
            {
              id: `${product.id}:${Date.now()}`,
              productId: product.id,
              priceAtSave: Number(product.price) || 0,
              addedAt: new Date().toISOString(),
            },
            ...current,
          ]
        }

        const removed = current.find((item) => item.productId === product.id)
        if (removed) setLastRemoved(removed)
        return current.filter((item) => item.productId !== product.id)
      })
    },
    [],
  )

  const markViewed = useCallback((productId) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              lastViewedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }, [])

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return
    setItems((current) => {
      if (current.some((item) => item.productId === lastRemoved.productId)) return current
      return [lastRemoved, ...current]
    })
    setLastRemoved(null)
  }, [lastRemoved])

  const clearLastRemoved = useCallback(() => {
    setLastRemoved(null)
  }, [])

  const isSaved = useCallback(
    (productId) => items.some((item) => item.productId === productId),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      lastRemoved,
      addItem,
      removeItem,
      toggleItem,
      markViewed,
      isSaved,
      undoRemove,
      clearLastRemoved,
    }),
    [items, lastRemoved, addItem, removeItem, toggleItem, markViewed, isSaved, undoRemove, clearLastRemoved],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
