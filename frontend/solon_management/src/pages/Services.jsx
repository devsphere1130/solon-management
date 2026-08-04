
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Image as ImageIcon,
  Scissors,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import BookingFlow from '../components/booking/BookingFlow.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { useServiceImages } from '../context/useServiceImages.js'
import { serviceCategories, salonServices } from '../data/services.js'
import { cn } from '../lib/cn.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.045,
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { opacity: 0, y: 12, transition: { duration: 0.18, ease: 'easeOut' } },
}

function formatPrice(price) {
  return INR_FORMATTER.format(price)
}

function ServicesHeader() {
  return (
    <section className="relative overflow-hidden border-b border-[#eadfd6] bg-[#fffaf7]">
      <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:py-24">
        <div className="max-w-3xl">
          <Badge className="border border-[#d6b493] bg-[#f8eadc] text-[#8a4d32]">Our Services</Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-[#241915] sm:text-5xl lg:text-6xl">
            Services designed around your best salon day
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#6f5d56] sm:text-lg">
            Browse polished hair, beauty, skin, spa, and bridal treatments with transparent pricing, real service
            imagery, and quick booking actions.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-[1.75rem] border border-[#eadfd6] bg-white/80 p-3 shadow-soft backdrop-blur">
          {[
            ['35+', 'curated looks'],
            ['4.9', 'guest rating'],
            ['12k', 'bookings managed'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-[#fff6ef] px-4 py-5 text-center">
              <p className="text-2xl font-extrabold text-[#9a5539]">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8b7a72]">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ServiceCategories({ activeCategory, onChange }) {
  return (
    <section aria-labelledby="services-filter-title" className="sticky top-18 z-20 border-b border-[#eadfd6] bg-[#fffaf7]/92 backdrop-blur">
      <Container className="py-5">
        <h2 id="services-filter-title" className="sr-only">
          Filter salon services
        </h2>
        <div className="premium-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:px-0">
          {serviceCategories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange(category)}
                className={cn(
                  'group shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-primary',
                  isActive
                    ? 'border-[#a05a3f] bg-[#a05a3f] text-white shadow-soft'
                    : 'border-[#eadfd6] bg-white text-[#6f5d56] hover:border-[#cfa98d] hover:bg-[#fff6ef] hover:text-[#32211c]',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {category}
                  {isActive && <Check className="size-3.5" aria-hidden="true" />}
                </span>
              </button>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function ImageFallback({ label = 'Service image' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#f6ece5] text-[#8b6a5d]">
      <ImageIcon className="size-8" aria-hidden="true" />
      <span className="text-xs font-bold uppercase tracking-[0.16em]">{label}</span>
    </div>
  )
}

function ImageWithFallback({ src, alt, className, fallbackLabel }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    return <ImageFallback label={fallbackLabel} />
  }

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setHasError(true)} />
}

function ThumbnailScroller({ images, selectedIndex, onSelect, serviceName }) {
  return (
    <div className="premium-scrollbar flex max-h-[30rem] gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
      {images.map((image, index) => {
        const isSelected = index === selectedIndex

        return (
          <button
            key={image.src}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Show ${serviceName} image ${index + 1}`}
            aria-current={isSelected ? 'true' : undefined}
            className={cn(
              'relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white transition-all duration-200 focus-visible:outline-primary sm:h-24 sm:w-28 lg:h-24 lg:w-24',
              isSelected
                ? 'border-[#a05a3f] shadow-[0_0_0_3px_rgba(160,90,63,0.18)]'
                : 'border-[#eadfd6] opacity-75 hover:border-[#cfa98d] hover:opacity-100',
            )}
          >
            <ImageWithFallback
              src={image.src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              fallbackLabel="Preview"
            />
            {isSelected && <span className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-white shadow" aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}

function GalleryMainImage({ image, serviceName }) {
  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-[#eadfd6] bg-[#f6ece5] shadow-soft sm:min-h-[30rem]">
      <AnimatePresence mode="wait">
        <motion.div
          key={image.src}
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
            fallbackLabel="Service"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241915]/75 via-[#241915]/24 to-transparent p-5 text-white">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {serviceName}
        </p>
      </div>
    </div>
  )
}

function FeaturedGallery({ service, selectedIndex, onSelectImage, onBookService }) {
  if (!service) {
    return null
  }

  const selectedImage = service.images[selectedIndex] ?? service.images[0]

  return (
    <section aria-labelledby="featured-service-title" className="py-12 sm:py-16">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(21rem,0.42fr)] lg:items-stretch">
        <div className="grid gap-4 lg:grid-cols-[6.5rem_minmax(0,1fr)]">
          <ThumbnailScroller
            images={service.images}
            selectedIndex={selectedIndex}
            onSelect={onSelectImage}
            serviceName={service.name}
          />
          <GalleryMainImage image={selectedImage} serviceName={service.name} />
        </div>

        <div className="flex flex-col justify-between rounded-[1.75rem] border border-[#eadfd6] bg-white p-6 shadow-soft sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-[#edf4ec] text-[#536d57]">{service.category}</Badge>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7a6961]">
                <Clock className="size-4" aria-hidden="true" />
                {service.duration}
              </span>
            </div>
            <h2 id="featured-service-title" className="mt-5 text-3xl font-extrabold leading-tight text-[#241915]">
              {service.name}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#6f5d56]">{service.fullDescription}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {service.benefits.slice(0, 4).map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-[#43322c]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fff0e8] text-[#a05a3f]">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-[#eadfd6] pt-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b7a72]">Starting at</p>
                <p className="mt-1 text-3xl font-extrabold text-[#9a5539]">{formatPrice(service.price)}</p>
              </div>
              <Button type="button" size="lg" className="bg-[#241915] hover:bg-[#3a2a23]" onClick={() => onBookService(service)}>
                Book Now
                <CalendarDays className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function ServiceImage({ service, onOpenDetails }) {
  const image = service.images[0]

  return (
    <button
      type="button"
      onClick={() => onOpenDetails(service)}
      className="group/image relative h-64 w-full overflow-hidden rounded-t-[1.45rem] bg-[#f6ece5] text-left focus-visible:outline-primary"
      aria-label={`View details for ${service.name}`}
    >
      <ImageWithFallback
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-[1.05]"
        fallbackLabel="Service"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/54 via-transparent to-transparent" aria-hidden="true" />
      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/88 px-3 py-1 text-xs font-bold text-[#5c453c] shadow-sm backdrop-blur">
        <Scissors className="size-3.5" aria-hidden="true" />
        {service.category}
      </span>
    </button>
  )
}

function ServiceCard({ service, index, onOpenDetails, onPreview }) {
  return (
    <motion.article
      layout
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, margin: '-72px' }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => onPreview(service)}
      className="group flex h-full min-h-[33.5rem] flex-col overflow-hidden rounded-[1.55rem] border border-[#eadfd6] bg-white shadow-[0_1px_2px_rgba(36,25,21,0.04),0_22px_55px_-34px_rgba(67,43,32,0.45)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(36,25,21,0.06),0_28px_70px_-32px_rgba(67,43,32,0.55)]"
    >
      <ServiceImage service={service} onOpenDetails={onOpenDetails} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf4ec] px-3 py-1 text-xs font-bold text-[#536d57]">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            {service.highlight}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7a6961]">
            <Clock className="size-4" aria-hidden="true" />
            {service.duration}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-extrabold leading-tight text-[#241915]">{service.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f5d56]">{service.description}</p>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a867c]">From</p>
              <p className="mt-1 text-2xl font-extrabold text-[#9a5539]">{formatPrice(service.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDetails(service)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-[#eadfd6] text-[#9a5539] transition-all duration-200 hover:border-[#a05a3f] hover:bg-[#a05a3f] hover:text-white focus-visible:outline-primary"
              aria-label={`View details for ${service.name}`}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full border-[#d8c5ba] text-[#35251f] hover:bg-[#fff0e8]"
            onClick={() => onOpenDetails(service)}
          >
            Select Service
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

function ServiceGrid({ services, isLoading, onOpenDetails, onPreview, onResetCategory }) {
  if (isLoading) {
    return <ServicesSkeleton />
  }

  if (services.length === 0) {
    return (
      <Container className="pb-20">
        <div className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff0e8] text-[#a05a3f]">
            <Heart className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold text-[#241915]">No services found</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f5d56]">
            Try another category or view the complete service menu to find the right treatment.
          </p>
          <Button type="button" className="mt-6 bg-[#241915] hover:bg-[#3a2a23]" onClick={onResetCategory}>
            Show all services
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <section aria-labelledby="services-grid-title" className="pb-20">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a867c]">Service Menu</p>
            <h2 id="services-grid-title" className="mt-2 text-3xl font-extrabold text-[#241915]">
              Choose your next appointment
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6f5d56]">
            Transparent details make it easy to choose the right treatment for your schedule and budget.
          </p>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onOpenDetails={onOpenDetails}
                onPreview={onPreview}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}

function ServicesSkeleton() {
  return (
    <section className="pb-20" aria-label="Loading services">
      <Container>
        <div className="mb-8 h-20 max-w-xl animate-pulse rounded-3xl bg-[#f1e5dc]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="min-h-[33.5rem] overflow-hidden rounded-[1.55rem] border border-[#eadfd6] bg-white">
              <div className="h-64 animate-pulse bg-[#f1e5dc]" />
              <div className="space-y-4 p-6">
                <div className="h-5 w-24 animate-pulse rounded-full bg-[#f1e5dc]" />
                <div className="h-6 w-3/4 animate-pulse rounded-full bg-[#eadfd6]" />
                <div className="space-y-2">
                  <div className="h-4 animate-pulse rounded-full bg-[#f1e5dc]" />
                  <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#f1e5dc]" />
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#f1e5dc]" />
                </div>
                <div className="h-11 animate-pulse rounded-full bg-[#eadfd6]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ServiceDetailModal({ service, onClose, onBookService }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [service?.id])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const selectedImage = service.images[selectedIndex] ?? service.images[0]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#241915]/58 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-detail-title"
        initial={{ opacity: 0, y: 34, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 26, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[#fffaf7] shadow-2xl sm:max-w-6xl sm:rounded-[1.75rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd6] bg-[#fffaf7]/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a867c]">Service Details</p>
            <h2 id="service-detail-title" className="truncate text-lg font-extrabold text-[#241915]">
              {service.name}
            </h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Close service details"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd6] bg-white text-[#5c453c] transition-colors hover:bg-[#fff0e8] focus-visible:outline-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.72fr)]">
          <div className="grid gap-4 lg:grid-cols-[6.25rem_minmax(0,1fr)]">
            <ThumbnailScroller
              images={service.images}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              serviceName={service.name}
            />
            <GalleryMainImage image={selectedImage} serviceName={service.name} />
          </div>

          <aside className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6 shadow-soft">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-[#edf4ec] text-[#536d57]">{service.category}</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0e8] px-3 py-1 text-xs font-bold text-[#9a5539]">
                <Clock className="size-3.5" aria-hidden="true" />
                {service.duration}
              </span>
            </div>

            <h3 className="mt-5 text-3xl font-extrabold leading-tight text-[#241915]">{service.name}</h3>
            <p className="mt-4 text-base leading-7 text-[#6f5d56]">{service.fullDescription}</p>

            <div className="mt-6 rounded-2xl bg-[#fff6ef] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a867c]">Price</p>
              <p className="mt-1 text-4xl font-extrabold text-[#9a5539]">{formatPrice(service.price)}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-extrabold text-[#241915]">Included benefits</p>
              <ul className="mt-4 grid gap-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-[#43322c]">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf4ec] text-[#536d57]">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <Button type="button" size="lg" className="mt-8 w-full bg-[#241915] hover:bg-[#3a2a23]" onClick={() => onBookService(service)}>
              Book Now
              <CalendarDays className="size-4" aria-hidden="true" />
            </Button>
          </aside>
        </div>
      </motion.section>
    </motion.div>
  )
}

function Services() {
  const { serviceImages } = useServiceImages()
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0])
  const [featuredServiceId, setFeaturedServiceId] = useState(salonServices[0]?.id)
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
  const [selectedService, setSelectedService] = useState(null)
  const [bookingService, setBookingService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 240)
    return () => window.clearTimeout(timer)
  }, [])

  const services = useMemo(
    () =>
      salonServices.map((service) => {
        const overrideImage = serviceImages[service.id]

        if (!overrideImage?.dataUrl) {
          return service
        }

        const customImage = {
          src: overrideImage.dataUrl,
          alt: `${service.name} custom salon service image`,
        }

        return {
          ...service,
          images: [customImage, ...service.images.slice(1)],
        }
      }),
    [serviceImages],
  )

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All Services') {
      return services
    }

    return services.filter((service) => service.category === activeCategory)
  }, [activeCategory, services])

  const featuredService = useMemo(() => {
    const selected = filteredServices.find((service) => service.id === featuredServiceId)
    return selected ?? filteredServices[0] ?? services[0]
  }, [featuredServiceId, filteredServices, services])

  useEffect(() => {
    if (!filteredServices.some((service) => service.id === featuredServiceId)) {
      setFeaturedServiceId(filteredServices[0]?.id ?? services[0]?.id)
    }
  }, [featuredServiceId, filteredServices, services])

  useEffect(() => {
    setFeaturedImageIndex(0)
  }, [featuredService?.id])

  function handleCategoryChange(category) {
    setActiveCategory(category)
  }

  function handlePreview(service) {
    setFeaturedServiceId(service.id)
  }

  function handleOpenDetails(service) {
    setSelectedService(service)
    setFeaturedServiceId(service.id)
  }

  function handleBookService(service) {
    setBookingService(service)
    setSelectedService(null)
    setFeaturedServiceId(service.id)
  }

  return (
    <div className="bg-[#fffaf7]">
      <ServicesHeader />
      <ServiceCategories activeCategory={activeCategory} onChange={handleCategoryChange} />
      {!isLoading && (
        <FeaturedGallery
          service={featuredService}
          selectedIndex={featuredImageIndex}
          onSelectImage={setFeaturedImageIndex}
          onBookService={handleBookService}
        />
      )}
      <ServiceGrid
        services={filteredServices}
        isLoading={isLoading}
        onOpenDetails={handleOpenDetails}
        onPreview={handlePreview}
        onResetCategory={() => setActiveCategory('All Services')}
      />

      <AnimatePresence>
        {selectedService && <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} onBookService={handleBookService} />}
      </AnimatePresence>

      <AnimatePresence>
        {bookingService && <BookingFlow service={bookingService} onClose={() => setBookingService(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default Services
