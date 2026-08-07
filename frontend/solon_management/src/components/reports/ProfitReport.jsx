import { motion } from 'motion/react'
import { TrendingUp } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import { cn } from '../../lib/cn.js'

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function ProfitReport({ profit, expenses }) {
  if (!profit || !expenses) return null
  const rows = [
    { label: 'Gross Revenue', value: profit.grossRevenue ?? 0, tone: 'text-text' },
    { label: '− Discounts', value: -(profit.discounts ?? 0), tone: 'text-danger' },
    { label: '− Expenses', value: -(profit.expenses ?? 0), tone: 'text-danger' },
    { label: '= Net Revenue', value: profit.netRevenue ?? 0, tone: 'text-text' },
    { label: '= Net Profit', value: profit.netProfit ?? 0, tone: 'text-success' },
  ]

  const expenseColors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-info)', 'var(--color-text-muted)']
  const categories = Array.isArray(expenses.categories) ? expenses.categories : []
  const maxExpense = Math.max(...categories.map((item) => item.value), 1)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <ReportCard
        title="Profit Report"
        subtitle="Revenue, expenses and net profit"
        tooltip="Net profit = gross revenue − discounts − expenses. Revenue and profit are clearly separated."
      >
        <div className="space-y-3">
          {rows.map((row, index) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={cn(
                'flex items-center justify-between rounded-xl border px-4 py-3',
                row.label.startsWith('=') ? 'border-primary/20 bg-primary/5' : 'border-border bg-background',
              )}
            >
              <span className="text-sm font-semibold text-text">{row.label}</span>
              <span className={cn('text-sm font-extrabold', row.tone)}>
                {row.value >= 0 ? '' : '− '}
                {formatCurrency(Math.abs(row.value))}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs text-text-muted">Profit Margin</p>
            <p className="mt-1.5 text-xl font-extrabold text-success">{profit.profitMargin}%</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs text-text-muted">Net Revenue</p>
            <p className="mt-1.5 text-xl font-extrabold text-text">{formatCurrency(profit.netRevenue)}</p>
          </div>
        </div>
      </ReportCard>

      <ReportCard
        title="Expense Report"
        subtitle="Where your money goes"
        tooltip="Expense categories include staff salaries, rent, utilities, products, marketing and maintenance."
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold text-text-muted">Total Expenses</p>
          <p className="text-xl font-extrabold text-text">{formatCurrency(expenses.total)}</p>
        </div>

        <div className="space-y-4">
          {categories.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-text">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: expenseColors[index % expenseColors.length] }} aria-hidden="true" />
                  {item.label}
                </span>
                <span className="font-bold text-text">{formatCurrency(item.value)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / maxExpense) * 100}%`, backgroundColor: expenseColors[index % expenseColors.length] }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-text-muted">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-success/20 bg-success/5 p-3">
          <TrendingUp className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          <p className="text-xs leading-5 text-text">Staff salaries account for {categories[0]?.percent ?? 0}% of total expenses. Consider reviewing staffing efficiency.</p>
        </div>
      </ReportCard>
    </div>
  )
}

export default ProfitReport