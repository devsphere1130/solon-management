import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, BookOpenText } from 'lucide-react'
import Container from '../components/common/Container.jsx'
import SectionHeading from '../components/landing/SectionHeading.jsx'
import { ROUTE_PATHS } from '../routes/routeConfig.js'
import { docLanguages } from '../data/docs/languages.js'

function LanguageCard({ language, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
      <Link
        to={`${ROUTE_PATHS.docs}/${language.code}`}
        className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-soft transition-shadow hover:shadow-lg"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BookOpenText className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-6 text-3xl font-extrabold tracking-tight text-text">{language.native}</p>
        <p className="mt-1 text-sm font-semibold text-text-muted">{language.name}</p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">{language.tagline}</p>
        <span className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
          Read documentation
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  )
}

function Documentation() {
  return (
    <Container as="section" className="py-24">
      <SectionHeading
        eyebrow="Documentation"
        title="Everything you need to run your salon with DevSphere."
        description="A complete, plain-language guide for salon owners and teams — pick the language you're most comfortable reading in."
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
        {docLanguages.map((language, index) => (
          <LanguageCard key={language.code} language={language} index={index} />
        ))}
      </div>
    </Container>
  )
}

export default Documentation
