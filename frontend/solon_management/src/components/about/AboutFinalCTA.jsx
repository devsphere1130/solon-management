import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Container from '../common/Container.jsx'
import Button from '../common/Button.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function AboutFinalCTA() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 text-center sm:px-16"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,78,227,0.35),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
              Your salon deserves a better way to run.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
              Bring appointments, customers, staff, billing and growth into one connected workspace.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={ROUTE_PATHS.login} className={buttonClasses({ variant: 'accent', size: 'lg', className: 'group' })}>
                Start Free Trial
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default AboutFinalCTA
