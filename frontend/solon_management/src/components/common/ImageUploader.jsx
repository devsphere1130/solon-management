import { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { formatFileSize } from '../../lib/imageStorage.js'
import { cn } from '../../lib/cn.js'

const aspectClasses = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
}

function ImageUploader({ label, description, image, aspect = 'video', accept = 'image/*', onUpload, onRemove, isDefault = false, className }) {
  const isVideo = image?.mimeType?.startsWith('video/')
  const inputRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setError('')
    setIsUploading(true)
    setProgress(15)

    const tick = setInterval(() => {
      setProgress((value) => (value < 85 ? value + 15 : value))
    }, 120)

    try {
      await onUpload(file)
      setProgress(100)
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      clearInterval(tick)
      setTimeout(() => {
        setIsUploading(false)
        setProgress(0)
      }, 300)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    handleFile(event.dataTransfer.files?.[0])
  }

  return (
    <div className={className}>
      {label && <p className="text-sm font-semibold text-text">{label}</p>}
      {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'relative mt-2 overflow-hidden rounded-xl border border-border bg-background',
          aspectClasses[aspect],
        )}
      >
        {image ? (
          isVideo ? (
            <video src={image.dataUrl} muted loop autoPlay playsInline className="size-full object-cover" />
          ) : (
            <img src={image.dataUrl} alt="" className="size-full object-cover" />
          )
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-full flex-col items-center justify-center gap-2 border-2 border-dashed border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Upload className="size-5" aria-hidden="true" />
            <span className="text-xs font-semibold">Click or drag to upload</span>
          </button>
        )}

        {image && isDefault && (
          <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
            Default
          </span>
        )}

        {isUploading && (
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {image && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {isDefault ? (
              <p className="text-xs font-medium text-text-muted">Using the site default — upload your own to replace it.</p>
            ) : (
              <>
                <p className="truncate text-xs font-medium text-text">{image.fileName}</p>
                <p className="text-[11px] text-text-muted">{formatFileSize(image.fileSize)}</p>
              </>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:text-text"
            >
              <ImagePlus className="size-3.5" aria-hidden="true" />
              Replace
            </button>
            {!isDefault && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}

export default ImageUploader
