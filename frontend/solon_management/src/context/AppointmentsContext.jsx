import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppointmentsContext } from './appointmentsContextValue.js'

const APPOINTMENTS_STORAGE_KEY = 'devsphere_customer_appointments'
const NOTIFICATIONS_STORAGE_KEY = 'devsphere_customer_notifications'

const businessConfig = Object.freeze({
  cancellationPolicy: 'Free cancellation up to 24 hours before your appointment.',
})

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function appointmentDateTime(appointment) {
  return new Date(`${appointment.date}T${appointment.time ?? '00:00'}`)
}

function isUpcomingAppointment(appointment) {
  if (!['pending', 'confirmed', 'rescheduled'].includes(appointment.status)) return false
  return appointmentDateTime(appointment).getTime() >= Date.now()
}

function sortNewest(items) {
  return [...items].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
}

function buildNotification({ type, title, detail, appointmentId }) {
  return {
    id: `${type}:${appointmentId}:${Date.now()}`,
    type,
    title,
    detail,
    appointmentId,
    createdAt: new Date().toISOString(),
    read: false,
  }
}

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(() => readStorage(APPOINTMENTS_STORAGE_KEY, []))
  const [notifications, setNotifications] = useState(() => readStorage(NOTIFICATIONS_STORAGE_KEY, []))

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const pushNotification = useCallback((notification) => {
    setNotifications((current) => [notification, ...current].slice(0, 12))
  }, [])

  const addAppointment = useCallback(
    (appointment) => {
      const record = {
        ...appointment,
        status: appointment.status ?? 'confirmed',
        createdAt: appointment.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAppointments((current) => [record, ...current.filter((item) => item.id !== record.id)])
      pushNotification(
        buildNotification({
          type: 'confirmed',
          title: 'Appointment confirmed',
          detail: `${record.service.name} - ${record.date} - ${record.time}`,
          appointmentId: record.id,
        }),
      )
      return record
    },
    [pushNotification],
  )

  const rescheduleAppointment = useCallback(
    (appointmentId, updates) => {
      const existing = appointments.find((appointment) => appointment.id === appointmentId)

      if (!existing) return null

      const updatedRecord = {
        ...existing,
        ...updates,
        previousDate: existing.date,
        previousTime: existing.time,
        status: 'rescheduled',
        rescheduledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAppointments((current) => current.map((appointment) => (appointment.id === appointmentId ? updatedRecord : appointment)))
      pushNotification(
        buildNotification({
          type: 'rescheduled',
          title: 'Appointment rescheduled',
          detail: `New time: ${updates.date} - ${updates.time}`,
          appointmentId,
        }),
      )

      return updatedRecord
    },
    [appointments, pushNotification],
  )

  const cancelAppointment = useCallback(
    (appointmentId) => {
      const existing = appointments.find((appointment) => appointment.id === appointmentId)

      if (!existing) return null

      const cancelledRecord = {
        ...existing,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setAppointments((current) => current.map((appointment) => (appointment.id === appointmentId ? cancelledRecord : appointment)))
      pushNotification(
        buildNotification({
          type: 'cancelled',
          title: 'Appointment cancelled',
          detail: `${cancelledRecord.service.name} - ${cancelledRecord.date}`,
          appointmentId,
        }),
      )

      return cancelledRecord
    },
    [appointments, pushNotification],
  )

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }, [])

  const getAppointmentById = useCallback(
    (appointmentId) => appointments.find((appointment) => appointment.id === appointmentId),
    [appointments],
  )

  const upcomingAppointments = useMemo(
    () => appointments.filter(isUpcomingAppointment).sort((a, b) => appointmentDateTime(a) - appointmentDateTime(b)),
    [appointments],
  )

  const counts = useMemo(() => {
    const cancelled = appointments.filter((appointment) => appointment.status === 'cancelled').length
    const upcoming = upcomingAppointments.length
    const completed = appointments.filter((appointment) => {
      if (appointment.status === 'cancelled') return false
      if (appointment.status === 'completed') return true
      return appointmentDateTime(appointment).getTime() < Date.now()
    }).length

    return { upcoming, completed, cancelled, total: appointments.length }
  }, [appointments, upcomingAppointments])

  const value = useMemo(
    () => ({
      appointments: sortNewest(appointments),
      notifications,
      unreadNotificationCount: notifications.filter((notification) => !notification.read).length,
      upcomingAppointments,
      counts,
      businessConfig,
      addAppointment,
      rescheduleAppointment,
      cancelAppointment,
      getAppointmentById,
      markNotificationsRead,
    }),
    [
      appointments,
      notifications,
      upcomingAppointments,
      counts,
      addAppointment,
      rescheduleAppointment,
      cancelAppointment,
      getAppointmentById,
      markNotificationsRead,
    ],
  )

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
}
