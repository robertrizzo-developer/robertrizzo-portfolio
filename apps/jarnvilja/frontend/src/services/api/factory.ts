import type { AppApi } from './contracts'
import { createLiveAuthApi } from './live/liveAuthApi'
import { createLiveBookingApi } from './live/liveBookingApi'
import { createLiveMemberApi } from './live/liveMemberApi'
import { createMockAuthApi } from './mock/mockAuthApi'
import { createMockBookingApi } from './mock/mockBookingApi'
import { createMockMemberApi } from './mock/mockMemberApi'

function createLiveApi(): AppApi {
  return {
    auth: createLiveAuthApi(),
    booking: createLiveBookingApi(),
    member: createLiveMemberApi(),
  }
}

function createMockApi(): AppApi {
  return {
    auth: createMockAuthApi(),
    booking: createMockBookingApi(),
    member: createMockMemberApi(),
  }
}

let cached: AppApi | null = null

export function createApi(): AppApi {
  if (!cached) {
    const mode = (import.meta.env.VITE_API_MODE ?? 'live').toLowerCase()
    cached = mode === 'mock' ? createMockApi() : createLiveApi()
  }
  return cached
}

export function getApiMode(): 'mock' | 'live' {
  return (import.meta.env.VITE_API_MODE ?? 'live').toLowerCase() === 'mock' ? 'mock' : 'live'
}
