import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarDays,
  Check,
  Clock,
  Image as ImageIcon,
  RotateCcw,
  Search,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import AccountShell from '../../components/account/AccountShell.jsx'
import BookingFlow from '../../components/booking/BookingFlow.jsx'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { cn } from '../../lib/cn.js'
import {
  formatAppointmentDate,
  formatAppointmentPrice,
  formatAppointmentTime,
  getAppointmentBucket,
  getAppointmentStatusLabel,
  sortAppointments,
} from '../../lib/appointmentUtils.js'
import { useAppointments } from '../../context/useAppointments.js'
import { serviceCategories } from '../../data/services.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
]

function ServiceImage({ appointment }) {
  const [hasError, setHasError] = useState(false)
  const src = appointment.service.image ?? appointment.service.images?.[0]?.src

  if (!src || hasError) {
    return (
      <div className="flex size-full items-center justify-center bg-[#f3e8df] text-[#8b756a]">
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={appointment.service.images?.[0]?.alt ?? appointment.service.name}
      className="size-full object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-[1.25rem] border border-[#eadfd6] bg-white p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8b7a72]">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-[#241915]">{value}</p>
    </article>
  )
}

function NextVisit({ appointment }) {
  if (!appointment) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-[#241915] p-6 text-white shadow-soft">
      <Badge className="border border-white/18 bg-white/12 text-white">Your Next Visit</Badge>
      <div className="mt-5 grid gap-5 md:grid-cols-[7rem_1fr_auto] md:items-center">
        <div className="aspect-square overflow-hidden rounded-2xl bg-white/10">
          <ServiceImage appointment={appointment} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">{appointment.service.name}</h2>
          <p className="mt-2 text-sm font-semibold text-white/74">
            {formatAppointmentDate(appointment.date)} at {formatAppointmentTime(appointment.time)}
          </p>
          <p className="mt-1 text-sm font-semibold text-white/74">
            {appointment.professional.name} - {appointment.professional.role}
          </p>
          <p className="mt-1 text-sm font-semibold text-white/74">{appointment.service.duration}</p>
        </div>
        <Link to={`${ROUTE_PATHS.accountAppointments}/${appointment.id}`} className={buttonClasses({ className: 'bg-white text-[#241915] hover:bg-[#f6eee7]' })}>
          View Appointment
        </Link>
      </div>
    </section>
  )
}

function Toolbar({ search, onSearch, category, onCategory, sort, onSort }) {
  const categories = ['All', ...serviceCategories.filter((item) => item !== 'All Services')]

  return (
    <section className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7a72]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search appointments..."
            className="h-12 w-full rounded-full border border-[#eadfd6] bg-[#fffaf7] pr-4 pl-11 text-sm font-semibold text-[#241915] outline-none focus:border-[#9b5639]"
          />
        </label>
        <select
          value={sort}
          onChange={(event) => onSort(event.target.value)}
          className="h-12 rounded-full border border-[#eadfd6] bg-[#fffaf7] px-4 text-sm font-bold text-[#241915] outline-none focus:border-[#9b5639]"
          aria-label="Sort appointments"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="premium-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((item) => {
          const selected = category === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => onCategory(item)}
              aria-pressed={selected}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
                selected ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] bg-white text-[#6f5f57] hover:bg-[#fffaf7]',
              )}
            >
              {item}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AppointmentTabs({ activeTab, counts, onChange }) {
  return (
    <div className="premium-scrollbar flex gap-2 overflow-x-auto rounded-[1.35rem] border border-[#eadfd6] bg-white p-2 shadow-soft">
      {tabs.map((tab) => {
        const selected = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition-colors',
              selected ? 'bg-[#241915] text-white' : 'text-[#6f5f57] hover:bg-[#fffaf7] hover:text-[#241915]',
            )}
          >
            {tab.label} ({counts[tab.id === 'past' ? 'completed' : tab.id]})
          </button>
        )
      })}
    </div>
  )
}

function StatusBadge({ status }) {
  const tone = {
    confirmed: 'bg-[#edf4ec] text-[#4f664f]',
    rescheduled: 'bg-[#fff6df] text-[#8a5b16]',
    pending: 'bg-[#fff6df] text-[#8a5b16]',
    completed: 'bg-[#edf4ec] text-[#4f664f]',
    cancelled: 'bg-[#fff1e8] text-[#9b5639]',
    no_show: 'bg-[#f7f0eb] text-[#6f5f57]',
  }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold', tone[status] ?? tone.confirmed)}>
      {status !== 'cancelled' && <Check className="size-3.5" aria-hidden="true" />}
      {getAppointmentStatusLabel(status)}
    </span>
  )
}

function AppointmentCard({ appointment, bucket, onReschedule, onCancel, onBookAgain }) {
  const manageable = bucket === 'upcoming'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="overflow-hidden rounded-[1.5rem] border border-[#eadfd6] bg-white shadow-soft"
    >
      <div className="grid gap-5 p-5 md:grid-cols-[10rem_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-[1.15rem] bg-[#f3e8df] md:aspect-square">
          <ServiceImage appointment={appointment} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">{bucket}</p>
            <StatusBadge status={appointment.status} />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-[#241915]">{appointment.service.name}</h2>
          <p className="mt-1 text-sm font-semibold text-[#6f5f57]">{appointment.service.category}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoPill icon={CalendarDays} label="Date" value={formatAppointmentDate(appointment.date)} />
            <InfoPill icon={Clock} label="Time" value={formatAppointmentTime(appointment.time)} />
            <InfoPill icon={Clock} label="Duration" value={appointment.service.duration} />
            <InfoPill icon={UserRound} label="Professional" value={appointment.professional.name} />
          </div>

          <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#eadfd6] pt-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">Booking ID</p>
              <p className="mt-1 text-sm font-extrabold text-[#241915]">#{appointment.id}</p>
              {appointment.cancelledAt && (
                <p className="mt-1 text-xs font-semibold text-[#9b5639]">
                  Cancelled on {formatAppointmentDate(appointment.cancelledAt.slice(0, 10), 'short')}
                </p>
              )}
            </div>
            <p className="text-2xl font-extrabold text-[#9b5639]">{formatAppointmentPrice(appointment.pricing.total)}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to={`${ROUTE_PATHS.accountAppointments}/${appointment.id}`} className={buttonClasses({ variant: 'outline', className: 'bg-white' })}>
              View Details
            </Link>
            {manageable ? (
              <>
                <Button type="button" variant="outline" className="bg-white" onClick={() => onReschedule(appointment)}>
                  Reschedule
                </Button>
                <Button type="button" variant="outline" className="border-[#e6b8aa] text-[#9b5639] hover:bg-[#fff5f2]" onClick={() => onCancel(appointment)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onBookAgain(appointment.service)}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Book Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#fffaf7] p-3">
      <Icon className="size-4 text-[#9b5639]" aria-hidden="true" />
      <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b7a72]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#241915]">{value}</p>
    </div>
  )
}

function EmptyState({ tab }) {
  const title = tab === 'upcoming' ? 'No upcoming appointments' : tab === 'past' ? 'No appointment history yet' : 'No cancelled appointments'
  const body = tab === 'upcoming' ? 'Ready for your next salon visit?' : 'Your completed and managed appointments will appear here.'

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
      <Sparkles className="mx-auto size-8 text-[#9b5639]" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-extrabold text-[#241915]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f5f57]">{body}</p>
      <Link to={ROUTE_PATHS.services} className={buttonClasses({ className: 'mt-6 bg-[#241915] hover:bg-[#3a2b24]' })}>
        Explore Services
      </Link>
    </section>
  )
}

function CancelAppointmentDialog({ appointment, policy, onClose, onConfirm }) {
  if (!appointment) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241915]/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-appointment-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="w-full max-w-md rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="cancel-appointment-title" className="text-xl font-extrabold text-[#241915]">Cancel appointment?</h2>
            <p className="mt-1 text-sm text-[#6f5f57]">Are you sure you want to cancel?</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-[#eadfd6]" aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">
          <p className="text-base font-extrabold text-[#241915]">{appointment.service.name}</p>
          <p className="mt-2 text-sm font-semibold text-[#6f5f57]">{formatAppointmentDate(appointment.date)}</p>
          <p className="mt-1 text-sm font-semibold text-[#6f5f57]">{formatAppointmentTime(appointment.time)}</p>
        </div>

        <div className="mt-5 rounded-2xl border border-[#eadfd6] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">Cancellation policy</p>
          <p className="mt-2 text-sm leading-6 text-[#5f4f47]">{policy}</p>
        </div>

        <div className="mt-6 grid gap-2">
          <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={onClose}>
            Keep Appointment
          </Button>
          <Button type="button" variant="outline" className="border-[#e6b8aa] text-[#9b5639] hover:bg-[#fff5f2]" onClick={() => onConfirm(appointment.id)}>
            Cancel Appointment
          </Button>
        </div>
      </motion.section>
    </motion.div>
  )
}

function MyAppointments() {
  const { appointments, upcomingAppointments, counts, businessConfig, cancelAppointment } = useAppointments()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null)
  const [bookAgainService, setBookAgainService] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  const visibleAppointments = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sortAppointments(
      appointments
        .filter((appointment) => getAppointmentBucket(appointment) === activeTab)
        .filter((appointment) => category === 'All' || appointment.service.category === category)
        .filter((appointment) => {
          if (!query) return true
          return [appointment.service.name, appointment.service.category, appointment.professional.name, appointment.id]
            .join(' ')
            .toLowerCase()
            .includes(query)
        }),
      sort,
    )
  }, [activeTab, appointments, category, search, sort])

  function handleCancel(appointmentId) {
    cancelAppointment(appointmentId)
    setCancelTarget(null)
    setActiveTab('cancelled')
  }

  return (
    <AccountShell
      title="My Appointments"
      description="Manage your upcoming visits and view your appointment history."
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Upcoming" value={counts.upcoming} />
          <SummaryCard label="Completed" value={counts.completed} />
          <SummaryCard label="Cancelled" value={counts.cancelled} />
        </div>

        <NextVisit appointment={upcomingAppointments[0]} />
        <AppointmentTabs activeTab={activeTab} counts={counts} onChange={setActiveTab} />
        <Toolbar search={search} onSearch={setSearch} category={category} onCategory={setCategory} sort={sort} onSort={setSort} />

        <AnimatePresence mode="popLayout">
          {visibleAppointments.length > 0 ? (
            <div className="space-y-4">
              {visibleAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  bucket={activeTab}
                  onReschedule={setRescheduleAppointment}
                  onCancel={setCancelTarget}
                  onBookAgain={setBookAgainService}
                />
              ))}
            </div>
          ) : (
            <EmptyState key="empty" tab={activeTab} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {rescheduleAppointment && (
          <BookingFlow
            service={rescheduleAppointment.service}
            mode="reschedule"
            appointment={rescheduleAppointment}
            onClose={() => setRescheduleAppointment(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookAgainService && <BookingFlow service={bookAgainService} onClose={() => setBookAgainService(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {cancelTarget && (
          <CancelAppointmentDialog
            appointment={cancelTarget}
            policy={businessConfig.cancellationPolicy}
            onClose={() => setCancelTarget(null)}
            onConfirm={handleCancel}
          />
        )}
      </AnimatePresence>
    </AccountShell>
  )
}

export default MyAppointments
