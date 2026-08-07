import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from '../landing/SectionHeading.jsx'
import { useGallery } from '../../context/useGallery.js'
import { salonTypes } from '../../data/aboutContent.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function sourceFor(item) {
  return item?.thumbnailUrl || item?.mediaUrl || item?.afterImage || item?.beforeImage || ''
}

function pickImage(pool, tagPreferences, usedIds) {
  const available = pool.filter((item) => !usedIds.has(item.id))
  const searchPool = available.length ? available : pool

  for (const tag of tagPreferences) {
    const match = searchPool.find(
      (item) => item.tags?.some((itemTag) => itemTag.toLowerCase().includes(tag)) || item.category?.toLowerCase() === tag,
    )
    if (match) return match
  }

  return searchPool[0]
}

function SalonTypeCard({ type, image, index }) {
  const src = sourceFor(image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-border shadow-soft sm:aspect-[4/5]"
    >
      {src ? (
        <img
          src={src}
          alt={image?.alt || type.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-surface text-text-muted">
          <ImageIcon className="size-8" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform duration-500 group-hover:-translate-y-2">
        <h3 className="text-xl font-extrabold tracking-tight">{type.name}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {type.services.map((service) => (
            <li key={service} className="rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
              {service}
            </li>
          ))}
        </ul>
        <Link
          to={ROUTE_PATHS.services}
          className="mt-4 flex items-center gap-1.5 text-sm font-bold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          Explore salon workflow
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  )
}

function SalonTypes() {
  const { publishedMedia } = useGallery()
  const usedIds = new Set()

  const cards = salonTypes.map((type) => {
    const image = pickImage(publishedMedia, type.tagPreferences, usedIds)
    if (image) usedIds.add(image.id)
    return { type, image }
  })

  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeading eyebrow="Every Kind of Salon" title="One platform. Every kind of salon." />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {cards.map(({ type, image }, index) => (
            <SalonTypeCard key={type.id} type={type} image={image} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default SalonTypes
