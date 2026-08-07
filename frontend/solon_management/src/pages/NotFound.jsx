import { Link } from 'react-router-dom'
import { CompassIcon } from 'lucide-react'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

function NotFound() {
  return (
    <Container as="section" className="flex max-w-xl flex-col items-center py-32 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CompassIcon className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-bold tracking-wide text-primary uppercase">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">Page not found</h1>
      <p className="mt-4 text-base text-text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to={ROUTE_PATHS.home} className={buttonClasses({ className: 'mt-8' })}>
        Back to home
      </Link>
    </Container>
  )
}

export default NotFound
