import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import { brandValues } from '../../data/aboutContent.js'

function BrandValues() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <p className="text-center text-sm font-bold tracking-[0.16em] text-primary uppercase">What We Believe</p>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {brandValues.map((value, index) => (
            <motion.div
              key={value.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
            >
              <p className="text-sm font-extrabold text-accent">{value.number}</p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-text">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default BrandValues
