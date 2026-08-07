const MOCK_DELAY = 320

export const BOOKING_CONFIG = Object.freeze({
  taxRate: 0.18,
  supportedPaymentMethods: [
    {
      id: 'pay_at_salon',
      label: 'Pay at salon',
      description: 'Pay after your appointment at the front desk.',
    },
  ],
})

export const occasionOptions = ['Regular', 'Party', 'Wedding', 'Bridal', 'Photoshoot', 'Other']

const timeGroups = [
  {
    label: 'Morning',
    slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  },
  {
    label: 'Afternoon',
    slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
  },
  {
    label: 'Evening',
    slots: ['17:00', '17:30', '18:00', '18:30', '19:00'],
  },
]

const professionals = [
  {
    id: 'meera-shah',
    name: 'Meera Shah',
    role: 'Senior Hair Expert',
    rating: 4.9,
    reviews: 186,
    experience: '9 years',
    specialty: 'Precision cuts, smoothing, event styling',
    categories: ['Hair', 'Hair Styling', 'Packages'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Skin Therapist',
    rating: 4.8,
    reviews: 142,
    experience: '7 years',
    specialty: 'Hydration facials, brightening care, sensitive skin',
    categories: ['Facial', 'Skin Care', 'Packages'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'sara-khan',
    name: 'Sara Khan',
    role: 'Makeup Artist',
    rating: 4.9,
    reviews: 164,
    experience: '8 years',
    specialty: 'Soft glam, party makeup, complexion matching',
    categories: ['Makeup', 'Bridal', 'Packages'],
    avatar: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'ritu-menon',
    name: 'Ritu Menon',
    role: 'Spa Therapist',
    rating: 4.7,
    reviews: 119,
    experience: '6 years',
    specialty: 'Spa therapy, recovery rituals, hair spa',
    categories: ['Spa', 'Hair', 'Packages'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'anika-rao',
    name: 'Anika Rao',
    role: 'Nail Artist',
    rating: 4.8,
    reviews: 98,
    experience: '5 years',
    specialty: 'Editorial manicures, gel finish, hand care',
    categories: ['Nails', 'Packages'],
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80',
  },
]

const addOnsByCategory = {
  Hair: [
    { id: 'hair-wash', name: 'Luxury hair wash', description: 'Scalp cleanse and conditioning rinse.', price: 199 },
    { id: 'head-massage', name: 'Head massage', description: 'Ten-minute relaxation massage.', price: 399 },
  ],
  'Hair Styling': [
    { id: 'hair-wash', name: 'Luxury hair wash', description: 'Scalp cleanse and conditioning rinse.', price: 199 },
    { id: 'heat-shield', name: 'Thermal shield upgrade', description: 'Extra protection before styling.', price: 249 },
  ],
  Makeup: [
    { id: 'lash-touch', name: 'Eyelash touch-up', description: 'Soft lash lift for event-ready eyes.', price: 299 },
    { id: 'hair-touch', name: 'Hair finish touch-up', description: 'Quick polish around the face frame.', price: 399 },
  ],
  Bridal: [
    { id: 'trial-look', name: 'Mini trial look', description: 'A short pre-event style direction session.', price: 999 },
    { id: 'touch-up-kit', name: 'Touch-up kit', description: 'Compact event essentials selected by the artist.', price: 699 },
  ],
  Facial: [
    { id: 'eye-mask', name: 'Cooling eye mask', description: 'Gentle eye-area refresh.', price: 199 },
    { id: 'neck-care', name: 'Neck care add-on', description: 'Extends hydration to neck and decollete.', price: 299 },
  ],
  'Skin Care': [
    { id: 'led-boost', name: 'LED boost', description: 'A short light therapy finish.', price: 499 },
    { id: 'spf-kit', name: 'SPF finish kit', description: 'Post-treatment protection essentials.', price: 299 },
  ],
  Nails: [
    { id: 'gel-finish', name: 'Gel finish upgrade', description: 'Longer-wear glossy finish.', price: 349 },
    { id: 'hand-mask', name: 'Hydrating hand mask', description: 'Softening hand treatment.', price: 249 },
  ],
  Spa: [
    { id: 'aroma-upgrade', name: 'Custom aroma blend', description: 'Choose a calming or energizing oil blend.', price: 299 },
    { id: 'steam-therapy', name: 'Steam therapy', description: 'Warm steam prep before the ritual.', price: 399 },
  ],
  Packages: [
    { id: 'priority-room', name: 'Priority suite setup', description: 'Private room preparation when available.', price: 699 },
    { id: 'refresh-drink', name: 'Wellness refreshment', description: 'Post-service tea or infused water.', price: 199 },
  ],
}

function wait(delay = MOCK_DELAY) {
  return new Promise((resolve) => window.setTimeout(resolve, delay))
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function hash(value) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0)
}

function buildSlot(serviceId, key, time, index) {
  const score = hash(`${serviceId}:${key}:${time}:${index}`)
  const booked = score % 11 === 0
  const limited = !booked && score % 7 === 0

  return {
    time,
    available: !booked,
    status: booked ? 'booked' : limited ? 'limited' : 'available',
    remaining: limited ? 1 : null,
  }
}

export function getServiceAddOns(service) {
  return addOnsByCategory[service?.category] ?? []
}

export function shouldAskOccasion(service) {
  return ['Makeup', 'Bridal', 'Hair Styling', 'Packages'].includes(service?.category)
}

export function getProfessionalsForService(service) {
  const matching = professionals.filter((professional) => professional.categories.includes(service?.category))
  return matching.length ? matching : professionals.slice(0, 3)
}

export async function getAvailability({ serviceId, monthDate }) {
  await wait()

  const today = stripTime(new Date())
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1)
    const key = dateKey(date)
    const isPast = stripTime(date) < today
    const isClosed = date.getDay() === 1
    const slots = isPast || isClosed
      ? []
      : timeGroups.flatMap((group) =>
          group.slots.map((time, slotIndex) => ({
            ...buildSlot(serviceId, key, time, slotIndex),
            group: group.label,
          })),
        )

    return {
      date: key,
      available: slots.some((slot) => slot.available),
      closedReason: isClosed ? 'Salon closed' : isPast ? 'Past date' : '',
      slots,
    }
  })

  return {
    month: dateKey(new Date(year, month, 1)),
    timeGroups: timeGroups.map((group) => group.label),
    days,
  }
}

export async function createAppointment(booking) {
  await wait(520)

  if (!booking?.date || !booking?.time || !booking?.service?.id) {
    throw new Error('Please select an available date and time.')
  }

  const suffix = String(Date.now()).slice(-5)
  return {
    id: `SAL-${suffix}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}
