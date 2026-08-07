import { motion } from 'motion/react'
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import { analyticsSummary } from '../../data/landingContent.js'

const donutColors = ['#6c4ee3', '#f0b84b', '#10b981', '#3b82f6']

const stats = [
  { label: 'Average ticket size', value: '₹1,180' },
  { label: 'Client retention rate', value: '78%' },
  { label: 'Rebooking rate', value: '64%' },
]

function AnalyticsSection() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeading
          eyebrow="Analytics"
          title="Know exactly what's driving growth"
          description="Every appointment, service and payment feeds real-time reporting — no spreadsheets required."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]"
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text">Revenue growth</p>
                <p className="text-xs text-text-muted">Last 6 months</p>
              </div>
              <p className="text-2xl font-extrabold text-text">₹2,45,800</p>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsSummary.revenueSeries} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="analytics-revenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6c4ee3" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6c4ee3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e7e4f2' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6c4ee3" strokeWidth={2.5} fill="url(#analytics-revenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-extrabold text-text">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm font-bold text-text">Revenue by service</p>
            <div className="mt-2 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e7e4f2' }} />
                  <Pie
                    data={analyticsSummary.revenueByService}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {analyticsSummary.revenueByService.map((entry, index) => (
                      <Cell key={entry.name} fill={donutColors[index % donutColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2">
              {analyticsSummary.revenueByService.map((entry, index) => (
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
        </motion.div>
      </Container>
    </section>
  )
}

export default AnalyticsSection
