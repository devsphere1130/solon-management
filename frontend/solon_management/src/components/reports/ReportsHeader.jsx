import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarRange, ChevronDown, Download, FileSpreadsheet, FileText, MoreHorizontal, Printer } from 'lucide-react'
import Button from '../common/Button.jsx'
import { dateRangeOptions } from '../../services/reportsService.js'

function ReportsHeader({ dateRange, onDateRangeChange, onExport, onPrint }) {
  const [rangeOpen, setRangeOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const selectedLabel = dateRangeOptions.find((option) => option.id === dateRange)?.label ?? 'This Month'

  const selectRange = (id) => {
    onDateRangeChange(id)
    setRangeOpen(false)
  }

  const applyCustom = () => {
    if (customFrom && customTo) {
      onDateRangeChange('custom')
      setRangeOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Reports & Analytics</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text-muted">
          Understand your salon performance, discover trends and make smarter business decisions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => { setRangeOpen((value) => !value); setExportOpen(false); setMoreOpen(false) }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-text shadow-soft transition-colors hover:bg-surface"
          >
            <CalendarRange className="size-4 text-primary" aria-hidden="true" />
            {selectedLabel}
            <ChevronDown className="size-3.5 text-text-muted" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {rangeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 z-30 mt-2 w-64 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-card p-2 shadow-soft"
              >
                <div className="max-h-72 overflow-y-auto premium-scrollbar">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectRange(option.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${dateRange === option.id ? 'bg-primary/10 text-primary' : 'text-text hover:bg-background'}`}
                    >
                      {option.label}
                      {dateRange === option.id && <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />}
                    </button>
                  ))}
                </div>

                {dateRange === 'custom' && (
                  <div className="mt-2 space-y-2 border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-text-muted">From</span>
                        <input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} className="h-9 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text outline-none focus:border-primary" />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold text-text-muted">To</span>
                        <input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} className="h-9 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text outline-none focus:border-primary" />
                      </label>
                    </div>
                    <Button type="button" size="sm" className="w-full" onClick={applyCustom}>Apply range</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Button type="button" variant="outline" size="sm" onClick={() => { setExportOpen((value) => !value); setRangeOpen(false); setMoreOpen(false) }}>
            <Download className="size-4" aria-hidden="true" />
            Export Report
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </Button>

          <AnimatePresence>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-30 mt-2 w-52 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-card p-2 shadow-soft"
              >
                {[
                  { id: 'pdf', label: 'PDF', icon: FileText },
                  { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
                  { id: 'csv', label: 'CSV', icon: FileSpreadsheet },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { onExport(id); setExportOpen(false) }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-text transition-colors hover:bg-background"
                  >
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    {label}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => { onPrint(); setExportOpen(false) }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-text transition-colors hover:bg-background"
                >
                  <Printer className="size-4 text-primary" aria-hidden="true" />
                  Print Report
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => { setMoreOpen((value) => !value); setRangeOpen(false); setExportOpen(false) }}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-text-muted shadow-soft transition-colors hover:bg-surface hover:text-text"
            aria-label="More options"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-30 mt-2 w-56 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-card p-2 shadow-soft"
              >
                <button type="button" onClick={() => { setMoreOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-text transition-colors hover:bg-background">
                  <CalendarRange className="size-4 text-primary" aria-hidden="true" />
                  Compare with previous period
                </button>
                <button type="button" onClick={() => { setMoreOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-text transition-colors hover:bg-background">
                  <Download className="size-4 text-primary" aria-hidden="true" />
                  Schedule email report
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ReportsHeader