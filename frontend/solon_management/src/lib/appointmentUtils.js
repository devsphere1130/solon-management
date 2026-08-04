const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
})

export function formatAppointmentPrice(price) {
  return INR_FORMATTER.format(Math.max(0, Math.round(Number(price) || 0)))
}

export function parseAppointmentDate(date) {
  if (!date) return null
  return new Date(`${date}T00:00:00`)
}

export function appointmentDateTime(appointment) {
  return new Date(`${appointment.date}T${appointment.time ?? '00:00'}`)
}

export function formatAppointmentDate(date, variant = 'long') {
  const parsed = parseAppointmentDate(date)
  if (!parsed) return ''
  return variant === 'short' ? SHORT_DATE_FORMATTER.format(parsed) : LONG_DATE_FORMATTER.format(parsed)
}

export function formatAppointmentTime(time) {
  if (!time) return ''
  const [hourValue, minute] = time.split(':').map(Number)
  const suffix = hourValue >= 12 ? 'PM' : 'AM'
  const hour = hourValue % 12 || 12
  return `${hour}:${String(minute).padStart(2, '0')} ${suffix}`
}

export function getAppointmentBucket(appointment) {
  if (appointment.status === 'cancelled') return 'cancelled'
  if (appointment.status === 'completed' || appointmentDateTime(appointment).getTime() < Date.now()) return 'past'
  return 'upcoming'
}

export function getAppointmentStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    rescheduled: 'Rescheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  }

  return labels[status] ?? 'Confirmed'
}

export function sortAppointments(items, sort) {
  return [...items].sort((a, b) => {
    if (sort === 'oldest') return appointmentDateTime(a) - appointmentDateTime(b)
    return appointmentDateTime(b) - appointmentDateTime(a)
  })
}
