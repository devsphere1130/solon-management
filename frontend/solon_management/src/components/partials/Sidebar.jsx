import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronsLeft, ChevronsRight, X } from 'lucide-react'
import Logo from '../brand/Logo.jsx'
import { adminNav } from '../../routes/adminNav.js'
import { cn } from '../../lib/cn.js'

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white',
          isActive && 'bg-primary/20 text-white',
          collapsed && 'justify-center px-0',
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
          {item.label}
        </span>
      )}
    </NavLink>
  )
}

function SidebarContent({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Admin">
      {adminNav.map((item) => (
        <NavItem key={item.path} item={item} collapsed={collapsed} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}

function Sidebar({ collapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  return (
    <>
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-sidebar transition-[width] duration-300 lg:flex',
          collapsed ? 'w-20' : 'w-64',
        )}
      >
        <div className={cn('flex h-18 items-center border-b border-white/10 px-4', collapsed && 'justify-center px-0')}>
          <Logo tone="light" showWordmark={!collapsed} />
        </div>

        <SidebarContent collapsed={collapsed} />

        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center gap-2 border-t border-white/10 py-4 text-xs font-semibold text-white/50 transition-colors hover:text-white"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight className="size-4" aria-hidden="true" /> : <ChevronsLeft className="size-4" aria-hidden="true" />}
        </button>
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar lg:hidden"
            >
              <div className="flex h-18 items-center justify-between border-b border-white/10 px-4">
                <Logo tone="light" />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center rounded-full text-white/70 hover:text-white"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              <SidebarContent collapsed={false} onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
