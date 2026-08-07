import { motion } from 'motion/react'
import Container from '../common/Container.jsx'
import { galleryProfessionals } from '../../data/gallery.js'

const roles = ['Salon owner', 'Stylist', 'Barber', 'Makeup artist', 'Therapist', 'Receptionist', 'Customer']

function PeopleSection() {
  const [main, ...rest] = galleryProfessionals

  return (
    <section className="overflow-hidden bg-background py-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative mx-auto aspect-[4/5] w-full max-w-md"
          >
            <img
              src={main?.image}
              alt={main?.name}
              loading="lazy"
              className="absolute inset-0 size-full rounded-[28px] object-cover shadow-2xl"
            />

            {rest.slice(0, 2).map((professional, index) => (
              <img
                key={professional.id}
                src={professional.image}
                alt={professional.name}
                loading="lazy"
                className={
                  index === 0
                    ? 'absolute -top-8 -right-10 hidden size-32 rounded-2xl border-4 border-background object-cover shadow-xl sm:block'
                    : 'absolute -bottom-10 -left-10 hidden size-36 rounded-2xl border-4 border-background object-cover shadow-xl sm:block'
                }
              />
            ))}

            <div className="absolute -bottom-6 right-4 max-w-[13rem] rounded-2xl border border-border bg-card p-4 shadow-2xl sm:right-8">
              <p className="text-sm leading-snug font-bold text-text">
                &ldquo;More time with clients. Less time managing the day.&rdquo;
              </p>
            </div>
          </motion.div>

          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-primary uppercase">People Behind the Salon</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl"
            >
              Technology should disappear. The experience should remain.
            </motion.h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
              DevSphere is built for the people who make a salon feel like a salon — not just the software behind
              it.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {roles.map((role) => (
                <li key={role} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-text-muted">
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default PeopleSection
