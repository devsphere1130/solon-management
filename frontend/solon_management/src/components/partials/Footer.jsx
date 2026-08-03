import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import Container from '../common/Container.jsx'
import SocialIcon from '../common/SocialIcon.jsx'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Services', href: ROUTE_PATHS.services },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: ROUTE_PATHS.about },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms of service', href: '#' },
    ],
  },
]

const socialLinks = [
  { label: 'Twitter', icon: 'twitter', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'LinkedIn', icon: 'linkedin', href: '#' },
]

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <Logo tone="dark" />
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            The premium platform for running appointments, staff, billing and growth in one calm, connected workspace.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <SocialIcon name={icon} className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-text">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-sm text-text-muted transition-colors hover:text-text">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-text-muted transition-colors hover:text-text">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-text-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} DevSphere. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-text">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-text">
              Terms
            </a>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
