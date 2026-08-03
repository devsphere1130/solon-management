import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import Container from '../common/Container.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { cn } from '../../lib/cn.js'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: ROUTE_PATHS.about },
]

function isHashLink(href) {
  return href.startsWith('#')
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <Link to={ROUTE_PATHS.login} className="text-sm font-semibold text-text-muted transition-colors hover:text-text">
            Sign in
          </Link>
          <Link to={ROUTE_PATHS.login} className={buttonClasses({ size: 'sm' })}>
            Start free trial
          </Link>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full text-text lg:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
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
    </header>
  )
}

export default Navbar
