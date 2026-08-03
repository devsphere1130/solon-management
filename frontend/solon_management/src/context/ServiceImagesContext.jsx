import { useCallback, useEffect, useMemo, useState } from 'react'
import { resizeImageFile } from '../lib/imageStorage.js'
import { ServiceImagesContext } from './serviceImagesContextValue.js'

const STORAGE_KEY = 'devsphere_service_images'

function readStoredServiceImages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ServiceImagesProvider({ children }) {
  const [serviceImages, setServiceImages] = useState(readStoredServiceImages)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceImages))
      setError('')
    } catch {
      setError('Storage limit reached. Remove a service image before adding another.')
    }
  }, [serviceImages])

  const setServiceCardImage = useCallback(async (serviceId, file) => {
    const record = await resizeImageFile(file, { maxWidth: 1200, quality: 0.78 })
    setServiceImages((prev) => ({ ...prev, [serviceId]: record }))
  }, [])

  const removeServiceCardImage = useCallback((serviceId) => {
    setServiceImages((prev) => {
      const next = { ...prev }
      delete next[serviceId]
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ serviceImages, error, setServiceCardImage, removeServiceCardImage }),
    [serviceImages, error, setServiceCardImage, removeServiceCardImage],
  )

  return <ServiceImagesContext.Provider value={value}>{children}</ServiceImagesContext.Provider>
}
