import {
  BarChart3,
  Bell,
  Boxes,
  Calendar,
  CalendarRange,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Package,
  Receipt,
  Scissors,
  Settings,
  UserRound,
  Users,
} from 'lucide-react'
import { ROUTE_PATHS } from './routeConfig.js'

export const adminNav = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', path: ROUTE_PATHS.appointments, icon: Calendar },
  { label: 'Calendar', path: ROUTE_PATHS.calendar, icon: CalendarRange },
  { label: 'Customers', path: ROUTE_PATHS.customers, icon: Users },
  { label: 'Services', path: ROUTE_PATHS.dashboardServices, icon: Scissors },
  { label: 'Staff', path: ROUTE_PATHS.staff, icon: UserRound },
  { label: 'Products', path: ROUTE_PATHS.dashboardProducts, icon: Package },
  { label: 'Inventory', path: '/inventory', icon: Boxes },
  { label: 'Billing', path: '/billing', icon: Receipt },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Marketing', path: '/marketing', icon: Megaphone },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
]
