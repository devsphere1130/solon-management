import { forwardRef, useId } from 'react'
import { cn } from '../../lib/cn.js'

const Input = forwardRef(function Input({ label, icon: Icon, error, required, className, id, ...props }, ref) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="text-left">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none transition-colors',
            'placeholder:text-text-muted focus:border-primary',
            Icon && 'pl-10',
            error && 'border-danger focus:border-danger',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
})

export default Input
