import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Flame } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import { cn } from '../../lib/cn.js'

function AppointmentOverview({ data }) {
  if (!data) return null
  const stats = [
    { label: 'Total', value: data.total ?? 0, tone: 'text-text' },
    { label: 'Completed', value: data.completed ?? 0, tone: 'text-success' },
    { label: 'Confirmed', value: data.confirmed ?? 0, tone: 'text-info' },
    { label: 'Pending', value: data.pending ?? 0, tone: 'text-warning' },
    { label: 'Cancelled', value: data.cancelled ?? 0, tone: 'text-danger' },
    { label: 'No-show', value: data.noShow ?? 0, tone: 'text-text-muted' },
  ]
  const statusBreakdown = Array.isArray(data.statusBreakdown) ? data.statusBreakdown : []

  return (
    <ReportCard
      title="Appointment Overview"
      subtitle="Status breakdown of all appointments"
      tooltip="No-show = customer did not arrive. Cancelled = appointment was cancelled before the scheduled time."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-3 text-center">
            <p className="text-xs font-semibold text-text-muted">{stat.label}</p>
            <p className={cn('mt-1 text-xl font-extrabold', stat.tone)}>{stat.value}</p>
          </div>
        ))}
      </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1.2fr] sm:items-center">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)' }} />
              <Pie data={statusBreakdown} dataKey="value" nameKey="label" innerRadius={40} outerRadius={62} paddingAngle={3}>
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-2.5">
          {statusBreakdown.map((entry) => (
            <li key={entry.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-text-muted">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                {entry.label}
              </span>
              <span className="font-bold text-text">{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </ReportCard>
  )
}

function getHeatColor(value, max) {
  const ratio = value / max
  if (ratio < 0.25) return 'rgba(108, 78, 227, 0.08)'
  if (ratio < 0.45) return 'rgba(108, 78, 227, 0.22)'
  if (ratio < 0.65) return 'rgba(108, 78, 227, 0.42)'
  if (ratio < 0.85) return 'rgba(108, 78, 227, 0.65)'
  return 'rgba(108, 78, 227, 0.9)'
}

function PeakHoursHeatmap({ data }) {
  if (!data) return null
  const rows = Array.isArray(data.data) ? data.data : []
  const days = Array.isArray(data.days) ? data.days : []
  const hours = Array.isArray(data.hours) ? data.hours : []
  const max = rows.length ? Math.max(...rows.flat()) : 1

  return (
    <ReportCard
      title="When is your salon busiest?"
      subtitle="Booking intensity by day and hour"
      tooltip="Darker cells indicate more appointments booked during that day and hour."
    >
      <div className="overflow-x-auto premium-scrollbar">
        <div className="min-w-[560px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: `48px repeat(${hours.length}, 1fr)` }}>
            <div />
            {hours.map((hour) => (
              <div key={hour} className="pb-1 text-center text-[10px] font-bold text-text-muted">{hour}</div>
            ))}

            {days.map((day, dayIndex) => (
              <div key={day} className="contents">
                <div className="flex items-center pr-2 text-xs font-bold text-text-muted">{day}</div>
                {rows[dayIndex]?.map((value, hourIndex) => (
                  <div
                    key={`${day}-${hourIndex}`}
                    className="flex h-8 items-center justify-center rounded-md text-[10px] font-bold text-white/80 transition-transform hover:scale-105"
                    style={{ backgroundColor: getHeatColor(value, max) }}
                    title={`${day} ${data.hours[hourIndex]} · ${value} bookings`}
                  >
                    {value >= 7 ? value : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
        <Flame className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-xs leading-5 text-text">{data.insight}</p>
      </div>
    </ReportCard>
  )
}

function AppointmentReport({ data, peakHours }) {
  return (
    <div className="space-y-4">
      <AppointmentOverview data={data} />
      <PeakHoursHeatmap data={peakHours} />
    </div>
  )
}

export default AppointmentReport