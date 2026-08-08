import { Outlet } from 'react-router-dom'
import Navbar from '../components/partials/Navbar.jsx'
import Footer from '../components/partials/Footer.jsx'
import ScrollToTopButton from '../components/common/ScrollToTopButton.jsx'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default PublicLayout
