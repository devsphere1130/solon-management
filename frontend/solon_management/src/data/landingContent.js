import { Bell, Calendar, CreditCard, LineChart, Package, Receipt, Scissors, Users } from 'lucide-react'

export const features = [
  {
    icon: Calendar,
    title: 'Appointment Management',
    description: 'Drag-and-drop calendar with day, week and month views so double-bookings never happen again.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Full visit history, preferences and spend for every client in one searchable profile.',
  },
  {
    icon: Scissors,
    title: 'Staff Management',
    description: 'Track availability, specialization and performance for every stylist and therapist.',
  },
  {
    icon: Package,
    title: 'Service Management',
    description: 'Organize services into categories with pricing, duration and rich descriptions.',
  },
  {
    icon: Receipt,
    title: 'Billing & Payments',
    description: 'Generate polished invoices and accept cash, card, UPI or bank transfer in seconds.',
  },
  {
    icon: CreditCard,
    title: 'Inventory',
    description: 'Stay ahead of stockouts with live quantities and automatic low-stock alerts.',
  },
  {
    icon: LineChart,
    title: 'Reports & Analytics',
    description: 'Revenue, retention and staff performance reporting with exportable data.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Automated reminders and confirmations that cut no-shows dramatically.',
  },
]

export const steps = [
  {
    title: 'Set up your salon',
    description: 'Add your services, staff and working hours in minutes with guided onboarding.',
  },
  {
    title: 'Fill your calendar',
    description: 'Clients book online or your front desk schedules in seconds from one unified calendar.',
  },
  {
    title: 'Get paid, stay stocked',
    description: 'Invoice automatically, accept any payment method, and track inventory in real time.',
  },
  {
    title: 'Grow with insight',
    description: 'Watch revenue, retention and staff performance trend upward with built-in analytics.',
  },
]

export const analyticsSummary = {
  revenueSeries: [
    { month: 'Feb', revenue: 168000, appointments: 312 },
    { month: 'Mar', revenue: 182400, appointments: 338 },
    { month: 'Apr', revenue: 176900, appointments: 329 },
    { month: 'May', revenue: 201500, appointments: 361 },
    { month: 'Jun', revenue: 219800, appointments: 388 },
    { month: 'Jul', revenue: 245800, appointments: 412 },
  ],
  revenueByService: [
    { name: 'Hair', value: 42 },
    { name: 'Spa', value: 24 },
    { name: 'Facial', value: 18 },
    { name: 'Nails', value: 16 },
  ],
}

export const kpis = [
  { label: 'Total Revenue', value: '₹2,45,800', change: '+18.4%', period: 'vs last month' },
  { label: "Today's Appointments", value: '38', change: '+6.1%', period: 'vs yesterday' },
  { label: 'Total Customers', value: '3,214', change: '+9.8%', period: 'vs last month' },
  { label: 'Active Staff', value: '14', change: '+2', period: 'this quarter' },
]

export const testimonials = [
  {
    name: 'Ananya Rao',
    role: 'Owner',
    salon: 'Lumière Salon & Spa',
    quote:
      'DevSphere replaced four different tools we were juggling. Our front desk finally moves as fast as our stylists do.',
    rating: 5,
  },
  {
    name: 'Marcus Bell',
    role: 'General Manager',
    salon: 'The Grove Barber Co.',
    quote: 'No-shows dropped by a third in the first month just from the automated reminders. The ROI was immediate.',
    rating: 5,
  },
  {
    name: 'Priya Menon',
    role: 'Founder',
    salon: 'Studio Bloom',
    quote: 'It genuinely feels like software built for a salon, not a generic CRM with a calendar bolted on.',
    rating: 5,
  },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: '₹1,499',
    period: '/month',
    description: 'For independent stylists and single-chair studios.',
    features: ['1 staff account', 'Appointment calendar', 'Customer profiles', 'Basic billing'],
    highlighted: false,
    cta: 'Start free trial',
  },
  {
    name: 'Growth',
    price: '₹3,999',
    period: '/month',
    description: 'For growing salons ready to scale bookings and staff.',
    features: [
      'Up to 15 staff accounts',
      'Everything in Starter',
      'Inventory management',
      'Reports & analytics',
      'Marketing & reminders',
    ],
    highlighted: true,
    cta: 'Start free trial',
  },
  {
    name: 'Studio',
    price: 'Custom',
    period: '',
    description: 'For multi-location chains with dedicated support needs.',
    features: ['Unlimited staff accounts', 'Everything in Growth', 'Multi-location reporting', 'Priority support'],
    highlighted: false,
    cta: 'Talk to sales',
  },
]

export const faqs = [
  {
    question: 'Can I import my existing customer and appointment data?',
    answer: 'Yes. We provide guided CSV import for customers, appointments and services, with a support specialist available for larger migrations.',
  },
  {
    question: 'Does DevSphere work on tablets at the front desk?',
    answer: 'DevSphere is fully responsive and optimized for tablet check-in flows as well as desktop and mobile use.',
  },
  {
    question: 'What payment methods can I accept through the platform?',
    answer: 'Cash, card, UPI and bank transfer are all supported out of the box, with itemized invoices for every transaction.',
  },
  {
    question: 'Is there a contract or can I cancel anytime?',
    answer: 'All plans are month-to-month with no long-term contract. You can upgrade, downgrade or cancel at any time.',
  },
  {
    question: 'Can I customize the look and feel for my brand?',
    answer: 'Yes — the admin theme customization system lets you set your own brand colors across the entire application instantly.',
  },
]
