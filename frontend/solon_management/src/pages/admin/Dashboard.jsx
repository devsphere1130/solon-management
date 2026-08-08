import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Area, AreaChart, Cell, Pie, PieChart } from 'recharts'
import PageLoader from '../../components/common/PageLoader.jsx'
import Badge from '../../components/common/Badge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDashboardOverview } from '../../services/dashboardService.js'

const donutColors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-info)']

const statusVariant = {
  Confirmed: 'success',
  Pending: 'warning',
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

function Dashboard() {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    let isMounted = true

    getDashboardOverview().then((data) => {
      if (isMounted) setOverview(data)
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!overview) {
    return <PageLoader />
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">Welcome back, {user?.name ?? 'there'}</p>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {overview.kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <p className="text-xs text-text-muted">{kpi.label}</p>
            <p className="mt-1.5 truncate text-2xl font-extrabold text-text" title={kpi.value}>{kpi.value}</p>
            <p className="mt-1.5 text-xs font-semibold text-success">
              {kpi.change} <span className="font-normal text-text-muted">{kpi.period}</span>
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-bold text-text">Appointments this week</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.revenueSeries}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <Tooltip cursor={{ fill: 'var(--color-primary)', fillOpacity: 0.06 }} contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)' }} />
                <Bar dataKey="appointments" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-bold text-text">Revenue by service</p>
          <div className="mt-2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)' }} />
                <Pie data={overview.revenueByService} dataKey="value" nameKey="name" innerRadius={45} outerRadius={65} paddingAngle={3}>
                  {overview.revenueByService.map((entry, index) => (
                    <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {overview.revenueByService.map((entry, index) => (
              <li key={entry.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-muted">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: donutColors[index % donutColors.length] }}
                    aria-hidden="true"
                  />
                  {entry.name}
                </span>
                <span className="font-semibold text-text">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-bold text-text">Revenue growth</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.revenueSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="dashboard-revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#dashboard-revenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm font-bold text-text">Upcoming appointments</p>
          <ul className="mt-4 space-y-4">
            {overview.upcomingAppointments.map((appt) => (
              <li key={appt.customer} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">{appt.customer}</p>
                  <p className="truncate text-xs text-text-muted">
                    {appt.service} · {appt.staff}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-text">{appt.time}</p>
                  <Badge variant={statusVariant[appt.status] ?? 'default'} className="mt-1">
                    {appt.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
