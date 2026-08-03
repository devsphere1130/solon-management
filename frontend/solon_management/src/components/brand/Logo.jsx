import { motion } from 'motion/react'
import { cn } from '../../lib/cn.js'

const markVariants = {
  initial: { opacity: 0, scale: 0.6, rotate: -20 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
  hover: { rotate: 8, transition: { type: 'spring', stiffness: 300, damping: 12 } },
}

const wordVariants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0, transition: { delay: 0.12, duration: 0.35, ease: 'easeOut' } },
}

function LogoMark({ tone = 'light', className }) {
  const ringColor = tone === 'light' ? '#ffffff' : '#241c4e'

  return (
    <motion.svg
      variants={markVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="34" height="34" rx="10" fill="url(#devsphere-gradient)" />
      <circle cx="17" cy="17" r="7.5" stroke={ringColor} strokeOpacity="0.9" strokeWidth="1.6" />
      <circle cx="22.5" cy="12" r="2.6" fill={ringColor} />
      <defs>
        <linearGradient id="devsphere-gradient" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6c4ee3" />
          <stop offset="1" stopColor="#f0b84b" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}

function Logo({ tone = 'dark', showWordmark = true, className }) {
  const textColor = tone === 'light' ? 'text-white' : 'text-text'

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} />
      {showWordmark && (
        <motion.span
          variants={wordVariants}
          initial="initial"
          animate="animate"
          className={cn('text-lg font-extrabold tracking-tight', textColor)}
        >
          DevSphere
        </motion.span>
      )}
    </span>
  )
}

export default Logo
