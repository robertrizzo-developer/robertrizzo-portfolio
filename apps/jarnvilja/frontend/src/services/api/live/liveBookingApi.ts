import type { BookingApi } from '../contracts'
import type { Booking, TrainingClass } from '../types'
import { ApiError, httpRequest, requestJson } from '../httpClient'

export function createLiveBookingApi(): BookingApi {
  return {
    getAvailableClasses(): Promise<TrainingClass[]> {
      return requestJson<TrainingClass[]>('GET', '/bookings/classes/available')
    },

    getUpcomingForMember(memberId: number): Promise<Booking[]> {
      return requestJson<Booking[]>('GET', `/bookings/members/${memberId}/upcoming`)
    },

    getPastForMember(memberId: number): Promise<Booking[]> {
      return requestJson<Booking[]>('GET', `/bookings/members/${memberId}/past`)
    },

    async createBooking(memberId: number, trainingClassId: number): Promise<Booking> {
      return requestJson<Booking>('POST', `/bookings/members/${memberId}/bookings`, {
        body: { trainingClass: { id: trainingClassId } },
      })
    },

    async cancelBooking(bookingId: number): Promise<Booking> {
      const res = await httpRequest('DELETE', `/bookings/bookings/${bookingId}`)
      const text = await res.text()
      if (!res.ok) {
        throw new ApiError(text || `Cancel failed (${res.status})`, res.status, text)
      }
      return text ? (JSON.parse(text) as Booking) : ({} as Booking)
    },

    async cancelAllForMember(/* memberId not in URL; session-based */): Promise<void> {
      const res = await httpRequest('POST', '/memberPage/bookings/cancel-all')
      if (!res.ok) {
        const text = await res.text()
        throw new ApiError(text || `Cancel all failed (${res.status})`, res.status, text)
      }
    },
  }
}
