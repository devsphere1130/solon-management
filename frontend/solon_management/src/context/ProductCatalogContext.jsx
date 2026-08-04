import { useCallback, useEffect, useMemo, useState } from 'react'
import { products as seedProducts } from '../data/products.js'
import { ProductCatalogContext } from './productCatalogContextValue.js'

const STORAGE_KEY = 'devsphere_product_catalog'

const emptyCatalog = {
  edits: {},
  customProducts: [],
}

function readStoredCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyCatalog, ...JSON.parse(raw) } : emptyCatalog
  } catch {
    return emptyCatalog
  }
}

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
    rating: Number(product.rating) || 0,
    reviewCount: Number(product.reviewCount) || 0,
    stock: Number(product.stock) || 0,
    images: product.images?.length ? product.images : seedProducts[0].images,
    benefits: product.benefits?.length ? product.benefits : ['Professional salon recommendation'],
    howToUse: product.howToUse?.length ? product.howToUse : ['Use as directed by your salon expert'],
    ingredients: product.ingredients?.length ? product.ingredients : ['Salon-grade formula'],
    variants: product.variants?.length ? product.variants : [{ name: 'Standard', price: Number(product.price) || 0 }],
    expert: {
      name: product.expert?.name || 'Salon Professional',
      role: product.expert?.role || 'Product Expert',
      quote: product.expert?.quote || 'Recommended for a polished at-home care routine.',
      avatar: product.expert?.avatar || seedProducts[0].expert.avatar,
    },
    routineProductIds: product.routineProductIds ?? [],
  }
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ProductCatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(readStoredCatalog)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
      setError('')
    } catch {
      setError('Storage limit reached. Remove some product images or 3D models before saving more.')
    }
  }, [catalog])

  const products = useMemo(() => {
    const baseIds = new Set(seedProducts.map((product) => product.id))
    const editedSeeds = seedProducts.map((product) => normalizeProduct({ ...product, ...catalog.edits[product.id] }))
    const customProducts = catalog.customProducts
      .filter((product) => !baseIds.has(product.id))
      .map((product) => normalizeProduct({ ...product, isCustom: true }))

    return [...editedSeeds, ...customProducts]
  }, [catalog])

  const getProductById = useCallback(
    (productId) => products.find((product) => product.id === productId),
    [products],
  )

  const getProductsByIds = useCallback(
    (productIds) => productIds.map(getProductById).filter(Boolean),
    [getProductById],
  )

  const saveProduct = useCallback((product, originalId = product.id) => {
    const seedIds = new Set(seedProducts.map((item) => item.id))
    const isSeedProduct = seedIds.has(originalId)
    const normalizedProduct = normalizeProduct({
      ...product,
      id: product.id || createSlug(product.name) || `product-${Date.now()}`,
    })

    setCatalog((prev) => {
      if (isSeedProduct) {
        return {
          ...prev,
          edits: {
            ...prev.edits,
            [originalId]: normalizedProduct,
          },
        }
      }

      const nextCustomProducts = prev.customProducts.some((item) => item.id === originalId)
        ? prev.customProducts.map((item) => (item.id === originalId ? normalizedProduct : item))
        : [...prev.customProducts, normalizedProduct]

      return {
        ...prev,
        customProducts: nextCustomProducts,
      }
    })

    return normalizedProduct.id
  }, [])

  const resetProduct = useCallback((productId) => {
    setCatalog((prev) => {
      const nextEdits = { ...prev.edits }
      delete nextEdits[productId]
      return { ...prev, edits: nextEdits }
    })
  }, [])

  const deleteProduct = useCallback((productId) => {
    setCatalog((prev) => ({
      ...prev,
      customProducts: prev.customProducts.filter((product) => product.id !== productId),
    }))
  }, [])

  const hasProductOverride = useCallback((productId) => Boolean(catalog.edits[productId]), [catalog.edits])
  const isCustomProduct = useCallback((productId) => catalog.customProducts.some((product) => product.id === productId), [catalog.customProducts])

  const value = useMemo(
    () => ({
      products,
      error,
      saveProduct,
      resetProduct,
      deleteProduct,
      getProductById,
      getProductsByIds,
      hasProductOverride,
      isCustomProduct,
    }),
    [products, error, saveProduct, resetProduct, deleteProduct, getProductById, getProductsByIds, hasProductOverride, isCustomProduct],
  )

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>
}
