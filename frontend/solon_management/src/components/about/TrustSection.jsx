import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import AnimatedStat from '../common/AnimatedStat.jsx'
import { trustStats } from '../../data/aboutContent.js'

function TrustSection() {
  return (
    <section className="bg-background py-24">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-center text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl"
        >
          Built for the people who keep salons moving.
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-text-muted">
          Salon owners, managers, stylists, barbers, therapists and receptionists — all working from the same
          workspace.
        </p>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 border-t border-border pt-10">
          {trustStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm font-semibold text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default TrustSection
