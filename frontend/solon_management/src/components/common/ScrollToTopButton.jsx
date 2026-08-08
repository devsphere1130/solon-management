import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp } from 'lucide-react'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const VISIBILITY_THRESHOLD = 420

function ScrollToTopButton() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const frameRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    function measure() {
      const scrollTop = window.scrollY
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0)
      setVisible(scrollTop > VISIBILITY_THRESHOLD)
      frameRef.current = null
    }

    function handleScroll() {
      if (frameRef.current) return
      frameRef.current = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed right-5 bottom-6 z-40 flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-2xl ring-1 ring-black/5 transition-colors hover:bg-primary hover:text-primary-foreground sm:right-8 sm:bottom-8"
        >
          <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <ArrowUp className="relative size-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTopButton
