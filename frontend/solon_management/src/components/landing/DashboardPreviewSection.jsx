import { motion } from 'motion/react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { Bell, Calendar, LayoutDashboard, Receipt, Search, Users } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import Badge from '../common/Badge.jsx'
import { kpis, analyticsSummary } from '../../data/landingContent.js'

const sidebarIcons = [LayoutDashboard, Calendar, Users, Receipt]

const upcomingAppointments = [
  { customer: 'Ananya Rao', service: 'Hair Spa', staff: 'Meera', time: '10:30 AM', status: 'Confirmed' },
  { customer: 'James Carter', service: 'Haircut', staff: 'Alex', time: '11:15 AM', status: 'Pending' },
  { customer: 'Priya Menon', service: 'Facial', staff: 'Ritu', time: '12:00 PM', status: 'Confirmed' },
]

const statusVariant = {
  Confirmed: 'success',
  Pending: 'warning',
}

function DashboardPreviewSection() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Inside DevSphere"
          title="A dashboard that keeps your whole day in view"
          description="Revenue, appointments and staff activity update live so nothing falls through the cracks."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div className="flex">
            <div className="hidden w-16 flex-col items-center gap-5 border-r border-border bg-sidebar py-6 sm:flex">
              {sidebarIcons.map((Icon, index) => (
                <span
                  key={index}
                  className={`flex size-10 items-center justify-center rounded-xl ${index === 0 ? 'bg-primary text-white' : 'text-white/50'}`}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
              ))}
            </div>

            <div className="flex-1 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <p className="text-lg font-bold text-text">Dashboard</p>
                  <p className="text-sm text-text-muted">Welcome back, Ananya</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-text-muted sm:flex">
                    <Search className="size-4" aria-hidden="true" />
                    Search
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted">
                    <Bell className="size-4" aria-hidden="true" />
                  </span>
                  <span className="size-9 rounded-full bg-gradient-to-br from-primary to-accent" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-border p-4">
                    <p className="text-xs text-text-muted">{kpi.label}</p>
                    <p className="mt-1 text-xl font-extrabold text-text">{kpi.value}</p>
                    <p className="mt-1 text-xs font-semibold text-success">
                      {kpi.change} <span className="font-normal text-text-muted">{kpi.period}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-border p-5">
                  <p className="text-sm font-bold text-text">Appointments this week</p>
                  <div className="mt-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsSummary.revenueSeries}>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b6785' }} />
                        <Tooltip cursor={{ fill: 'rgba(108,78,227,0.06)' }} />
                        <Bar dataKey="appointments" fill="#6c4ee3" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-5">
                  <p className="text-sm font-bold text-text">Upcoming appointments</p>
                  <ul className="mt-4 space-y-4">
                    {upcomingAppointments.map((appt) => (
                      <li key={appt.customer} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text">{appt.customer}</p>
                          <p className="text-xs text-text-muted">
                            {appt.service} · {appt.staff}
                          </p>
                        </div>
                        <div className="text-right">
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
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default DashboardPreviewSection
