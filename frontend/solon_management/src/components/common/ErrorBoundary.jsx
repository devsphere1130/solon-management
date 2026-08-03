import { Component } from 'react'
import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { buttonClasses } from '../../lib/buttonClasses.js'

class ErrorBoundary extends Component {
  state = {
    error: null,
    resetKey: this.props.resetKey,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey }
    }

    return null
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error(error, errorInfo)
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-text">Something went wrong</h1>
            <p className="mt-1 text-sm text-text-muted">
              {this.state.error?.message || 'Please try again from the home page.'}
            </p>
          </div>
          <Link to={ROUTE_PATHS.home} className={buttonClasses({ size: 'sm' })}>
            Back to home
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
