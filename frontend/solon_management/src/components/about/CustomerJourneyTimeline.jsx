import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import SectionHeading from '../landing/SectionHeading.jsx'
import { customerJourneySteps } from '../../data/aboutContent.js'

function CustomerJourneyTimeline() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeading eyebrow="Customer Experience" title="From first click to final touch." />

        <div className="relative mt-16">
          <div className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block" aria-hidden="true" />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {customerJourneySteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                className="relative"
              >
                <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-card text-sm font-extrabold text-primary shadow-soft">
                  {step.number}
                </span>
                <h3 className="mt-4 text-sm font-extrabold tracking-wide text-text uppercase">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CustomerJourneyTimeline
