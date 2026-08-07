// DevSphere Reports & Analytics — API-ready service layer.
// Swap each mock resolver for api.get('/reports/...') when the backend is ready.
// Filters are passed consistently: date_from, date_to, staff_id, service_id, category, payment_method.

const MOCK_DELAY = 0

const salonType = 'unisex' // men | women | unisex — driven by salon configuration

const dateRangeOptions = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this-week', label: 'This Week' },
  { id: 'last-week', label: 'Last Week' },
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'this-quarter', label: 'This Quarter' },
  { id: 'this-year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
]

const mockOverview = {
  kpis: [
    { id: 'revenue', label: 'Total Revenue', value: '₹4,82,500', change: 18.4, period: 'vs previous period', tone: 'positive' },
    { id: 'appointments', label: 'Total Appointments', value: '428', change: 12.8, period: 'vs previous period', tone: 'positive' },
    { id: 'new-customers', label: 'New Customers', value: '96', change: 9.2, period: 'vs previous period', tone: 'positive' },
    { id: 'returning', label: 'Returning Customers', value: '274', change: 16.5, period: 'vs previous period', tone: 'positive' },
  ],
  secondaryKpis: [
    { id: 'avg-ticket', label: 'Average Appointment Value', value: '₹1,127', change: 4.8, period: 'vs previous period', tone: 'positive' },
    { id: 'cancellation', label: 'Cancellation Rate', value: '7.2%', change: -1.4, period: 'vs previous period', tone: 'positive' },
    { id: 'no-show', label: 'No-show Rate', value: '4.0%', change: -0.8, period: 'vs previous period', tone: 'positive' },
    { id: 'net-profit', label: 'Net Profit', value: '₹3,06,000', change: 21.2, period: 'vs previous period', tone: 'positive' },
  ],
  summary: {
    revenue: '₹4.82L',
    appointments: '428',
    newCustomers: '96',
    returningCustomers: '274',
    retention: '78%',
    staffUtilization: '92%',
  },
  goingWell: [
    { text: 'Hair Spa revenue ↑24%', tone: 'positive' },
    { text: 'Customer retention ↑8%', tone: 'positive' },
    { text: 'No-shows ↓12%', tone: 'positive' },
  ],
  needsAttention: [
    { text: 'Wax inventory low', tone: 'warning' },
    { text: 'Saturday capacity high', tone: 'warning' },
    { text: '3 services have declining bookings', tone: 'warning' },
  ],
}

const mockRevenue = {
  total: 482500,
  gross: 511000,
  discounts: 28500,
  refunds: 0,
  net: 482500,
  growth: 18.4,
  series: [
    { label: 'Jan', revenue: 342000, appointments: 312, previous: 298000 },
    { label: 'Feb', revenue: 368400, appointments: 338, previous: 321000 },
    { label: 'Mar', revenue: 356900, appointments: 329, previous: 335000 },
    { label: 'Apr', revenue: 401500, appointments: 361, previous: 348000 },
    { label: 'May', revenue: 439800, appointments: 388, previous: 372000 },
    { label: 'Jun', revenue: 482500, appointments: 428, previous: 407500 },
  ],
  breakdown: [
    { id: 'services', label: 'Services', value: 348000, percent: 72 },
    { id: 'products', label: 'Products', value: 82500, percent: 17 },
    { id: 'packages', label: 'Packages', value: 35000, percent: 7 },
    { id: 'other', label: 'Other', value: 17000, percent: 4 },
  ],
}

const mockServices = [
  { id: 'haircut', name: 'Haircut', category: 'Hair', bookings: 128, revenue: 76800, avgPrice: 600, growth: 12, cancellationRate: 3.1, gender: 'Unisex' },
  { id: 'hair-spa', name: 'Hair Spa', category: 'Spa', bookings: 84, revenue: 126000, avgPrice: 1500, growth: 24, cancellationRate: 2.4, gender: 'Unisex' },
  { id: 'facial', name: 'Facial', category: 'Skin Care', bookings: 72, revenue: 86400, avgPrice: 1200, growth: 18, cancellationRate: 4.2, gender: 'Women' },
  { id: 'bridal', name: 'Bridal Makeup', category: 'Bridal', bookings: 18, revenue: 162000, avgPrice: 9000, growth: 31, cancellationRate: 1.8, gender: 'Women' },
  { id: 'nail-art', name: 'Nail Art', category: 'Nails', bookings: 42, revenue: 42000, avgPrice: 1000, growth: 8, cancellationRate: 5.0, gender: 'Women' },
  { id: 'beard', name: 'Beard Grooming', category: 'Grooming', bookings: 64, revenue: 38400, avgPrice: 600, growth: 22, cancellationRate: 3.8, gender: 'Men' },
  { id: 'hair-color', name: 'Hair Color', category: 'Hair', bookings: 36, revenue: 100800, avgPrice: 2800, growth: 26, cancellationRate: 2.9, gender: 'Unisex' },
  { id: 'manicure', name: 'Manicure', category: 'Nails', bookings: 30, revenue: 30000, avgPrice: 1000, growth: 6, cancellationRate: 4.5, gender: 'Women' },
]

const mockAppointments = {
  total: 428,
  completed: 362,
  confirmed: 18,
  pending: 18,
  cancelled: 31,
  noShow: 17,
  statusBreakdown: [
    { label: 'Completed', value: 362, color: 'var(--color-success)' },
    { label: 'Confirmed', value: 18, color: 'var(--color-info)' },
    { label: 'Pending', value: 18, color: 'var(--color-warning)' },
    { label: 'Cancelled', value: 31, color: 'var(--color-danger)' },
    { label: 'No-show', value: 17, color: 'var(--color-text-muted)' },
  ],
}

const mockPeakHours = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  hours: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'],
  data: [
    [2, 3, 4, 3, 2, 2, 1, 2, 3, 4, 3, 2],
    [2, 3, 4, 4, 3, 2, 2, 2, 3, 4, 4, 3],
    [3, 4, 5, 4, 3, 3, 2, 3, 4, 5, 4, 3],
    [3, 4, 5, 5, 4, 3, 3, 3, 4, 5, 5, 4],
    [4, 5, 6, 5, 4, 4, 3, 4, 5, 6, 6, 5],
    [5, 6, 7, 7, 6, 5, 5, 6, 7, 8, 9, 8],
    [4, 5, 6, 6, 5, 4, 4, 5, 6, 7, 7, 6],
  ],
  insight: 'Saturday evenings have 34% more appointments than your weekly average.',
}

const mockStaff = [
  { id: 1, name: 'Ritu Menon', department: 'Hair', appointments: 86, completed: 82, revenue: 124500, avgTicket: 1518, rating: 4.8, utilization: 92, bookedHours: 148, availableHours: 160 },
  { id: 2, name: 'Ananya Shah', department: 'Makeup', appointments: 72, completed: 70, revenue: 108200, avgTicket: 1546, rating: 4.9, utilization: 87, bookedHours: 139, availableHours: 160 },
  { id: 3, name: 'Meera Nair', department: 'Spa', appointments: 64, completed: 61, revenue: 96200, avgTicket: 1577, rating: 4.7, utilization: 81, bookedHours: 130, availableHours: 160 },
  { id: 4, name: 'Arjun Rao', department: 'Grooming', appointments: 58, completed: 55, revenue: 34800, avgTicket: 633, rating: 4.6, utilization: 74, bookedHours: 118, availableHours: 160 },
  { id: 5, name: 'Pooja Das', department: 'Nails', appointments: 52, completed: 49, revenue: 52000, avgTicket: 1061, rating: 4.5, utilization: 68, bookedHours: 109, availableHours: 160 },
  { id: 6, name: 'Simran Kaur', department: 'Skin', appointments: 48, completed: 45, revenue: 57600, avgTicket: 1280, rating: 4.8, utilization: 71, bookedHours: 114, availableHours: 160 },
]

const mockCustomers = {
  total: 1248,
  new: 96,
  returning: 274,
  inactive: 184,
  atRisk: 184,
  retention: 78,
  funnel: [
    { stage: 'First-time customers', count: 100 },
    { stage: 'Second visit', count: 62, drop: 38 },
    { stage: 'Third visit', count: 44, drop: 29 },
    { stage: 'Regular customers', count: 36, drop: 18 },
  ],
  avgSpend: 2840,
  topCustomers: [
    { name: 'Ananya Rao', visits: 18, spend: 42500 },
    { name: 'Priya Shah', visits: 14, spend: 36200 },
    { name: 'Rahul Patil', visits: 12, spend: 29800 },
  ],
  segments: [
    { id: 'new', label: 'New', count: 96, tone: 'info' },
    { id: 'returning', label: 'Returning', count: 274, tone: 'success' },
    { id: 'loyal', label: 'Loyal', count: 428, tone: 'primary' },
    { id: 'high-value', label: 'High Value', count: 82, tone: 'accent' },
    { id: 'inactive', label: 'Inactive', count: 96, tone: 'warning' },
  ],
}

const mockProducts = [
  { id: 'kerastase-serum', name: 'Kerastase Serum', unitsSold: 42, revenue: 37800, growth: 24, stock: 18, status: 'Healthy' },
  { id: 'hair-repair-mask', name: 'Hair Repair Mask', unitsSold: 36, revenue: 28800, growth: 18, stock: 12, status: 'Healthy' },
  { id: 'repair-shampoo', name: 'Professional Repair Shampoo', unitsSold: 28, revenue: 19600, growth: 11, stock: 4, status: 'Low Stock' },
  { id: 'hydrating-serum', name: 'Hydrating Face Serum', unitsSold: 22, revenue: 19800, growth: 15, stock: 0, status: 'Out of Stock' },
  { id: 'beard-oil', name: 'Beard Growth Oil', unitsSold: 18, revenue: 10800, growth: 9, stock: 14, status: 'Healthy' },
  { id: 'nail-polish', name: 'Gel Nail Polish Set', unitsSold: 12, revenue: 7200, growth: -4, stock: 9, status: 'Slow Moving' },
]

const mockInventory = {
  totalValue: 482000,
  lowStock: 12,
  outOfStock: 3,
  fastMoving: 18,
  slowMoving: 9,
  items: [
    { id: 'repair-shampoo', name: 'Professional Repair Shampoo', stock: 4, sold: 28, revenue: 19600, status: 'Low Stock' },
    { id: 'hydrating-serum', name: 'Hydrating Face Serum', stock: 0, sold: 22, revenue: 19800, status: 'Out of Stock' },
    { id: 'kerastase-serum', name: 'Kerastase Serum', stock: 18, sold: 42, revenue: 37800, status: 'Healthy' },
    { id: 'hair-repair-mask', name: 'Hair Repair Mask', stock: 12, sold: 36, revenue: 28800, status: 'Healthy' },
    { id: 'beard-oil', name: 'Beard Growth Oil', stock: 14, sold: 18, revenue: 10800, status: 'Healthy' },
    { id: 'nail-polish', name: 'Gel Nail Polish Set', stock: 9, sold: 12, revenue: 7200, status: 'Slow Moving' },
  ],
}

const mockPayments = {
  breakdown: [
    { id: 'upi', label: 'UPI', value: 218000, percent: 45 },
    { id: 'card', label: 'Card', value: 142000, percent: 29 },
    { id: 'cash', label: 'Cash', value: 94000, percent: 19 },
    { id: 'online', label: 'Online', value: 28500, percent: 7 },
  ],
  trend: [
    { label: 'Feb', upi: 148000, card: 98000, cash: 82000, online: 20400 },
    { label: 'Mar', upi: 162000, card: 104000, cash: 86000, online: 22400 },
    { label: 'Apr', upi: 158000, card: 110000, cash: 78000, online: 20900 },
    { label: 'May', upi: 184000, card: 122000, cash: 88000, online: 25400 },
    { label: 'Jun', upi: 218000, card: 142000, cash: 94000, online: 28500 },
  ],
}

const mockDiscounts = {
  total: 28500,
  discountedAppointments: 74,
  averageDiscount: 385,
  impactPercent: 5.9,
  topServices: [
    { name: 'Hair Color', count: 18, discount: 7200 },
    { name: 'Bridal Makeup', count: 8, discount: 6400 },
    { name: 'Hair Spa', count: 16, discount: 4800 },
    { name: 'Facial', count: 12, discount: 3600 },
  ],
}

const mockLosses = {
  cancelled: 31,
  noShow: 17,
  lateCancellation: 8,
  estimatedLostRevenue: 18400,
  trend: [
    { label: 'Feb', cancelled: 28, noShow: 22 },
    { label: 'Mar', cancelled: 32, noShow: 19 },
    { label: 'Apr', cancelled: 26, noShow: 21 },
    { label: 'May', cancelled: 34, noShow: 18 },
    { label: 'Jun', cancelled: 31, noShow: 17 },
  ],
  insight: 'Saturday has the highest cancellation rate.',
}

const mockProfit = {
  grossRevenue: 511000,
  discounts: 28500,
  expenses: 148000,
  netRevenue: 482500,
  netProfit: 306000,
  profitMargin: 63.4,
}

const mockExpenses = {
  total: 148000,
  categories: [
    { id: 'staff', label: 'Staff Salaries', value: 82000, percent: 55 },
    { id: 'rent', label: 'Rent', value: 35000, percent: 24 },
    { id: 'products', label: 'Products', value: 18000, percent: 12 },
    { id: 'marketing', label: 'Marketing', value: 8500, percent: 6 },
    { id: 'other', label: 'Other', value: 4500, percent: 3 },
  ],
}

const mockInsights = [
  { id: 1, type: 'positive', icon: 'trending-up', title: 'Hair Spa revenue increased 24%', detail: 'Consider promoting Hair Spa during weekday afternoons.' },
  { id: 2, type: 'warning', icon: 'alert', title: 'Saturday evening capacity is 96%', detail: 'Consider extending staff availability.' },
  { id: 3, type: 'positive', icon: 'trending-down', title: 'No-show rate decreased 8%', detail: 'Your reminder workflow is performing well.' },
  { id: 4, type: 'star', icon: 'star', title: 'Bridal services generated the highest average ticket', detail: 'Consider creating a bridal package.' },
]

const mockCrossSell = [
  { service: 'Hair Spa', product: 'Hair Serum', likelihood: 42 },
  { service: 'Facial', product: 'Hydrating Face Serum', likelihood: 36 },
  { service: 'Manicure', product: 'Gel Nail Polish Set', likelihood: 28 },
]

function resolve(data) {
  const cloned = JSON.parse(JSON.stringify(data))
  if (!MOCK_DELAY) return Promise.resolve(cloned)
  return new Promise((resolvePromise) => setTimeout(() => resolvePromise(cloned), MOCK_DELAY))
}

// API-ready resolvers — each accepts a filters object for future backend integration.
export function getReportsOverview(_filters = {}) {
  return resolve(mockOverview)
}

export function getRevenueReport(_filters = {}) {
  return resolve(mockRevenue)
}

export function getServicePerformance(_filters = {}) {
  return resolve(mockServices)
}

export function getAppointmentReport(_filters = {}) {
  return resolve(mockAppointments)
}

export function getPeakHoursReport(_filters = {}) {
  return resolve(mockPeakHours)
}

export function getStaffPerformance(_filters = {}) {
  return resolve(mockStaff)
}

export function getCustomerInsights(_filters = {}) {
  return resolve(mockCustomers)
}

export function getProductPerformance(_filters = {}) {
  return resolve(mockProducts)
}

export function getInventoryReport(_filters = {}) {
  return resolve(mockInventory)
}

export function getPaymentReport(_filters = {}) {
  return resolve(mockPayments)
}

export function getDiscountReport(_filters = {}) {
  return resolve(mockDiscounts)
}

export function getCancellationReport(_filters = {}) {
  return resolve(mockLosses)
}

export function getProfitReport(_filters = {}) {
  return resolve(mockProfit)
}

export function getExpenseReport(_filters = {}) {
  return resolve(mockExpenses)
}

export function getBusinessInsights(_filters = {}) {
  return resolve(mockInsights)
}

export function getCrossSellInsights(_filters = {}) {
  return resolve(mockCrossSell)
}

export function getSalonType() {
  return resolve({ salonType })
}

export { dateRangeOptions }