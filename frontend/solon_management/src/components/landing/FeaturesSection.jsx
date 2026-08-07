import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import { features } from '../../data/landingContent.js'
import { useLandingImages } from '../../context/LandingImagesContext.jsx'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function FeaturesSection() {
  const { images } = useLandingImages()

  return (
    <section id="features" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Everything included"
          title="One platform for every part of the salon"
          description="Replace the spreadsheets, sticky notes and disconnected apps with a single workspace built for salon operations."
        />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map(({ icon: Icon, title, description }) => {
            const image = images.features[title]

            return (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lg"
              >
                {image ? (
                  <img src={image.dataUrl} alt="" className="size-11 rounded-xl object-cover" />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                )}
                <h3 className="mt-5 text-base font-bold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}

export default FeaturesSection
