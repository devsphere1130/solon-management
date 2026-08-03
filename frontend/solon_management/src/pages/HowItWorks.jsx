import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Image as ImageIcon,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { audienceJourneys, journeySteps } from '../data/howItWorks.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'
import { cn } from '../lib/cn.js'

function ImageWithFallback({ src, alt, className, loading = 'lazy' }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#ede6dc] text-[#7b675c]', className)}>
        <ImageIcon className="size-8" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} loading={loading} className={className} onError={() => setHasError(true)} />
}

function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  function scrollToJourney() {
    document.getElementById('journey')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-[#191716] text-white">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=84"
        alt="Salon stylist preparing a client hair appointment"
        loading="eager"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,23,22,0.92),rgba(25,23,22,0.62),rgba(25,23,22,0.18)),linear-gradient(180deg,rgba(25,23,22,0.2),rgba(25,23,22,0.72))]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#191716] to-transparent" />

      <Container className="relative flex min-h-[calc(100vh-4.5rem)] items-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Badge className="border border-white/20 bg-white/12 text-white backdrop-blur">Your Beauty Journey</Badge>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            How It Works
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
            Your perfect salon experience, from discovery to appointment, made simple.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" className="bg-white text-[#241915] hover:bg-[#f5ede5]" onClick={scrollToJourney}>
              Explore How It Works
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Link
              to={ROUTE_PATHS.services}
              className={buttonClasses({
                variant: 'outline',
                size: 'lg',
                className: 'border-white/28 bg-white/8 text-white hover:bg-white/15',
              })}
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function AudienceSection() {
  return (
    <section className="border-b border-[#e7ded4] bg-[#f8f4ef] py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <Badge className="bg-[#e7eee5] text-[#4f664f]">One Platform</Badge>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#221915] sm:text-4xl">
            Every beauty and grooming journey belongs here
          </h2>
          <p className="mt-4 text-base leading-7 text-[#6f5f57]">
            The experience supports everyday grooming, premium beauty care, wedding prep, spa recovery, and repeat
            self-care routines for everyone.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {audienceJourneys.map((audience) => (
            <div key={audience.label} className="rounded-3xl border border-[#e7ded4] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-extrabold text-[#221915]">{audience.label}</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {audience.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-[#e7ded4] bg-[#fbf8f4] px-3 py-1.5 text-xs font-bold text-[#5d4b43]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function StepPreview({ type }) {
  if (type === 'map') {
    return (
      <div className="grid gap-2 rounded-2xl border border-white/18 bg-white/12 p-3 text-white backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl bg-white/14 px-3 py-2 text-xs font-bold">
          <Search className="size-3.5" aria-hidden="true" />
          Salon near me
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[#241915]">
          <span className="inline-flex items-center gap-2 text-xs font-bold">
            <MapPin className="size-3.5 text-[#9b5639]" aria-hidden="true" />
            1.2 km
          </span>
          <span className="text-xs font-bold text-[#4f664f]">Open</span>
        </div>
      </div>
    )
  }

  if (type === 'services') {
    return (
      <div className="rounded-2xl border border-white/18 bg-white/12 p-3 backdrop-blur">
        {['Hair Styling', 'Beard Grooming', 'Hydra Facial'].map((item, index) => (
          <div key={item} className="flex items-center justify-between border-b border-white/12 py-2 text-xs font-bold text-white last:border-0">
            <span>{item}</span>
            <span className="text-white/70">{index === 0 ? '45 min' : index === 1 ? '30 min' : '50 min'}</span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'calendar') {
    return (
      <div className="rounded-2xl border border-white/18 bg-white/12 p-3 backdrop-blur">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-white">
          <CalendarDays className="size-4" aria-hidden="true" />
          Friday, 7:30 PM
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['5:00', '6:30', '7:30'].map((time) => (
            <span
              key={time}
              className={cn(
                'rounded-full px-3 py-2 text-center text-xs font-bold',
                time === '7:30' ? 'bg-white text-[#241915]' : 'bg-white/12 text-white',
              )}
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'confirmation') {
    return (
      <div className="rounded-2xl border border-white/18 bg-white p-4 text-[#241915] shadow-soft">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9b5639]">Confirmed</p>
        <div className="mt-3 space-y-2 text-xs font-bold">
          <p className="flex items-center justify-between">
            <span>Signature Cut</span>
            <span>Rs. 799</span>
          </p>
          <p className="flex items-center justify-between text-[#6f5f57]">
            <span>Stylist</span>
            <span>Meera</span>
          </p>
        </div>
      </div>
    )
  }

  if (type === 'again') {
    return (
      <div className="rounded-2xl border border-white/18 bg-white/12 p-3 backdrop-blur">
        <button type="button" className="flex w-full items-center justify-between rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#241915]">
          Book Again
          <Heart className="size-4 text-[#9b5639]" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/18 bg-white/12 p-3 text-xs font-bold text-white backdrop-blur">
      A prepared team, a calm chair, and everything ready on arrival.
    </div>
  )
}

function StepCard({ step, index, activeIndex, scrollProgress }) {
  const segment = 1 / Math.max(journeySteps.length - 1, 1)
  const center = index * segment
  const prefersReducedMotion = useReducedMotion()
  const input = [
    center - segment * 1.35,
    center - segment,
    center,
    center + segment,
    center + segment * 1.35,
  ]
  const opacity = useTransform(scrollProgress, input, [0, 0.25, 1, 0.25, 0])
  const y = useTransform(scrollProgress, input, [410, 320, 0, -320, -410])
  const scale = useTransform(scrollProgress, input, [0.9, 0.94, 1, 0.94, 0.9])
  const imageScale = useTransform(scrollProgress, input, [1, 1, 1.03, 1, 1])
  const isActive = activeIndex === index

  const reducedStyle = useMemo(() => {
    const distance = index - activeIndex
    return {
      opacity: Math.abs(distance) > 1 ? 0 : distance === 0 ? 1 : 0.24,
      y: distance * 300,
      scale: distance === 0 ? 1 : 0.94,
    }
  }, [activeIndex, index])

  return (
    <div
      style={{
        zIndex: journeySteps.length + 2 - Math.abs(index - activeIndex),
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      className="absolute left-1/2 top-1/2 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2"
    >
      <motion.article
        style={{
          opacity: prefersReducedMotion ? reducedStyle.opacity : opacity,
          y: prefersReducedMotion ? reducedStyle.y : y,
          scale: prefersReducedMotion ? reducedStyle.scale : scale,
        }}
        className="overflow-hidden rounded-[1.65rem] border border-white/18 bg-[#fffaf6] shadow-[0_28px_90px_-42px_rgba(0,0,0,0.7)]"
        aria-label={`${step.number}. ${step.title}`}
      >
        <div className="relative h-48 overflow-hidden bg-[#e9dfd5] sm:h-60">
          <motion.div style={{ scale: prefersReducedMotion ? 1 : imageScale }} className="size-full">
            <ImageWithFallback src={step.image.src} alt={step.image.alt} className="size-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#191716]/76 via-[#191716]/14 to-transparent" />
          <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6">
            <StepPreview type={step.preview} />
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[0.34fr_1fr]">
          <div>
            <p className="text-5xl font-extrabold leading-none text-[#9b5639]">{step.number}</p>
            <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#6e7b59]">{step.eyebrow}</p>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold leading-tight text-[#221915] sm:text-3xl">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#6f5f57] sm:text-base">{step.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {step.chips.map((chip) => (
                <span key={chip} className="rounded-full bg-[#edf1ea] px-3 py-1.5 text-xs font-bold text-[#4f664f]">
                  {chip}
                </span>
              ))}
            </div>
            <Link
              to={ROUTE_PATHS.services}
              tabIndex={isActive ? 0 : -1}
              className={buttonClasses({
                variant: 'secondary',
                size: 'md',
                className: 'mt-6 bg-[#221915] hover:bg-[#3a2b24]',
              })}
            >
              {step.action}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

function StepIndicator({ activeIndex, scrollProgress, mode = 'all' }) {
  return (
    <>
      {mode !== 'mobile' && (
        <nav className="hidden lg:block" aria-label="Journey progress">
          <div className="relative px-2 py-2">
            <div className="absolute left-[1.35rem] top-7 h-[calc(100%-3.5rem)] w-px bg-white/18" aria-hidden="true">
              <motion.div
                className="h-full origin-top bg-[#d7b48c]"
                style={{ scaleY: scrollProgress }}
              />
            </div>
            <ol className="relative z-10 space-y-5">
              {journeySteps.map((step, index) => (
                <li key={step.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full border text-xs font-extrabold transition-all duration-300',
                      activeIndex === index
                        ? 'border-[#d7b48c] bg-[#d7b48c] text-[#221915] scale-110'
                        : 'border-white/18 bg-white/8 text-white/55',
                    )}
                  >
                    {step.number}
                  </span>
                  <span className={cn('text-xs font-bold transition-colors', activeIndex === index ? 'text-white' : 'text-white/42')}>
                    {step.eyebrow}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {mode !== 'desktop' && (
        <nav className="absolute left-5 right-5 top-4 z-30 rounded-full border border-white/14 bg-[#191716]/72 px-4 py-3 backdrop-blur lg:hidden" aria-label="Journey progress">
          <div className="absolute left-6 right-6 top-1/2 h-px bg-white/18" aria-hidden="true">
            <motion.div className="h-full origin-left bg-[#d7b48c]" style={{ scaleX: scrollProgress }} />
          </div>
          <ol className="relative z-10 flex items-center justify-between">
            {journeySteps.map((step, index) => (
              <li key={step.id}>
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border text-[11px] font-extrabold transition-all duration-300',
                    activeIndex === index
                      ? 'border-[#d7b48c] bg-[#d7b48c] text-[#221915]'
                      : 'border-white/18 bg-[#191716] text-white/55',
                  )}
                >
                  {step.number}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  )
}

function JourneySection() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 })

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const nextIndex = Math.min(journeySteps.length - 1, Math.max(0, Math.round(latest * (journeySteps.length - 1))))
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
  })

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative bg-[#191716]"
      style={{ height: `${journeySteps.length * 112}vh` }}
      aria-labelledby="journey-title"
    >
      <div className="sticky top-18 min-h-[calc(100vh-4.5rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(215,180,140,0.13),transparent_34%),linear-gradient(240deg,rgba(79,102,79,0.18),transparent_42%)]" />
        <Container className="relative grid min-h-[calc(100vh-4.5rem)] items-center gap-8 py-16 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <div className="hidden self-center lg:block">
            <p className="mb-6 text-xs font-extrabold uppercase tracking-[0.2em] text-[#d7b48c]">How It Works</p>
            <StepIndicator activeIndex={activeIndex} scrollProgress={smoothProgress} mode="desktop" />
          </div>

          <div className="relative min-h-[calc(100vh-9rem)] lg:min-h-[calc(100vh-8rem)]">
            <h2 id="journey-title" className="sr-only">
              Salon booking journey
            </h2>
            <StepIndicator activeIndex={activeIndex} scrollProgress={smoothProgress} mode="mobile" />
            {journeySteps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                activeIndex={activeIndex}
                scrollProgress={smoothProgress}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#f8f4ef] py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#221915]">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1500&q=82"
            alt="Salon styling tools and beauty products prepared for an appointment"
            className="absolute inset-0 size-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,25,21,0.96),rgba(34,25,21,0.78),rgba(34,25,21,0.42))]" />
          <div className="relative max-w-2xl px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-14">
            <Badge className="border border-white/18 bg-white/12 text-white">Ready When You Are</Badge>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Ready for your next salon experience?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/78">
              Discover salons, explore services, and book an appointment in just a few clicks.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTE_PATHS.services}
                className={buttonClasses({
                  variant: 'accent',
                  size: 'lg',
                  className: 'bg-[#d7b48c] text-[#221915] hover:bg-[#e6c49e]',
                })}
              >
                Explore Services
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href="#journey"
                className={buttonClasses({
                  variant: 'outline',
                  size: 'lg',
                  className: 'border-white/22 bg-white/8 text-white hover:bg-white/15',
                })}
              >
                Find a Salon
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function HowItWorks() {
  return (
    <div className="bg-[#f8f4ef]">
      <HeroSection />
      <AudienceSection />
      <JourneySection />
      <FinalCta />
    </div>
  )
}

export default HowItWorks
