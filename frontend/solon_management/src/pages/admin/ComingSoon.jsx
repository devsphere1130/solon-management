import { useLocation } from 'react-router-dom'
import { Hourglass } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState.jsx'
import { adminNav } from '../../routes/adminNav.js'

function ComingSoon() {
  const { pathname } = useLocation()
  const label = adminNav.find((item) => item.path === pathname)?.label ?? 'This page'

  return (
    <EmptyState
      icon={Hourglass}
      title={`${label} is coming soon`}
      description="This module is on the roadmap and isn't built yet. Check back soon."
    />
  )
}

export default ComingSoon
