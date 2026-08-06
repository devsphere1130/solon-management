import { motion } from 'motion/react'
import { AlertTriangle, Sparkles, Star, TrendingDown, TrendingUp } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import { cn } from '../../lib/cn.js'

const iconMap = {
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  alert: AlertTriangle,
  star: Star,
}

const toneClasses = {
  positive: 'border-success/20 bg-success/5',
  warning: 'border-warning/20 bg-warning/5',
  star: 'border-accent/20 bg-accent/5',
}

const iconToneClasses = {
  positive: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  star: 'bg-accent/15 text-accent-foreground',
}

function BusinessInsights({ insights }) {
  const items = Array.isArray(insights) ? insights : []
  if (items.length === 0) return null

  return (
    <ReportCard
      title="Business Insights"
      subtitle="What the data means and what you should do next"
      tooltip="Insights are generated from your salon's actual data. They highlight trends, risks and opportunities."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((insight, index) => {
          const Icon = iconMap[insight.icon] ?? Sparkles
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn('flex items-start gap-3 rounded-xl border p-4', toneClasses[insight.type] ?? 'border-border bg-background')}
            >
              <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', iconToneClasses[insight.type] ?? 'bg-primary/10 text-primary')}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-text">{insight.title}</p>
                <p className="mt-1 text-xs leading-5 text-text-muted">{insight.detail}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </ReportCard>
  )
}

export default BusinessInsights