import { useState } from 'react'
import { motion } from 'motion/react'
import { Star } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import { cn } from '../../lib/cn.js'

const sortOptions = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'rating', label: 'Rating' },
  { id: 'utilization', label: 'Utilization' },
]

const departmentFilters = ['All', 'Hair', 'Makeup', 'Spa', 'Nails', 'Skin', 'Grooming']

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function StaffPerformance({ staff, onSelectStaff }) {
  const [sortBy, setSortBy] = useState('revenue')
  const [department, setDepartment] = useState('All')
  const items = Array.isArray(staff) ? staff : []

  const filtered = department === 'All' ? items : items.filter((s) => s.department === department)
  const sorted = [...filtered].sort((a, b) => b[sortBy] - a[sortBy])

  return (
    <div className="space-y-4">
      <ReportCard
        title="Staff Performance"
        subtitle="Appointments, revenue, rating and utilization by staff member"
        tooltip="Utilization = booked hours / available hours. Rating is the average customer rating for that staff member."
        action={
          <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-background p-1 premium-scrollbar">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={cn('whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold transition-colors', sortBy === option.id ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text')}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="mb-4 flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-background p-1 premium-scrollbar">
          {departmentFilters.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartment(dept)}
              className={cn('whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold transition-colors', department === dept ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text')}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="px-3 py-3">Staff</th>
                <th className="px-3 py-3">Appointments</th>
                <th className="px-3 py-3">Completed</th>
                <th className="px-3 py-3">Revenue</th>
                <th className="px-3 py-3">Avg. Ticket</th>
                <th className="px-3 py-3">Rating</th>
                <th className="px-3 py-3">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => onSelectStaff?.(member)}
                  className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.035]"
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-text">{member.name}</p>
                        <p className="text-xs text-text-muted">{member.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{member.appointments}</td>
                  <td className="px-3 py-4 text-sm text-text-muted">{member.completed}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(member.revenue)}</td>
                  <td className="px-3 py-4 text-sm text-text-muted">{formatCurrency(member.avgTicket)}</td>
                  <td className="px-3 py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-text">
                      <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
                      {member.rating}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-background">
                        <div
                          className={cn('h-full rounded-full', member.utilization >= 85 ? 'bg-success' : member.utilization >= 70 ? 'bg-warning' : 'bg-danger')}
                          style={{ width: `${member.utilization}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text">{member.utilization}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportCard
        title="Staff Utilization"
        subtitle="Booked hours vs available hours"
        tooltip="Utilization = booked hours / available hours. High utilization may indicate the need for additional staff."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.slice(0, 6).map((member) => (
            <div key={member.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-text">{member.name}</p>
                <span className={cn('text-sm font-extrabold', member.utilization >= 85 ? 'text-success' : member.utilization >= 70 ? 'text-warning' : 'text-danger')}>
                  {member.utilization}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className={cn('h-full rounded-full', member.utilization >= 85 ? 'bg-success' : member.utilization >= 70 ? 'bg-warning' : 'bg-danger')}
                  style={{ width: `${member.utilization}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>Booked: {member.bookedHours} hrs</span>
                <span>Available: {member.availableHours} hrs</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3">
          <span className="mt-0.5 size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
          <p className="text-xs leading-5 text-text">Saturday is approaching full staff capacity. Consider extending staff availability or adding weekend support.</p>
        </div>
      </ReportCard>
    </div>
  )
}

export default StaffPerformance