import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  X,
} from 'lucide-react'
import Button from '../../components/common/Button.jsx'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const workers = ['Neha Kapoor', 'Riya Mehta', 'Arjun Rao', 'Pooja Das']
const statuses = ['Confirmed', 'Completed', 'Upcoming', 'Pending']

const appointmentTemplates = [
  { dayOffset: 0, time: '09:30 AM', client: 'Aarav Sharma', phone: '+91 98765 43210', service: 'Haircut & Styling', worker: 'Neha Kapoor', status: 'Confirmed' },
  { dayOffset: 0, time: '10:30 AM', client: 'Meera Iyer', phone: '+91 98234 56781', service: 'Bridal Makeup', worker: 'Riya Mehta', status: 'Upcoming' },
  { dayOffset: 0, time: '12:30 PM', client: 'Ananya Patel', phone: '+91 97654 32109', service: 'Hair Spa', worker: 'Neha Kapoor', status: 'Completed' },
  { dayOffset: 0, time: '03:30 PM', client: 'Sara Khan', phone: '+91 95432 10987', service: 'Manicure & Pedicure', worker: 'Pooja Das', status: 'Pending' },
  { dayOffset: 0, time: '05:00 PM', client: 'Kabir Singh', phone: '+91 99876 54321', service: 'Beard Grooming', worker: 'Arjun Rao', status: 'Confirmed' },
  { dayOffset: 1, time: '11:15 AM', client: 'Ishaan Verma', phone: '+91 96543 21098', service: 'Premium Facial', worker: 'Riya Mehta', status: 'Confirmed' },
  { dayOffset: 2, time: '02:00 PM', client: 'Rohan Gupta', phone: '+91 94321 09876', service: 'Hair Colour', worker: 'Arjun Rao', status: 'Upcoming' },
  { dayOffset: 4, time: '10:30 AM', client: 'Diya Nair', phone: '+91 93210 98765', service: 'Keratin Treatment', worker: 'Neha Kapoor', status: 'Pending' },
  { dayOffset: 7, time: '04:00 PM', client: 'Ira Malhotra', phone: '+91 91098 76543', service: 'Party Makeup', worker: 'Riya Mehta', status: 'Confirmed' },
  { dayOffset: 10, time: '01:15 PM', client: 'Nisha Reddy', phone: '+91 89876 54321', service: 'Cleanup & Threading', worker: 'Pooja Das', status: 'Completed' },
  { dayOffset: 15, time: '11:30 AM', client: 'Vivaan Joshi', phone: '+91 92109 87654', service: 'Classic Haircut', worker: 'Arjun Rao', status: 'Upcoming' },
  { dayOffset: 20, time: '05:30 PM', client: 'Aditya Bose', phone: '+91 90987 65432', service: 'Head Massage', worker: 'Pooja Das', status: 'Confirmed' },
]

const toneClasses = {
  Confirmed: 'border-primary/25 bg-primary/10 text-primary',
  Completed: 'border-success/25 bg-success/10 text-success',
  Upcoming: 'border-info/25 bg-info/10 text-info',
  Pending: 'border-warning/25 bg-warning/10 text-warning',
}

function dateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const gridStart = addDays(firstDay, -firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    return { date, key: dateKey(date), currentMonth: date.getMonth() === month }
  })
}

function FilterSelect({ icon: Icon, label, value, options, onChange }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
      <select value={value} onChange={onChange} aria-label={label} className="h-11 w-full appearance-none rounded-xl border border-border bg-surface pr-9 pl-10 text-sm font-semibold text-text outline-none transition-colors focus:border-primary">
        <option value="">{label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </div>
  )
}

function AppointmentCard({ appointment }) {
  return (
    <div className={`rounded-xl border p-3 ${toneClasses[appointment.status]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-xs font-bold"><Clock3 className="size-3.5" aria-hidden="true" />{appointment.time}</span>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-bold">{appointment.status}</span>
      </div>
      <p className="mt-2 text-sm font-bold">{appointment.client}</p>
      <p className="mt-0.5 text-xs opacity-75">{appointment.service}</p>
      <div className="mt-2 flex items-center gap-1.5 border-t border-current/10 pt-2 text-xs font-semibold opacity-80">
        <UserRound className="size-3.5" aria-hidden="true" />{appointment.worker}
      </div>
    </div>
  )
}

function DayAppointmentsModal({ date, appointments, onClose }) {
  const formattedDate = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4" onMouseDown={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="day-appointments-title" className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 id="day-appointments-title" className="text-lg font-extrabold text-text">Appointments</h2>
              <p className="mt-1 text-sm text-text-muted">{formattedDate} · {appointments.length} bookings</p>
            </div>
            <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted hover:bg-background hover:text-text" aria-label="Close appointments">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid max-h-[65vh] gap-3 overflow-y-auto p-6 premium-scrollbar sm:grid-cols-2">
            {appointments.map((appointment) => <AppointmentCard key={`${appointment.time}-${appointment.client}`} appointment={appointment} />)}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Calendar() {
  const [today] = useState(() => new Date())
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [search, setSearch] = useState('')
  const [worker, setWorker] = useState('')
  const [status, setStatus] = useState('')
  const [openDay, setOpenDay] = useState(null)

  const appointments = useMemo(() => appointmentTemplates.map((appointment, index) => ({
    ...appointment,
    id: index + 1,
    date: dateKey(addDays(today, appointment.dayOffset)),
  })), [today])

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return appointments.filter((appointment) => {
      const matchesSearch = !query || [appointment.client, appointment.phone, appointment.service, appointment.worker].some((value) => value.toLowerCase().includes(query))
      return matchesSearch && (!worker || appointment.worker === worker) && (!status || appointment.status === status)
    })
  }, [appointments, search, worker, status])

  const appointmentsByDate = useMemo(() => filteredAppointments.reduce((grouped, appointment) => {
    grouped[appointment.date] = [...(grouped[appointment.date] ?? []), appointment]
    return grouped
  }, {}), [filteredAppointments])

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth])
  const monthLabel = visibleMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const visibleMonthCount = filteredAppointments.filter((appointment) => {
    const date = new Date(`${appointment.date}T00:00:00`)
    return date.getMonth() === visibleMonth.getMonth() && date.getFullYear() === visibleMonth.getFullYear()
  }).length

  const changeMonth = (amount) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  const goToToday = () => setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  const clearFilters = () => { setSearch(''); setWorker(''); setStatus('') }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Calendar</h1>
          <p className="mt-1 text-sm text-text-muted">Live calendar for salon appointments and staff schedules.</p>
        </div>
        <Button type="button"><CirclePlus className="size-4" aria-hidden="true" />New appointment</Button>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client, phone or service" className="h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary" />
          </div>
          <FilterSelect icon={UserRound} label="All workers" value={worker} options={workers} onChange={(event) => setWorker(event.target.value)} />
          <FilterSelect icon={SlidersHorizontal} label="All statuses" value={status} options={statuses} onChange={(event) => setStatus(event.target.value)} />
          <Button type="button" variant="outline" className="h-11" onClick={clearFilters}>Clear filters</Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => changeMonth(-1)} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background" aria-label="Previous month"><ChevronLeft className="size-4" aria-hidden="true" /></button>
            <button type="button" onClick={goToToday} className="h-9 rounded-lg border border-border px-4 text-xs font-bold text-text hover:bg-background">Today</button>
            <button type="button" onClick={() => changeMonth(1)} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background" aria-label="Next month"><ChevronRight className="size-4" aria-hidden="true" /></button>
            <h2 className="ml-2 text-base font-extrabold text-text sm:text-lg">{monthLabel}</h2>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">Live · {visibleMonthCount} appointments</span>
        </div>

        <div className="overflow-x-auto premium-scrollbar">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-7 border-b border-border bg-background">
              {weekDays.map((day) => <div key={day} className="border-r border-border px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-text-muted last:border-r-0">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, key, currentMonth }, index) => {
                const dayAppointments = appointmentsByDate[key] ?? []
                const isToday = key === dateKey(today)
                return (
                  <div key={key} onClick={() => dayAppointments.length > 3 && setOpenDay({ date, appointments: dayAppointments })} className={`min-h-32 border-r border-b border-border p-2.5 transition-colors hover:bg-background ${index % 7 === 6 ? 'border-r-0' : ''} ${dayAppointments.length > 3 ? 'cursor-pointer' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-primary text-primary-foreground' : currentMonth ? 'text-text' : 'text-text-muted/45'}`}>{date.getDate()}</span>
                      {dayAppointments.length > 0 && <span className="text-[10px] font-semibold text-text-muted">{dayAppointments.length} {dayAppointments.length === 1 ? 'booking' : 'bookings'}</span>}
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {dayAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className={`w-full rounded-lg border p-2 text-left ${toneClasses[appointment.status]}`}>
                          <span className="flex items-center gap-1 text-[10px] font-bold"><Clock3 className="size-3" aria-hidden="true" />{appointment.time}</span>
                          <span className="mt-1 block truncate text-[11px] font-bold">{appointment.client}</span>
                          <span className="block truncate text-[10px] opacity-75">{appointment.service}</span>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && <button type="button" className="w-full rounded-lg bg-background px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary/10">+{dayAppointments.length - 3} more · View all</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-4 text-xs font-semibold text-text-muted">
          {statuses.map((item) => <span key={item} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${item === 'Confirmed' ? 'bg-primary' : item === 'Completed' ? 'bg-success' : item === 'Upcoming' ? 'bg-info' : 'bg-warning'}`} />{item}</span>)}
          <span className="ml-auto flex items-center gap-2"><CalendarDays className="size-4" aria-hidden="true" />{visibleMonthCount} matching appointments</span>
        </div>
      </section>

      {openDay && <DayAppointmentsModal date={openDay.date} appointments={openDay.appointments} onClose={() => setOpenDay(null)} />}
    </div>
  )
}

export default Calendar
