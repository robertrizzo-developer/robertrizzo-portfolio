import type { MemberApi } from '../contracts'
import type { MemberProfile, MemberStats } from '../types'
import { requestJson } from '../httpClient'

export function createLiveMemberApi(): MemberApi {
  return {
    getProfile(memberId: number): Promise<MemberProfile> {
      return requestJson<MemberProfile>('GET', `/memberPage/${memberId}/profile`)
    },

    getStats(memberId: number): Promise<MemberStats> {
      return requestJson<MemberStats>('GET', `/memberPage/${memberId}/stats`)
    },

    updateProfile(memberId: number, data: Partial<MemberProfile>): Promise<MemberProfile> {
      return requestJson<MemberProfile>('PUT', `/memberPage/${memberId}/profile`, { body: data })
    },
  }
}
