import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Container from '../common/Container.jsx'
import InfiniteSalonCarousel from './InfiniteSalonCarousel.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 size-[24rem] rounded-full bg-accent/25 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid grid-cols-1 gap-16 py-24 lg:grid-cols-[45fr_55fr] lg:items-center lg:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            About DevSphere
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Where Beauty
            <br />
            <span className="bg-gradient-to-r from-accent to-primary-foreground bg-clip-text text-transparent">
              Meets Better Business.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-relaxed font-semibold text-white/85"
          >
            Built for salons. Designed around people.
            <br />
            Powered by a smarter way to work.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-white/65"
          >
            DevSphere brings appointments, customers, staff, services, billing and growth into one connected
            workspace — so salon teams can spend less time managing operations and more time creating experiences
            people remember.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link to={ROUTE_PATHS.login} className={buttonClasses({ variant: 'accent', size: 'lg', className: 'group' })}>
              Discover DevSphere
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              to={ROUTE_PATHS.howItWorks}
              className={buttonClasses({ variant: 'outline', size: 'lg', className: 'border-white/25 text-white hover:bg-white/10' })}
            >
              See How It Works
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <InfiniteSalonCarousel />
      </Container>
    </section>
  )
}

export default AboutHero
