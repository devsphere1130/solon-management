import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import { steps } from '../../data/landingContent.js'

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface py-24">
      <Container>
        <SectionHeading eyebrow="How it works" title="Up and running in an afternoon" />

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative"
            >
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground shadow-soft">
                {index + 1}
              </span>
              <h3 className="mt-5 text-base font-bold text-text">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default HowItWorksSection
