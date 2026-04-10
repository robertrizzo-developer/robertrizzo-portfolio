import type { MemberApi } from '../contracts'
import type { MemberProfile, MemberStats } from '../types'
import { mockDelay } from './delay'
import { getBookingsForMember, getMembers, getSessionMemberId, updateMember } from './state'

export function createMockMemberApi(): MemberApi {
  return {
    async getProfile(memberId: number): Promise<MemberProfile> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const user = getMembers().find((m) => m.id === memberId)
      if (!user) throw new Error('Member not found')
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

    async updateProfile(memberId: number, data: Partial<MemberProfile>): Promise<MemberProfile> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const updated = updateMember(memberId, data)
      if (!updated) throw new Error('Member not found')
      return {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: 'ROLE_MEMBER',
        profileVisible: updated.profileVisible,
        createdAt: updated.createdAt,
        demo: updated.demo,
        emailNotifications: updated.emailNotifications,
      }
    },

    async getStats(memberId: number): Promise<MemberStats> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const user = getMembers().find((m) => m.id === memberId)
      if (!user) throw new Error('Member not found')

      const allBookings = getBookingsForMember(memberId).filter(
        (b) => b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'CANCELLED_BY_MEMBER',
      )

      const categoryBreakdown: Record<string, number> = {}
      const monthlyTrend: Record<string, number> = {}
      let mostBookedClass: string | null = null
      const classCounts: Record<string, number> = {}

      for (const b of allBookings) {
        const cat = b.trainingClass.category ?? 'OTHER'
        categoryBreakdown[cat] = (categoryBreakdown[cat] ?? 0) + 1

        const month = b.bookingDate.slice(0, 7)
        monthlyTrend[month] = (monthlyTrend[month] ?? 0) + 1

        const title = b.trainingClass.title
        classCounts[title] = (classCounts[title] ?? 0) + 1
      }

      let maxCount = 0
      for (const [title, count] of Object.entries(classCounts)) {
        if (count > maxCount) {
          maxCount = count
          mostBookedClass = title
        }
      }

      const weeks = Math.max(1, allBookings.length > 0 ? 8 : 1)
      const avgSessionsPerWeek = Math.round((allBookings.length / weeks) * 10) / 10

      return {
        memberId,
        totalBookings: allBookings.length,
        mostBookedClass,
        memberSince: user.createdAt ?? null,
        avgSessionsPerWeek,
        currentStreak: Math.min(allBookings.length, 3),
        categoryBreakdown,
        monthlyTrend,
      }
    },
  }
}
