import { motion } from 'motion/react'
import { Image as ImageIcon } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from '../landing/SectionHeading.jsx'
import { useGallery } from '../../context/useGallery.js'
import { galleryStoryCaptions } from '../../data/aboutContent.js'

function sourceFor(item) {
  return item?.thumbnailUrl || item?.mediaUrl || item?.afterImage || item?.beforeImage || ''
}

function AboutGallery() {
  const { publishedMedia } = useGallery()
  const items = publishedMedia.slice(0, 9)

  if (!items.length) return null

  return (
    <section className="bg-background py-24">
      <Container>
        <SectionHeading eyebrow="Craft, Care, Connection" title="A closer look at every day in the salon." />

        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {items.map((item, index) => {
            const src = sourceFor(item)
            const caption = galleryStoryCaptions[index % galleryStoryCaptions.length]

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.08, ease: 'easeOut' }}
                className="relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                {src ? (
                  <img
                    src={src}
                    alt={item.alt || item.title}
                    loading="lazy"
                    className={index % 4 === 0 ? 'aspect-[3/4] w-full object-cover' : 'aspect-square w-full object-cover'}
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-surface text-text-muted">
                    <ImageIcon className="size-6" aria-hidden="true" />
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold tracking-wide text-text uppercase">
                  {caption}
                </span>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default AboutGallery
