import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BarChart3, CalendarDays, CheckCircle2, Download, FileDown, Loader2, Package, Receipt, Scissors, TrendingUp, UserRound, Users, Wallet, X } from 'lucide-react'
import Button from '../common/Button.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { cn } from '../../lib/cn.js'

const tabIcons = {
  Overview: BarChart3,
  Revenue: TrendingUp,
  Appointments: CalendarDays,
  Services: Scissors,
  Staff: UserRound,
  Customers: Users,
  Products: Package,
  Payments: Wallet,
  Expenses: Receipt,
}

function ReportTabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 shadow-soft premium-scrollbar">
      {tabs.map((tab) => {
        const Icon = tabIcons[tab] ?? BarChart3
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors',
              active === tab ? 'bg-primary text-primary-foreground shadow-soft' : 'text-text-muted hover:bg-background hover:text-text',
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {tab}
          </button>
        )
      })}
    </div>
  )
}

function ReportDetailDrawer({ open, title, subtitle, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-50 bg-secondary/45"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            onMouseDown={(event) => event.stopPropagation()}
            className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="text-lg font-extrabold text-text">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:bg-background hover:text-text"
                aria-label="Close details"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 premium-scrollbar">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ExportModal({ open, format, onClose }) {
  const [state, setState] = useState('preparing')

  const states = {
    preparing: { icon: Loader2, label: 'Preparing...', tone: 'text-primary' },
    generating: { icon: FileDown, label: 'Generating...', tone: 'text-warning' },
    downloaded: { icon: CheckCircle2, label: 'Downloaded', tone: 'text-success' },
  }

  const current = states[state]

  // Simulate export lifecycle: preparing → generating → downloaded
  useEffect(() => {
    if (!open) return
    setState('preparing')
    const preparingTimer = setTimeout(() => setState('generating'), 800)
    const downloadedTimer = setTimeout(() => setState('downloaded'), 1800)
    return () => {
      clearTimeout(preparingTimer)
      clearTimeout(downloadedTimer)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4"
        >
          <motion.div
            initial={{ y: 14, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 14, scale: 0.97 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <span className={cn('mx-auto flex size-14 items-center justify-center rounded-full bg-background', current.tone)}>
              <current.icon className={cn('size-6', state === 'preparing' && 'animate-spin')} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-text">Exporting {format?.toUpperCase()}</h2>
            <p className="mt-1 text-sm text-text-muted">{current.label}</p>
            <div className="mt-5 flex justify-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>Close</Button>
              {state === 'downloaded' && (
                <Button type="button" size="sm" onClick={onClose}>
                  <Download className="size-4" aria-hidden="true" />
                  Open file
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ReportEmptyState({ onViewAppointments }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="No report data yet"
      description="Once you complete your first appointments, DevSphere will start showing business insights here."
      action={
        onViewAppointments && (
          <Button type="button" variant="outline" onClick={onViewAppointments}>
            View Appointments
          </Button>
        )
      }
    />
  )
}

function ReportErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <X className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-bold text-text">Unable to load this report</h2>
      <p className="max-w-sm text-sm text-text-muted">Something went wrong while fetching your analytics data.</p>
      <Button type="button" variant="outline" onClick={onRetry}>Try Again</Button>
    </div>
  )
}

function SkeletonBlock({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-border/60', className)} />
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </div>
      <SkeletonBlock className="h-64" />
    </div>
  )
}

function ReportFilters({ filters, onChange, onReset }) {
  const [open, setOpen] = useState(false)

  const update = (key, value) => onChange({ ...filters, [key]: value })

  const filterFields = (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_180px_180px_180px_180px_auto]">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-text-muted">Salon Location</span>
        <select value={filters.location ?? ''} onChange={(event) => update('location', event.target.value)} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus:border-primary">
          <option value="">All locations</option>
          <option>Main Salon</option>
          <option>Branch 2</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-text-muted">Staff</span>
        <select value={filters.staff ?? ''} onChange={(event) => update('staff', event.target.value)} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus:border-primary">
          <option value="">All staff</option>
          <option>Ritu Menon</option>
          <option>Ananya Shah</option>
          <option>Meera Nair</option>
          <option>Arjun Rao</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-text-muted">Service Category</span>
        <select value={filters.category ?? ''} onChange={(event) => update('category', event.target.value)} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus:border-primary">
          <option value="">All categories</option>
          <option>Hair</option>
          <option>Spa</option>
          <option>Skin Care</option>
          <option>Nails</option>
          <option>Bridal</option>
          <option>Grooming</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-text-muted">Customer Type</span>
        <select value={filters.customerType ?? ''} onChange={(event) => update('customerType', event.target.value)} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus:border-primary">
          <option value="">All customers</option>
          <option>New</option>
          <option>Returning</option>
          <option>Loyal</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-text-muted">Payment Method</span>
        <select value={filters.paymentMethod ?? ''} onChange={(event) => update('paymentMethod', event.target.value)} className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus:border-primary">
          <option value="">All methods</option>
          <option>UPI</option>
          <option>Card</option>
          <option>Cash</option>
          <option>Online</option>
        </select>
      </label>

      <div className="flex items-end">
        <Button type="button" variant="outline" size="sm" className="h-10" onClick={onReset}>Reset Filters</Button>
      </div>
    </div>
  )

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 text-sm font-bold text-text"
        >
          <BarChart3 className="size-4 text-primary" aria-hidden="true" />
          Report Filters
          <span className="text-xs font-semibold text-text-muted">({Object.values(filters).filter(Boolean).length} active)</span>
        </button>
        <button type="button" onClick={() => setOpen((value) => !value)} className="text-xs font-bold text-primary">
          {open ? 'Hide' : 'Show'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-border pt-4">{filterFields}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export { ReportTabs, ReportDetailDrawer, ExportModal, ReportEmptyState, ReportErrorState, ReportSkeleton, ReportFilters }