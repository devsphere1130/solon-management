import { motion } from 'motion/react'
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  Search,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import Button from '../../components/common/Button.jsx'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = [
  { day: 26, muted: true }, { day: 27, muted: true }, { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true },
  { day: 1 }, { day: 2 },
  { day: 3, today: true, events: [
    { time: '09:30', client: 'Aarav Sharma', service: 'Haircut', tone: 'primary' },
    { time: '12:30', client: 'Ananya Patel', service: 'Hair Spa', tone: 'success' },
  ] },
  { day: 4, events: [
    { time: '10:00', client: 'Meera Iyer', service: 'Bridal Makeup', tone: 'info' },
    { time: '03:30', client: 'Sara Khan', service: 'Manicure', tone: 'warning' },
  ] },
  { day: 5, events: [{ time: '11:15', client: 'Kabir Singh', service: 'Beard Grooming', tone: 'primary' }] },
  { day: 6, events: [{ time: '02:00', client: 'Ishaan Verma', service: 'Premium Facial', tone: 'success' }] },
  { day: 7 }, { day: 8 }, { day: 9 },
  { day: 10, events: [{ time: '10:30', client: 'Diya Nair', service: 'Keratin Treatment', tone: 'info' }] },
  { day: 11 },
  { day: 12, events: [
    { time: '09:00', client: 'Rohan Gupta', service: 'Hair Colour', tone: 'warning' },
    { time: '04:00', client: 'Ira Malhotra', service: 'Party Makeup', tone: 'primary' },
  ] },
  { day: 13 }, { day: 14 },
  { day: 15, events: [{ time: '01:15', client: 'Nisha Reddy', service: 'Cleanup', tone: 'success' }] },
  { day: 16 }, { day: 17 }, { day: 18 },
  { day: 19, events: [{ time: '11:30', client: 'Vivaan Joshi', service: 'Classic Haircut', tone: 'primary' }] },
  { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 },
  { day: 24, events: [{ time: '05:30', client: 'Aditya Bose', service: 'Head Massage', tone: 'info' }] },
  { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 },
  { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }, { day: 5, muted: true },
]

const toneClasses = {
  primary: 'border-primary/25 bg-primary/10 text-primary',
  success: 'border-success/25 bg-success/10 text-success',
  info: 'border-info/25 bg-info/10 text-info',
  warning: 'border-warning/25 bg-warning/10 text-warning',
}

function SelectControl({ icon: Icon, label }) {
  return (
    <button type="button" className="flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-sm font-semibold text-text transition-colors hover:border-primary/40">
      <Icon className="size-4 text-text-muted" aria-hidden="true" />
      <span>{label}</span>
      <ChevronDown className="ml-auto size-4 text-text-muted" aria-hidden="true" />
    </button>
  )
}

function Calendar() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Calendar</h1>
          <p className="mt-1 text-sm text-text-muted">View salon appointments and staff schedules.</p>
        </div>
        <Button type="button">
          <CirclePlus className="size-4" aria-hidden="true" />
          New appointment
        </Button>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input type="search" placeholder="Search client or appointment" className="h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary" />
          </div>
          <SelectControl icon={UserRound} label="All workers" />
          <SelectControl icon={SlidersHorizontal} label="All statuses" />
          <Button type="button" variant="outline" className="h-11">Clear filters</Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background" aria-label="Previous month">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className="h-9 rounded-lg border border-border px-4 text-xs font-bold text-text hover:bg-background">Today</button>
            <button type="button" className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background" aria-label="Next month">
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <h2 className="ml-2 text-base font-extrabold text-text sm:text-lg">August 2026</h2>
          </div>

          <div className="flex w-fit rounded-xl bg-background p-1">
            <button type="button" className="rounded-lg bg-card px-4 py-2 text-xs font-bold text-primary shadow-sm">Month</button>
            <button type="button" className="rounded-lg px-4 py-2 text-xs font-semibold text-text-muted hover:text-text">Week</button>
            <button type="button" className="rounded-lg px-4 py-2 text-xs font-semibold text-text-muted hover:text-text">Day</button>
          </div>
        </div>

        <div className="overflow-x-auto premium-scrollbar">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-7 border-b border-border bg-background">
              {weekDays.map((day) => (
                <div key={day} className="border-r border-border px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-text-muted last:border-r-0">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => (
                <motion.div
                  key={`${date.day}-${index}`}
                  whileHover={{ backgroundColor: 'var(--color-background)' }}
                  className="min-h-32 border-r border-b border-border p-2.5 [@media(min-width:980px)]:nth-[7n]:border-r-0"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${date.today ? 'bg-primary text-primary-foreground' : date.muted ? 'text-text-muted/50' : 'text-text'}`}>
                      {date.day}
                    </span>
                    {date.events?.length > 1 && <span className="text-[10px] font-semibold text-text-muted">{date.events.length} bookings</span>}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {date.events?.map((event) => (
                      <button key={`${event.time}-${event.client}`} type="button" className={`w-full rounded-lg border p-2 text-left transition-transform hover:-translate-y-0.5 ${toneClasses[event.tone]}`}>
                        <span className="flex items-center gap-1 text-[10px] font-bold">
                          <Clock3 className="size-3" aria-hidden="true" /> {event.time}
                        </span>
                        <span className="mt-1 block truncate text-[11px] font-bold">{event.client}</span>
                        <span className="block truncate text-[10px] opacity-75">{event.service}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-4 text-xs font-semibold text-text-muted">
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-primary" />Confirmed</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-success" />Completed</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-info" />Upcoming</span>
          <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-warning" />Pending</span>
          <span className="ml-auto flex items-center gap-2"><CalendarDays className="size-4" aria-hidden="true" />12 appointments this month</span>
        </div>
      </section>
    </div>
  )
}

export default Calendar
