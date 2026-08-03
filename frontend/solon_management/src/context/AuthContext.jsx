import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as authService from '../services/authService.js'

const STORAGE_KEY = 'devsphere_auth_token'
const USER_STORAGE_KEY = 'devsphere_auth_user'

const AuthContext = createContext(null)

function readStoredUser() {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [user, setUser] = useState(readStoredUser)

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials)
    localStorage.setItem(STORAGE_KEY, result.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
    setToken(result.token)
    setUser(result.user)
    return result
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(token), login, logout }),
    [user, token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
