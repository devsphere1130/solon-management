import { motion } from 'motion/react'
import { Lightbulb } from 'lucide-react'
import Container from '../common/Container.jsx'
import { insightCards } from '../../data/aboutContent.js'

const metrics = ['Revenue', 'Appointments', 'Customer retention', 'Staff performance', 'Service performance']

function IntelligenceSection() {
  return (
    <section className="bg-secondary py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.16em] text-accent uppercase">Data &amp; Intelligence</p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Know what&apos;s happening. Know what to do next.
          </motion.h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Every appointment, sale and client visit turns into a clear read on how the business is doing.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2"
        >
          {metrics.map((metric) => (
            <span key={metric} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
              {metric}
            </span>
          ))}
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {insightCards.map((insight, index) => (
            <motion.div
              key={insight}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm leading-relaxed font-semibold text-white">{insight}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default IntelligenceSection
