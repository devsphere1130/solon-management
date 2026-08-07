import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import SectionHeading from '../landing/SectionHeading.jsx'
import { platformPillars } from '../../data/aboutContent.js'

function PlatformDifference() {
  return (
    <section className="bg-background py-24">
      <Container>
        <SectionHeading
          eyebrow="The DevSphere Difference"
          title="One calm workspace. Every part of your salon."
          align="left"
          className="mx-0"
        />

        <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {platformPillars.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: (index % 2) * 0.08, ease: 'easeOut' }}
              className="flex items-baseline gap-5 border-b border-border pb-6"
            >
              <span className="text-sm font-extrabold text-accent">{pillar.number}</span>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-text">{pillar.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{pillar.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default PlatformDifference
