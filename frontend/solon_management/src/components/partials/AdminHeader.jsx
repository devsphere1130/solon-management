import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, LogOut, Menu, Search, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

const notifications = [
  { title: 'New appointment booked', detail: 'Ananya Rao · Hair Spa · 10:30 AM', time: '5m ago' },
  { title: 'Low stock alert', detail: 'Argan Oil Shampoo has 3 units left', time: '1h ago' },
  { title: 'Payment received', detail: '₹1,800 from James Carter', time: '2h ago' },
]

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, onOutside])
}

function AdminHeader({ onOpenMobileMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const notificationsRef = useRef(null)
  const userMenuRef = useRef(null)

  useClickOutside(notificationsRef, () => setIsNotificationsOpen(false))
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false))

  async function handleLogout() {
    await logout()
    navigate(ROUTE_PATHS.login, { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-full text-text-muted hover:text-text lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <label className="hidden items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-text-muted sm:flex">
          <Search className="size-4" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search customers, appointments…"
            className="w-56 bg-transparent outline-none placeholder:text-text-muted"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            className="relative flex size-10 items-center justify-center rounded-full text-text-muted hover:bg-background hover:text-text"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-danger" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-40 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              >
                <div className="border-b border-border px-4 py-3 text-sm font-bold text-text">Notifications</div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <li key={item.title} className="border-b border-border px-4 py-3 last:border-none hover:bg-background">
                      <p className="text-sm font-semibold text-text">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{item.detail}</p>
                      <p className="mt-1 text-[11px] text-text-muted">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            aria-expanded={isUserMenuOpen}
            className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-background"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? <User className="size-4" aria-hidden="true" />}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-text">{user?.name ?? 'Account'}</span>
              <span className="block text-xs text-text-muted">{user?.email}</span>
            </span>
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-40 mt-3 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-danger hover:bg-danger/5"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
