import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import Container from '../common/Container.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { useLandingImages } from '../../context/LandingImagesContext.jsx'
import defaultBannerVideo from '../../assets/videos/banner.mp4'
import defaultHeroImage from '../../assets/img/hero.png'

function HeroSection() {
  const { images } = useLandingImages()

  return (
    <section className="relative overflow-hidden bg-secondary">
      {images.heroBackgroundVideo || !images.heroBackground ? (
        <>
          <video
            src={images.heroBackgroundVideo?.dataUrl || defaultBannerVideo}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 size-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-secondary/80" aria-hidden="true" />
        </>
      ) : (
        <>
          <img
            src={images.heroBackground.dataUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-secondary/80" aria-hidden="true" />
        </>
      )}
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 size-[24rem] rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid gap-16 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Built for modern salons
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Run Your Salon.
            <br />
            Grow Your Business.
            <br />
            <span className="bg-gradient-to-r from-accent to-primary-foreground bg-clip-text text-transparent">
              Delight Every Client.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/70"
          >
            DevSphere brings appointments, staff, billing and inventory into one calm workspace — so you can spend
            less time on admin and more time behind the chair.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link to={ROUTE_PATHS.login} className={buttonClasses({ variant: 'accent', size: 'lg', className: 'group' })}>
              Start free trial
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a href="#how-it-works" className={buttonClasses({ variant: 'outline', size: 'lg', className: 'border-white/25 text-white hover:bg-white/10' })}>
              See how it works
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-sm text-white/50"
          >
            Loved by 500+ salons and spas worldwide
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {images.heroVideo ? (
            <video
              src={images.heroVideo.dataUrl}
              muted
              loop
              autoPlay
              playsInline
              className="relative mt-10 aspect-video w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
            />
          ) : (
            <img
              src={images.hero?.dataUrl || defaultHeroImage}
              alt=""
              className="relative mt-10 aspect-video w-full rounded-3xl border border-white/10 object-cover shadow-2xl"
            />
          )}
        </motion.div>
      </Container>
    </section>
  )
}

export default HeroSection
