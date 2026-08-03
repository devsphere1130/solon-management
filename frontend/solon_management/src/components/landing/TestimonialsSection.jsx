import { motion } from 'motion/react'
import { Star } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import { testimonials } from '../../data/landingContent.js'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

function TestimonialsSection() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="Trusted by salons that run on precision" />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-text">"{testimonial.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials(testimonial.name)}
                </span>
                <div>
                  <p className="text-sm font-bold text-text">{testimonial.name}</p>
                  <p className="text-xs text-text-muted">
                    {testimonial.role}, {testimonial.salon}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default TestimonialsSection
