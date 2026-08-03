import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { buttonClasses } from '../../lib/buttonClasses.js'

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  )
})

export default Button
