import { cn } from '../../lib/cn.js'

function ReportCard({ title, subtitle, tooltip, action, children, className }) {
  return (
    <section className={cn('rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <h2 className="text-sm font-bold text-text sm:text-base">{title}</h2>}
          {subtitle && <p className="mt-1 text-xs leading-5 text-text-muted">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {tooltip && (
            <span className="group relative">
              <span className="flex size-6 cursor-help items-center justify-center rounded-full border border-border text-xs font-bold text-text-muted transition-colors hover:border-primary/40 hover:text-primary">?</span>
              <span className="pointer-events-none absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-card p-3 text-xs leading-5 text-text-muted opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
                {tooltip}
              </span>
            </span>
          )}
          {action}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default ReportCard