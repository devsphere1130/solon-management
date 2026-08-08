import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  XCircle,
} from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'

const summaryCards = [
  { label: "Today's appointments", value: '08', icon: CalendarCheck, tone: 'bg-primary/10 text-primary' },
  { label: 'Upcoming', value: '24', icon: CalendarClock, tone: 'bg-info/10 text-info' },
  { label: 'Done', value: '156', icon: CheckCircle2, tone: 'bg-success/10 text-success' },
  { label: 'Cancelled', value: '12', icon: XCircle, tone: 'bg-danger/10 text-danger' },
]

const appointments = [
  { client: 'Aarav Sharma', phone: '+91 98765 43210', purpose: 'Haircut & Styling', price: 850, time: '09:30 AM', date: '03 Aug 2026', worker: 'Neha Kapoor' },
  { client: 'Meera Iyer', phone: '+91 98234 56781', purpose: 'Bridal Makeup', price: 4500, time: '10:00 AM', date: '03 Aug 2026', worker: 'Riya Mehta' },
  { client: 'Kabir Singh', phone: '+91 99876 54321', purpose: 'Beard Grooming', price: 500, time: '11:15 AM', date: '03 Aug 2026', worker: 'Arjun Rao' },
  { client: 'Ananya Patel', phone: '+91 97654 32109', purpose: 'Hair Spa', price: 1800, time: '12:30 PM', date: '03 Aug 2026', worker: 'Neha Kapoor' },
  { client: 'Ishaan Verma', phone: '+91 96543 21098', purpose: 'Premium Facial', price: 2200, time: '02:00 PM', date: '03 Aug 2026', worker: 'Riya Mehta' },
  { client: 'Sara Khan', phone: '+91 95432 10987', purpose: 'Manicure & Pedicure', price: 1500, time: '03:30 PM', date: '04 Aug 2026', worker: 'Pooja Das' },
  { client: 'Rohan Gupta', phone: '+91 94321 09876', purpose: 'Hair Colour', price: 2800, time: '04:45 PM', date: '04 Aug 2026', worker: 'Arjun Rao' },
  { client: 'Diya Nair', phone: '+91 93210 98765', purpose: 'Keratin Treatment', price: 5200, time: '05:30 PM', date: '05 Aug 2026', worker: 'Neha Kapoor' },
  { client: 'Vivaan Joshi', phone: '+91 92109 87654', purpose: 'Classic Haircut', price: 700, time: '06:15 PM', date: '05 Aug 2026', worker: 'Arjun Rao' },
  { client: 'Ira Malhotra', phone: '+91 91098 76543', purpose: 'Party Makeup', price: 3000, time: '07:00 PM', date: '06 Aug 2026', worker: 'Riya Mehta' },
  { client: 'Aditya Bose', phone: '+91 90987 65432', purpose: 'Head Massage', price: 900, time: '10:30 AM', date: '06 Aug 2026', worker: 'Pooja Das' },
  { client: 'Nisha Reddy', phone: '+91 89876 54321', purpose: 'Cleanup & Threading', price: 1200, time: '01:15 PM', date: '07 Aug 2026', worker: 'Pooja Das' },
]

const rowsPerPage = 8

function Appointments() {
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return appointments
    return appointments.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(query)))
  }, [search])

  const pageCount = Math.max(1, Math.ceil(filteredAppointments.length / rowsPerPage))
  const currentPage = Math.min(page, pageCount)
  const visibleAppointments = filteredAppointments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const resetFilters = () => {
    setSearch('')
    setFromDate('')
    setToDate('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Appointments</h1>
        <p className="mt-1 text-sm text-text-muted">View and manage all salon appointments in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, tone }, index) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-muted">{label}</p>
                <p className="mt-2 truncate text-2xl font-extrabold text-text">{value}</p>
              </div>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(240px,1.5fr)_1fr_1fr_auto] xl:items-end">
          <Input
            label="Search appointments"
            icon={Search}
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder="Client, phone, purpose or worker"
          />
          <Input label="From date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          <Input label="To date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          <Button type="button" variant="outline" onClick={resetFilters} className="h-11">
            Clear filters
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-text">Appointment list</h2>
            <p className="mt-0.5 text-xs text-text-muted">Showing {filteredAppointments.length} static appointments</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Clock3 className="size-3.5" aria-hidden="true" /> Updated just now
          </span>
        </div>

        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead className="bg-background">
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="px-5 py-3.5">Sr. No.</th>
                <th className="px-5 py-3.5">Client name</th>
                <th className="px-5 py-3.5">Client number</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Assigned worker</th>
              </tr>
            </thead>
            <tbody>
              {visibleAppointments.map((appointment, index) => (
                <tr key={`${appointment.client}-${appointment.time}`} className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-primary/[0.035]">
                  <td className="px-5 py-4 text-sm font-semibold text-text-muted">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="px-5 py-4 text-sm font-bold text-text">{appointment.client}</td>
                  <td className="px-5 py-4 text-sm text-text-muted">{appointment.phone}</td>
                  <td className="px-5 py-4 text-sm text-text">{appointment.purpose}</td>
                  <td className="px-5 py-4 text-sm font-bold text-text">₹{appointment.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-text">{appointment.time}</td>
                  <td className="px-5 py-4 text-sm text-text-muted">{appointment.date}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{appointment.worker}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            Showing <span className="font-bold text-text">{filteredAppointments.length ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to{' '}
            <span className="font-bold text-text">{Math.min(currentPage * rowsPerPage, filteredAppointments.length)}</span> of{' '}
            <span className="font-bold text-text">{filteredAppointments.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40" aria-label="Previous page">
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={`size-9 rounded-lg text-xs font-bold transition-colors ${currentPage === pageNumber ? 'bg-primary text-primary-foreground' : 'border border-border text-text-muted hover:bg-background'}`}>
                {pageNumber}
              </button>
            ))}
            <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40" aria-label="Next page">
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Appointments
