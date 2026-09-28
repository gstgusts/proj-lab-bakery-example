import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { initKeycloak, keycloak } from './keycloak.ts'

export interface AuthUser {
  username: string
  name: string
  email: string
}

interface AuthState {
  ready: boolean
  authenticated: boolean
  user: AuthUser | null
  login: () => void
  logout: () => void
  getToken: () => Promise<string | undefined>
}

const AuthContext = createContext<AuthState | null>(null)

function readUser(): AuthUser | null {
  const t = keycloak.tokenParsed
  if (!t) return null
  return {
    username: t.preferred_username ?? '',
    name: t.name ?? '',
    email: t.email ?? '',
  }
}

const login = () => keycloak.login()

const logout = () => keycloak.logout({ redirectUri: window.location.origin })

async function getToken(): Promise<string | undefined> {
  if (!keycloak.authenticated) return undefined
  await keycloak.updateToken(30)
  return keycloak.token
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => setAuthenticated(false))
    }
    initKeycloak()
      .then((auth) => setAuthenticated(auth))
      .catch(() => setError('Could not connect to the authentication server.'))
      .finally(() => setReady(true))
  }, [])

  const value: AuthState = {
    ready,
    authenticated,
    user: authenticated ? readUser() : null,
    login,
    logout,
    getToken,
  }

  if (error) return <p className="error content">{error}</p>

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
