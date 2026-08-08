import { motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '../../lib/cn.js'

function TrendIndicator({ change }) {
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
        {change}%
      </span>
    )
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-danger">
        <ArrowDownRight className="size-3.5" aria-hidden="true" />
        {Math.abs(change)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-text-muted">
      <Minus className="size-3.5" aria-hidden="true" />
      0%
    </span>
  )
}

function KpiCard({ kpi, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-soft"
    >
      <p className="text-xs font-semibold text-text-muted">{kpi.label}</p>
      <p className="mt-2 truncate text-2xl font-extrabold tracking-tight text-text">{kpi.value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <TrendIndicator change={kpi.change} />
        <span className="text-xs text-text-muted">{kpi.period}</span>
      </div>
    </motion.article>
  )
}

function KPIOverview({ kpis, secondaryKpis }) {
  const primaryItems = Array.isArray(kpis) ? kpis : []
  const secondaryItems = Array.isArray(secondaryKpis) ? secondaryKpis : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryItems.map((kpi, index) => (
          <KpiCard key={kpi.id} kpi={kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryItems.map((kpi, index) => (
          <motion.article
            key={kpi.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 4) * 0.05 }}
            whileHover={{ y: -3 }}
            className={cn('min-w-0 rounded-2xl border p-5 shadow-soft', kpi.tone === 'positive' ? 'border-success/20 bg-success/[0.04]' : 'border-border bg-card')}
          >
            <p className="text-xs font-semibold text-text-muted">{kpi.label}</p>
            <p className="mt-2 truncate text-xl font-extrabold tracking-tight text-text">{kpi.value}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <TrendIndicator change={kpi.change} />
              <span className="text-xs text-text-muted">{kpi.period}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

export default KPIOverview