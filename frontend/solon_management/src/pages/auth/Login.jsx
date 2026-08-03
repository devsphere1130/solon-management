import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })
      const redirectTo = location.state?.from?.pathname ?? ROUTE_PATHS.dashboard
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-text">Welcome back</h1>
      <p className="mt-1.5 text-sm text-text-muted">Sign in to your DevSphere workspace.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@salon.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            Remember me
          </label>
          <a href="#" className="font-semibold text-primary hover:text-primary/80">
            Forgot password?
          </a>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        New to DevSphere?{' '}
        <Link to={ROUTE_PATHS.home} className="font-semibold text-primary hover:text-primary/80">
          Start your free trial
        </Link>
      </p>
    </div>
  )
}

export default Login
