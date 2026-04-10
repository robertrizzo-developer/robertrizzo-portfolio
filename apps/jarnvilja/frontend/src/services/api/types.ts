export type Role = 'ROLE_MEMBER' | 'ROLE_ADMIN' | 'ROLE_TRAINER'

export type BookingStatus =
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'PENDING'
  | 'CANCELLED_BY_MEMBER'
  | 'EXPIRED'
  | 'WAITLISTED'

export type TrainingCategory = 'BJJ' | 'THAIBOXNING' | 'BOXNING' | 'FYS' | 'SPARRING'

export type Matta = 'MATTA_1' | 'MATTA_2'

export type ClassStatus = 'ACTIVE' | 'CANCELLED'

export interface MemberProfile {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  role?: Role
  profileVisible?: boolean
  createdAt?: string
  demo?: boolean
  emailNotifications?: boolean
}

export interface MemberStats {
  memberId: number
  totalBookings: number
  mostBookedClass: string | null
  memberSince: string | null
  avgSessionsPerWeek: number
  currentStreak: number
  categoryBreakdown: Record<string, number>
  monthlyTrend: Record<string, number>
}

export interface UserSummary {
  id: number
  email: string
  username: string
  firstName?: string
  lastName?: string
  role?: Role
  demo?: boolean
  profileVisible?: boolean
  createdAt?: string
}

export interface TrainingClass {
  id: number
  title: string
  description?: string
  trainingDay?: string
  matta?: Matta
  startTime?: string
  endTime?: string
  category?: TrainingCategory
  maxCapacity?: number
  trainer?: UserSummary
  status?: ClassStatus
}

export interface Booking {
  id: number
  trainingClass: TrainingClass
  bookingStatus: BookingStatus
  bookingDate: string
  bookingTimeStamp?: string
  attended?: boolean
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}
