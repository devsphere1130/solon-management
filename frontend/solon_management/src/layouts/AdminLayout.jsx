import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/partials/Sidebar.jsx'
import AdminHeader from '../components/partials/AdminHeader.jsx'
import { BillingProvider } from '../context/BillingContext.jsx'

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <BillingProvider>
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
    </BillingProvider>
  )
}

export default AdminLayout
