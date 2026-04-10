import type { AuthApi } from '../contracts'
import type { MemberProfile, RegisterPayload } from '../types'
import { mockDelay } from './delay'
import {
  addMember,
  getMembers,
  getSessionMemberId,
  nextMemberId,
  setSessionMemberId,
} from './state'

export function createMockAuthApi(): AuthApi {
  return {
    async warmupCsrf(): Promise<void> {
      await mockDelay()
    },

    async login(username: string, password: string): Promise<void> {
      await mockDelay()
      const user = getMembers().find((m) => m.username === username && m.password === password)
      if (!user) throw new Error('Invalid username or password')
      setSessionMemberId(user.id)
    },

    async logout(): Promise<void> {
      await mockDelay()
      setSessionMemberId(null)
    },

    async register(payload: RegisterPayload): Promise<void> {
      await mockDelay()
      if (getMembers().some((m) => m.username === payload.username)) {
        throw new Error('Username already taken')
      }
      if (getMembers().some((m) => m.email === payload.email)) {
        throw new Error('Email already registered')
      }
      const id = nextMemberId()
      addMember({
        id,
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: payload.password,
        role: 'ROLE_MEMBER',
        demo: false,
        profileVisible: true,
        createdAt: new Date().toISOString().slice(0, 10),
      })
    },

    async getSessionMember(): Promise<MemberProfile | null> {
      await mockDelay()
      const id = getSessionMemberId()
      if (id === null) return null
      const user = getMembers().find((m) => m.id === id)
      if (!user) return null
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'ROLE_MEMBER',
        profileVisible: user.profileVisible,
        createdAt: user.createdAt,
        demo: user.demo,
        emailNotifications: user.emailNotifications ?? true,
      }
    },
  }
}
