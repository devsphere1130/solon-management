import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarDays,
  Check,
  Clock,
  Image as ImageIcon,
  ReceiptText,
  RotateCcw,
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
} from '../../lib/appointmentUtils.js'
import { useAppointments } from '../../context/useAppointments.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function AppointmentImage({ appointment }) {
  const [hasError, setHasError] = useState(false)
  const src = appointment.service.image ?? appointment.service.images?.[0]?.src

  if (!src || hasError) {
    return (
      <div className="flex size-full items-center justify-center bg-[#f3e8df] text-[#8b756a]">
        <ImageIcon className="size-8" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={appointment.service.name} className="size-full object-cover" onError={() => setHasError(true)} />
}

function StatusBadge({ status }) {
  const tone = {
    confirmed: 'bg-[#edf4ec] text-[#4f664f]',
    rescheduled: 'bg-[#fff6df] text-[#8a5b16]',
    cancelled: 'bg-[#fff1e8] text-[#9b5639]',
    completed: 'bg-[#edf4ec] text-[#4f664f]',
  }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold', tone[status] ?? tone.confirmed)}>
      {status !== 'cancelled' && <Check className="size-3.5" aria-hidden="true" />}
      {getAppointmentStatusLabel(status)}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#fffaf7] p-4">
      <Icon className="size-4 text-[#9b5639]" aria-hidden="true" />
      <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#8b7a72]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#241915]">{value}</p>
    </div>
  )
}

function CancelDialog({ appointment, policy, onClose, onConfirm }) {
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
        aria-labelledby="cancel-details-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="w-full max-w-md rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="cancel-details-title" className="text-xl font-extrabold text-[#241915]">Cancel appointment?</h2>
            <p className="mt-1 text-sm text-[#6f5f57]">This appointment will move to your Cancelled tab.</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-[#eadfd6]" aria-label="Close">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">
          <p className="font-extrabold text-[#241915]">{appointment.service.name}</p>
          <p className="mt-1 text-sm font-semibold text-[#6f5f57]">{formatAppointmentDate(appointment.date)} at {formatAppointmentTime(appointment.time)}</p>
        </div>
        <div className="mt-5 rounded-2xl border border-[#eadfd6] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">Cancellation policy</p>
          <p className="mt-2 text-sm leading-6 text-[#5f4f47]">{policy}</p>
        </div>
        <div className="mt-6 grid gap-2">
          <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={onClose}>Keep Appointment</Button>
          <Button type="button" variant="outline" className="border-[#e6b8aa] text-[#9b5639] hover:bg-[#fff5f2]" onClick={onConfirm}>Cancel Appointment</Button>
        </div>
      </motion.section>
    </motion.div>
  )
}

function AppointmentDetails() {
  const { appointmentId } = useParams()
  const { getAppointmentById, cancelAppointment, businessConfig } = useAppointments()
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [bookAgainOpen, setBookAgainOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const appointment = getAppointmentById(appointmentId)

  if (!appointment) {
    return (
      <AccountShell title="Appointment Details" description="We could not find that appointment in this browser.">
        <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
          <h2 className="text-2xl font-extrabold text-[#241915]">Appointment not found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f5f57]">It may have been booked on another device or removed from local data.</p>
          <Link to={ROUTE_PATHS.accountAppointments} className={buttonClasses({ className: 'mt-6 bg-[#241915] hover:bg-[#3a2b24]' })}>
            Back to My Appointments
          </Link>
        </section>
      </AccountShell>
    )
  }

  const bucket = getAppointmentBucket(appointment)
  const manageable = bucket === 'upcoming'

  function handleCancel() {
    cancelAppointment(appointment.id)
    setCancelOpen(false)
  }

  return (
    <AccountShell
      title="Appointment Details"
      description="Review your salon booking, payment details, and available actions."
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[1.5rem] border border-[#eadfd6] bg-white shadow-soft">
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[18rem_1fr]">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#f3e8df] lg:aspect-square">
              <AppointmentImage appointment={appointment} />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Badge className="bg-[#edf4ec] text-[#536d57]">{appointment.service.category}</Badge>
                <StatusBadge status={appointment.status} />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-[#241915]">{appointment.service.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6f5f57]">{appointment.service.fullDescription ?? appointment.service.description}</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DetailRow icon={CalendarDays} label="Date" value={formatAppointmentDate(appointment.date)} />
                <DetailRow icon={Clock} label="Time" value={formatAppointmentTime(appointment.time)} />
                <DetailRow icon={Clock} label="Duration" value={appointment.service.duration} />
                <DetailRow icon={UserRound} label="Professional" value={appointment.professional.name} />
              </div>
              <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">Booking ID</p>
                <p className="mt-1 text-xl font-extrabold text-[#9b5639]">#{appointment.id}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6 shadow-soft">
            <h3 className="text-xl font-extrabold text-[#241915]">Service</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(appointment.service.benefits ?? []).map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-semibold text-[#43322c]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf4ec] text-[#536d57]">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <ReceiptText className="size-5 text-[#9b5639]" aria-hidden="true" />
              <h3 className="text-xl font-extrabold text-[#241915]">Payment</h3>
            </div>
            <div className="mt-5 space-y-3">
              <PaymentLine label="Service" value={appointment.pricing.service} />
              {appointment.pricing.addOns > 0 && <PaymentLine label="Add-ons" value={appointment.pricing.addOns} />}
              <PaymentLine label="Tax" value={appointment.pricing.tax} />
              <div className="border-t border-[#eadfd6] pt-3">
                <PaymentLine label="Total" value={appointment.pricing.total} strong />
              </div>
            </div>
          </section>
        </div>

        <section className="flex flex-wrap gap-2 rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
          {manageable ? (
            <>
              <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => setRescheduleOpen(true)}>
                Reschedule
              </Button>
              <Button type="button" variant="outline" className="border-[#e6b8aa] text-[#9b5639] hover:bg-[#fff5f2]" onClick={() => setCancelOpen(true)}>
                Cancel Appointment
              </Button>
            </>
          ) : (
            <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => setBookAgainOpen(true)}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Book Again
            </Button>
          )}
          <Link to={ROUTE_PATHS.accountAppointments} className={buttonClasses({ variant: 'outline', className: 'bg-white' })}>
            Back to Appointments
          </Link>
        </section>
      </div>

      <AnimatePresence>
        {rescheduleOpen && (
          <BookingFlow
            service={appointment.service}
            mode="reschedule"
            appointment={appointment}
            onClose={() => setRescheduleOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookAgainOpen && <BookingFlow service={appointment.service} onClose={() => setBookAgainOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {cancelOpen && (
          <CancelDialog
            appointment={appointment}
            policy={businessConfig.cancellationPolicy}
            onClose={() => setCancelOpen(false)}
            onConfirm={handleCancel}
          />
        )}
      </AnimatePresence>
    </AccountShell>
  )
}

function PaymentLine({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-[#6f5f57]">{label}</span>
      <span className={cn('text-sm font-extrabold text-[#241915]', strong && 'text-lg text-[#9b5639]')}>{formatAppointmentPrice(value)}</span>
    </div>
  )
}

export default AppointmentDetails
