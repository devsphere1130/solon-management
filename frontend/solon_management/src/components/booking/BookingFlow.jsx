import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Mail,
  Phone,
  Scissors,
  Sparkles,
  Star,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { cn } from '../../lib/cn.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAppointments } from '../../context/useAppointments.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import {
  BOOKING_CONFIG,
  createAppointment,
  getAvailability,
  getProfessionalsForService,
  getServiceAddOns,
  occasionOptions,
  shouldAskOccasion,
} from '../../services/bookingService.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  year: 'numeric',
})

const steps = [
  { id: 'service', label: 'Service' },
  { id: 'schedule', label: 'Date & Time' },
  { id: 'professional', label: 'Professional' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
]

const stepOrder = ['schedule', 'professional', 'details', 'review']

function formatPrice(price) {
  return INR_FORMATTER.format(Math.max(0, Math.round(Number(price) || 0)))
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(key) {
  if (!key) return null
  return new Date(`${key}T00:00:00`)
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function minutesFromDuration(duration) {
  const value = String(duration ?? '')
  const hours = Number(value.match(/(\d+)\s*hr/i)?.[1] ?? 0)
  const minutes = Number(value.match(/(\d+)\s*min/i)?.[1] ?? 0)
  return hours * 60 + minutes || 60
}

function formatTime(time) {
  if (!time) return ''
  const [hourValue, minute] = time.split(':').map(Number)
  const suffix = hourValue >= 12 ? 'PM' : 'AM'
  const hour = hourValue % 12 || 12
  return `${hour}:${String(minute).padStart(2, '0')} ${suffix}`
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function groupSlots(slots = [], groups = []) {
  return groups
    .map((group) => ({
      label: group,
      slots: slots.filter((slot) => slot.group === group),
    }))
    .filter((group) => group.slots.length > 0)
}

function imageSrc(service) {
  return service?.images?.[0]?.src
}

function buildInitialCustomer(user) {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    note: '',
  }
}

function buildInitialBooking({ service, user, appointment }) {
  return {
    serviceId: service?.id,
    service,
    date: appointment?.date ?? '',
    time: appointment?.time ?? '',
    professionalId: appointment?.professional?.id ?? 'any',
    addOns: appointment?.addOns?.map((addOn) => addOn.id) ?? [],
    occasion: appointment?.occasion ?? '',
    customer: appointment?.customer ?? buildInitialCustomer(user),
    paymentMethod: appointment?.paymentMethod ?? BOOKING_CONFIG.supportedPaymentMethods[0]?.id ?? 'pay_at_salon',
  }
}

function buildAppointmentRecord({ id, service, booking, selectedProfessional, selectedAddOns, totals, status = 'confirmed', existingAppointment }) {
  const professional = selectedProfessional
    ? {
        id: selectedProfessional.id,
        name: selectedProfessional.name,
        role: selectedProfessional.role,
        image: selectedProfessional.avatar,
      }
    : {
        id: 'any',
        name: 'Any Professional',
        role: 'Best available',
        image: '',
      }

  return {
    ...existingAppointment,
    id,
    service: {
      ...service,
      image: service.images?.[0]?.src ?? '',
    },
    professional,
    date: booking.date,
    time: booking.time,
    status,
    addOns: selectedAddOns,
    occasion: booking.occasion,
    customer: booking.customer,
    paymentMethod: booking.paymentMethod,
    pricing: {
      service: totals.servicePrice,
      addOns: totals.addOnsTotal,
      tax: totals.tax,
      discount: 0,
      total: totals.total,
    },
  }
}

function ServiceImage({ service, className }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [service?.id])

  if (!imageSrc(service) || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#f3e8df] text-[#8b756a]', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={imageSrc(service)}
      alt={service.images[0]?.alt ?? service.name}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

function BookingProgress({ currentStep }) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-2" aria-label="Booking progress">
        {steps.map((step, index) => {
          const completed = step.id === 'service' || index < currentIndex
          const active = step.id === currentStep

          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-extrabold transition-colors',
                  completed && 'border-[#4f664f] bg-[#edf4ec] text-[#4f664f]',
                  active && 'border-[#9b5639] bg-[#fff1e8] text-[#9b5639]',
                  !completed && !active && 'border-[#eadfd6] bg-white text-[#8b7a72]',
                )}
              >
                {completed ? <Check className="size-3.5" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}
                {step.label}
              </span>
              {index < steps.length - 1 && <span className={cn('h-px w-7 bg-[#eadfd6]', completed && 'bg-[#8aa083]')} aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function BookingHeader({ service, currentStep, mode, onClose }) {
  const isReschedule = mode === 'reschedule'

  return (
    <header className="sticky top-0 z-20 border-b border-[#eadfd6] bg-[#fffaf7]/96 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">
            {isReschedule ? 'Reschedule Appointment' : 'Book Your Appointment'}
          </p>
          <h2 id="booking-flow-title" className="mt-1 truncate text-xl font-extrabold text-[#241915]">
            {isReschedule ? 'Update' : 'Book'} {service.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking flow"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#eadfd6] bg-white text-[#5c453c] transition-colors hover:bg-[#fff1e8] focus-visible:outline-primary"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4">
        <BookingProgress currentStep={currentStep} />
      </div>
    </header>
  )
}

function ServiceSummary({ service, booking, selectedProfessional, selectedAddOns, totals }) {
  const selectedDate = parseDateKey(booking.date)

  return (
    <aside className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-4 shadow-soft lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[1.2rem] bg-[#f3e8df]">
        <ServiceImage service={service} className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="mt-4">
        <Badge className="bg-[#edf4ec] text-[#536d57]">{service.category}</Badge>
        <h3 className="mt-3 text-xl font-extrabold leading-tight text-[#241915]">{service.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#6f5f57]">
          <Clock className="size-4 text-[#9b5639]" aria-hidden="true" />
          {service.duration}
        </p>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#8b7a72]">Starting at</p>
        <p className="mt-1 text-3xl font-extrabold text-[#9b5639]">{formatPrice(service.price)}</p>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl bg-[#fffaf7] p-4">
        <SummaryLine label="Date" value={selectedDate ? shortDateFormatter.format(selectedDate) : 'Choose a date'} />
        <SummaryLine label="Time" value={booking.time ? formatTime(booking.time) : 'Choose a time'} />
        <SummaryLine label="Professional" value={selectedProfessional?.name ?? 'Any Professional'} />
        {selectedAddOns.length > 0 && <SummaryLine label="Add-ons" value={`${selectedAddOns.length} selected`} />}
        <div className="border-t border-[#eadfd6] pt-3">
          <SummaryLine label="Estimated total" value={formatPrice(totals.total)} strong />
        </div>
      </div>
    </aside>
  )
}

function SummaryLine({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8b7a72]">{label}</span>
      <span className={cn('text-right text-sm font-extrabold text-[#241915]', strong && 'text-base text-[#9b5639]')}>{value}</span>
    </div>
  )
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2" aria-label="Loading calendar">
      {Array.from({ length: 42 }).map((_, index) => (
        <span key={index} className="h-11 animate-pulse rounded-2xl bg-[#f2e6dd]" />
      ))}
    </div>
  )
}

function DateSelector({ monthDate, onMonthChange, selectedDate, onSelectDate, availability, status, onRetry, errors }) {
  const today = useMemo(() => stripTime(new Date()), [])
  const calendarDays = useMemo(() => getCalendarDays(monthDate), [monthDate])
  const availabilityMap = useMemo(() => new Map((availability?.days ?? []).map((day) => [day.date, day])), [availability])
  const canGoPrevious = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1) > new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <section>
      <div>
        <h3 className="text-2xl font-extrabold text-[#241915]">Choose your date</h3>
        <p className="mt-2 text-sm leading-6 text-[#6f5f57]">Select a day that works best for you.</p>
      </div>

      <div className="mt-5 rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => onMonthChange(-1)}
            className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] text-[#6f5f57] hover:bg-[#fffaf7] disabled:opacity-40"
            aria-label="Show previous month"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <h4 className="text-base font-extrabold text-[#241915]">{monthFormatter.format(monthDate)}</h4>
          <button
            type="button"
            onClick={() => onMonthChange(1)}
            className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] text-[#6f5f57] hover:bg-[#fffaf7]"
            aria-label="Show next month"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b7a72]">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>

        <div className="mt-3">
          {status === 'loading' && <CalendarSkeleton />}
          {status === 'error' && (
            <div className="rounded-2xl border border-[#e6b8aa] bg-[#fff5f2] p-5 text-center">
              <AlertCircle className="mx-auto size-6 text-[#9b5639]" aria-hidden="true" />
              <p className="mt-2 text-sm font-extrabold text-[#241915]">We could not load available days.</p>
              <Button type="button" size="sm" className="mt-4 bg-[#241915] hover:bg-[#3a2b24]" onClick={onRetry}>
                Try Again
              </Button>
            </div>
          )}
          {status === 'ready' && (
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date) => {
                const key = formatDateKey(date)
                const day = availabilityMap.get(key)
                const inMonth = date.getMonth() === monthDate.getMonth()
                const isToday = stripTime(date).getTime() === today.getTime()
                const isSelected = selectedDate === key
                const disabled = !inMonth || !day?.available

                return (
                  <motion.button
                    key={key}
                    type="button"
                    whileTap={!disabled ? { scale: 0.95 } : undefined}
                    disabled={disabled}
                    onClick={() => onSelectDate(key)}
                    aria-label={`${dateFormatter.format(date)}${day?.available ? ', available' : ', unavailable'}`}
                    aria-pressed={isSelected}
                    className={cn(
                      'relative flex h-11 items-center justify-center rounded-2xl border text-sm font-extrabold transition-colors focus-visible:outline-primary',
                      !inMonth && 'border-transparent text-transparent',
                      inMonth && !day?.available && 'border-[#eee4dc] bg-[#f7f0eb] text-[#b3a39a]',
                      inMonth && day?.available && 'border-[#eadfd6] bg-white text-[#241915] hover:border-[#9b5639] hover:bg-[#fff1e8]',
                      isSelected && 'border-[#9b5639] bg-[#9b5639] text-white shadow-soft',
                    )}
                  >
                    {date.getDate()}
                    {isToday && inMonth && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current" aria-hidden="true" />}
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {errors.date && <p className="mt-2 text-xs font-bold text-danger">{errors.date}</p>}
    </section>
  )
}

function TimeSlotSelector({ selectedDate, selectedTime, onSelectTime, availability, status, errors }) {
  const selectedDay = availability?.days?.find((day) => day.date === selectedDate)
  const groups = groupSlots(selectedDay?.slots, availability?.timeGroups)
  const formattedDate = selectedDate ? dateFormatter.format(parseDateKey(selectedDate)) : ''

  if (!selectedDate) {
    return null
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8"
    >
      <div>
        <h3 className="text-xl font-extrabold text-[#241915]">Available times</h3>
        <p className="mt-1 text-sm text-[#6f5f57]">Available times for {formattedDate}</p>
      </div>

      {status === 'loading' ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="h-12 animate-pulse rounded-2xl bg-[#f2e6dd]" />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">{group.label}</p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {group.slots.map((slot) => {
                  const selected = selectedTime === slot.time
                  return (
                    <motion.button
                      key={`${group.label}-${slot.time}`}
                      type="button"
                      whileHover={slot.available ? { y: -2 } : undefined}
                      whileTap={slot.available ? { scale: 0.98 } : undefined}
                      disabled={!slot.available}
                      onClick={() => onSelectTime(slot.time)}
                      aria-pressed={selected}
                      className={cn(
                        'min-h-12 rounded-2xl border px-3 py-2 text-left text-sm font-extrabold transition-colors focus-visible:outline-primary',
                        slot.available && 'border-[#eadfd6] bg-white text-[#241915] hover:border-[#9b5639] hover:bg-[#fffaf7]',
                        selected && 'border-[#241915] bg-[#241915] text-white',
                        !slot.available && 'cursor-not-allowed border-[#eee4dc] bg-[#f7f0eb] text-[#b3a39a]',
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        {formatTime(slot.time)}
                        {selected && <Check className="size-4" aria-hidden="true" />}
                      </span>
                      {slot.status === 'limited' && <span className={cn('mt-1 block text-[11px]', selected ? 'text-white/74' : 'text-[#9b5639]')}>1 slot left</span>}
                      {slot.status === 'booked' && <span className="mt-1 block text-[11px]">Booked</span>}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {errors.time && <p className="mt-2 text-xs font-bold text-danger">{errors.time}</p>}
    </motion.section>
  )
}

function ScheduleStep(props) {
  return (
    <div>
      <DateSelector {...props} />
      <TimeSlotSelector {...props} />
    </div>
  )
}

function ProfessionalSelector({ professionals, selectedProfessionalId, onSelect }) {
  const cards = [
    {
      id: 'any',
      name: 'Any Professional',
      role: 'Best available',
      rating: null,
      reviews: null,
      experience: 'Fastest confirmation',
      specialty: 'We will assign the best available expert for this service.',
      avatar: '',
    },
    ...professionals,
  ]

  return (
    <section>
      <div>
        <h3 className="text-2xl font-extrabold text-[#241915]">Choose your professional</h3>
        <p className="mt-2 text-sm leading-6 text-[#6f5f57]">Pick a preferred expert or keep Any Professional for the fastest booking.</p>
      </div>

      <div className="mt-5 grid gap-3">
        {cards.map((professional) => {
          const selected = selectedProfessionalId === professional.id

          return (
            <button
              key={professional.id}
              type="button"
              onClick={() => onSelect(professional.id)}
              aria-pressed={selected}
              className={cn(
                'flex gap-4 rounded-[1.25rem] border bg-white p-4 text-left transition-colors focus-visible:outline-primary',
                selected ? 'border-[#9b5639] bg-[#fff7f1] shadow-soft' : 'border-[#eadfd6] hover:border-[#cfa98d] hover:bg-[#fffaf7]',
              )}
            >
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f3e8df] text-[#9b5639]">
                {professional.avatar ? (
                  <img src={professional.avatar} alt="" className="size-full object-cover" />
                ) : (
                  <UserRound className="size-7" aria-hidden="true" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-base font-extrabold text-[#241915]">{professional.name}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-[#6f5f57]">{professional.role}</span>
                  </span>
                  {selected && <Check className="size-5 shrink-0 text-[#9b5639]" aria-hidden="true" />}
                </span>
                {professional.rating && (
                  <span className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#6f5f57]">
                    <Star className="size-3.5 fill-[#b98238] text-[#b98238]" aria-hidden="true" />
                    {professional.rating.toFixed(1)}
                    <span className="text-[#9a8b82]">({professional.reviews})</span>
                  </span>
                )}
                <span className="mt-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#9b5639]">{professional.experience}</span>
                <span className="mt-1 block text-sm leading-6 text-[#6f5f57]">{professional.specialty}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AddOns({ addOns, selectedAddOnIds, onToggle }) {
  if (!addOns.length) return null

  return (
    <section className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
      <div>
        <h4 className="text-lg font-extrabold text-[#241915]">Enhance your experience</h4>
        <p className="mt-1 text-sm text-[#6f5f57]">Optional add-ons update your total instantly.</p>
      </div>
      <div className="mt-4 grid gap-3">
        {addOns.map((addOn) => {
          const selected = selectedAddOnIds.includes(addOn.id)

          return (
            <label
              key={addOn.id}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors',
                selected ? 'border-[#9b5639] bg-[#fff7f1]' : 'border-[#eadfd6] hover:bg-[#fffaf7]',
              )}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggle(addOn.id)}
                className="mt-1 size-4 accent-[#9b5639]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-[#241915]">{addOn.name}</span>
                <span className="mt-1 block text-xs leading-5 text-[#6f5f57]">{addOn.description}</span>
              </span>
              <span className="shrink-0 text-sm font-extrabold text-[#9b5639]">+ {formatPrice(addOn.price)}</span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

function CustomerDetails({ customer, onCustomerChange, errors, addOns, selectedAddOnIds, onToggleAddOn, occasion, onOccasionChange, showOccasion }) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-2xl font-extrabold text-[#241915]">Almost there</h3>
        <p className="mt-2 text-sm leading-6 text-[#6f5f57]">Tell us where we can send your appointment confirmation.</p>
      </div>

      <AddOns addOns={addOns} selectedAddOnIds={selectedAddOnIds} onToggle={onToggleAddOn} />

      {showOccasion && (
        <section className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
          <h4 className="text-lg font-extrabold text-[#241915]">What is the occasion?</h4>
          <p className="mt-1 text-sm text-[#6f5f57]">Optional, but it helps your stylist prepare.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {occasionOptions.map((option) => {
              const selected = occasion === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onOccasionChange(selected ? '' : option)}
                  aria-pressed={selected}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
                    selected ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] bg-white text-[#6f5f57] hover:bg-[#fffaf7]',
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <BookingField label="Full Name" error={errors.name}>
          <input
            type="text"
            value={customer.name}
            onChange={(event) => onCustomerChange('name', event.target.value)}
            placeholder="Enter your full name"
            className={inputClasses(errors.name)}
          />
        </BookingField>
        <BookingField label="Email" error={errors.email}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b7a72]" aria-hidden="true" />
            <input
              type="email"
              value={customer.email}
              onChange={(event) => onCustomerChange('email', event.target.value)}
              placeholder="you@example.com"
              className={inputClasses(errors.email, 'pl-10')}
            />
          </div>
        </BookingField>
        <BookingField label="Phone Number" error={errors.phone}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b7a72]" aria-hidden="true" />
            <input
              type="tel"
              value={customer.phone}
              onChange={(event) => onCustomerChange('phone', event.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className={inputClasses(errors.phone, 'pl-10')}
            />
          </div>
        </BookingField>
        <BookingField label="Optional Note">
          <textarea
            value={customer.note}
            onChange={(event) => onCustomerChange('note', event.target.value)}
            placeholder="Anything you would like us to know?"
            className={cn(inputClasses('', 'min-h-24 py-3'), 'resize-y')}
          />
        </BookingField>
      </div>
    </section>
  )
}

function inputClasses(error, extra = '') {
  return cn(
    'min-h-12 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-[#241915] outline-none transition-colors placeholder:text-[#9a8b82] focus:border-[#9b5639]',
    error ? 'border-danger' : 'border-[#eadfd6]',
    extra,
  )
}

function BookingField({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b7a72]">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1.5 block text-xs font-bold text-danger">{error}</span>}
    </label>
  )
}

function PaymentMethod({ paymentMethod, onChange }) {
  return (
    <section className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
      <h4 className="text-lg font-extrabold text-[#241915]">Payment</h4>
      <div className="mt-3 grid gap-3">
        {BOOKING_CONFIG.supportedPaymentMethods.map((method) => {
          const selected = paymentMethod === method.id

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              aria-pressed={selected}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                selected ? 'border-[#9b5639] bg-[#fff7f1]' : 'border-[#eadfd6] hover:bg-[#fffaf7]',
              )}
            >
              <WalletCards className="size-5 text-[#9b5639]" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-[#241915]">{method.label}</span>
                <span className="mt-0.5 block text-xs text-[#6f5f57]">{method.description}</span>
              </span>
              {selected && <Check className="ml-auto size-5 text-[#9b5639]" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ReviewStep({ service, booking, selectedProfessional, selectedAddOns, totals, onEdit, paymentMethod, onPaymentMethod }) {
  const selectedDate = parseDateKey(booking.date)

  return (
    <section>
      <div>
        <h3 className="text-2xl font-extrabold text-[#241915]">Review your appointment</h3>
        <p className="mt-2 text-sm leading-6 text-[#6f5f57]">Make sure every detail is right before we confirm your booking.</p>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">{service.category}</p>
            <h4 className="mt-1 text-2xl font-extrabold text-[#241915]">{service.name}</h4>
          </div>
          <p className="text-right text-sm font-extrabold text-[#9b5639]">Starting at {formatPrice(service.price)}</p>
        </div>

        <div className="mt-5 grid gap-3">
          <ReviewRow icon={CalendarDays} label="Date" value={selectedDate ? dateFormatter.format(selectedDate) : 'Not selected'} onEdit={() => onEdit('schedule')} />
          <ReviewRow icon={Clock} label="Time" value={booking.time ? formatTime(booking.time) : 'Not selected'} onEdit={() => onEdit('schedule')} />
          <ReviewRow icon={UserRound} label="Professional" value={selectedProfessional?.name ?? 'Any Professional'} onEdit={() => onEdit('professional')} />
          <ReviewRow icon={Scissors} label="Duration" value={service.duration} />
          <ReviewRow icon={Mail} label="Customer" value={`${booking.customer.name} - ${booking.customer.email}`} onEdit={() => onEdit('details')} />
          {booking.occasion && <ReviewRow icon={Sparkles} label="Occasion" value={booking.occasion} onEdit={() => onEdit('details')} />}
        </div>

        {selectedAddOns.length > 0 && (
          <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">
            <p className="text-sm font-extrabold text-[#241915]">Selected add-ons</p>
            <div className="mt-3 space-y-2">
              {selectedAddOns.map((addOn) => (
                <SummaryLine key={addOn.id} label={addOn.name} value={formatPrice(addOn.price)} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-[#eadfd6] pt-5">
          <SummaryLine label="Service" value={formatPrice(totals.servicePrice)} />
          {totals.addOnsTotal > 0 && <SummaryLine label="Add-ons" value={formatPrice(totals.addOnsTotal)} />}
          <SummaryLine label="Taxes" value={formatPrice(totals.tax)} />
          <div className="mt-3 border-t border-[#eadfd6] pt-3">
            <SummaryLine label="Total" value={formatPrice(totals.total)} strong />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <PaymentMethod paymentMethod={paymentMethod} onChange={onPaymentMethod} />
        <section className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
          <h4 className="text-lg font-extrabold text-[#241915]">Booking policies</h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#5f4f47]">
            <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#4f664f]" aria-hidden="true" />Appointment duration: {service.duration}</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#4f664f]" aria-hidden="true" />Please arrive 5-10 minutes early.</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#4f664f]" aria-hidden="true" />Cancellation policy applies.</li>
          </ul>
          <button type="button" className="mt-4 text-sm font-extrabold text-[#9b5639]">
            View cancellation policy
          </button>
        </section>
      </div>
    </section>
  )
}

function ReviewRow({ icon: Icon, label, value, onEdit }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#fffaf7] px-4 py-3">
      <Icon className="size-4 shrink-0 text-[#9b5639]" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b7a72]">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-[#241915]">{value}</p>
      </div>
      {onEdit && (
        <button type="button" onClick={onEdit} className="shrink-0 text-xs font-extrabold text-[#9b5639]">
          Edit
        </button>
      )}
    </div>
  )
}

function ConfirmationStep({ service, booking, selectedProfessional, bookingId, mode, onClose, onViewAppointment, onAddToCalendar }) {
  const selectedDate = parseDateKey(booking.date)
  const isReschedule = mode === 'reschedule'

  return (
    <section className="flex min-h-[34rem] flex-col items-center justify-center px-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex size-20 items-center justify-center rounded-full bg-[#edf4ec] text-[#4f664f]"
      >
        <Check className="size-10" aria-hidden="true" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.28 }}>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">
          {isReschedule ? 'Appointment Updated' : 'Appointment Confirmed'}
        </p>
        <h3 className="mt-2 text-3xl font-extrabold text-[#241915]">
          {isReschedule ? 'Your appointment has been rescheduled.' : 'Your appointment is booked.'}
        </h3>
        <div className="mx-auto mt-6 max-w-md rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
          <p className="text-xl font-extrabold text-[#241915]">{service.name}</p>
          <p className="mt-3 text-sm font-bold text-[#6f5f57]">{selectedDate ? dateFormatter.format(selectedDate) : ''}</p>
          <p className="mt-1 text-sm font-bold text-[#6f5f57]">{formatTime(booking.time)}</p>
          <p className="mt-1 text-sm font-bold text-[#6f5f57]">{selectedProfessional?.name ?? 'Any Professional'} - {selectedProfessional?.role ?? 'Best available'}</p>
          <p className="mt-1 text-sm font-bold text-[#6f5f57]">{service.duration}</p>
          <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">Booking ID</p>
            <p className="mt-1 text-xl font-extrabold text-[#9b5639]">#{bookingId}</p>
          </div>
        </div>
        <p className="mt-5 text-sm font-semibold text-[#6f5f57]">We will remind you by email before your appointment.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" size="lg" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={onViewAppointment}>
            View My Appointment
          </Button>
          <button type="button" onClick={onAddToCalendar} className={buttonClasses({ variant: 'outline', size: 'lg', className: 'bg-white' })}>
            Add to Calendar
          </button>
        </div>
        <button type="button" className="mt-4 text-sm font-extrabold text-[#6f5f57] hover:text-[#241915]" onClick={onClose}>
          {isReschedule ? 'Back to Appointment' : 'Back to Services'}
        </button>
      </motion.div>
    </section>
  )
}

function StepContent(props) {
  if (props.currentStep === 'schedule') {
    return <ScheduleStep {...props} />
  }

  if (props.currentStep === 'professional') {
    return <ProfessionalSelector professionals={props.professionals} selectedProfessionalId={props.booking.professionalId} onSelect={props.onProfessionalChange} />
  }

  if (props.currentStep === 'details') {
    return (
      <CustomerDetails
        customer={props.booking.customer}
        onCustomerChange={props.onCustomerChange}
        errors={props.errors}
        addOns={props.addOns}
        selectedAddOnIds={props.booking.addOns}
        onToggleAddOn={props.onToggleAddOn}
        occasion={props.booking.occasion}
        onOccasionChange={props.onOccasionChange}
        showOccasion={props.showOccasion}
      />
    )
  }

  return (
    <ReviewStep
      service={props.service}
      booking={props.booking}
      selectedProfessional={props.selectedProfessional}
      selectedAddOns={props.selectedAddOns}
      totals={props.totals}
      onEdit={props.onStepChange}
      paymentMethod={props.booking.paymentMethod}
      onPaymentMethod={props.onPaymentMethod}
    />
  )
}

function StickyAction({ currentStep, booking, totals, disabled, submitting, mode, onBack, onContinue }) {
  const selectedDate = parseDateKey(booking.date)
  const label = currentStep === 'review' ? (mode === 'reschedule' ? 'Confirm Reschedule' : 'Confirm Appointment') : 'Continue'
  const summary = [selectedDate ? shortDateFormatter.format(selectedDate) : null, booking.time ? formatTime(booking.time) : null].filter(Boolean).join(' - ')

  return (
    <footer className="sticky bottom-0 z-20 border-t border-[#eadfd6] bg-[#fffaf7]/96 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[#241915]">{summary || 'Choose your appointment details'}</p>
          <p className="mt-0.5 text-xs font-bold text-[#9b5639]">{formatPrice(totals.total)} estimated total</p>
        </div>
        <div className="flex gap-2">
          {currentStep !== 'schedule' && (
            <Button type="button" variant="outline" className="bg-white" onClick={onBack}>
              Back
            </Button>
          )}
          <Button type="button" loading={submitting} disabled={disabled} className="bg-[#241915] hover:bg-[#3a2b24]" onClick={onContinue}>
            {submitting ? 'Confirming...' : label}
            {!submitting && currentStep !== 'review' && <ChevronRight className="size-4" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </footer>
  )
}

function getFocusableElements(container) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function BookingFlow({ service, onClose, mode = 'book', appointment = null }) {
  const { user } = useAuth()
  const { addAppointment, rescheduleAppointment } = useAppointments()
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const [currentStep, setCurrentStep] = useState('schedule')
  const [monthDate, setMonthDate] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [availability, setAvailability] = useState(null)
  const [availabilityStatus, setAvailabilityStatus] = useState('loading')
  const [availabilityError, setAvailabilityError] = useState('')
  const [availabilityRequest, setAvailabilityRequest] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [booking, setBooking] = useState(() => buildInitialBooking({ service, user, appointment }))

  const addOns = useMemo(() => getServiceAddOns(service), [service])
  const showOccasion = useMemo(() => shouldAskOccasion(service), [service])
  const professionals = useMemo(() => getProfessionalsForService(service), [service])
  const selectedProfessional = professionals.find((professional) => professional.id === booking.professionalId) ?? null
  const selectedAddOns = useMemo(() => addOns.filter((addOn) => booking.addOns.includes(addOn.id)), [addOns, booking.addOns])
  const totals = useMemo(() => {
    const servicePrice = Number(service?.price) || 0
    const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + Number(addOn.price || 0), 0)
    const subtotal = servicePrice + addOnsTotal
    const tax = Math.round(subtotal * BOOKING_CONFIG.taxRate)

    return {
      servicePrice,
      addOnsTotal,
      subtotal,
      tax,
      total: subtotal + tax,
    }
  }, [selectedAddOns, service])

  useEffect(() => {
    if (!service) return
    setCurrentStep('schedule')
    setMonthDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    setBookingId(mode === 'reschedule' ? appointment?.id ?? '' : '')
    setErrors({})
    setSubmitting(false)
    setBooking(buildInitialBooking({ service, user, appointment: mode === 'reschedule' ? appointment : null }))
  }, [appointment, mode, service, user])

  useEffect(() => {
    if (!service) return

    let isActive = true
    setAvailabilityStatus('loading')
    setAvailabilityError('')

    getAvailability({ serviceId: service.id, monthDate })
      .then((result) => {
        if (!isActive) return
        setAvailability(result)
        setAvailabilityStatus('ready')
      })
      .catch((error) => {
        if (!isActive) return
        setAvailability(null)
        setAvailabilityError(error.message || 'Availability failed to load.')
        setAvailabilityStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [availabilityRequest, monthDate, service])

  useEffect(() => {
    if (!service) return undefined

    previousFocusRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => dialogRef.current?.focus(), 0)

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusableElements = getFocusableElements(dialogRef.current)
      if (!focusableElements.length) return
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [onClose, service])

  if (!service) return null

  function updateMonth(delta) {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  function selectDate(date) {
    setBooking((current) => ({ ...current, date, time: '' }))
    setErrors((current) => ({ ...current, date: '', time: '' }))
  }

  function selectTime(time) {
    setBooking((current) => ({ ...current, time }))
    setErrors((current) => ({ ...current, time: '' }))
  }

  function updateCustomer(field, value) {
    setBooking((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [field]: value,
      },
    }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function toggleAddOn(addOnId) {
    setBooking((current) => ({
      ...current,
      addOns: current.addOns.includes(addOnId)
        ? current.addOns.filter((id) => id !== addOnId)
        : [...current.addOns, addOnId],
    }))
  }

  function setProfessional(professionalId) {
    setBooking((current) => ({ ...current, professionalId }))
  }

  function setPaymentMethod(paymentMethod) {
    setBooking((current) => ({ ...current, paymentMethod }))
  }

  function setOccasion(occasion) {
    setBooking((current) => ({ ...current, occasion }))
  }

  function validateStep(step = currentStep) {
    const nextErrors = {}

    if (step === 'schedule') {
      if (!booking.date) nextErrors.date = 'Please select an available date.'
      if (!booking.time) nextErrors.time = 'Please select an available time.'
    }

    if (step === 'details') {
      if (!booking.customer.name.trim()) nextErrors.name = 'Please enter your name.'
      if (!/^\S+@\S+\.\S+$/.test(booking.customer.email.trim())) nextErrors.email = 'Please enter a valid email address.'
      if (booking.customer.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Please enter a valid phone number.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goNext() {
    if (!validateStep()) return

    if (currentStep === 'review') {
      confirmBooking()
      return
    }

    const index = stepOrder.indexOf(currentStep)
    setCurrentStep(stepOrder[Math.min(index + 1, stepOrder.length - 1)])
  }

  function goBack() {
    const index = stepOrder.indexOf(currentStep)
    setCurrentStep(stepOrder[Math.max(index - 1, 0)])
  }

  async function confirmBooking() {
    if (!validateStep('schedule') || !validateStep('details')) return
    setSubmitting(true)

    try {
      const result = await createAppointment({
        ...booking,
        service,
        selectedAddOns,
        selectedProfessional,
        totals,
      })
      const appointmentId = mode === 'reschedule' ? appointment?.id ?? result.id : result.id
      const record = buildAppointmentRecord({
        id: appointmentId,
        service,
        booking,
        selectedProfessional,
        selectedAddOns,
        totals,
        status: mode === 'reschedule' ? 'rescheduled' : result.status,
        existingAppointment: appointment,
      })

      if (mode === 'reschedule') {
        rescheduleAppointment(appointmentId, record)
      } else {
        addAppointment(record)
      }

      setBookingId(appointmentId)
      setCurrentStep('confirmation')
    } catch (error) {
      setErrors({ time: error.message || 'That time slot was just booked. Please choose another available time.' })
      setCurrentStep('schedule')
    } finally {
      setSubmitting(false)
    }
  }

  function viewAppointment() {
    if (!bookingId) return
    onClose()
    navigate(`${ROUTE_PATHS.accountAppointments}/${bookingId}`)
  }

  function addToCalendar() {
    const date = parseDateKey(booking.date)
    if (!date || !booking.time || !bookingId) return

    const [hours, minutes] = booking.time.split(':').map(Number)
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
    const end = new Date(start.getTime() + minutesFromDuration(service.duration) * 60000)
    const calendarStamp = (value) => value.toISOString().replace(/[-:]/g, '').split('.')[0]
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DevSphere Salon//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${bookingId}@devsphere-salon`,
      `DTSTAMP:${calendarStamp(new Date())}Z`,
      `DTSTART:${calendarStamp(start)}Z`,
      `DTEND:${calendarStamp(end)}Z`,
      `SUMMARY:${service.name}`,
      `DESCRIPTION:Booking ${bookingId} with ${selectedProfessional?.name ?? 'Any Professional'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${bookingId}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  const selectedDay = availability?.days?.find((day) => day.date === booking.date)
  const selectedSlot = selectedDay?.slots?.find((slot) => slot.time === booking.time)
  const continueDisabled = currentStep === 'schedule' && availabilityStatus !== 'ready'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#241915]/62 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-flow-title"
        initial={{ opacity: 0, y: 34, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-dvh w-full flex-col overflow-hidden bg-[#fffaf7] shadow-2xl outline-none sm:h-auto sm:max-h-[94vh] sm:max-w-6xl sm:rounded-[1.75rem]"
      >
        {currentStep === 'confirmation' ? (
          <ConfirmationStep
            service={service}
            booking={booking}
            selectedProfessional={selectedProfessional}
            bookingId={bookingId}
            mode={mode}
            onClose={onClose}
            onViewAppointment={viewAppointment}
            onAddToCalendar={addToCalendar}
          />
        ) : (
          <>
            <BookingHeader service={service} currentStep={currentStep} mode={mode} onClose={onClose} />
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
                <ServiceSummary
                  service={service}
                  booking={booking}
                  selectedProfessional={selectedProfessional}
                  selectedAddOns={selectedAddOns}
                  totals={totals}
                />
                <main className="min-w-0">
                  {selectedSlot?.status === 'limited' && (
                    <p className="mb-4 rounded-2xl border border-[#f0d8a7] bg-[#fff6df] px-4 py-3 text-sm font-bold text-[#8a5b16]">
                      This time is almost full. Only 1 slot left.
                    </p>
                  )}
                  {availabilityStatus === 'error' && availabilityError && (
                    <p className="mb-4 rounded-2xl border border-[#e6b8aa] bg-[#fff5f2] px-4 py-3 text-sm font-bold text-danger">
                      {availabilityError}
                    </p>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <StepContent
                        currentStep={currentStep}
                        service={service}
                        booking={booking}
                        errors={errors}
                        monthDate={monthDate}
                        onMonthChange={updateMonth}
                        selectedDate={booking.date}
                        selectedTime={booking.time}
                        onSelectDate={selectDate}
                        onSelectTime={selectTime}
                        availability={availability}
                        status={availabilityStatus}
                        error={availabilityError}
                        onRetry={() => setAvailabilityRequest((value) => value + 1)}
                        professionals={professionals}
                        selectedProfessional={selectedProfessional}
                        selectedAddOns={selectedAddOns}
                        totals={totals}
                        addOns={addOns}
                        showOccasion={showOccasion}
                        onProfessionalChange={setProfessional}
                        onCustomerChange={updateCustomer}
                        onToggleAddOn={toggleAddOn}
                        onOccasionChange={setOccasion}
                        onPaymentMethod={setPaymentMethod}
                        onStepChange={setCurrentStep}
                      />
                    </motion.div>
                  </AnimatePresence>
                </main>
              </div>
            </div>
            <StickyAction
              currentStep={currentStep}
              booking={booking}
              totals={totals}
              disabled={continueDisabled}
              submitting={submitting}
              mode={mode}
              onBack={goBack}
              onContinue={goNext}
            />
          </>
        )}
      </motion.section>
    </motion.div>
  )
}

export default BookingFlow
