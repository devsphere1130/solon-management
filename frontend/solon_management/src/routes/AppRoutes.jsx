import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import SettingsLayout from '../layouts/SettingsLayout.jsx'
import PageLoader from '../components/common/PageLoader.jsx'
import ErrorBoundary from '../components/common/ErrorBoundary.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { adminNav } from './adminNav.js'
import { ROUTE_PATHS } from './routeConfig.js'

const LandingPage = lazy(() => import('../pages/LandingPage.jsx'))
const About = lazy(() => import('../pages/About.jsx'))
const Services = lazy(() => import('../pages/Services.jsx'))
const HowItWorks = lazy(() => import('../pages/HowItWorks.jsx'))
const Gallery = lazy(() => import('../pages/Gallery.jsx'))
const Products = lazy(() => import('../pages/Products.jsx'))
const ProductDetails = lazy(() => import('../pages/ProductDetails.jsx'))
const Cart = lazy(() => import('../pages/Cart.jsx'))
const Wishlist = lazy(() => import('../pages/Wishlist.jsx'))
const AccountDashboard = lazy(() => import('../pages/account/AccountDashboard.jsx'))
const MyAppointments = lazy(() => import('../pages/account/MyAppointments.jsx'))
const AppointmentDetails = lazy(() => import('../pages/account/AppointmentDetails.jsx'))
const AccountPlaceholder = lazy(() => import('../pages/account/AccountPlaceholder.jsx'))
const NotFound = lazy(() => import('../pages/NotFound.jsx'))
const Login = lazy(() => import('../pages/auth/Login.jsx'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard.jsx'))
const Appointments = lazy(() => import('../pages/admin/Appointments.jsx'))
const Calendar = lazy(() => import('../pages/admin/Calendar.jsx'))
const Customers = lazy(() => import('../pages/admin/Customers.jsx'))
const Staff = lazy(() => import('../pages/admin/Staff.jsx'))
const Inventory = lazy(() => import('../pages/admin/Inventory.jsx'))
const Reports = lazy(() => import('../pages/admin/Reports.jsx'))
const Billing = lazy(() => import('../pages/admin/Billing.jsx'))
const Payments = lazy(() => import('../pages/admin/Payments.jsx'))
const ComingSoon = lazy(() => import('../pages/admin/ComingSoon.jsx'))
const ServicesManagement = lazy(() => import('../pages/admin/ServicesManagement.jsx'))
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement.jsx'))
const GalleryManagement = lazy(() => import('../pages/admin/GalleryManagement.jsx'))
const Appearance = lazy(() => import('../pages/admin/settings/Appearance.jsx'))
const LandingPageSettings = lazy(() => import('../pages/admin/settings/LandingPageSettings.jsx'))

function getAdminElement(path) {
  if (path === ROUTE_PATHS.dashboard) {
    return <Dashboard />
  }

  if (path === ROUTE_PATHS.dashboardServices) {
    return <ServicesManagement />
  }

  if (path === ROUTE_PATHS.dashboardProducts) {
    return <ProductManagement />
  }

  if (path === ROUTE_PATHS.adminGallery) {
    return <GalleryManagement />
  }

  if (path === ROUTE_PATHS.appointments) {
    return <Appointments />
  }

  if (path === ROUTE_PATHS.calendar) {
    return <Calendar />
  }

  if (path === ROUTE_PATHS.customers) {
    return <Customers />
  }

  if (path === ROUTE_PATHS.staff) {
    return <Staff />
  }

  if (path === ROUTE_PATHS.inventory) {
    return <Inventory />
  }

  if (path === '/reports') {
    return <Reports />
  if (path === ROUTE_PATHS.billing) {
    return <Billing />
  }

  if (path === ROUTE_PATHS.payments) {
    return <Payments />
  }

  return <ComingSoon />
}

function AppRoutes() {
  const location = useLocation()

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTE_PATHS.home} element={<LandingPage />} />
            <Route path={ROUTE_PATHS.about} element={<About />} />
            <Route path={ROUTE_PATHS.services} element={<Services />} />
            <Route path={ROUTE_PATHS.howItWorks} element={<HowItWorks />} />
            <Route path={ROUTE_PATHS.gallery} element={<Gallery />} />
            <Route path={ROUTE_PATHS.products} element={<Products />} />
            <Route path={ROUTE_PATHS.productDetails} element={<ProductDetails />} />
            <Route path={ROUTE_PATHS.cart} element={<Cart />} />
            <Route path={ROUTE_PATHS.wishlist} element={<Wishlist />} />
            <Route path={ROUTE_PATHS.account} element={<AccountDashboard />} />
            <Route path={ROUTE_PATHS.accountAppointments} element={<MyAppointments />} />
            <Route path={ROUTE_PATHS.accountAppointmentDetails} element={<AppointmentDetails />} />
            <Route path={ROUTE_PATHS.accountOrders} element={<AccountPlaceholder />} />
            <Route path={ROUTE_PATHS.accountWishlist} element={<AccountPlaceholder />} />
            <Route path={ROUTE_PATHS.accountProfile} element={<AccountPlaceholder />} />
            <Route path={ROUTE_PATHS.accountSettings} element={<AccountPlaceholder />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path={ROUTE_PATHS.login} element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              {adminNav
                .filter((item) => item.path !== ROUTE_PATHS.settings)
                .map((item) => (
                  <Route
                    key={item.path}
                    path={item.path}
                    element={getAdminElement(item.path)}
                  />
                ))}

              <Route path={ROUTE_PATHS.settings} element={<SettingsLayout />}>
                <Route index element={<Navigate to={ROUTE_PATHS.settingsAppearance} replace />} />
                <Route path="appearance" element={<Appearance />} />
                <Route path="landing-page" element={<LandingPageSettings />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default AppRoutes
