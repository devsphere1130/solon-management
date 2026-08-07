// Large video blobs go in IndexedDB instead of localStorage — localStorage's ~5-10MB
// per-origin quota (shared across the whole app) can't hold even one multi-MB video
// once base64-encoded, while IndexedDB comfortably holds tens/hundreds of MB.

const DB_NAME = 'devsphere_media'
const STORE_NAME = 'videos'
const DB_VERSION = 1

const MAX_VIDEO_BYTES = 50 * 1024 * 1024

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Validates only — the raw File is stored as-is (no base64 conversion, so no ~33% bloat).
export function validateVideoFile(file, { maxBytes = MAX_VIDEO_BYTES } = {}) {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please choose a video file.')
  }

  if (file.size > maxBytes) {
    throw new Error(`That video is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).`)
  }

  return { fileName: file.name, fileSize: file.size, mimeType: file.type }
}

export async function saveVideoBlob(key, blob) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(blob, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getVideoBlob(key) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const request = tx.objectStore(STORE_NAME).get(key)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteVideoBlob(key) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export { MAX_VIDEO_BYTES }
