import { useContext } from 'react'
import { ServiceImagesContext } from './serviceImagesContextValue.js'

export function useServiceImages() {
  const context = useContext(ServiceImagesContext)

  if (!context) {
    throw new Error('useServiceImages must be used within a ServiceImagesProvider')
  }

  return context
}

