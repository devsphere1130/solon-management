import { motion } from 'motion/react'
import { cn } from '../../lib/cn.js'

function SectionHeading({ eyebrow, title, description, align = 'center', className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('mx-auto max-w-2xl', align === 'center' && 'text-center', className)}
    >
      {eyebrow && <p className="text-sm font-bold tracking-wide text-primary uppercase">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-text-muted">{description}</p>}
    </motion.div>
  )
}

export default SectionHeading
