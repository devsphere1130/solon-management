import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Check,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  UserRound,
  X,
} from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Container from '../common/Container.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { useCart } from '../../context/useCart.js'
import { useWishlist } from '../../context/useWishlist.js'
import { useAppointments } from '../../context/useAppointments.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { cn } from '../../lib/cn.js'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Services', href: ROUTE_PATHS.services },
  { label: 'Gallery', href: ROUTE_PATHS.gallery },
  { label: 'Products', href: ROUTE_PATHS.products },
  { label: 'How it works', href: ROUTE_PATHS.howItWorks },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: ROUTE_PATHS.about },
]

function isHashLink(href) {
  return href.startsWith('#')
}

function userInitial(user) {
  return (user?.name?.trim()?.[0] ?? user?.email?.trim()?.[0] ?? 'U').toUpperCase()
}

function AccountMenu({ user, counts, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)

  const items = [
    { label: 'Dashboard', href: ROUTE_PATHS.account, icon: LayoutDashboard },
    { label: 'My Appointments', href: ROUTE_PATHS.accountAppointments, icon: CalendarDays, count: counts.upcoming ? `${counts.upcoming} upcoming` : '' },
    { label: 'My Orders', href: ROUTE_PATHS.accountOrders, icon: Package },
    { label: 'My Wishlist', href: ROUTE_PATHS.accountWishlist, icon: Heart },
    { label: 'My Profile', href: ROUTE_PATHS.accountProfile, icon: UserRound },
    { label: 'Account Settings', href: ROUTE_PATHS.accountSettings, icon: Settings },
  ]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex h-10 items-center gap-2 rounded-full border border-border bg-white pr-3 pl-1.5 text-sm font-extrabold text-text transition-colors hover:bg-background"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-[#fff1e8] text-xs text-[#9b5639]">{userInitial(user)}</span>
        <span className="max-w-32 truncate">{user?.name ?? 'Account'}</span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border p-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-[#fff1e8] text-sm font-extrabold text-[#9b5639]">{userInitial(user)}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-text">{user?.name ?? 'Customer'}</p>
                <p className="truncate text-xs text-text-muted">{user?.email ?? 'Signed in'}</p>
              </div>
            </div>

            <div className="p-2">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-background hover:text-text"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.count && <span className="ml-auto rounded-full bg-[#fff1e8] px-2 py-0.5 text-[11px] font-extrabold text-[#9b5639]">{item.count}</span>}
                  </Link>
                )
              })}
            </div>

            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onSignOut()
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-text-muted transition-colors hover:bg-background hover:text-text"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotificationsMenu({ notifications, unreadCount, onOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  function toggleOpen() {
    setIsOpen((open) => !open)
    if (!isOpen) onOpen()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={`Open notifications${unreadCount ? ` with ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        className="relative flex size-10 items-center justify-center rounded-full border border-border bg-white text-text transition-colors hover:bg-background"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#9b5639] px-1.5 text-[11px] font-extrabold text-white">{unreadCount}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Notifications</p>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {notifications.length > 0 ? (
                notifications.slice(0, 6).map((notification) => (
                  <Link
                    key={notification.id}
                    to={`${ROUTE_PATHS.accountAppointments}/${notification.appointmentId}`}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-background"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf4ec] text-[#4f664f]">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold text-text">{notification.title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-text-muted">{notification.detail}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-sm font-semibold text-text-muted">No appointment notifications yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { totals } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { counts, notifications, unreadNotificationCount, markNotificationsRead } = useAppointments()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  async function handleSignOut() {
    await logout()
    navigate(ROUTE_PATHS.home)
  }

  return (
    <>
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-navbar/90 shadow-soft backdrop-blur-md' : 'bg-navbar/0',
      )}
    >
      <Container className="flex h-18 items-center justify-between py-4">
        <Link to={ROUTE_PATHS.home} aria-label="DevSphere home" className="shrink-0">
          <Logo tone="dark" wordmarkClassName="hidden min-[360px]:inline" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) =>
            isHashLink(link.href) ? (
              location.pathname === ROUTE_PATHS.home ? (
                <a key={link.label} href={link.href} className="text-sm font-semibold text-text-muted transition-colors hover:text-text">
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={`${ROUTE_PATHS.home}${link.href}`}
                  className="text-sm font-semibold text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              )
            ) : (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  cn('text-sm font-semibold text-text-muted transition-colors hover:text-text', isActive && 'text-text')
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to={ROUTE_PATHS.wishlist}
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-white text-text transition-colors hover:bg-background"
            aria-label={`Open wishlist with ${wishlistCount} products`}
          >
            <Heart className="size-4" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#9b5639] px-1.5 text-[11px] font-extrabold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex size-10 items-center justify-center rounded-full border border-border bg-white text-text transition-colors hover:bg-background"
            aria-label={`Open cart with ${totals.itemCount} items`}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            {totals.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#9b5639] px-1.5 text-[11px] font-extrabold text-white">
                {totals.itemCount}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <NotificationsMenu
                notifications={notifications}
                unreadCount={unreadNotificationCount}
                onOpen={markNotificationsRead}
              />
              <AccountMenu user={user} counts={counts} onSignOut={handleSignOut} />
            </>
          ) : (
            <>
              <Link to={ROUTE_PATHS.login} className="text-sm font-semibold text-text-muted transition-colors hover:text-text">
                Sign in
              </Link>
              <Link to={ROUTE_PATHS.login} className={buttonClasses({ size: 'sm' })}>
                Start free trial
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 min-[360px]:gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex size-10 items-center justify-center rounded-full text-text"
            aria-label={`Open cart with ${totals.itemCount} items`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {totals.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#9b5639] px-1.5 text-[11px] font-extrabold text-white">
                {totals.itemCount}
              </span>
            )}
          </button>
          {isAuthenticated && (
            <NotificationsMenu
              notifications={notifications}
              unreadCount={unreadNotificationCount}
              onOpen={markNotificationsRead}
            />
          )}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-text"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-navbar lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) =>
                isHashLink(link.href) ? (
                  location.pathname === ROUTE_PATHS.home ? (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      to={`${ROUTE_PATHS.home}${link.href}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
                    >
                      {link.label}
                    </Link>
                  )
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
                  >
                    {link.label}
                  </NavLink>
                ),
              )}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsCartOpen(true)
                }}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
              >
                Cart
                <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-xs font-extrabold text-[#9b5639]">{totals.itemCount}</span>
              </button>
              <NavLink
                to={ROUTE_PATHS.wishlist}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
              >
                Wishlist
                <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-xs font-extrabold text-[#9b5639]">{wishlistCount}</span>
              </NavLink>
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-background px-3 py-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-[#fff1e8] text-xs font-extrabold text-[#9b5639]">{userInitial(user)}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold text-text">{user?.name ?? 'Account'}</span>
                        <span className="block truncate text-xs text-text-muted">{user?.email ?? 'Signed in'}</span>
                      </span>
                    </div>
                    <NavLink to={ROUTE_PATHS.account} className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text">
                      Dashboard
                    </NavLink>
                    <NavLink to={ROUTE_PATHS.accountAppointments} className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text">
                      My Appointments
                      {counts.upcoming > 0 && <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-xs font-extrabold text-[#9b5639]">{counts.upcoming} upcoming</span>}
                    </NavLink>
                    <NavLink to={ROUTE_PATHS.accountOrders} className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text">
                      My Orders
                    </NavLink>
                    <NavLink to={ROUTE_PATHS.accountWishlist} className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text">
                      My Wishlist
                    </NavLink>
                    <NavLink to={ROUTE_PATHS.accountProfile} className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text">
                      My Profile
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTE_PATHS.login}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-text-muted hover:text-text"
                    >
                      Sign in
                    </Link>
                    <Link to={ROUTE_PATHS.login} className={buttonClasses({ className: 'w-full' })} onClick={() => setIsMenuOpen(false)}>
                      Start free trial
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navbar
