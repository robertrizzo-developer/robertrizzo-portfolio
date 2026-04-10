import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { MemberProfile } from '@/services/api/types'
import { useApi } from '@/services/api/useApi'
import { getApiMode } from '@/services/api'

interface AuthState {
  member: MemberProfile | null
  loading: boolean
  setMember: (m: MemberProfile | null) => void
  refresh: () => Promise<void>
  login: (username: string, password: string) => Promise<MemberProfile>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const api = useApi()
  const [member, setMember] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      let m = await api.auth.getSessionMember()
      if (!m && getApiMode() === 'mock') {
        await api.auth.login('demo', 'demo123')
        m = await api.auth.getSessionMember()
      }
      setMember(m)
    } catch {
      setMember(null)
    } finally {
      setLoading(false)
    }
  }, [api])

  const login = useCallback(async (username: string, password: string): Promise<MemberProfile> => {
    await api.auth.login(username, password)
    const m = await api.auth.getSessionMember()
    if (!m) {
      await api.auth.logout()
      throw new Error('Inloggad, men inget medlemskonto hittades.')
    }
    setMember(m)
    return m
  }, [api])

  const logout = useCallback(async () => {
    await api.auth.logout()
    setMember(null)
  }, [api])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo(
    () => ({ member, loading, setMember, refresh, login, logout }),
    [member, loading, refresh, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
