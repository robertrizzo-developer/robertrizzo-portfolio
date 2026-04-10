import type { AuthApi } from '../contracts'
import type { MemberProfile, RegisterPayload } from '../types'
import { ApiError, httpRequest, parseJsonOrEmpty, warmupCsrfCookie } from '../httpClient'

function formBody(params: Record<string, string>): string {
  return new URLSearchParams(params).toString()
}

function assertRedirectOk(res: Response, action: string): void {
  if (res.status === 302 || res.status === 301) {
    const loc = res.headers.get('Location') ?? ''
    if (loc.includes('error=true')) {
      throw new ApiError('Invalid username or password', 401)
    }
    return
  }
  if (!res.ok) {
    throw new ApiError(`${action} failed (${res.status})`, res.status)
  }
}

export function createLiveAuthApi(): AuthApi {
  return {
    warmupCsrf: warmupCsrfCookie,

    async login(username: string, password: string): Promise<void> {
      await warmupCsrfCookie()
      const body = formBody({ username, password })
      const res = await httpRequest('POST', '/login', {
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
      })
      assertRedirectOk(res, 'Login')
    },

    async logout(): Promise<void> {
      const res = await httpRequest('POST', '/logout', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: '',
        redirect: 'manual',
      })
      if (res.status === 302 || res.status === 301 || res.ok) return
      throw new ApiError(`Logout failed (${res.status})`, res.status)
    },

    async register(payload: RegisterPayload): Promise<void> {
      await warmupCsrfCookie()
      const body = formBody({
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
      })
      const res = await httpRequest('POST', '/register', {
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'manual',
      })
      if (res.status === 302 || res.status === 301 || res.ok) return
      throw new ApiError(`Register failed (${res.status})`, res.status)
    },

    async getSessionMember(): Promise<MemberProfile | null> {
      const res = await httpRequest('GET', '/memberPage/me')
      if (res.status === 401 || res.status === 403) return null
      if (!res.ok) {
        const text = await res.text()
        throw new ApiError(text || res.statusText, res.status, text)
      }
      const basic = (await parseJsonOrEmpty<MemberProfile>(res)) as MemberProfile | null
      if (!basic) return null

      // Enrich with full user data (firstName, lastName, role, etc.)
      try {
        const full = await httpRequest('GET', `/memberPage/${basic.id}`)
        if (full.ok) {
          const user = (await parseJsonOrEmpty<MemberProfile>(full)) as MemberProfile | null
          if (user) return { ...basic, ...user }
        }
      } catch {
        // Fall back to basic profile if enrichment fails
      }
      return basic
    },
  }
}
