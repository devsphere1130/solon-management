import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import { manifestoLines } from '../../data/aboutContent.js'

function VisualManifesto() {
  return (
    <section className="bg-secondary py-28">
      <Container className="space-y-10">
        {manifestoLines.map(([faint, bold], index) => (
          <motion.p
            key={faint}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
            className="text-3xl leading-[1.15] font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-white/35">{faint} </span>
            <span className="text-white">{bold}</span>
          </motion.p>
        ))}
      </Container>
    </section>
  )
}

export default VisualManifesto
