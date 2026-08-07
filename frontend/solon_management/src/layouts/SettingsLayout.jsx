import { NavLink, Outlet } from 'react-router-dom'
import { Image, Palette } from 'lucide-react'
import { ROUTE_PATHS } from '../routes/routeConfig.js'
import { cn } from '../lib/cn.js'

const tabs = [
  { label: 'Appearance', path: ROUTE_PATHS.settingsAppearance, icon: Palette },
  { label: 'Landing Page', path: ROUTE_PATHS.settingsLandingPage, icon: Image },
]

function SettingsLayout() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Settings</h1>
        <p className="mt-1 text-sm text-text-muted">Manage how DevSphere looks and feels for your team.</p>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:text-text',
                isActive && 'border-primary text-primary',
              )
            }
          >
            <tab.icon className="size-4" aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}

export default SettingsLayout
