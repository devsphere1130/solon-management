import { Link } from 'react-router-dom'
import { CalendarDays, Heart, Package, Sparkles } from 'lucide-react'
import AccountShell from '../../components/account/AccountShell.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { useAppointments } from '../../context/useAppointments.js'
import { useWishlist } from '../../context/useWishlist.js'
import { useCart } from '../../context/useCart.js'
import { formatAppointmentDate, formatAppointmentTime } from '../../lib/appointmentUtils.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function AccountDashboard() {
  const { counts, upcomingAppointments } = useAppointments()
  const { count: wishlistCount } = useWishlist()
  const { totals } = useCart()
  const nextAppointment = upcomingAppointments[0]

  return (
    <AccountShell
      title="Account Dashboard"
      description="Your salon visits, product activity, and saved items in one calm place."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard icon={CalendarDays} label="Upcoming" value={counts.upcoming} />
          <SummaryCard icon={Package} label="Cart Items" value={totals.itemCount} />
          <SummaryCard icon={Heart} label="Wishlist" value={wishlistCount} />
        </div>

        {nextAppointment ? (
          <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-6 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Your Next Visit</p>
            <h2 className="mt-3 text-2xl font-extrabold text-[#241915]">{nextAppointment.service.name}</h2>
            <p className="mt-2 text-sm font-semibold text-[#6f5f57]">
              {formatAppointmentDate(nextAppointment.date)} at {formatAppointmentTime(nextAppointment.time)} with {nextAppointment.professional.name}
            </p>
            <Link to={`${ROUTE_PATHS.accountAppointments}/${nextAppointment.id}`} className={buttonClasses({ className: 'mt-5 bg-[#241915] hover:bg-[#3a2b24]' })}>
              View Appointment
            </Link>
          </section>
        ) : (
          <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-8 text-center shadow-soft">
            <Sparkles className="mx-auto size-8 text-[#9b5639]" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold text-[#241915]">Ready for your next salon visit?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f5f57]">Book a service and it will appear here automatically.</p>
            <Link to={ROUTE_PATHS.services} className={buttonClasses({ className: 'mt-5 bg-[#241915] hover:bg-[#3a2b24]' })}>
              Explore Services
            </Link>
          </section>
        )}
      </div>
    </AccountShell>
  )
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[1.25rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
      <Icon className="size-5 text-[#9b5639]" aria-hidden="true" />
      <p className="mt-4 text-3xl font-extrabold text-[#241915]">{value}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8b7a72]">{label}</p>
    </article>
  )
}

export default AccountDashboard
