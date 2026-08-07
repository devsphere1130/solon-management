import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { resizeImageFile } from '../lib/imageStorage.js'
import { deleteVideoBlob, getVideoBlob, saveVideoBlob, validateVideoFile } from '../lib/videoStorage.js'

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
  const [videoBlobUrls, setVideoBlobUrls] = useState({})
  const [error, setError] = useState('')

  // Metadata (fileName/fileSize/mimeType) for hero/heroBackground video slots still
  // lives in localStorage; the actual video bytes live in IndexedDB (see videoStorage.js)
  // and are only ever addressable via object URLs, which don't survive a reload — so on
  // mount, re-fetch each stored video's blob and mint a fresh object URL for it.
  useEffect(() => {
    let cancelled = false

    async function hydrateVideos() {
      const entries = await Promise.all(
        [...videoSlots].map(async (slot) => {
          if (!images[slot]) return null
          const blob = await getVideoBlob(slot)
          return blob ? [slot, URL.createObjectURL(blob)] : null
        }),
      )
      if (cancelled) return
      setVideoBlobUrls(Object.fromEntries(entries.filter(Boolean)))
    }

    hydrateVideos()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
      setError('')
    } catch {
      setError('Storage limit reached — remove an image before adding another.')
    }
  }, [images])

  const setImage = useCallback(async (slot, file) => {
    if (videoSlots.has(slot)) {
      const meta = validateVideoFile(file)
      await saveVideoBlob(slot, file)
      const url = URL.createObjectURL(file)
      setVideoBlobUrls((prev) => {
        if (prev[slot]) URL.revokeObjectURL(prev[slot])
        return { ...prev, [slot]: url }
      })
      setImages((prev) => ({ ...prev, [slot]: meta }))
      return
    }

    const record = await resizeImageFile(file, { maxWidth: 1280, quality: 0.75 })
    setImages((prev) => ({ ...prev, [slot]: record }))
  }, [])

  const removeImage = useCallback((slot) => {
    if (videoSlots.has(slot)) {
      deleteVideoBlob(slot)
      setVideoBlobUrls((prev) => {
        if (!prev[slot]) return prev
        URL.revokeObjectURL(prev[slot])
        const next = { ...prev }
        delete next[slot]
        return next
      })
    }
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

  const resolvedImages = useMemo(() => {
    const merged = { ...images }
    videoSlots.forEach((slot) => {
      if (merged[slot] && videoBlobUrls[slot]) {
        merged[slot] = { ...merged[slot], dataUrl: videoBlobUrls[slot] }
      }
    })
    return merged
  }, [images, videoBlobUrls])

  const value = useMemo(
    () => ({ images: resolvedImages, error, setImage, removeImage, setFeatureImage, removeFeatureImage, addBanner, removeBanner }),
    [resolvedImages, error, setImage, removeImage, setFeatureImage, removeFeatureImage, addBanner, removeBanner],
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
