import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowUpRight } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import { cn } from '../../lib/cn.js'

const chartModes = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
]

const chartTypes = [
  { id: 'area', label: 'Area' },
  { id: 'line', label: 'Line' },
  { id: 'bar', label: 'Bar' },
]

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function RevenueChart({ data, type }) {
  const series = Array.isArray(data) ? data : []
  const commonProps = {
    data: series,
    margin: { top: 8, right: 8, bottom: 0, left: 0 },
  }

  const tooltipStyle = {
    borderRadius: 12,
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-soft)',
    fontSize: 12,
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), 'Revenue']} />
          <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} width={48} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), 'Revenue']} />
          <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-primary)' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} width={48} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(value), 'Revenue']} />
        <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revenue-area)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function RevenueBreakdown({ breakdown }) {
  const items = Array.isArray(breakdown) ? breakdown : []
  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-info)']
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id}>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-semibold text-text">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} aria-hidden="true" />
              {item.label}
            </span>
            <span className="font-bold text-text">{formatCurrency(item.value)}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: colors[index % colors.length] }}
              />
            </div>
            <span className="w-10 text-right text-xs font-bold text-text-muted">{item.percent}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RevenueReport({ data }) {
  const [mode, setMode] = useState('monthly')
  const [type, setType] = useState('area')

  if (!data) return null

  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <ReportCard
        title="Revenue Overview"
        subtitle="Revenue over time with previous period comparison"
        tooltip="Revenue excludes refunds. Net revenue = gross revenue − discounts − refunds."
        action={
          <div className="premium-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-background p-1">
            {chartModes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors', mode === item.id ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text')}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-text">{formatCurrency(data.total)}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-success">
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              +{data.growth}% compared with previous period
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
            {chartTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id)}
                className={cn('rounded-full px-3 py-1 text-xs font-bold transition-colors', type === item.id ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <RevenueChart data={data.series} type={type} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Gross Revenue', data.gross],
            ['Discounts', data.discounts],
            ['Refunds', data.refunds],
            ['Net Revenue', data.net],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs text-text-muted">{label}</p>
              <p className="mt-1 text-sm font-bold text-text">{formatCurrency(value)}</p>
            </div>
          ))}
        </div>
      </ReportCard>

      <ReportCard
        title="Revenue by Category"
        subtitle="Where your money comes from"
        tooltip="Revenue split across services, products, packages, memberships and other sources."
      >
        <RevenueBreakdown breakdown={data.breakdown} />
      </ReportCard>
    </div>
  )
}

export default RevenueReport