import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Image as ImageIcon,
  MapPin,
  Pause,
  Play,
  Search,
  Sparkles,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
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
      <div className="grid gap-2 rounded-2xl border border-white/18 bg-[#241c1a]/70 p-3 text-white">
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
      <div className="rounded-2xl border border-white/18 bg-[#241c1a]/70 p-3">
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
      <div className="rounded-2xl border border-white/18 bg-[#241c1a]/70 p-3">
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
      <div className="rounded-2xl border border-white/18 bg-[#241c1a]/70 p-3">
        <button type="button" className="flex w-full items-center justify-between rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#241915]">
          Book Again
          <Heart className="size-4 text-[#9b5639]" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/18 bg-[#241c1a]/70 p-3 text-xs font-bold text-white">
      A prepared team, a calm chair, and everything ready on arrival.
    </div>
  )
}

const AUTOPLAY_MS = 3500
const RESUME_DELAY_MS = 5000
const PEEK_PERCENT = 27

function wrappedDistance(index, activeIndex, length) {
  let distance = index - activeIndex
  if (distance > length / 2) distance -= length
  if (distance < -length / 2) distance += length
  return distance
}

function StepCard({ step, distance, onToggle }) {
  const prefersReducedMotion = useReducedMotion()
  const isActive = distance === 0
  const abs = Math.abs(distance)
  const peekY = `${-distance * PEEK_PERCENT}%`

  const target = prefersReducedMotion
    ? { opacity: isActive ? 1 : 0, y: '0%', scale: 1 }
    : abs === 0
      ? { opacity: 1, y: '0%', scale: 1 }
      : abs === 1
        ? { opacity: 0.32, y: peekY, scale: 0.93 }
        : { opacity: 0, y: peekY, scale: 0.9 }

  return (
    <motion.article
      animate={{ ...target, zIndex: journeySteps.length - abs }}
      transition={
        prefersReducedMotion
          ? { duration: 0.25 }
          : abs >= 2
            ? { duration: 0 }
            : { type: 'spring', stiffness: 220, damping: 32, mass: 0.7 }
      }
      onClick={isActive ? onToggle : undefined}
      style={{ pointerEvents: isActive ? 'auto' : 'none', cursor: isActive ? 'pointer' : 'default' }}
      className="absolute inset-x-0 top-24 mx-auto w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-white/18 bg-[#fffaf6] shadow-[0_28px_90px_-42px_rgba(0,0,0,0.7)] sm:top-32 sm:rounded-[1.65rem]"
      aria-hidden={!isActive}
      aria-label={`${step.number}. ${step.title}`}
    >
      <div className="relative h-36 overflow-hidden bg-[#e9dfd5] sm:h-60">
        <ImageWithFallback src={step.image.src} alt={step.image.alt} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191716]/76 via-[#191716]/14 to-transparent" />
        <div className="absolute left-3 right-3 bottom-3 sm:left-6 sm:right-6 sm:bottom-4">
          <StepPreview type={step.preview} />
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:gap-5 sm:p-7 lg:grid-cols-[0.34fr_1fr]">
        <div>
          <p className="text-3xl font-extrabold leading-none text-[#9b5639] sm:text-5xl">{step.number}</p>
          <p className="mt-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#6e7b59] sm:mt-2">{step.eyebrow}</p>
        </div>
        <div>
          <h3 className="text-lg font-extrabold leading-tight text-[#221915] sm:text-3xl">{step.title}</h3>
          <p className="mt-2 text-xs leading-5 text-[#6f5f57] sm:mt-3 sm:text-base sm:leading-6">{step.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
            {step.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-[#edf1ea] px-2.5 py-1 text-[11px] font-bold text-[#4f664f] sm:px-3 sm:py-1.5 sm:text-xs">
                {chip}
              </span>
            ))}
          </div>
          <Link
            to={ROUTE_PATHS.services}
            tabIndex={isActive ? 0 : -1}
            onClick={(event) => event.stopPropagation()}
            className={buttonClasses({
              variant: 'secondary',
              size: 'sm',
              className: 'mt-4 bg-[#221915] hover:bg-[#3a2b24] sm:mt-6 sm:h-11 sm:px-6 sm:text-sm',
            })}
          >
            {step.action}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function StepDot({ step, index, activeIndex, isPlaying, onSelect }) {
  const isActive = activeIndex === index

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={isActive}
      aria-label={`Go to step ${step.number}: ${step.eyebrow}`}
      className="group flex items-center gap-3 text-left"
    >
      <span
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-extrabold transition-all duration-300',
          isActive ? 'border-[#d7b48c] text-[#221915] scale-110' : 'border-white/18 bg-white/8 text-white/55 group-hover:border-white/40 group-hover:text-white/80',
        )}
      >
        {isActive && (
          <motion.span
            key={isPlaying ? 'fill-playing' : 'fill-paused'}
            className="absolute inset-0 bg-[#d7b48c]"
            style={{ originY: 1 }}
            initial={{ scaleY: isPlaying ? 0 : 1 }}
            animate={{ scaleY: 1 }}
            transition={isPlaying ? { duration: AUTOPLAY_MS / 1000, ease: 'linear' } : { duration: 0.2 }}
          />
        )}
        <span className="relative z-10">{step.number}</span>
      </span>
      <span className={cn('text-xs font-bold transition-colors', isActive ? 'text-white' : 'text-white/42 group-hover:text-white/70')}>
        {step.eyebrow}
      </span>
    </button>
  )
}

function StepIndicator({ activeIndex, isPlaying, onSelect, mode = 'all' }) {
  return (
    <>
      {mode !== 'mobile' && (
        <nav className="hidden lg:block" aria-label="Journey progress">
          <ol className="space-y-5">
            {journeySteps.map((step, index) => (
              <li key={step.id}>
                <StepDot step={step} index={index} activeIndex={activeIndex} isPlaying={isPlaying} onSelect={onSelect} />
              </li>
            ))}
          </ol>
        </nav>
      )}

      {mode !== 'desktop' && (
        <nav className="mb-6 flex items-center justify-center gap-2 lg:hidden" aria-label="Journey progress">
          {journeySteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-current={activeIndex === index}
              aria-label={`Go to step ${step.number}: ${step.eyebrow}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                activeIndex === index ? 'w-7 bg-[#d7b48c]' : 'w-2 bg-white/25 hover:bg-white/40',
              )}
            />
          ))}
        </nav>
      )}
    </>
  )
}

function JourneySection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const resumeTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return undefined

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % journeySteps.length)
    }, AUTOPLAY_MS)

    return () => window.clearInterval(id)
  }, [isPlaying, prefersReducedMotion])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  function clearResumeTimer() {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  function selectStep(index) {
    clearResumeTimer()

    if (index === activeIndex) {
      // Clicking the already-active step toggles it: pause, or remove the pause and continue.
      setIsPlaying((current) => !current)
      return
    }

    setActiveIndex(index)
    setIsPlaying(false)
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true)
      resumeTimeoutRef.current = null
    }, RESUME_DELAY_MS)
  }

  function togglePlay() {
    clearResumeTimer()
    setIsPlaying((current) => !current)
  }

  return (
    <section id="journey" className="relative overflow-hidden bg-[#191716] py-16 sm:py-20" aria-labelledby="journey-title">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(215,180,140,0.13),transparent_34%),linear-gradient(240deg,rgba(79,102,79,0.18),transparent_42%)]" />
      <Container className="relative grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-center">
        <div className="hidden self-center lg:block">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d7b48c]">How It Works</p>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
              className="flex size-7 items-center justify-center rounded-full border border-white/18 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              {isPlaying ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
          <StepIndicator activeIndex={activeIndex} isPlaying={isPlaying} onSelect={selectStep} mode="desktop" />
        </div>

        <div className="relative">
          <h2 id="journey-title" className="sr-only">
            Salon booking journey
          </h2>
          <StepIndicator activeIndex={activeIndex} isPlaying={isPlaying} onSelect={selectStep} mode="mobile" />
          <div className="relative min-h-[40rem] sm:min-h-[52rem]">
            {journeySteps.map((journeyStep, index) => (
              <StepCard
                key={journeyStep.id}
                step={journeyStep}
                distance={wrappedDistance(index, activeIndex, journeySteps.length)}
                onToggle={() => selectStep(index)}
              />
            ))}
          </div>
        </div>
      </Container>
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
