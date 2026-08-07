import { motion } from 'motion/react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import Container from '../common/Container.jsx'
import { kpis, analyticsSummary } from '../../data/landingContent.js'
import { ownerNotifications } from '../../data/aboutContent.js'

const badgePositions = [
  '-top-6 -left-6',
  '-top-6 -right-6 sm:-right-10',
  '-bottom-6 -left-6 sm:-left-10',
  '-bottom-6 -right-6',
]

function FloatingNote({ notification, position, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      className={`absolute z-20 hidden max-w-[12.5rem] rounded-2xl border border-border bg-card px-4 py-3 shadow-2xl sm:block ${position}`}
    >
      <p className="text-xs font-bold text-text">{notification.label}</p>
      <p className="mt-0.5 text-[11px] text-text-muted">{notification.detail}</p>
    </motion.div>
  )
}

function OwnerExperience() {
  return (
    <section className="bg-background py-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-primary uppercase">Salon Owner Experience</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-text sm:text-4xl"
            >
              Your salon. Your team. One clear view.
            </motion.h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
              Today&apos;s appointments, revenue, customers, staff availability, inventory and reports — all in one
              calm dashboard, instead of scattered across tools.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="relative rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold text-text-muted">Overview</p>
                  <p className="text-sm font-bold text-text">Today</p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TrendingUp className="size-4" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl bg-background p-3">
                    <p className="text-[11px] text-text-muted">{kpi.label}</p>
                    <p className="mt-1 text-base font-extrabold text-text">{kpi.value}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-success">{kpi.change}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-24 rounded-2xl bg-background p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsSummary.revenueSeries} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <defs>
                      <linearGradient id="owner-revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#owner-revenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {ownerNotifications.map((notification, index) => (
              <FloatingNote
                key={notification.label}
                notification={notification}
                position={badgePositions[index % badgePositions.length]}
                delay={0.5 + index * 0.2}
              />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default OwnerExperience
