const MOCK_DELAY = 500

const mockOverview = {
  kpis: [
    { label: 'Total Revenue', value: '₹2,45,800', change: '+18.4%', period: 'vs last month' },
    { label: "Today's Appointments", value: '38', change: '+6.1%', period: 'vs yesterday' },
    { label: 'Total Customers', value: '3,214', change: '+9.8%', period: 'vs last month' },
    { label: 'Active Staff', value: '14', change: '+2', period: 'this quarter' },
  ],
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
  upcomingAppointments: [
    { customer: 'Ananya Rao', service: 'Hair Spa', staff: 'Meera', time: '10:30 AM', status: 'Confirmed' },
    { customer: 'James Carter', service: 'Haircut', staff: 'Alex', time: '11:15 AM', status: 'Pending' },
    { customer: 'Priya Menon', service: 'Facial', staff: 'Ritu', time: '12:00 PM', status: 'Confirmed' },
    { customer: 'Marcus Bell', service: 'Beard Trim', staff: 'Alex', time: '1:30 PM', status: 'Confirmed' },
  ],
}

// Stubbed until a real backend exists — swap for api.get('/dashboard/overview').
export function getDashboardOverview() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOverview), MOCK_DELAY)
  })
}
