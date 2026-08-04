const MAX_SOURCE_BYTES = 8 * 1024 * 1024
const MAX_VIDEO_BYTES = 15 * 1024 * 1024
const MAX_MODEL_BYTES = 12 * 1024 * 1024

function readAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('That file could not be read as an image.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('That file could not be read.'))
    reader.readAsDataURL(file)
  })
}

// Downscales and re-encodes client-side since there is no upload API yet.
export async function resizeImageFile(file, { maxWidth = 1280, quality = 0.75 } = {}) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('That image is too large (max 8MB).')
  }

  const img = await readAsImage(file)
  const scale = Math.min(1, maxWidth / img.width)
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(img, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', quality)
  const fileSize = Math.round((dataUrl.length * 3) / 4)

  return { dataUrl, fileName: file.name, fileSize, mimeType: 'image/jpeg' }
}

// No client-side video compression; admins should upload already-compressed clips.
export function readVideoFile(file, { maxBytes = MAX_VIDEO_BYTES } = {}) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('Please choose a video file.'))
      return
    }

    if (file.size > maxBytes) {
      reject(new Error(`That video is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).`))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve({ dataUrl: reader.result, fileName: file.name, fileSize: file.size, mimeType: file.type })
    reader.onerror = () => reject(new Error('That file could not be read.'))
    reader.readAsDataURL(file)
  })
}

export function readModelFile(file, { maxBytes = MAX_MODEL_BYTES } = {}) {
  return new Promise((resolve, reject) => {
    const isSupportedModel =
      file.name.toLowerCase().endsWith('.glb') ||
      file.name.toLowerCase().endsWith('.gltf') ||
      file.type === 'model/gltf-binary' ||
      file.type === 'model/gltf+json'

    if (!isSupportedModel) {
      reject(new Error('Please choose a .glb or .gltf product model.'))
      return
    }

    if (file.size > maxBytes) {
      reject(new Error(`That 3D model is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).`))
      return
    }

    const reader = new FileReader()
    reader.onload = () =>
      resolve({ dataUrl: reader.result, fileName: file.name, fileSize: file.size, mimeType: file.type || 'model/gltf-binary' })
    reader.onerror = () => reject(new Error('That model file could not be read.'))
    reader.readAsDataURL(file)
  })
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
