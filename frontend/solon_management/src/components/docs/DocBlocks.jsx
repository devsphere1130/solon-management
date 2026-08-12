import { motion } from 'motion/react'
import Badge from '../common/Badge.jsx'
import { cn } from '../../lib/cn.js'

const calloutStyles = {
  tip: { badge: 'success', border: 'border-success/25', bg: 'bg-success/5' },
  best: { badge: 'accent', border: 'border-accent/35', bg: 'bg-accent/8' },
  important: { badge: 'warning', border: 'border-warning/25', bg: 'bg-warning/5' },
  example: { badge: 'default', border: 'border-primary/25', bg: 'bg-primary/5' },
  quickstart: { badge: 'outline', border: 'border-border', bg: 'bg-background' },
}

export function Callout({ variant = 'example', label, children }) {
  const style = calloutStyles[variant] ?? calloutStyles.example

  return (
    <div className={cn('rounded-2xl border p-5', style.border, style.bg)}>
      {label && (
        <Badge variant={style.badge} className="mb-2.5">
          {label}
        </Badge>
      )}
      <p className="text-sm leading-relaxed text-text">{children}</p>
    </div>
  )
}

export function RoleBadge({ children }) {
  return (
    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
      {children}
    </span>
  )
}

export function NoteStrip({ children }) {
  return <p className="rounded-xl bg-background px-4 py-3 text-sm text-text-muted">{children}</p>
}

export function Steps({ items }) {
  return (
    <ol className="space-y-0">
      {items.map((item, index) => (
        <li key={item.title} className={cn('relative border-l-2 border-border pb-6 pl-9', index === items.length - 1 && 'border-transparent pb-0')}>
          <span className="absolute top-0 -left-[15px] flex size-[30px] items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
            {index + 1}
          </span>
          <p className="font-bold text-text">{item.title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{item.text}</p>
        </li>
      ))}
    </ol>
  )
}

export function CardsGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <p className="text-sm font-extrabold text-text">{item.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{item.text}</p>
        </div>
      ))}
    </div>
  )
}

export function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="bg-background px-4 py-2.5 text-left text-xs font-bold tracking-wide text-text-muted uppercase">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-border">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={cn('px-4 py-2.5 align-top text-text', cellIndex === 0 && 'font-semibold')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Flow({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <span key={item} className="contents">
          <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-text shadow-soft">{item}</span>
          {index < items.length - 1 && <span className="text-sm font-extrabold text-accent">&rarr;</span>}
        </span>
      ))}
    </div>
  )
}

export function ClosingBanner({ big, sub, tagline }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-secondary px-8 py-14 text-center sm:px-14"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,78,227,0.35),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <p className="mx-auto max-w-lg text-xl leading-relaxed font-bold text-white">{big}</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/70">{sub}</p>
        <p className="mt-6 text-sm font-extrabold tracking-wide text-accent uppercase">{tagline}</p>
      </div>
    </motion.div>
  )
}
