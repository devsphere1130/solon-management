import { useContext } from 'react'
import { ProductCatalogContext } from './productCatalogContextValue.js'

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext)

  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalogProvider')
  }

  return context
}
