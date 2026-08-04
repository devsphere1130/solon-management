import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, ShoppingBag, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Container from '../common/Container.jsx'
import CartDrawer from '../cart/CartDrawer.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { useCart } from '../../context/useCart.js'
import { useWishlist } from '../../context/useWishlist.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { cn } from '../../lib/cn.js'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Services', href: ROUTE_PATHS.services },
  { label: 'Products', href: ROUTE_PATHS.products },
  { label: 'How it works', href: ROUTE_PATHS.howItWorks },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: ROUTE_PATHS.about },
]

function isHashLink(href) {
  return href.startsWith('#')
}

function Navbar() {
  const { totals } = useCart()
  const { count: wishlistCount } = useWishlist()
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

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-navbar/90 shadow-soft backdrop-blur-md' : 'bg-navbar/0',
      )}
    >
      <Container className="flex h-18 items-center justify-between py-4">
        <Link to={ROUTE_PATHS.home} aria-label="DevSphere home">
          <Logo tone="dark" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) =>
            isHashLink(link.href) ? (
              <a key={link.label} href={link.href} className="text-sm font-semibold text-text-muted transition-colors hover:text-text">
                {link.label}
              </a>
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
          <Link to={ROUTE_PATHS.login} className="text-sm font-semibold text-text-muted transition-colors hover:text-text">
            Sign in
          </Link>
          <Link to={ROUTE_PATHS.login} className={buttonClasses({ size: 'sm' })}>
            Start free trial
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to={ROUTE_PATHS.wishlist}
            className="relative flex size-10 items-center justify-center rounded-full text-text"
            aria-label={`Open wishlist with ${wishlistCount} products`}
          >
            <Heart className="size-5" aria-hidden="true" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-[#9b5639] px-1.5 text-[11px] font-extrabold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
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
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-semibold text-text-muted hover:bg-background hover:text-text"
                  >
                    {link.label}
                  </a>
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
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

export default Navbar
