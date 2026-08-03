import { cn } from './cn.js'

const variantClasses = {
  primary: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  outline: 'border border-border bg-transparent text-text hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-black/5',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
}

const sizeClasses = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

export function buttonClasses({ variant = 'primary', size = 'md', className } = {}) {
  return cn(
    'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}
