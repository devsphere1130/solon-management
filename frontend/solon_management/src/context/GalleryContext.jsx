import { useCallback, useEffect, useMemo, useState } from 'react'
import { galleryAlbums, galleryMedia } from '../data/gallery.js'
import { GalleryContext } from './galleryContextValue.js'

const STORAGE_KEY = 'devsphere_gallery_media'
const ALBUMS_STORAGE_KEY = 'devsphere_gallery_albums'
const INTERACTIONS_STORAGE_KEY = 'devsphere_gallery_interactions'
const FEATURED_LIMIT = 6

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function normalizeMedia(media) {
  return [...media].sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
}

function buildInteractionState() {
  return {
    likedIds: [],
    savedIds: [],
    sharedIds: [],
  }
}

export function GalleryProvider({ children }) {
  const [media, setMedia] = useState(() => normalizeMedia(readStorage(STORAGE_KEY, galleryMedia)))
  const [albums, setAlbums] = useState(() => readStorage(ALBUMS_STORAGE_KEY, galleryAlbums))
  const [interactions, setInteractions] = useState(() => readStorage(INTERACTIONS_STORAGE_KEY, buildInteractionState()))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(media))
  }, [media])

  useEffect(() => {
    localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums))
  }, [albums])

  useEffect(() => {
    localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(interactions))
  }, [interactions])

  const publishedMedia = useMemo(
    () => normalizeMedia(media.filter((item) => item.status === 'published' && !item.deletedAt)),
    [media],
  )

  const featuredMedia = useMemo(
    () => publishedMedia.filter((item) => item.isFeatured).slice(0, FEATURED_LIMIT),
    [publishedMedia],
  )

  const trashedMedia = useMemo(
    () => normalizeMedia(media.filter((item) => item.deletedAt)),
    [media],
  )

  const saveMedia = useCallback((draft) => {
    const now = new Date().toISOString()
    const existing = media.find((item) => item.id === draft.id)
    const nextItem = {
      ...draft,
      tags: Array.isArray(draft.tags) ? draft.tags : [],
      stats: draft.stats ?? existing?.stats ?? { views: 0, likes: 0, saves: 0, shares: 0, serviceClicks: 0, bookingClicks: 0, bookings: 0 },
      sortOrder: Number(draft.sortOrder ?? existing?.sortOrder ?? media.length + 1),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }

    setMedia((current) => {
      const next = existing
        ? current.map((item) => (item.id === draft.id ? nextItem : item))
        : [nextItem, ...current]
      return normalizeMedia(next)
    })

    return nextItem.id
  }, [media])

  const addMedia = useCallback((items) => {
    const now = new Date().toISOString()
    const normalizedItems = items.map((item, index) => ({
      ...item,
      id: item.id || `gallery-${Date.now()}-${index}`,
      status: item.status ?? 'draft',
      isFeatured: Boolean(item.isFeatured),
      sortOrder: Number(item.sortOrder ?? media.length + index + 1),
      stats: item.stats ?? { views: 0, likes: 0, saves: 0, shares: 0, serviceClicks: 0, bookingClicks: 0, bookings: 0 },
      createdAt: now,
      updatedAt: now,
    }))

    setMedia((current) => normalizeMedia([...normalizedItems, ...current]))
    return normalizedItems
  }, [media.length])

  const duplicateMedia = useCallback((mediaId) => {
    const source = media.find((item) => item.id === mediaId)
    if (!source) return null

    const copy = {
      ...source,
      id: `${source.id}-copy-${Date.now()}`,
      title: `${source.title} Copy`,
      status: 'draft',
      isFeatured: false,
      sortOrder: media.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setMedia((current) => normalizeMedia([copy, ...current]))
    return copy
  }, [media])

  const updateStatus = useCallback((mediaId, status) => {
    setMedia((current) =>
      normalizeMedia(
        current.map((item) =>
          item.id === mediaId
            ? {
                ...item,
                status,
                deletedAt: null,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      ),
    )
  }, [])

  const moveToTrash = useCallback((mediaId) => {
    setMedia((current) =>
      current.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              deletedAt: new Date().toISOString(),
              status: 'archived',
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }, [])

  const restoreMedia = useCallback((mediaId) => {
    setMedia((current) =>
      normalizeMedia(
        current.map((item) =>
          item.id === mediaId
            ? {
                ...item,
                deletedAt: null,
                status: 'draft',
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      ),
    )
  }, [])

  const deletePermanently = useCallback((mediaId) => {
    setMedia((current) => current.filter((item) => item.id !== mediaId))
  }, [])

  const reorderMedia = useCallback((mediaId, direction) => {
    setMedia((current) => {
      const ordered = normalizeMedia(current)
      const index = ordered.findIndex((item) => item.id === mediaId)
      const targetIndex = direction === 'up' ? index - 1 : index + 1

      if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) {
        return current
      }

      const next = [...ordered]
      const [item] = next.splice(index, 1)
      next.splice(targetIndex, 0, item)
      return next.map((entry, nextIndex) => ({ ...entry, sortOrder: nextIndex + 1 }))
    })
  }, [])

  const saveAlbum = useCallback((album) => {
    const record = {
      ...album,
      id: album.id || `album-${Date.now()}`,
    }

    setAlbums((current) => {
      const exists = current.some((item) => item.id === record.id)
      return exists ? current.map((item) => (item.id === record.id ? record : item)) : [record, ...current]
    })

    return record.id
  }, [])

  const toggleInteraction = useCallback((mediaId, key) => {
    setInteractions((current) => {
      const ids = new Set(current[key] ?? [])
      if (ids.has(mediaId)) ids.delete(mediaId)
      else ids.add(mediaId)
      return { ...current, [key]: [...ids] }
    })
  }, [])

  const markShared = useCallback((mediaId) => {
    setInteractions((current) => {
      const ids = new Set(current.sharedIds ?? [])
      ids.add(mediaId)
      return { ...current, sharedIds: [...ids] }
    })
  }, [])

  const value = useMemo(
    () => ({
      media,
      albums,
      publishedMedia,
      featuredMedia,
      trashedMedia,
      likedIds: interactions.likedIds ?? [],
      savedIds: interactions.savedIds ?? [],
      sharedIds: interactions.sharedIds ?? [],
      featuredLimit: FEATURED_LIMIT,
      saveMedia,
      addMedia,
      duplicateMedia,
      updateStatus,
      moveToTrash,
      restoreMedia,
      deletePermanently,
      reorderMedia,
      saveAlbum,
      toggleLike: (mediaId) => toggleInteraction(mediaId, 'likedIds'),
      toggleSave: (mediaId) => toggleInteraction(mediaId, 'savedIds'),
      markShared,
    }),
    [
      media,
      albums,
      publishedMedia,
      featuredMedia,
      trashedMedia,
      interactions,
      saveMedia,
      addMedia,
      duplicateMedia,
      updateStatus,
      moveToTrash,
      restoreMedia,
      deletePermanently,
      reorderMedia,
      saveAlbum,
      toggleInteraction,
      markShared,
    ],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}
