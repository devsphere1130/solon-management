import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readVideoFile, resizeImageFile } from '../lib/imageStorage.js'

const STORAGE_KEY = 'devsphere_landing_images'
const videoSlots = new Set(['heroVideo', 'heroBackgroundVideo'])

const emptyState = {
  hero: null,
  heroBackground: null,
  heroVideo: null,
  heroBackgroundVideo: null,
  about: null,
  cta: null,
  features: {},
  banners: [],
}

function readStoredImages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyState, ...JSON.parse(raw) } : emptyState
  } catch {
    return emptyState
  }
}

const LandingImagesContext = createContext(null)

export function LandingImagesProvider({ children }) {
  const [images, setImages] = useState(readStoredImages)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
      setError('')
    } catch {
      setError('Storage limit reached — remove an image before adding another.')
    }
  }, [images])

  const setImage = useCallback(async (slot, file) => {
    const record = videoSlots.has(slot) ? await readVideoFile(file) : await resizeImageFile(file, { maxWidth: 1280, quality: 0.75 })
    setImages((prev) => ({ ...prev, [slot]: record }))
  }, [])

  const removeImage = useCallback((slot) => {
    setImages((prev) => ({ ...prev, [slot]: null }))
  }, [])

  const setFeatureImage = useCallback(async (featureId, file) => {
    const record = await resizeImageFile(file, { maxWidth: 480, quality: 0.75 })
    setImages((prev) => ({ ...prev, features: { ...prev.features, [featureId]: record } }))
  }, [])

  const removeFeatureImage = useCallback((featureId) => {
    setImages((prev) => {
      const features = { ...prev.features }
      delete features[featureId]
      return { ...prev, features }
    })
  }, [])

  const addBanner = useCallback(async (file) => {
    const record = await resizeImageFile(file, { maxWidth: 1280, quality: 0.75 })
    setImages((prev) => ({ ...prev, banners: [...prev.banners, { id: `banner-${Date.now()}`, ...record }] }))
  }, [])

  const removeBanner = useCallback((id) => {
    setImages((prev) => ({ ...prev, banners: prev.banners.filter((banner) => banner.id !== id) }))
  }, [])

  const value = useMemo(
    () => ({ images, error, setImage, removeImage, setFeatureImage, removeFeatureImage, addBanner, removeBanner }),
    [images, error, setImage, removeImage, setFeatureImage, removeFeatureImage, addBanner, removeBanner],
  )

  return <LandingImagesContext.Provider value={value}>{children}</LandingImagesContext.Provider>
}

export function useLandingImages() {
  const context = useContext(LandingImagesContext)

  if (!context) {
    throw new Error('useLandingImages must be used within a LandingImagesProvider')
  }

  return context
}
