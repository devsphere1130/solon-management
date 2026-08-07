import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import Badge from '../common/Badge.jsx'
import { cn } from '../../lib/cn.js'

const categoryFilters = ['All', 'Hair', 'Spa', 'Skin Care', 'Nails', 'Bridal', 'Grooming']

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function ServicePerformance({ services, onSelectService }) {
  const [category, setCategory] = useState('All')
  const items = Array.isArray(services) ? services : []

  const filtered = category === 'All' ? items : items.filter((s) => s.category === category)

  return (
    <ReportCard
      title="Service Performance"
      subtitle="Bookings, revenue and growth by service"
      tooltip="Growth compares the current period to the previous period. Cancellation rate = cancelled / total bookings."
      action={
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-background p-1 premium-scrollbar">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn('whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold transition-colors', category === cat ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text')}
            >
              {cat}
            </button>
          ))}
        </div>
      }
    >
      <div className="overflow-x-auto premium-scrollbar">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
              <th className="px-3 py-3">Service</th>
              <th className="px-3 py-3">Bookings</th>
              <th className="px-3 py-3">Revenue</th>
              <th className="px-3 py-3">Avg. Price</th>
              <th className="px-3 py-3">Growth</th>
              <th className="px-3 py-3">Cancel Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service, index) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => onSelectService?.(service)}
                className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.035]"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text">{service.name}</span>
                    <Badge variant="outline" className="text-[10px]">{service.category}</Badge>
                  </div>
                </td>
                <td className="px-3 py-4 text-sm font-bold text-text">{service.bookings}</td>
                <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(service.revenue)}</td>
                <td className="px-3 py-4 text-sm text-text-muted">{formatCurrency(service.avgPrice)}</td>
                <td className="px-3 py-4">
                  <span className={cn('inline-flex items-center gap-1 text-xs font-bold', service.growth >= 0 ? 'text-success' : 'text-danger')}>
                    {service.growth >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
                    {Math.abs(service.growth)}%
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-text-muted">{service.cancellationRate}%</td>
              </motion.tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="6" className="px-3 py-12 text-center text-sm font-semibold text-text-muted">
                  No services found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ReportCard>
  )
}

export default ServicePerformance