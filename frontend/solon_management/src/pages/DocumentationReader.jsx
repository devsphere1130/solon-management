import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Download, Sparkles } from 'lucide-react'
import Container from '../components/common/Container.jsx'
import DocSection from '../components/docs/DocSection.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'
import { docLanguages, getDocLanguage } from '../data/docs/languages.js'
import docsEn from '../data/docs/en.js'
import docsHi from '../data/docs/hi.js'
import docsMr from '../data/docs/mr.js'

const docsByLanguage = { en: docsEn, hi: docsHi, mr: docsMr }

function DocumentationReader() {
  const { lang } = useParams()
  const language = getDocLanguage(lang)
  const doc = docsByLanguage[lang]

  const tocItems = useMemo(
    () => doc?.sections.map((section, index) => ({ id: section.id, index, title: section.title })) ?? [],
    [doc],
  )

  if (!language || !doc) {
    return <Navigate to={ROUTE_PATHS.docs} replace />
  }

  return (
    <>
      <style>{`
        @media print {
          .doc-noprint { display: none !important; }
          .doc-print-area section { break-inside: avoid-page; page-break-before: always; }
          .doc-print-area section:first-child { page-break-before: avoid; }
        }
      `}</style>

      <section className="relative overflow-hidden bg-secondary">
        <div className="pointer-events-none absolute -top-32 -right-32 size-[26rem] rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 size-[22rem] rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />

        <Container className="relative py-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-white uppercase"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            {doc.meta.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl"
          >
            {doc.meta.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-xl text-base text-white/70"
          >
            {doc.meta.tagline}
          </motion.p>

          <div className="doc-noprint mt-9 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
              {docLanguages.map((item) => (
                <Link
                  key={item.code}
                  to={`${ROUTE_PATHS.docs}/${item.code}`}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors',
                    item.code === lang ? 'bg-white text-secondary' : 'text-white/70 hover:text-white',
                  )}
                >
                  {item.native}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className={buttonClasses({ variant: 'accent', size: 'sm', className: 'group' })}
            >
              <Download className="size-4" aria-hidden="true" />
              {doc.meta.downloadLabel}
            </button>
          </div>
          <p className="doc-noprint mt-2 text-xs text-white/50">{doc.meta.printHint}</p>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[220px_1fr]">
        <nav className="doc-noprint hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-1 overflow-y-auto premium-scrollbar pr-2">
            <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-text-muted uppercase">{doc.meta.tocLabel}</p>
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block truncate rounded-lg px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-background hover:text-text"
              >
                <span className="mr-1.5 font-mono text-xs text-accent">{String(item.index + 1).padStart(2, '0')}</span>
                {item.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="doc-print-area min-w-0">
          {doc.sections.map((section, index) => (
            <DocSection key={section.id} index={index} section={section} />
          ))}
        </div>
      </Container>
    </>
  )
}

export default DocumentationReader
