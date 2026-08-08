import { NavLink, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  UserRound,
} from 'lucide-react'
import Container from '../common/Container.jsx'
import { cn } from '../../lib/cn.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAppointments } from '../../context/useAppointments.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

const accountNav = [
  { label: 'Dashboard', path: ROUTE_PATHS.account, icon: LayoutDashboard },
  { label: 'Appointments', path: ROUTE_PATHS.accountAppointments, icon: CalendarDays, countKey: 'upcoming' },
  { label: 'Orders', path: ROUTE_PATHS.accountOrders, icon: Package },
  { label: 'Wishlist', path: ROUTE_PATHS.accountWishlist, icon: Heart },
  { label: 'Profile', path: ROUTE_PATHS.accountProfile, icon: UserRound },
  { label: 'Settings', path: ROUTE_PATHS.accountSettings, icon: Settings },
]

function AccountShell({ title = 'My Account', description, children }) {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { counts } = useAppointments()

  async function handleSignOut() {
    await logout()
    navigate(ROUTE_PATHS.home)
  }

  return (
    <div className="bg-[#fffaf7]">
      <section className="border-b border-[#eadfd6] bg-[#fffaf7] py-10 sm:py-12">
        <Container>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">My Account</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#241915] sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f5f57]">{description}</p>}
        </Container>
      </section>

      <Container className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.35rem] border border-[#eadfd6] bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3 border-b border-[#eadfd6] pb-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-[#fff1e8] text-sm font-extrabold text-[#9b5639]">
                {(user?.name?.[0] ?? 'G').toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#241915]">{user?.name ?? 'Guest Customer'}</p>
                <p className="truncate text-xs text-[#6f5f57]">{user?.email ?? 'Appointments saved on this device'}</p>
              </div>
            </div>

            <nav className="premium-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Account">
              {accountNav.map((item) => {
                const Icon = item.icon
                const count = item.countKey ? counts[item.countKey] : 0

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === ROUTE_PATHS.account}
                    className={({ isActive }) =>
                      cn(
                        'flex min-w-max items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors lg:min-w-0',
                        isActive ? 'bg-[#fff1e8] text-[#9b5639]' : 'text-[#6f5f57] hover:bg-[#fffaf7] hover:text-[#241915]',
                      )
                    }
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                    {count > 0 && (
                      <span className="ml-auto rounded-full bg-[#edf4ec] px-2 py-0.5 text-[11px] font-extrabold text-[#4f664f]">
                        {count}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-4 flex w-full items-center gap-2 rounded-xl border border-[#eadfd6] px-3 py-2.5 text-sm font-bold text-[#6f5f57] transition-colors hover:bg-[#fffaf7] hover:text-[#241915]"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign Out
              </button>
            )}
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </Container>
    </div>
  )
}

export default AccountShell
