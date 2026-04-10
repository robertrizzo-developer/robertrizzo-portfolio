import type { BookingApi } from '../contracts'
import type { Booking, TrainingClass } from '../types'
import { mockDelay } from './delay'
import {
  addBooking,
  allocateBookingId,
  cancelAllBookingsForMember,
  getBookingsForMember,
  getClasses,
  getSessionMemberId,
  nextOccurrence,
  patchBookingStatus,
  todayIso,
} from './state'

export function createMockBookingApi(): BookingApi {
  return {
    async getAvailableClasses(): Promise<TrainingClass[]> {
      await mockDelay()
      return getClasses().filter((c) => c.status !== 'CANCELLED')
    },

    async getUpcomingForMember(memberId: number): Promise<Booking[]> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const today = todayIso()
      return getBookingsForMember(memberId).filter(
        (b) =>
          b.bookingStatus !== 'CANCELLED' &&
          b.bookingStatus !== 'CANCELLED_BY_MEMBER' &&
          b.bookingStatus !== 'EXPIRED' &&
          b.bookingDate >= today,
      )
    },

    async getPastForMember(memberId: number): Promise<Booking[]> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const today = todayIso()
      return getBookingsForMember(memberId).filter(
        (b) =>
          b.bookingDate < today &&
          b.bookingStatus !== 'CANCELLED' &&
          b.bookingStatus !== 'CANCELLED_BY_MEMBER',
      )
    },

    async createBooking(memberId: number, trainingClassId: number): Promise<Booking> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      const tc = getClasses().find((c) => c.id === trainingClassId)
      if (!tc) throw new Error('Class not found')
      const resolvedDate = nextOccurrence(tc.trainingDay ?? '')
      const existing = getBookingsForMember(memberId)
      const dup = existing.some(
        (b) =>
          b.trainingClass.id === trainingClassId &&
          b.bookingDate === resolvedDate &&
          (b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED'),
      )
      if (dup) throw new Error('Already booked this class')
      const booking: Booking = {
        id: allocateBookingId(),
        trainingClass: { ...tc },
        bookingStatus: 'CONFIRMED',
        bookingDate: resolvedDate,
        bookingTimeStamp: new Date().toISOString(),
        attended: false,
      }
      addBooking(memberId, booking)
      return booking
    },

    async cancelBooking(bookingId: number): Promise<Booking> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid === null) throw new Error('Not authenticated')
      const updated = patchBookingStatus(sid, bookingId, 'CANCELLED_BY_MEMBER')
      if (!updated) throw new Error('Booking not found')
      return updated
    },

    async cancelAllForMember(memberId: number): Promise<void> {
      await mockDelay()
      const sid = getSessionMemberId()
      if (sid !== memberId) throw new Error('Not allowed')
      cancelAllBookingsForMember(memberId)
    },
  }
}
