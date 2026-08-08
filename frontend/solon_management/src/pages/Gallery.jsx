import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Heart,
  Image as ImageIcon,
  Play,
  Share2,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import BookingFlow from '../components/booking/BookingFlow.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useGallery } from '../context/useGallery.js'
import { useProductCatalog } from '../context/useProductCatalog.js'
import { galleryCategories, galleryProfessionals, galleryTypeFilters, getGalleryProfessional } from '../data/gallery.js'
import { salonServices } from '../data/services.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

function getService(serviceId) {
  return salonServices.find((service) => service.id === serviceId)
}

function isVideo(item) {
  return item.type === 'video' || item.contentType === 'Videos' || item.contentType === 'Reels'
}

function mediaSource(item) {
  return item.thumbnailUrl || item.mediaUrl || item.afterImage || item.beforeImage
}

function GalleryImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#f3e8df] text-[#8b756a]', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setHasError(true)} />
}

function GalleryHero({ item, onExplore, onOpen }) {
  if (!item) return null

  return (
    <section className="relative overflow-hidden bg-[#fffaf7] py-10 sm:py-14">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
        <div className="max-w-2xl">
          <Badge className="border border-[#d6b493] bg-[#f8eadc] text-[#8a4d32]">Our Gallery</Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#241915] sm:text-5xl lg:text-6xl">
            A glimpse into the craft behind every visit.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#6f5f57]">
            Explore salon atmosphere, transformations, bridal moments, skincare rituals, and the people behind the work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button type="button" size="lg" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={onExplore}>
              Explore Gallery
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Link to={ROUTE_PATHS.services} className={buttonClasses({ variant: 'outline', size: 'lg', className: 'bg-white' })}>
              Book a Service
            </Link>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={() => onOpen(item)}
          className="group relative min-h-[25rem] overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-[#f3e8df] text-left shadow-soft sm:min-h-[34rem]"
          whileHover={{ y: -4 }}
        >
          <GalleryImage src={mediaSource(item)} alt={item.alt} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/76 via-[#241915]/18 to-transparent" />
          {isVideo(item) && (
            <span className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-white/88 px-3 py-1.5 text-xs font-extrabold text-[#241915] backdrop-blur">
              <Play className="size-3.5 fill-current" aria-hidden="true" />
              {item.duration || 'Watch'}
            </span>
          )}
          <div className="absolute right-5 bottom-5 left-5 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Featured Moment</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight">{item.title}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/78">{item.caption}</p>
          </div>
        </motion.button>
      </Container>
    </section>
  )
}

function FeaturedGallery({ items, onOpen }) {
  const [primary, ...sideItems] = items.slice(0, 3)
  if (!primary) return null

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Featured</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Our latest work and salon moments</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6f5f57]">Selected visuals that show the service, atmosphere, and craft customers can expect.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.8fr]">
          <FeaturedCard item={primary} large onOpen={onOpen} />
          <div className="grid gap-4">
            {sideItems.map((item) => (
              <FeaturedCard key={item.id} item={item} onOpen={onOpen} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function FeaturedCard({ item, large = false, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        'group relative overflow-hidden rounded-[1.6rem] border border-[#eadfd6] bg-[#f3e8df] text-left shadow-soft',
        large ? 'min-h-[28rem]' : 'min-h-[13.5rem]',
      )}
    >
      <GalleryImage src={mediaSource(item)} alt={item.alt} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/74 via-[#241915]/12 to-transparent" />
      <div className="absolute right-4 bottom-4 left-4 text-white">
        <Badge className="border border-white/18 bg-white/16 text-white">{item.category}</Badge>
        <h3 className={cn('mt-3 font-extrabold leading-tight', large ? 'text-3xl' : 'text-xl')}>{item.title}</h3>
      </div>
    </button>
  )
}

function GalleryFilters({ activeCategory, onCategory, activeType, onType }) {
  return (
    <section className="sticky top-18 z-20 border-y border-[#eadfd6] bg-[#fffaf7]/94 backdrop-blur">
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="sm:hidden">
            <span className="sr-only">Filter gallery</span>
            <select
              value={activeCategory}
              onChange={(event) => onCategory(event.target.value)}
              className="h-11 w-full rounded-full border border-[#eadfd6] bg-white px-4 text-sm font-bold text-[#241915] outline-none focus:border-[#9b5639]"
            >
              {galleryCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <div className="premium-scrollbar -mx-4 hidden gap-2 overflow-x-auto px-4 pb-1 sm:flex">
            {galleryCategories.map((category) => (
              <FilterButton key={category} active={activeCategory === category} onClick={() => onCategory(category)}>
                {category}
              </FilterButton>
            ))}
          </div>

          <div className="premium-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
            {galleryTypeFilters.map((type) => (
              <FilterButton key={type} active={activeType === type} onClick={() => onType(type)}>
                {type}
              </FilterButton>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
        active ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] bg-white text-[#6f5f57] hover:bg-[#fffaf7]',
      )}
    >
      {children}
    </button>
  )
}

function MediaCard({ item, index, liked, saved, onLike, onSave, onShare, onOpen }) {
  const aspect = index % 5 === 0 ? 'aspect-[4/5]' : index % 5 === 2 ? 'aspect-[9/12]' : 'aspect-[4/3]'
  const professional = getGalleryProfessional(item.professionalId)
  const service = getService(item.serviceId)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      className="group overflow-hidden rounded-[1.4rem] border border-[#eadfd6] bg-white shadow-soft"
    >
      <button type="button" onClick={() => onOpen(item)} className={cn('relative block w-full overflow-hidden bg-[#f3e8df] text-left', aspect)}>
        <GalleryImage src={mediaSource(item)} alt={item.alt} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/64 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-[#241915]">{item.category}</Badge>
          {item.type === 'before_after' && <Badge className="bg-[#241915] text-white">Before & After</Badge>}
        </div>
        {isVideo(item) && (
          <span className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-white/88 text-[#241915] shadow-soft">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden="true" />
          </span>
        )}
        {isVideo(item) && (
          <span className="absolute right-3 bottom-3 rounded-full bg-[#241915]/72 px-3 py-1 text-xs font-extrabold text-white">
            {item.duration || 'Watch'}
          </span>
        )}
      </button>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-extrabold text-[#241915]">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6f5f57]">{item.caption}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-xs font-bold text-[#8b7a72]">
            {professional ? `${professional.name} - ${professional.role}` : service?.name ?? item.contentType}
          </p>
          <div className="flex shrink-0 gap-1">
            <IconButton active={liked} label={`Like ${item.title}`} onClick={() => onLike(item.id)} icon={Heart} />
            <IconButton active={saved} label={`Save ${item.title}`} onClick={() => onSave(item.id)} icon={Bookmark} />
            <IconButton label={`Share ${item.title}`} onClick={() => onShare(item)} icon={Share2} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function IconButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-full border border-[#eadfd6] text-[#6f5f57] transition-colors hover:bg-[#fff1e8] hover:text-[#9b5639]',
        active && 'border-[#9b5639] bg-[#fff1e8] text-[#9b5639]',
      )}
    >
      <Icon className={cn('size-4', active && Icon === Heart && 'fill-current')} aria-hidden="true" />
    </button>
  )
}

function BeforeAfterSlider({ item, onOpen }) {
  const [value, setValue] = useState(52)
  if (!item) return null

  return (
    <section className="bg-white py-14 sm:py-18">
      <Container>
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Real Transformations</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">See the difference.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6f5f57]">Drag the divider to compare the before and after result.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.46fr] lg:items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-[#eadfd6] bg-[#f3e8df] shadow-soft">
            <GalleryImage src={item.afterImage} alt={`${item.title} after`} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${value}%` }}>
              <GalleryImage src={item.beforeImage} alt={`${item.title} before`} className="size-full object-cover" />
            </div>
            <div className="absolute inset-y-0 w-1 bg-white shadow-lg" style={{ left: `${value}%` }} aria-hidden="true">
              <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#9b5639] shadow-soft">
                <ChevronLeft className="size-4" aria-hidden="true" />
                <ChevronRight className="size-4" aria-hidden="true" />
              </span>
            </div>
            <span className="absolute top-4 left-4 rounded-full bg-[#241915]/72 px-3 py-1 text-xs font-extrabold text-white">Before</span>
            <span className="absolute top-4 right-4 rounded-full bg-[#241915]/72 px-3 py-1 text-xs font-extrabold text-white">After</span>
            <input
              type="range"
              min="18"
              max="82"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-label={`Compare before and after for ${item.title}`}
              className="absolute inset-x-4 bottom-4 h-10 cursor-ew-resize opacity-0"
            />
          </div>
          <div className="rounded-[1.5rem] border border-[#eadfd6] bg-[#fffaf7] p-6 shadow-soft">
            <Badge className="bg-[#fff1e8] text-[#9b5639]">Transformation</Badge>
            <h3 className="mt-4 text-2xl font-extrabold text-[#241915]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#6f5f57]">{item.caption}</p>
            <Button type="button" className="mt-6 bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onOpen(item)}>
              View Transformation
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ExperienceSection({ items, onOpen }) {
  if (!items.length) return null

  const visibleItems = items.slice(0, 5)
  // The first tile spans 2 columns, so the row needs (count + 1) tracks — capped at the 5-column design.
  const lgColumns = Math.min(visibleItems.length + 1, 5)

  return (
    <section className="py-14 sm:py-18">
      <Container>
        <div className="mb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">The Salon Experience</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Step inside our world.</h2>
        </div>
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(var(--exp-cols),minmax(0,1fr))]"
          style={{ '--exp-cols': lgColumns }}
        >
          {visibleItems.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onOpen(item)}
              className={cn('group relative overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-[#f3e8df] shadow-soft', index === 0 && 'sm:col-span-2 lg:col-span-2')}
            >
              <GalleryImage src={mediaSource(item)} alt={item.alt} className="aspect-[4/5] size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241915]/76 to-transparent p-4 text-left text-white">
                <p className="text-sm font-extrabold">{item.title}</p>
                <p className="mt-1 text-xs text-white/72">{item.category}</p>
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}

function TeamSection({ onProfessional }) {
  return (
    <section className="bg-white py-14 sm:py-18">
      <Container>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Meet the Team</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">The people behind the craft.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryProfessionals.map((professional) => (
            <article key={professional.id} className="overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-[#fffaf7] shadow-soft">
              <GalleryImage src={professional.image} alt={professional.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-extrabold text-[#241915]">{professional.name}</h3>
                <p className="mt-1 text-sm font-bold text-[#9b5639]">{professional.role}</p>
                <p className="mt-2 text-sm leading-6 text-[#6f5f57]">{professional.specialty}</p>
                <button type="button" className="mt-4 text-sm font-extrabold text-[#241915]" onClick={() => onProfessional(professional.id)}>
                  View {professional.name.split(' ')[0]}'s Work
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function AlbumSection({ albums, media, onOpen }) {
  if (!albums.length) return null

  return (
    <section className="py-14 sm:py-18">
      <Container>
        <div className="mb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Albums</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Salon moments and collections</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {albums.map((album) => {
            const albumItems = media.filter((item) => item.albumId === album.id)
            const cover = media.find((item) => item.id === album.coverMediaId) ?? albumItems[0]
            return (
              <button key={album.id} type="button" onClick={() => cover && onOpen(cover)} className="group overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-white text-left shadow-soft">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f3e8df]">
                  <GalleryImage src={cover ? mediaSource(cover) : ''} alt={album.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#241915]">{albumItems.length} items</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-extrabold text-[#241915]">{album.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6f5f57]">{album.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function GalleryLightbox({ item, items, onClose, onPrev, onNext, liked, saved, onLike, onSave, onShare, onBook }) {
  const [zoomed, setZoomed] = useState(false)
  const { products } = useProductCatalog()
  const service = getService(item.serviceId)
  const professional = getGalleryProfessional(item.professionalId)
  const productLinks = products.filter((product) => item.productIds?.includes(product.id))

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#160f0c]/90 p-0 text-white backdrop-blur-sm sm:p-5"
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
        aria-labelledby="gallery-lightbox-title"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="grid h-dvh w-full overflow-hidden bg-[#1f1511] sm:h-[92vh] sm:max-w-7xl sm:rounded-[1.75rem] lg:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="relative min-h-0 bg-black">
          {isVideo(item) && item.mediaUrl ? (
            <video src={item.mediaUrl} poster={item.thumbnailUrl} controls muted playsInline className="size-full object-contain" />
          ) : (
            <GalleryImage src={item.type === 'before_after' ? item.afterImage : mediaSource(item)} alt={item.alt} className={cn('size-full object-contain transition-transform duration-300', zoomed && 'scale-125')} />
          )}

          {isVideo(item) && !item.mediaUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-18 items-center justify-center rounded-full bg-white/90 text-[#241915]">
                <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
              </span>
            </div>
          )}

          <button type="button" onClick={onPrev} className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 backdrop-blur hover:bg-white/22" aria-label="Previous gallery item">
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={onNext} className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 backdrop-blur hover:bg-white/22" aria-label="Next gallery item">
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
          <div className="absolute left-4 bottom-4 rounded-full bg-white/12 px-3 py-1 text-xs font-bold backdrop-blur">
            {items.findIndex((entry) => entry.id === item.id) + 1} / {items.length}
          </div>
        </div>

        <aside className="flex min-h-0 flex-col overflow-y-auto border-l border-white/10 bg-[#241915] p-5">
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/16" aria-label="Close gallery lightbox">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <Badge className="mt-2 border border-white/16 bg-white/12 text-white">{item.category}</Badge>
          <h2 id="gallery-lightbox-title" className="mt-4 text-3xl font-extrabold leading-tight">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/72">{item.caption}</p>

          <div className="mt-5 space-y-3 rounded-2xl bg-white/8 p-4">
            <InfoLine label="Type" value={item.contentType} />
            {professional && <InfoLine label="Professional" value={`${professional.name} - ${professional.role}`} />}
            {service && <InfoLine label="Related Service" value={service.name} />}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => onLike(item.id)} className={lightboxActionClasses(liked)}>
              <Heart className={cn('size-4', liked && 'fill-current')} aria-hidden="true" />
              Like
            </button>
            <button type="button" onClick={() => onSave(item.id)} className={lightboxActionClasses(saved)}>
              <Bookmark className="size-4" aria-hidden="true" />
              Save
            </button>
            <button type="button" onClick={() => onShare(item)} className={lightboxActionClasses(false)}>
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </button>
            {!isVideo(item) && (
              <button type="button" onClick={() => setZoomed((value) => !value)} className={lightboxActionClasses(zoomed)}>
                <ZoomIn className="size-4" aria-hidden="true" />
                Zoom
              </button>
            )}
          </div>

          {productLinks.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">Products used</p>
              <div className="mt-3 space-y-2">
                {productLinks.slice(0, 3).map((product) => (
                  <Link key={product.id} to={`${ROUTE_PATHS.products}/${product.id}`} className="block rounded-xl bg-white/8 px-3 py-2 text-sm font-bold text-white/82 hover:bg-white/12">
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6">
            <div className="grid gap-2">
              {service && (
                <Link to={ROUTE_PATHS.services} className={buttonClasses({ variant: 'outline', className: 'border-white/18 bg-white/8 text-white hover:bg-white/12' })}>
                  View Service
                </Link>
              )}
              {service && (
                <Button type="button" className="bg-white text-[#241915] hover:bg-[#f6eee7]" onClick={() => onBook(service)}>
                  Book Appointment
                  <CalendarDays className="size-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </aside>
      </motion.section>
    </motion.div>
  )
}

function InfoLine({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/48">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  )
}

function lightboxActionClasses(active) {
  return cn(
    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
    active ? 'border-white bg-white text-[#241915]' : 'border-white/16 bg-white/8 text-white hover:bg-white/12',
  )
}

function GalleryCta() {
  return (
    <section className="bg-white pb-16">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-[#241915] p-8 text-white shadow-soft sm:p-10 lg:p-12">
          <GalleryImage
            src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1600&q=82"
            alt="Salon team preparing a beauty treatment station"
            className="absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="relative max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">Love what you see?</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Let us create your next look.</h2>
            <p className="mt-3 text-sm leading-6 text-white/76">Explore the service menu and choose the appointment that matches your mood, occasion, or routine.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={ROUTE_PATHS.services} className={buttonClasses({ className: 'bg-white text-[#241915] hover:bg-[#f6eee7]' })}>
                Explore Services
              </Link>
              <Link to={ROUTE_PATHS.accountAppointments} className={buttonClasses({ variant: 'outline', className: 'border-white/20 text-white hover:bg-white/10' })}>
                My Appointments
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Gallery() {
  const { isAuthenticated } = useAuth()
  const {
    publishedMedia,
    featuredMedia,
    albums,
    likedIds,
    savedIds,
    toggleLike,
    toggleSave,
    markShared,
  } = useGallery()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [lightboxItem, setLightboxItem] = useState(null)
  const [bookingService, setBookingService] = useState(null)
  const [notice, setNotice] = useState('')

  const filteredMedia = useMemo(() => {
    return publishedMedia.filter((item) => {
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory
      const typeMatch = activeType === 'All' || item.contentType === activeType
      return categoryMatch && typeMatch
    })
  }, [activeCategory, activeType, publishedMedia])

  const heroItem = featuredMedia[0] ?? publishedMedia[0]
  const beforeAfterItem = publishedMedia.find((item) => item.type === 'before_after')
  const experienceItems = publishedMedia.filter((item) => ['Salon', 'Spa', 'Behind the Scenes', 'Team'].includes(item.category))
  const lightboxItems = filteredMedia.length ? filteredMedia : publishedMedia

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 1800)
  }

  function handleSave(mediaId) {
    if (!isAuthenticated) {
      showNotice('Sign in to save this look.')
      return
    }
    toggleSave(mediaId)
  }

  async function handleShare(item) {
    const url = `${window.location.origin}${ROUTE_PATHS.gallery}?look=${item.id}`
    markShared(item.id)

    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: item.caption, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        showNotice('Gallery link copied.')
      } else {
        showNotice('Share link ready.')
      }
    } catch {
      showNotice('Share cancelled.')
    }
  }

  function handleProfessional(professionalId) {
    const professionalItem = publishedMedia.find((item) => item.professionalId === professionalId)
    if (professionalItem) {
      setLightboxItem(professionalItem)
    }
  }

  function openBooking(service) {
    setLightboxItem(null)
    setBookingService(service)
  }

  function selectRelativeItem(direction) {
    if (!lightboxItem) return
    if (!lightboxItems.length) return
    const index = lightboxItems.findIndex((item) => item.id === lightboxItem.id)
    const activeIndex = index >= 0 ? index : 0
    const nextIndex = (activeIndex + direction + lightboxItems.length) % lightboxItems.length
    setLightboxItem(lightboxItems[nextIndex])
  }

  return (
    <div className="bg-[#fffaf7]">
      <GalleryHero item={heroItem} onExplore={() => document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth' })} onOpen={setLightboxItem} />
      <FeaturedGallery items={featuredMedia.length ? featuredMedia : publishedMedia.slice(0, 3)} onOpen={setLightboxItem} />
      <GalleryFilters activeCategory={activeCategory} onCategory={setActiveCategory} activeType={activeType} onType={setActiveType} />

      <section id="gallery-grid" className="py-12 sm:py-16">
        <Container>
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Visual Portfolio</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Photos, reels, moments, and work</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#6f5f57]">{filteredMedia.length} gallery items showing current published work.</p>
          </div>

          {filteredMedia.length > 0 ? (
            <motion.div
              layout
              className="premium-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 xl:grid-cols-4"
            >
              {filteredMedia.map((item, index) => (
                <div key={item.id} className="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink">
                  <MediaCard
                    item={item}
                    index={index}
                    liked={likedIds.includes(item.id)}
                    saved={savedIds.includes(item.id)}
                    onLike={toggleLike}
                    onSave={handleSave}
                    onShare={handleShare}
                    onOpen={setLightboxItem}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
              <Grid3X3 className="mx-auto size-8 text-[#9b5639]" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-extrabold text-[#241915]">No gallery items found</h3>
              <p className="mt-2 text-sm text-[#6f5f57]">Try another category or content type.</p>
            </div>
          )}
        </Container>
      </section>

      <BeforeAfterSlider item={beforeAfterItem} onOpen={setLightboxItem} />
      <ExperienceSection items={experienceItems} onOpen={setLightboxItem} />
      <TeamSection onProfessional={handleProfessional} />
      <AlbumSection albums={albums} media={publishedMedia} onOpen={setLightboxItem} />
      <GalleryCta />

      <AnimatePresence>
        {lightboxItem && (
          <GalleryLightbox
            item={lightboxItem}
            items={lightboxItems}
            liked={likedIds.includes(lightboxItem.id)}
            saved={savedIds.includes(lightboxItem.id)}
            onClose={() => setLightboxItem(null)}
            onPrev={() => selectRelativeItem(-1)}
            onNext={() => selectRelativeItem(1)}
            onLike={toggleLike}
            onSave={handleSave}
            onShare={handleShare}
            onBook={openBooking}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingService && <BookingFlow service={bookingService} onClose={() => setBookingService(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed right-4 bottom-4 z-50 rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 text-sm font-extrabold text-[#241915] shadow-2xl"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-[#9b5639]" aria-hidden="true" />
              {notice}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery
