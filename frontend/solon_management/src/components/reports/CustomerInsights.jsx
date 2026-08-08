import { motion } from 'motion/react'
import { ArrowDown, Send, Users } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function CustomerRetentionFunnel({ funnel }) {
  if (!Array.isArray(funnel) || funnel.length === 0) return null
  const maxCount = Math.max(...funnel.map((stage) => stage.count), 1)

  return (
    <div className="space-y-3">
      {funnel.map((stage, index) => (
        <div key={stage.stage}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-text">{stage.stage}</span>
            <span className="font-bold text-text">{stage.count}</span>
          </div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(stage.count / maxCount) * 100}%` }}
            />
          </div>
          {index < funnel.length - 1 && (
            <div className="mt-1 flex items-center gap-1.5 pl-1 text-xs text-text-muted">
              <ArrowDown className="size-3" aria-hidden="true" />
              {stage.drop}% dropped off
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CustomerInsights({ data }) {
  if (!data) return null
  const stats = [
    { label: 'Total Customers', value: data.total ?? 0 },
    { label: 'New Customers', value: data.new ?? 0 },
    { label: 'Returning Customers', value: data.returning ?? 0 },
    { label: 'At Risk', value: data.atRisk ?? 0 },
  ]
  const funnel = Array.isArray(data.funnel) ? data.funnel : []
  const segments = Array.isArray(data.segments) ? data.segments : []
  const topCustomers = Array.isArray(data.topCustomers) ? data.topCustomers : []

  return (
    <div className="space-y-4">
      <ReportCard
        title="Customer Insights"
        subtitle="Customer base health and retention"
        tooltip="At risk = customers who have not visited in 60+ days but were previously active."
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold text-text-muted">{stat.label}</p>
              <p className="mt-1.5 text-2xl font-extrabold text-text">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold text-text">Customer Retention</h3>
            <p className="mt-1 text-xs text-text-muted">How customers move from first visit to regular</p>
            <div className="mt-4">
              <CustomerRetentionFunnel funnel={funnel} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text">Customer Segments</h3>
            <p className="mt-1 text-xs text-text-muted">Group customers by behaviour and value</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {segments.map((segment) => (
                <div key={segment.id} className="min-w-0 rounded-xl border border-border p-4">
                  <Badge variant={segment.tone === 'primary' ? 'default' : segment.tone === 'accent' ? 'accent' : segment.tone} className="mb-2">
                    {segment.label}
                  </Badge>
                  <p className="text-xl font-extrabold text-text">{segment.count}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-xs">
                      <Users className="size-3.5" aria-hidden="true" />
                      View
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-xs">
                      <Send className="size-3.5" aria-hidden="true" />
                      Campaign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReportCard>

      <ReportCard
        title="Customer Spending"
        subtitle="Average spend and top customers"
        tooltip="Average customer spend = total revenue / total customers. Top customers are ranked by total spend."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
            <p className="text-xs font-semibold text-text-muted">Average Customer Spend</p>
            <p className="mt-2 text-3xl font-extrabold text-text">{formatCurrency(data.avgSpend)}</p>
            <p className="mt-2 text-xs text-text-muted">per customer in selected period</p>
          </div>

          <div className="overflow-x-auto premium-scrollbar">
            <table className="w-full min-w-[320px] text-left">
              <thead>
                <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Visits</th>
                  <th className="px-3 py-3">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                        </span>
                        <span className="text-sm font-bold text-text">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-bold text-text">{customer.visits}</td>
                    <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(customer.spend)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ReportCard>
    </div>
  )
}

export default CustomerInsights