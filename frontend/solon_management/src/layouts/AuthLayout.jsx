import { Link, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'
import Logo from '../components/brand/Logo.jsx'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary px-4 py-12">
      <div
        className="pointer-events-none absolute -top-32 -right-24 size-[26rem] rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 size-[22rem] rounded-full bg-accent/25 blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link to={ROUTE_PATHS.home} className="mb-8 flex justify-center">
          <Logo tone="light" />
        </Link>

        <div className="rounded-3xl border border-white/10 bg-card p-8 shadow-2xl">
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}

export default AuthLayout
