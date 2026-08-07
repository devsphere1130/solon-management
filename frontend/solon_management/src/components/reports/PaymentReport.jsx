import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Percent, Receipt, XCircle } from 'lucide-react'
import ReportCard from './ReportCard.jsx'

const paymentColors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-info)']

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function PaymentReport({ payments }) {
  if (!payments) return null
  const breakdown = Array.isArray(payments.breakdown) ? payments.breakdown : []
  const trend = Array.isArray(payments.trend) ? payments.trend : []
  const maxValue = Math.max(...breakdown.map((item) => item.value), 1)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
      <ReportCard
        title="Payments"
        subtitle="Revenue by payment method"
        tooltip="Payment breakdown across cash, UPI, card, online and wallet."
      >
        <div className="space-y-4">
          {breakdown.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-text">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: paymentColors[index % paymentColors.length] }} aria-hidden="true" />
                  {item.label}
                </span>
                <span className="font-bold text-text">{formatCurrency(item.value)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: paymentColors[index % paymentColors.length] }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-bold text-text-muted">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </ReportCard>

      <ReportCard
        title="Payment Trend"
        subtitle="Payment method usage over time"
        tooltip="Shows how payment preferences have shifted across the selected period."
      >
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="payment-upi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="payment-card" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} width={48} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 12 }} formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="upi" name="UPI" stroke="var(--color-primary)" strokeWidth={2} fill="url(#payment-upi)" />
              <Area type="monotone" dataKey="card" name="Card" stroke="var(--color-accent)" strokeWidth={2} fill="url(#payment-card)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ReportCard>
    </div>
  )
}

function DiscountReport({ discounts }) {
  if (!discounts) return null
  const topServices = Array.isArray(discounts.topServices) ? discounts.topServices : []
  return (
    <ReportCard
      title="Discount Report"
      subtitle="Discount impact on revenue"
      tooltip="Discounts reduced gross revenue by the impact percentage shown below."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Percent className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{formatCurrency(discounts.total)}</p>
          <p className="mt-0.5 text-xs text-text-muted">Total Discounts</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-info/10 text-info">
            <Receipt className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{discounts.discountedAppointments}</p>
          <p className="mt-0.5 text-xs text-text-muted">Discounted Appointments</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <Percent className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{formatCurrency(discounts.averageDiscount)}</p>
          <p className="mt-0.5 text-xs text-text-muted">Average Discount</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{discounts.impactPercent}%</p>
          <p className="mt-0.5 text-xs text-text-muted">Revenue Impact</p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-text">Top Discounted Services</h3>
        <div className="mt-3 overflow-x-auto premium-scrollbar">
          <table className="w-full min-w-[400px] text-left">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="px-3 py-3">Service</th>
                <th className="px-3 py-3">Discounted Appointments</th>
                <th className="px-3 py-3">Discount Value</th>
              </tr>
            </thead>
            <tbody>
              {topServices.map((service, index) => (
                <motion.tr
                  key={service.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-bold text-text">{service.name}</td>
                  <td className="px-3 py-4 text-sm text-text-muted">{service.count}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(service.discount)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3">
        <span className="mt-0.5 size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
        <p className="text-xs leading-5 text-text">Discounts reduced gross revenue by {discounts.impactPercent}% this month.</p>
      </div>
    </ReportCard>
  )
}

function CancellationReport({ losses }) {
  if (!losses) return null
  const trend = Array.isArray(losses.trend) ? losses.trend : []
  return (
    <ReportCard
      title="Appointment Losses"
      subtitle="Cancellations, no-shows and estimated lost revenue"
      tooltip="Estimated lost revenue = cancelled + no-show appointments × average appointment value."
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <XCircle className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{losses.cancelled}</p>
          <p className="mt-0.5 text-xs text-text-muted">Cancelled</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <XCircle className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{losses.noShow}</p>
          <p className="mt-0.5 text-xs text-text-muted">No-show</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-info/10 text-info">
            <XCircle className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-text">{losses.lateCancellation}</p>
          <p className="mt-0.5 text-xs text-text-muted">Late Cancellation</p>
        </div>
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-lg font-extrabold text-danger">{formatCurrency(losses.estimatedLostRevenue)}</p>
          <p className="mt-0.5 text-xs text-text-muted">Estimated Lost Revenue</p>
        </div>
      </div>

      <div className="mt-5 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="loss-cancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-danger)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-danger)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="loss-noshow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} width={32} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 12 }} />
            <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="var(--color-danger)" strokeWidth={2} fill="url(#loss-cancelled)" />
            <Area type="monotone" dataKey="noShow" name="No-show" stroke="var(--color-warning)" strokeWidth={2} fill="url(#loss-noshow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
        <span className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        <p className="text-xs leading-5 text-text">{losses.insight}</p>
      </div>
    </ReportCard>
  )
}

export { PaymentReport, DiscountReport, CancellationReport }