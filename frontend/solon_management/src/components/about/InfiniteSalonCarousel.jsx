import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Image as ImageIcon } from 'lucide-react'
import { useGallery } from '../../context/useGallery.js'
import { cn } from '../../lib/cn.js'

function sourceFor(item) {
  return item?.thumbnailUrl || item?.mediaUrl || item?.afterImage || item?.beforeImage || ''
}

function SalonCard({ item, tall }) {
  const src = sourceFor(item)

  return (
    <div className={cn('relative w-full shrink-0 overflow-hidden rounded-[24px] shadow-soft', tall ? 'aspect-[3/4]' : 'aspect-square')}>
      {src ? (
        <img src={src} alt={item.alt || item.title} loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center bg-surface text-text-muted">
          <ImageIcon className="size-6" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-3 bottom-3 text-white">
        <p className="text-[10px] font-extrabold tracking-[0.16em] uppercase text-white/70">{item.category}</p>
        <p className="mt-0.5 text-sm font-bold leading-tight">{item.title}</p>
      </div>
    </div>
  )
}

function MarqueeColumn({ items, direction }) {
  const track = [...items, ...items]

  return (
    <div className="relative h-full flex-1 overflow-hidden">
      <div
        className={cn('flex flex-col gap-4', direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down', 'hover:[animation-play-state:paused]')}
      >
        {track.map((item, index) => (
          <SalonCard key={`${item.id}-${index}`} item={item} tall={index % 3 !== 1} />
        ))}
      </div>
    </div>
  )
}

function InfiniteSalonCarousel() {
  const { publishedMedia, featuredMedia } = useGallery()
  const prefersReducedMotion = useReducedMotion()

  const items = useMemo(() => {
    const pool = featuredMedia.length ? featuredMedia : publishedMedia
    return pool.filter((item) => sourceFor(item))
  }, [featuredMedia, publishedMedia])

  const columnA = items.filter((_, index) => index % 2 === 0)
  const columnB = items.filter((_, index) => index % 2 !== 0)

  if (!items.length) return null

  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      role="region"
      aria-label="A rotating showcase of salon services and moments"
      className="relative"
    >
      {prefersReducedMotion ? (
        <div className="grid grid-cols-2 gap-4">
          {items.slice(0, 6).map((item, index) => (
            <SalonCard key={item.id} item={item} tall={index % 3 !== 1} />
          ))}
        </div>
      ) : (
        <>
          <div className="hidden h-[34rem] gap-4 lg:flex" style={maskStyle}>
            <MarqueeColumn items={columnA.length ? columnA : items} direction="up" />
            <MarqueeColumn items={columnB.length ? columnB : items} direction="down" />
          </div>

          <div className="premium-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:hidden">
            {items.map((item) => (
              <div key={item.id} className="w-56 shrink-0 snap-center">
                <SalonCard item={item} tall />
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

export default InfiniteSalonCarousel
