import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import SectionHeading from '../landing/SectionHeading.jsx'
import { whyDevSphereProblems } from '../../data/aboutContent.js'

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

function WhyDevSphere() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeading eyebrow="Why DevSphere Exists" title="Built because salon owners deserve better." />

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {whyDevSphereProblems.map((problem) => (
            <motion.div key={problem.number} variants={cardVariants} className="rounded-3xl border border-border bg-card p-8">
              <p className="text-sm font-extrabold text-primary">{problem.number}</p>
              <h3 className="mt-3 text-lg font-extrabold tracking-tight text-text uppercase">{problem.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 text-center text-2xl font-extrabold tracking-tight text-text sm:text-3xl"
        >
          DevSphere brings it together.
        </motion.p>
      </Container>
    </section>
  )
}

export default WhyDevSphere
