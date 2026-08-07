import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Image as ImageIcon, Images, Play, Sparkles } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { cn } from '../../lib/cn.js'
import { useGallery } from '../../context/useGallery.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function sourceFor(item) {
  return item?.thumbnailUrl || item?.mediaUrl || item?.afterImage || item?.beforeImage || ''
}

function PreviewImage({ item, className }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [item])

  if (!item || !sourceFor(item) || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-surface text-text-muted', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={sourceFor(item)}
      alt={item.alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  )
}

function GalleryTile({ item, large = false, index }) {
  const isVideo = item.type === 'video' || item.contentType === 'Videos' || item.contentType === 'Reels'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.42, delay: index * 0.05, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft',
        large ? 'min-h-[28rem] lg:row-span-2' : 'min-h-[13.5rem]',
      )}
    >
      <PreviewImage item={item} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/78 via-[#211713]/12 to-transparent" />
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#241915]">{item.category}</span>
        {isVideo && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#241915]/72 px-3 py-1 text-xs font-extrabold text-white">
            <Play className="size-3 fill-current" aria-hidden="true" />
            {item.duration || 'Video'}
          </span>
        )}
      </div>
      <div className="absolute inset-x-4 bottom-4 text-white">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/68">{item.contentType}</p>
        <h3 className={cn('mt-2 font-extrabold leading-tight', large ? 'text-3xl' : 'text-lg')}>{item.title}</h3>
      </div>
    </motion.div>
  )
}

function GalleryPreviewSection() {
  const { featuredMedia, publishedMedia } = useGallery()
  const previewItems = (featuredMedia.length ? featuredMedia : publishedMedia).slice(0, 5)

  if (!previewItems.length) return null

  return (
    <section className="bg-[#fffaf7] py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Gallery"
            title="A preview of the work customers can book"
            description="Feature the newest transformations, bridal finishes, salon details, reels, and team moments from the admin gallery."
            align="left"
            className="mx-0"
          />
          <Link to={ROUTE_PATHS.gallery} className={buttonClasses({ variant: 'outline', size: 'lg', className: 'bg-white' })}>
            View Full Gallery
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <GalleryTile item={previewItems[0]} large index={0} />
          <div className="grid gap-4 sm:grid-cols-2">
            {previewItems.slice(1).map((item, index) => (
              <GalleryTile key={item.id} item={item} index={index + 1} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm font-bold text-text-muted sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3">
            <Images className="size-4 text-primary" aria-hidden="true" />
            Photos, reels, and albums
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Featured looks from admin
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3">
            <ImageIcon className="size-4 text-primary" aria-hidden="true" />
            Before and after moments
          </div>
        </div>
      </Container>
    </section>
  )
}

export default GalleryPreviewSection
