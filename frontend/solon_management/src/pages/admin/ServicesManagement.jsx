import { ImagePlus, RotateCcw, Scissors, Sparkles } from 'lucide-react'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import ImageUploader from '../../components/common/ImageUploader.jsx'
import { useServiceImages } from '../../context/useServiceImages.js'
import { salonServices } from '../../data/services.js'

function AdminPanel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-base font-bold text-text">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-text-muted">{description}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function ServiceImageManager({ service, overrideImage, onUpload, onRemove }) {
  const defaultImage = service.images[0]
  const previewSrc = overrideImage?.dataUrl ?? defaultImage.src
  const isCustom = Boolean(overrideImage)

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="relative h-48 bg-surface">
        <img src={previewSrc} alt={defaultImage.alt} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" aria-hidden="true" />
        <Badge className="absolute top-3 left-3 bg-white/90 text-text shadow-sm">{service.category}</Badge>
        <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-text shadow-sm">
          {isCustom ? 'Custom image' : 'Default image'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-text">{service.name}</h3>
            <p className="mt-1 text-xs text-text-muted">{service.duration} / {service.category}</p>
          </div>
          {isCustom && (
            <button
              type="button"
              onClick={onRemove}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-text-muted hover:bg-surface hover:text-text"
              aria-label={`Reset ${service.name} image to default`}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="mt-4">
          <ImageUploader
            label={isCustom ? 'Replace card image' : 'Upload card image'}
            description="This image appears first on the public service card and detail gallery."
            image={overrideImage}
            aspect="video"
            onUpload={onUpload}
            onRemove={onRemove}
          />
        </div>
      </div>
    </article>
  )
}

function ServicesManagement() {
  const { serviceImages, error, setServiceCardImage, removeServiceCardImage } = useServiceImages()
  const customCount = Object.keys(serviceImages).length

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge>
              <Scissors className="size-3.5" aria-hidden="true" />
              Services
            </Badge>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Service card images</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Replace the primary image for each public service card. Removing a custom image returns that service to its
              original default photo.
            </p>
          </div>
          <div className="rounded-2xl bg-background px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Custom images</p>
            <p className="mt-1 text-2xl font-extrabold text-text">
              {customCount}/{salonServices.length}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{error}</p>
      )}

      <AdminPanel
        title="Public service cards"
        description="Upload consistent, landscape-oriented images for best results. Each image is compressed locally before being saved in this browser."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {salonServices.map((service) => (
            <ServiceImageManager
              key={service.id}
              service={service}
              overrideImage={serviceImages[service.id]}
              onUpload={(file) => setServiceCardImage(service.id, file)}
              onRemove={() => removeServiceCardImage(service.id)}
            />
          ))}
        </div>
      </AdminPanel>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-text">Public page preview</p>
              <p className="text-xs text-text-muted">Open the services page to see updated cards immediately.</p>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={() => window.open('/services', '_blank', 'noopener,noreferrer')}>
            <ImagePlus className="size-4" aria-hidden="true" />
            View services page
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServicesManagement
