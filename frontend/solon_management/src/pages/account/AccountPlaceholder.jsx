import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import AccountShell from '../../components/account/AccountShell.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

const pageCopy = {
  [ROUTE_PATHS.accountOrders]: {
    title: 'My Orders',
    description: 'Product order management will appear here when checkout is connected.',
    action: 'Open Cart',
    href: ROUTE_PATHS.cart,
  },
  [ROUTE_PATHS.accountWishlist]: {
    title: 'My Wishlist',
    description: 'Your saved product collection is ready in the product wishlist.',
    action: 'Open Wishlist',
    href: ROUTE_PATHS.wishlist,
  },
  [ROUTE_PATHS.accountProfile]: {
    title: 'My Profile',
    description: 'Profile editing will connect here when customer profile APIs are available.',
    action: 'Book a Service',
    href: ROUTE_PATHS.services,
  },
  [ROUTE_PATHS.accountSettings]: {
    title: 'Account Settings',
    description: 'Notification, privacy, and account preferences will live here.',
    action: 'View Appointments',
    href: ROUTE_PATHS.accountAppointments,
  },
}

function AccountPlaceholder() {
  const location = useLocation()
  const content = pageCopy[location.pathname] ?? pageCopy[ROUTE_PATHS.accountProfile]

  return (
    <AccountShell title={content.title} description={content.description}>
      <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
        <Sparkles className="mx-auto size-8 text-[#9b5639]" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-extrabold text-[#241915]">{content.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f5f57]">{content.description}</p>
        <Link to={content.href} className={buttonClasses({ className: 'mt-6 bg-[#241915] hover:bg-[#3a2b24]' })}>
          {content.action}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </AccountShell>
  )
}

export default AccountPlaceholder
