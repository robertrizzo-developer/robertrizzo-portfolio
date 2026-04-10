import type { Booking, MemberProfile, MemberStats, RegisterPayload, TrainingClass } from './types'

export interface AuthApi {
  warmupCsrf(): Promise<void>
  login(username: string, password: string): Promise<void>
  logout(): Promise<void>
  register(payload: RegisterPayload): Promise<void>
  getSessionMember(): Promise<MemberProfile | null>
}

export interface BookingApi {
  getAvailableClasses(): Promise<TrainingClass[]>
  getUpcomingForMember(memberId: number): Promise<Booking[]>
  getPastForMember(memberId: number): Promise<Booking[]>
  createBooking(memberId: number, trainingClassId: number): Promise<Booking>
  cancelBooking(bookingId: number): Promise<Booking>
  cancelAllForMember(memberId: number): Promise<void>
}

export interface MemberApi {
  getProfile(memberId: number): Promise<MemberProfile>
  getStats(memberId: number): Promise<MemberStats>
  updateProfile(memberId: number, data: Partial<MemberProfile>): Promise<MemberProfile>
}

export interface AppApi {
  auth: AuthApi
  booking: BookingApi
  member: MemberApi
}
