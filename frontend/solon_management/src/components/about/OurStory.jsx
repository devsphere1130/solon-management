import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import { ourStorySteps } from '../../data/aboutContent.js'

function OurStory() {
  return (
    <section className="bg-background py-24">
      <Container>
        <p className="text-sm font-bold tracking-[0.16em] text-primary uppercase">Our Story</p>

        <div className="mt-6 grid gap-12 lg:grid-cols-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl lg:text-[2.75rem]"
          >
            Salons were built around people. Their software should be too.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <p className="text-base leading-relaxed text-text-muted">
              Running a salon is about much more than appointments. It is about remembering a client&apos;s favorite
              stylist, keeping a team moving, creating beautiful experiences, managing inventory, handling payments
              and building relationships that bring people back.
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              DevSphere was created to bring all of those moments into one connected workspace.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8"
        >
          {ourStorySteps.map((step) => (
            <div key={step.number}>
              <p className="text-2xl font-extrabold text-accent sm:text-3xl">{step.number}</p>
              <p className="mt-1 text-sm font-bold text-text sm:text-base">{step.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default OurStory
