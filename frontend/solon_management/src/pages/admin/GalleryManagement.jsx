import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Archive,
  BarChart3,
  CalendarClock,
  Check,
  ChevronDown,
  Copy,
  Eye,
  FileImage,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  MoveDown,
  MoveUp,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import { cn } from '../../lib/cn.js'
import { formatFileSize, readVideoFile, resizeImageFile } from '../../lib/imageStorage.js'
import { useGallery } from '../../context/useGallery.js'
import { galleryCategories, galleryProfessionals, galleryTypeFilters } from '../../data/gallery.js'
import { salonServices } from '../../data/services.js'
import { products } from '../../data/products.js'

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'media', label: 'Media', icon: FileImage },
  { id: 'albums', label: 'Albums', icon: FolderOpen },
  { id: 'before-after', label: 'Before & After', icon: Layers },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
  { id: 'trash', label: 'Trash', icon: Trash2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const statusOptions = ['draft', 'published', 'scheduled', 'archived']
const adminFilters = ['All', 'Published', 'Draft', 'Scheduled', 'Archived', 'Photos', 'Videos', 'Featured']

function emptyDraft() {
  const now = Date.now()
  return {
    id: `gallery-${now}`,
    type: 'image',
    title: 'New Gallery Moment',
    caption: 'Describe the look, transformation, or salon moment.',
    category: 'Makeup',
    contentType: 'Photos',
    mediaUrl: '',
    thumbnailUrl: '',
    beforeImage: '',
    afterImage: '',
    alt: 'Salon gallery image',
    serviceId: 'soft-glam-makeup',
    professionalId: 'sara',
    productIds: [],
    albumId: '',
    tags: [],
    isFeatured: false,
    status: 'draft',
    publishAt: '',
    sortOrder: 1,
  }
}

function mediaPreviewUrl(item) {
  return item.thumbnailUrl || item.mediaUrl || item.afterImage || item.beforeImage
}

function toTagText(tags) {
  return (tags ?? []).join(', ')
}

function fromTagText(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function statusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function SummaryCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <p className="mt-4 text-3xl font-extrabold text-text">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p>
    </article>
  )
}

function GalleryManagement() {
  const gallery = useGallery()
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [category, setCategory] = useState('All')
  const [editingItem, setEditingItem] = useState(null)
  const [previewItem, setPreviewItem] = useState(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [notice, setNotice] = useState('')

  const stats = useMemo(() => {
    const activeMedia = gallery.media.filter((item) => !item.deletedAt)
    return {
      total: activeMedia.length,
      photos: activeMedia.filter((item) => item.type === 'image').length,
      videos: activeMedia.filter((item) => item.type === 'video').length,
      beforeAfter: activeMedia.filter((item) => item.type === 'before_after').length,
      published: activeMedia.filter((item) => item.status === 'published').length,
      draft: activeMedia.filter((item) => item.status === 'draft').length,
      scheduled: activeMedia.filter((item) => item.status === 'scheduled').length,
      archived: activeMedia.filter((item) => item.status === 'archived').length,
      featured: activeMedia.filter((item) => item.isFeatured).length,
    }
  }, [gallery.media])

  const visibleMedia = useMemo(() => {
    const query = search.trim().toLowerCase()
    return gallery.media
      .filter((item) => !item.deletedAt)
      .filter((item) => category === 'All' || item.category === category)
      .filter((item) => {
        if (filter === 'All') return true
        if (filter === 'Published') return item.status === 'published'
        if (filter === 'Draft') return item.status === 'draft'
        if (filter === 'Scheduled') return item.status === 'scheduled'
        if (filter === 'Archived') return item.status === 'archived'
        if (filter === 'Photos') return item.type === 'image'
        if (filter === 'Videos') return item.type === 'video'
        if (filter === 'Featured') return item.isFeatured
        return true
      })
      .filter((item) => {
        if (!query) return true
        return [item.title, item.caption, item.tags?.join(' '), item.category, item.serviceId, item.professionalId]
          .join(' ')
          .toLowerCase()
          .includes(query)
      })
  }, [category, filter, gallery.media, search])

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 1700)
  }

  function handleSave(draft) {
    gallery.saveMedia(draft)
    setEditingItem(null)
    showNotice('Gallery media saved.')
  }

  function handleUpload(items) {
    gallery.addMedia(items)
    setIsUploadOpen(false)
    setActiveTab('media')
    showNotice(`${items.length} media item${items.length === 1 ? '' : 's'} added.`)
  }

  function handleMoveTrash(item) {
    gallery.moveToTrash(item.id)
    setDeleteTarget(null)
    showNotice('Moved to trash.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge>
              <Sparkles className="size-3.5" aria-hidden="true" />
              Gallery Management
            </Badge>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Salon visual portfolio manager</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Upload, organize, publish, schedule, feature, and analyze photos, reels, videos, albums, and transformations.
            </p>
          </div>
          <Button type="button" onClick={() => setIsUploadOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add Media
          </Button>
        </div>
      </div>

      {notice && <p className="rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-semibold text-success">{notice}</p>}

      <div className="premium-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-soft">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors',
                selected ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:bg-background hover:text-text',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
              {tab.id === 'trash' && gallery.trashedMedia.length > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{gallery.trashedMedia.length}</span>
              )}
            </button>
          )
        })}
      </div>

      {activeTab === 'overview' && <Overview stats={stats} media={gallery.media} />}
      {activeTab === 'media' && (
        <MediaManager
          media={visibleMedia}
          stats={stats}
          filter={filter}
          onFilter={setFilter}
          category={category}
          onCategory={setCategory}
          search={search}
          onSearch={setSearch}
          onEdit={setEditingItem}
          onPreview={setPreviewItem}
          onDuplicate={(item) => {
            gallery.duplicateMedia(item.id)
            showNotice('Media duplicated as draft.')
          }}
          onStatus={gallery.updateStatus}
          onTrash={setDeleteTarget}
          onReorder={gallery.reorderMedia}
        />
      )}
      {activeTab === 'albums' && <AlbumsManager albums={gallery.albums} media={gallery.media} onSave={gallery.saveAlbum} />}
      {activeTab === 'before-after' && <BeforeAfterManager media={gallery.media.filter((item) => item.type === 'before_after' && !item.deletedAt)} onEdit={setEditingItem} onCreate={() => setEditingItem({ ...emptyDraft(), type: 'before_after', contentType: 'Before & After', category: 'Before & After' })} />}
      {activeTab === 'scheduled' && <ScheduledManager media={gallery.media.filter((item) => item.status === 'scheduled' && !item.deletedAt)} onEdit={setEditingItem} onPublish={(item) => gallery.updateStatus(item.id, 'published')} />}
      {activeTab === 'trash' && <TrashManager media={gallery.trashedMedia} onRestore={gallery.restoreMedia} onDelete={gallery.deletePermanently} />}
      {activeTab === 'settings' && <GallerySettings stats={stats} featuredLimit={gallery.featuredLimit} />}

      <AnimatePresence>
        {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />}
      </AnimatePresence>

      <AnimatePresence>
        {editingItem && (
          <EditMediaModal
            item={editingItem}
            albums={gallery.albums}
            featuredCount={stats.featured}
            featuredLimit={gallery.featuredLimit}
            onClose={() => setEditingItem(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewItem && <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmTrashDialog
            item={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => handleMoveTrash(deleteTarget)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Overview({ stats, media }) {
  const topMedia = [...media]
    .filter((item) => !item.deletedAt)
    .sort((a, b) => (b.stats?.views ?? 0) - (a.stats?.views ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Media" value={stats.total} icon={FileImage} />
        <SummaryCard label="Photos" value={stats.photos} icon={ImageIcon} />
        <SummaryCard label="Videos" value={stats.videos} icon={Play} />
        <SummaryCard label="Drafts" value={stats.draft} icon={Archive} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Published" value={stats.published} icon={Check} />
        <SummaryCard label="Scheduled" value={stats.scheduled} icon={CalendarClock} />
        <SummaryCard label="Archived" value={stats.archived} icon={Archive} />
        <SummaryCard label="Featured" value={stats.featured} icon={Sparkles} />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-extrabold text-text">Top gallery content</h2>
        <div className="mt-4 grid gap-3">
          {topMedia.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-xl border border-border bg-background p-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-text">{index + 1}. {item.title}</p>
                <p className="mt-1 text-xs text-text-muted">{item.category} / {statusLabel(item.status)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right text-xs sm:grid-cols-4">
                <Metric label="Views" value={item.stats?.views ?? 0} />
                <Metric label="Likes" value={item.stats?.likes ?? 0} />
                <Metric label="Service clicks" value={item.stats?.serviceClicks ?? 0} />
                <Metric label="Bookings" value={item.stats?.bookings ?? 0} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="font-extrabold text-text">{value}</p>
      <p className="text-text-muted">{label}</p>
    </div>
  )
}

function MediaManager({ media, filter, onFilter, category, onCategory, search, onSearch, onEdit, onPreview, onDuplicate, onStatus, onTrash, onReorder }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search gallery..."
              className="h-11 w-full rounded-xl border border-border bg-background pr-3 pl-10 text-sm font-semibold text-text outline-none focus:border-primary"
            />
          </label>
          <Select value={category} onChange={(event) => onCategory(event.target.value)} aria-label="Filter by category">
            <option value="All">All Categories</option>
            {galleryCategories.filter((item) => item !== 'All').map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Select value={filter} onChange={(event) => onFilter(event.target.value)} aria-label="Filter media status">
            {adminFilters.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => (
          <AdminMediaCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onPreview={onPreview}
            onDuplicate={onDuplicate}
            onStatus={onStatus}
            onTrash={onTrash}
            onReorder={onReorder}
          />
        ))}
      </motion.div>

      {media.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-soft">
          <FileImage className="mx-auto size-8 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-extrabold text-text">No media found</h2>
          <p className="mt-2 text-sm text-text-muted">Try another filter or upload new gallery content.</p>
        </div>
      )}
    </div>
  )
}

function AdminMediaCard({ item, onEdit, onPreview, onDuplicate, onStatus, onTrash, onReorder }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative aspect-[4/3] bg-background">
        <MediaThumb item={item} className="size-full object-cover" />
        {item.type === 'video' && (
          <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-white/90 text-text">
            <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
          </span>
        )}
        {item.isFeatured && <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Featured</Badge>}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-text">{statusLabel(item.status)}</span>
      </div>
      <div className="p-4">
        <p className="line-clamp-1 text-sm font-extrabold text-text">{item.title}</p>
        <p className="mt-1 text-xs text-text-muted">{item.category} / {item.contentType}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SmallButton onClick={() => onEdit(item)} icon={Pencil}>Edit</SmallButton>
          <SmallButton onClick={() => onPreview(item)} icon={Eye}>Preview</SmallButton>
          <SmallButton onClick={() => onDuplicate(item)} icon={Copy}>Duplicate</SmallButton>
          <SmallButton onClick={() => onStatus(item.id, item.status === 'published' ? 'draft' : 'published')} icon={Check}>
            {item.status === 'published' ? 'Unpublish' : 'Publish'}
          </SmallButton>
          <SmallButton onClick={() => onReorder(item.id, 'up')} icon={MoveUp}>Move Up</SmallButton>
          <SmallButton onClick={() => onReorder(item.id, 'down')} icon={MoveDown}>Move Down</SmallButton>
        </div>
        <button type="button" onClick={() => onTrash(item)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-danger hover:bg-danger/5">
          <Trash2 className="size-3.5" aria-hidden="true" />
          Move to Trash
        </button>
      </div>
    </article>
  )
}

function SmallButton({ icon: Icon, children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-text-muted hover:bg-background hover:text-text">
      <Icon className="size-3.5" aria-hidden="true" />
      {children}
    </button>
  )
}

function MediaThumb({ item, className }) {
  const [hasError, setHasError] = useState(false)
  const src = mediaPreviewUrl(item)

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-background text-text-muted', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  if (item.type === 'video' && item.mediaUrl && !item.thumbnailUrl) {
    return <video src={item.mediaUrl} muted playsInline className={className} />
  }

  return <img src={src} alt={item.alt || item.title} className={className} onError={() => setHasError(true)} />
}

function UploadModal({ onClose, onUpload }) {
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function handleFiles(fileList) {
    const files = Array.from(fileList ?? [])
    if (!files.length) return
    setError('')

    const records = []
    for (const file of files) {
      try {
        const isVideoFile = file.type.startsWith('video/')
        const record = isVideoFile
          ? await readVideoFile(file)
          : await resizeImageFile(file, { maxWidth: 1400, quality: 0.78 })
        records.push({
          ...emptyDraft(),
          id: `gallery-upload-${Date.now()}-${records.length}`,
          type: isVideoFile ? 'video' : 'image',
          contentType: isVideoFile ? 'Videos' : 'Photos',
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Gallery upload',
          mediaUrl: record.dataUrl,
          thumbnailUrl: isVideoFile ? '' : record.dataUrl,
          alt: `${file.name} salon gallery media`,
          fileName: record.fileName,
          fileSize: record.fileSize,
          mimeType: record.mimeType,
          uploadProgress: 100,
        })
      } catch (err) {
        setError(err.message || 'Upload failed.')
      }
    }

    setItems((current) => [...records, ...current])
  }

  return (
    <ModalFrame title="Add Gallery Media" onClose={onClose} width="max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr]">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            handleFiles(event.dataTransfer.files)
          }}
          className="flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center"
        >
          <Upload className="size-8 text-primary" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-extrabold text-text">Drag and drop your files here</h3>
          <p className="mt-2 text-sm leading-6 text-text-muted">Upload photos or videos. JPG, PNG, WEBP, MP4, MOV, and WebM are supported.</p>
          <Button type="button" className="mt-5" onClick={() => inputRef.current?.click()}>
            Browse Files
          </Button>
          <p className="mt-3 text-xs text-text-muted">Images max 8MB. Videos max 15MB.</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-text">{items.length} files selected</h3>
            <Button type="button" size="sm" disabled={!items.length} onClick={() => onUpload(items)}>
              Add to Library
            </Button>
          </div>
          <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-xl border border-border bg-background p-2">
                <div className="aspect-square overflow-hidden rounded-lg bg-card">
                  <MediaThumb item={item} className="size-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text">{item.title}</p>
                  <p className="mt-1 text-xs text-text-muted">{formatFileSize(item.fileSize)}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${item.uploadProgress}%` }} />
                  </div>
                  <p className="mt-1 text-xs font-bold text-success">Uploaded</p>
                </div>
              </div>
            ))}
            {!items.length && <p className="rounded-xl border border-border bg-background p-6 text-center text-sm text-text-muted">No files selected yet.</p>}
          </div>
          {error && <p className="mt-3 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-xs font-bold text-danger">{error}</p>}
        </div>
      </div>
    </ModalFrame>
  )
}

function EditMediaModal({ item, albums, featuredCount, featuredLimit, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({ ...item, tagsText: toTagText(item.tags), productIdsText: (item.productIds ?? []).join('\n') }))

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function uploadMedia(file, target = 'media') {
    const isVideoFile = file.type.startsWith('video/')
    const record = isVideoFile ? await readVideoFile(file) : await resizeImageFile(file, { maxWidth: 1400, quality: 0.78 })
    setDraft((current) => {
      if (target === 'before') return { ...current, beforeImage: record.dataUrl }
      if (target === 'after') return { ...current, afterImage: record.dataUrl, mediaUrl: record.dataUrl, thumbnailUrl: record.dataUrl }
      return {
        ...current,
        type: isVideoFile ? 'video' : 'image',
        contentType: isVideoFile ? 'Videos' : 'Photos',
        mediaUrl: record.dataUrl,
        thumbnailUrl: isVideoFile ? current.thumbnailUrl : record.dataUrl,
        fileName: record.fileName,
        fileSize: record.fileSize,
        mimeType: record.mimeType,
      }
    })
  }

  function submit() {
    onSave({
      ...draft,
      tags: fromTagText(draft.tagsText ?? ''),
      productIds: (draft.productIdsText ?? '').split(/\n|,/).map((value) => value.trim()).filter(Boolean),
      isFeatured: Boolean(draft.isFeatured) && (item.isFeatured || featuredCount < featuredLimit),
    })
  }

  const featuredBlocked = draft.isFeatured && !item.isFeatured && featuredCount >= featuredLimit

  return (
    <ModalFrame title="Edit Gallery Media" onClose={onClose} width="max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title"><TextInput value={draft.title} onChange={(event) => update('title', event.target.value)} /></Field>
            <Field label="Alt text"><TextInput value={draft.alt ?? ''} onChange={(event) => update('alt', event.target.value)} /></Field>
            <Field label="Category">
              <Select value={draft.category} onChange={(event) => update('category', event.target.value)}>
                {galleryCategories.filter((value) => value !== 'All').map((value) => <option key={value}>{value}</option>)}
              </Select>
            </Field>
            <Field label="Content type">
              <Select value={draft.contentType} onChange={(event) => update('contentType', event.target.value)}>
                {galleryTypeFilters.filter((value) => value !== 'All').map((value) => <option key={value}>{value}</option>)}
              </Select>
            </Field>
            <Field label="Service">
              <Select value={draft.serviceId ?? ''} onChange={(event) => update('serviceId', event.target.value)}>
                <option value="">No service</option>
                {salonServices.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </Select>
            </Field>
            <Field label="Professional">
              <Select value={draft.professionalId ?? ''} onChange={(event) => update('professionalId', event.target.value)}>
                <option value="">No professional</option>
                {galleryProfessionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name}</option>)}
              </Select>
            </Field>
            <Field label="Album">
              <Select value={draft.albumId ?? ''} onChange={(event) => update('albumId', event.target.value)}>
                <option value="">No album</option>
                {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={draft.status} onChange={(event) => update('status', event.target.value)}>
                {statusOptions.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
              </Select>
            </Field>
            <Field label="Publish date">
              <TextInput type="datetime-local" value={draft.publishAt ?? ''} onChange={(event) => update('publishAt', event.target.value)} />
            </Field>
            <Field label="Display order">
              <TextInput type="number" min="1" value={draft.sortOrder ?? 1} onChange={(event) => update('sortOrder', event.target.value)} />
            </Field>
          </div>

          <Field label="Caption"><TextArea value={draft.caption ?? ''} onChange={(event) => update('caption', event.target.value)} /></Field>
          <Field label="Tags"><TextInput value={draft.tagsText ?? ''} onChange={(event) => update('tagsText', event.target.value)} placeholder="soft glam, makeup, evening" /></Field>
          <Field label="Product IDs">
            <TextArea value={draft.productIdsText ?? ''} onChange={(event) => update('productIdsText', event.target.value)} placeholder={products.slice(0, 3).map((product) => product.id).join('\n')} />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <UploadField label="Main media" item={draft} onUpload={(file) => uploadMedia(file)} />
            {draft.type === 'before_after' && (
              <>
                <UploadField label="Before image" item={{ ...draft, thumbnailUrl: draft.beforeImage, mediaUrl: draft.beforeImage }} onUpload={(file) => uploadMedia(file, 'before')} />
                <UploadField label="After image" item={{ ...draft, thumbnailUrl: draft.afterImage, mediaUrl: draft.afterImage }} onUpload={(file) => uploadMedia(file, 'after')} />
              </>
            )}
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
            <input type="checkbox" checked={Boolean(draft.isFeatured)} onChange={(event) => update('isFeatured', event.target.checked)} className="mt-1 size-4 accent-primary" />
            <span>
              <span className="block text-sm font-extrabold text-text">Featured</span>
              <span className="mt-1 block text-xs leading-5 text-text-muted">Featured media appears in the gallery hero and featured section. Maximum {featuredLimit} active featured items.</span>
              {featuredBlocked && <span className="mt-1 block text-xs font-bold text-danger">Featured limit reached. Unfeature another item first.</span>}
            </span>
          </label>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="aspect-[4/3] bg-background">
              <MediaThumb item={draft} className="size-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm font-extrabold text-text">{draft.title}</p>
              <p className="mt-1 text-xs text-text-muted">{draft.category} / {statusLabel(draft.status)}</p>
            </div>
          </div>
          <Button type="button" className="w-full" onClick={submit}>
            <Save className="size-4" aria-hidden="true" />
            Save Media
          </Button>
        </aside>
      </div>
    </ModalFrame>
  )
}

function UploadField({ label, item, onUpload }) {
  const inputRef = useRef(null)
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</p>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-background">
        <MediaThumb item={item} className="size-full object-cover" />
      </button>
      <input ref={inputRef} type="file" accept="image/*,video/mp4,video/quicktime,video/webm" className="hidden" onChange={(event) => event.target.files?.[0] && onUpload(event.target.files[0])} />
    </div>
  )
}

function AlbumsManager({ albums, media, onSave }) {
  const [draft, setDraft] = useState({ id: '', title: '', description: '', category: 'Salon', coverMediaId: '' })

  function submit() {
    if (!draft.title.trim()) return
    onSave(draft)
    setDraft({ id: '', title: '', description: '', category: 'Salon', coverMediaId: '' })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid gap-4 md:grid-cols-3">
        {albums.map((album) => {
          const items = media.filter((item) => item.albumId === album.id && !item.deletedAt)
          const cover = media.find((item) => item.id === album.coverMediaId) ?? items[0]
          return (
            <article key={album.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="aspect-[4/3] bg-background"><MediaThumb item={cover ?? {}} className="size-full object-cover" /></div>
              <div className="p-4">
                <p className="text-sm font-extrabold text-text">{album.title}</p>
                <p className="mt-1 text-xs text-text-muted">{items.length} media items</p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-muted">{album.description}</p>
              </div>
            </article>
          )
        })}
      </div>
      <aside className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-base font-extrabold text-text">Create album</h2>
        <div className="mt-4 space-y-4">
          <Field label="Title"><TextInput value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></Field>
          <Field label="Description"><TextArea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></Field>
          <Field label="Category">
            <Select value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>
              {galleryCategories.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
            </Select>
          </Field>
          <Field label="Cover media">
            <Select value={draft.coverMediaId} onChange={(event) => setDraft((current) => ({ ...current, coverMediaId: event.target.value }))}>
              <option value="">Auto cover</option>
              {media.filter((item) => !item.deletedAt).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
            </Select>
          </Field>
          <Button type="button" className="w-full" onClick={submit}>Save Album</Button>
        </div>
      </aside>
    </div>
  )
}

function BeforeAfterManager({ media, onEdit, onCreate }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button type="button" onClick={onCreate}><Plus className="size-4" aria-hidden="true" />Add Transformation</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="grid aspect-[4/3] grid-cols-2 bg-background">
              <MediaThumb item={{ ...item, thumbnailUrl: item.beforeImage, mediaUrl: item.beforeImage }} className="size-full object-cover" />
              <MediaThumb item={{ ...item, thumbnailUrl: item.afterImage, mediaUrl: item.afterImage }} className="size-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm font-extrabold text-text">{item.title}</p>
              <p className="mt-1 text-xs text-text-muted">{item.category}</p>
              <Button type="button" size="sm" className="mt-4" onClick={() => onEdit(item)}>Edit Transformation</Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function ScheduledManager({ media, onEdit, onPublish }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-base font-extrabold text-text">Scheduled posts</h2>
      <div className="mt-4 space-y-3">
        {media.map((item) => (
          <div key={item.id} className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-extrabold text-text">{item.title}</p>
              <p className="mt-1 text-xs text-text-muted">{item.publishAt || 'No publish date set'}</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => onEdit(item)}>Edit</Button>
              <Button type="button" size="sm" onClick={() => onPublish(item)}>Publish Now</Button>
            </div>
          </div>
        ))}
        {!media.length && <p className="rounded-xl border border-border bg-background p-6 text-center text-sm text-text-muted">No scheduled gallery content yet.</p>}
      </div>
    </div>
  )
}

function TrashManager({ media, onRestore, onDelete }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {media.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="aspect-[4/3] bg-background opacity-70"><MediaThumb item={item} className="size-full object-cover" /></div>
          <div className="p-4">
            <p className="text-sm font-extrabold text-text">{item.title}</p>
            <p className="mt-1 text-xs text-text-muted">Moved to trash</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => onRestore(item.id)}><RotateCcw className="size-4" aria-hidden="true" />Restore</Button>
              <Button type="button" size="sm" variant="outline" className="text-danger" onClick={() => onDelete(item.id)}>Delete</Button>
            </div>
          </div>
        </article>
      ))}
      {!media.length && <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-muted md:col-span-2 xl:col-span-3">Trash is empty.</p>}
    </div>
  )
}

function GallerySettings({ stats, featuredLimit }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-extrabold text-text">Publishing rules</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-text-muted">
          <li>Featured media limit: {featuredLimit} active items.</li>
          <li>Draft media stays hidden from the customer gallery.</li>
          <li>Scheduled posts can be prepared with a future publish date.</li>
          <li>Deleted media moves to trash before permanent deletion.</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-extrabold text-text">Storage health</h2>
        <p className="mt-4 text-sm leading-6 text-text-muted">
          Client-side uploads are stored in this browser until backend object storage is connected. Use compressed photos and short clips for best performance.
        </p>
        <p className="mt-4 text-sm font-bold text-text">{stats.total} active media items managed locally.</p>
      </section>
    </div>
  )
}

function ConfirmTrashDialog({ item, onClose, onConfirm }) {
  return (
    <ModalFrame title="Move to Trash?" onClose={onClose} width="max-w-md">
      <p className="text-sm leading-6 text-text-muted">This will hide "{item.title}" from the public gallery. You can restore it later from Trash.</p>
      <div className="mt-6 grid gap-2">
        <Button type="button" onClick={onClose}>Keep Media</Button>
        <Button type="button" variant="outline" className="text-danger" onClick={onConfirm}>Move to Trash</Button>
      </div>
    </ModalFrame>
  )
}

function PreviewModal({ item, onClose }) {
  return (
    <ModalFrame title={item.title} onClose={onClose} width="max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <MediaThumb item={item} className="max-h-[65vh] w-full object-contain" />
      </div>
      <p className="mt-4 text-sm leading-6 text-text-muted">{item.caption}</p>
    </ModalFrame>
  )
}

function ModalFrame({ title, width = 'max-w-3xl', onClose, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-admin-modal-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className={cn('max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl', width)}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="gallery-admin-modal-title" className="text-xl font-extrabold text-text">{title}</h2>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted hover:bg-background" aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </motion.section>
    </motion.div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={cn('h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text outline-none transition-colors focus:border-primary', props.className)}
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={cn('min-h-24 w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold leading-6 text-text outline-none transition-colors focus:border-primary', props.className)}
    />
  )
}

function Select(props) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn('h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 pr-9 text-sm font-semibold text-text outline-none transition-colors focus:border-primary', props.className)}
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </div>
  )
}

export default GalleryManagement
