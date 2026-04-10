import type { Booking, BookingStatus, TrainingClass, UserSummary } from '../types'

export type MemberRecord = UserSummary & { password: string; role: 'ROLE_MEMBER'; emailNotifications?: boolean }

export const trainers: Record<string, UserSummary> = {
  goran:   { id: 101, username: 'Göran', email: 'goran@example.com', firstName: 'Göran' },
  hanna:   { id: 102, username: 'Hanna Karlsson', email: 'hanna@example.com', firstName: 'Hanna' },
  fanny:   { id: 103, username: 'Fanny Berg', email: 'fanny@example.com', firstName: 'Fanny' },
  micke:   { id: 104, username: 'Micke Andersson', email: 'micke@example.com', firstName: 'Micke' },
  tony:    { id: 105, username: 'Tony McClinch', email: 'tony@example.com', firstName: 'Tony' },
  kajsa:   { id: 106, username: 'Kettlebell-Kajsa', email: 'kajsa@example.com', firstName: 'Kajsa' },
  bella:   { id: 107, username: 'Bella Johansson', email: 'bella@example.com', firstName: 'Bella' },
  leif:    { id: 108, username: 'Leif Benlåset', email: 'leif@example.com', firstName: 'Leif' },
}

let classIdCounter = 0
function c(
  title: string,
  day: string,
  matta: 'MATTA_1' | 'MATTA_2',
  start: string,
  end: string,
  trainer?: UserSummary,
): TrainingClass {
  classIdCounter += 1
  const lower = title.toLowerCase()
  const category = lower.includes('bjj') ? 'BJJ' as const
    : lower.includes('thaiboxning') ? 'THAIBOXNING' as const
    : lower.includes('boxning') ? 'BOXNING' as const
    : lower.includes('fys') ? 'FYS' as const
    : lower.includes('sparring') && lower.includes('thai') ? 'THAIBOXNING' as const
    : lower.includes('sparring') && lower.includes('box') ? 'BOXNING' as const
    : lower.includes('sparring') && lower.includes('bjj') ? 'BJJ' as const
    : lower.includes('sparring') ? 'SPARRING' as const
    : 'BJJ' as const
  return {
    id: classIdCounter,
    title,
    description: title,
    trainingDay: day,
    matta,
    startTime: start,
    endTime: end,
    category,
    maxCapacity: 20,
    status: 'ACTIVE',
    trainer,
  }
}

function seedClasses(): TrainingClass[] {
  classIdCounter = 0
  const { goran, hanna, fanny, micke, tony, kajsa, bella, leif } = trainers
  return [
    // Monday - Matta 1 (Thaiboxning)
    c('Thaiboxning', 'MONDAY', 'MATTA_1', '12:00:00', '13:15:00', goran),
    c('Barn Thaiboxning', 'MONDAY', 'MATTA_1', '16:00:00', '17:15:00', fanny),
    c('Nybörjare Thaiboxning', 'MONDAY', 'MATTA_1', '17:30:00', '18:55:00', fanny),
    c('Forts/Avanc Thaiboxning', 'MONDAY', 'MATTA_1', '19:00:00', '20:15:00', tony),
    c('Sparring Thaiboxning', 'MONDAY', 'MATTA_1', '20:15:00', '21:15:00', tony),
    // Monday - Matta 2 (BJJ & Fys)
    c('Fys \u2013 Morgonpass', 'MONDAY', 'MATTA_2', '06:30:00', '07:30:00', kajsa),
    c('BJJ Lunchpass', 'MONDAY', 'MATTA_2', '12:00:00', '13:15:00', bella),
    c('Barn BJJ', 'MONDAY', 'MATTA_2', '16:00:00', '17:15:00', bella),
    c('Nybörjare BJJ', 'MONDAY', 'MATTA_2', '17:30:00', '18:45:00', bella),
    c('Forts/Avanc BJJ', 'MONDAY', 'MATTA_2', '19:00:00', '20:15:00', bella),
    c('Sparring BJJ', 'MONDAY', 'MATTA_2', '20:15:00', '21:15:00', leif),

    // Tuesday - Matta 1 (Boxning)
    c('Boxning', 'TUESDAY', 'MATTA_1', '12:00:00', '13:15:00', hanna),
    c('Barn Boxning', 'TUESDAY', 'MATTA_1', '16:00:00', '17:15:00', micke),
    c('Nybörjare Boxning', 'TUESDAY', 'MATTA_1', '17:30:00', '18:45:00', micke),
    c('Forts/Avanc Boxning', 'TUESDAY', 'MATTA_1', '19:00:00', '20:15:00', hanna),
    c('Sparring Boxning', 'TUESDAY', 'MATTA_1', '20:15:00', '21:15:00'),
    // Tuesday - Matta 2 (BJJ)
    c('BJJ Lunchpass', 'TUESDAY', 'MATTA_2', '12:00:00', '13:15:00', bella),
    c('Barn BJJ', 'TUESDAY', 'MATTA_2', '16:00:00', '17:15:00', bella),
    c('Nybörjare BJJ', 'TUESDAY', 'MATTA_2', '17:30:00', '18:45:00', bella),
    c('Forts/Avanc BJJ', 'TUESDAY', 'MATTA_2', '19:00:00', '20:15:00', bella),
    c('Sparring BJJ', 'TUESDAY', 'MATTA_2', '20:15:00', '21:15:00', leif),

    // Wednesday - Matta 1 (Thaiboxning)
    c('Thaiboxning', 'WEDNESDAY', 'MATTA_1', '12:00:00', '13:15:00', goran),
    c('Barn Thaiboxning', 'WEDNESDAY', 'MATTA_1', '16:00:00', '17:15:00', fanny),
    c('Nybörjare Thaiboxning', 'WEDNESDAY', 'MATTA_1', '17:30:00', '18:45:00', fanny),
    c('Forts/Avanc Thaiboxning', 'WEDNESDAY', 'MATTA_1', '19:00:00', '20:15:00', tony),
    c('Sparring Thaiboxning', 'WEDNESDAY', 'MATTA_1', '20:15:00', '21:15:00'),
    // Wednesday - Matta 2 (BJJ & Fys)
    c('Fys \u2013 Morgonpass', 'WEDNESDAY', 'MATTA_2', '06:30:00', '07:30:00', kajsa),
    c('BJJ Lunchpass', 'WEDNESDAY', 'MATTA_2', '12:00:00', '13:15:00', bella),
    c('Barn BJJ', 'WEDNESDAY', 'MATTA_2', '16:00:00', '17:15:00', bella),
    c('Nybörjare BJJ', 'WEDNESDAY', 'MATTA_2', '17:30:00', '18:45:00', bella),
    c('Forts/Avanc BJJ', 'WEDNESDAY', 'MATTA_2', '19:00:00', '20:15:00', bella),
    c('Sparring BJJ', 'WEDNESDAY', 'MATTA_2', '20:15:00', '21:15:00', leif),

    // Thursday - Matta 1 (Boxning)
    c('Boxning', 'THURSDAY', 'MATTA_1', '12:00:00', '13:15:00', hanna),
    c('Barn Boxning', 'THURSDAY', 'MATTA_1', '16:00:00', '17:15:00', micke),
    c('Nybörjare Boxning', 'THURSDAY', 'MATTA_1', '17:30:00', '18:45:00', micke),
    c('Forts/Avanc Boxning', 'THURSDAY', 'MATTA_1', '19:00:00', '20:15:00', hanna),
    c('Sparring Boxning', 'THURSDAY', 'MATTA_1', '20:15:00', '21:15:00'),
    // Thursday - Matta 2 (BJJ)
    c('BJJ Lunchpass', 'THURSDAY', 'MATTA_2', '12:00:00', '13:15:00', bella),
    c('Barn BJJ', 'THURSDAY', 'MATTA_2', '16:00:00', '17:15:00', bella),
    c('Nybörjare BJJ', 'THURSDAY', 'MATTA_2', '17:30:00', '18:45:00', bella),
    c('Forts/Avanc BJJ', 'THURSDAY', 'MATTA_2', '19:00:00', '20:15:00', bella),
    c('Sparring BJJ', 'THURSDAY', 'MATTA_2', '20:15:00', '21:15:00', leif),

    // Friday - Matta 1 (Thaiboxning)
    c('Thaiboxning', 'FRIDAY', 'MATTA_1', '12:00:00', '13:15:00', goran),
    c('Barn Thaiboxning', 'FRIDAY', 'MATTA_1', '16:00:00', '17:15:00', fanny),
    c('Nybörjare Thaiboxning', 'FRIDAY', 'MATTA_1', '17:30:00', '18:45:00', fanny),
    c('Forts/Avanc Thaiboxning', 'FRIDAY', 'MATTA_1', '19:00:00', '20:15:00', tony),
    c('Sparring Thaiboxning', 'FRIDAY', 'MATTA_1', '20:15:00', '21:15:00'),
    // Friday - Matta 2 (BJJ & Fys)
    c('Fys \u2013 Morgonpass', 'FRIDAY', 'MATTA_2', '06:30:00', '07:30:00', kajsa),
    c('BJJ Lunchpass', 'FRIDAY', 'MATTA_2', '12:00:00', '13:15:00', bella),
    c('Barn BJJ', 'FRIDAY', 'MATTA_2', '16:00:00', '17:15:00', bella),
    c('Nybörjare BJJ', 'FRIDAY', 'MATTA_2', '17:30:00', '18:45:00', bella),
    c('Forts/Avanc BJJ', 'FRIDAY', 'MATTA_2', '19:00:00', '20:15:00', bella),
    c('Sparring BJJ', 'FRIDAY', 'MATTA_2', '20:15:00', '21:15:00', leif),

    // Saturday - Matta 1
    c('Boxning', 'SATURDAY', 'MATTA_1', '08:00:00', '09:30:00', hanna),
    c('Thaiboxning', 'SATURDAY', 'MATTA_1', '10:00:00', '12:00:00', goran),
    // Saturday - Matta 2
    c('BJJ', 'SATURDAY', 'MATTA_2', '08:00:00', '09:30:00', bella),
    c('BJJ', 'SATURDAY', 'MATTA_2', '10:00:00', '12:00:00', leif),

    // Sunday - Matta 1
    c('Boxning', 'SUNDAY', 'MATTA_1', '08:00:00', '09:30:00', micke),
    c('Thaiboxning', 'SUNDAY', 'MATTA_1', '10:00:00', '12:00:00', goran),
    // Sunday - Matta 2
    c('BJJ', 'SUNDAY', 'MATTA_2', '08:00:00', '09:30:00', bella),
    c('BJJ', 'SUNDAY', 'MATTA_2', '10:00:00', '12:00:00', leif),
  ]
}

function seedMembers(): MemberRecord[] {
  return [
    {
      id: 1,
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      password: 'demo123',
      role: 'ROLE_MEMBER',
      demo: true,
      profileVisible: true,
      createdAt: '2024-09-15',
      emailNotifications: true,
    },
  ]
}

type StoredBooking = Booking & { memberId: number }

function stripBookingRow(row: StoredBooking): Booking {
  return {
    id: row.id,
    trainingClass: row.trainingClass,
    bookingStatus: row.bookingStatus,
    bookingDate: row.bookingDate,
    bookingTimeStamp: row.bookingTimeStamp,
    attended: row.attended,
  }
}

function seedBookings(classes: TrainingClass[]): StoredBooking[] {
  const seeded: StoredBooking[] = []
  let id = 100

  const bjjClass = classes.find((c) => c.title === 'Nybörjare BJJ' && c.trainingDay === 'MONDAY')
  const thaiClass = classes.find((c) => c.title === 'Thaiboxning' && c.trainingDay === 'WEDNESDAY')
  const fysClass = classes.find((c) => c.title.startsWith('Fys') && c.trainingDay === 'FRIDAY')
  const boxClass = classes.find((c) => c.title === 'Boxning' && c.trainingDay === 'TUESDAY')

  const pastClasses = [bjjClass, thaiClass, fysClass, boxClass, bjjClass, thaiClass].filter(Boolean) as TrainingClass[]
  for (let i = 0; i < pastClasses.length; i++) {
    id += 1
    const weeksAgo = pastClasses.length - i
    const d = new Date()
    d.setDate(d.getDate() - weeksAgo * 7)
    seeded.push({
      id,
      memberId: 1,
      trainingClass: { ...pastClasses[i] },
      bookingStatus: 'CONFIRMED',
      bookingDate: d.toISOString().slice(0, 10),
      bookingTimeStamp: d.toISOString(),
      attended: true,
    })
  }

  // One upcoming booking
  const upcoming = classes.find((c) => c.title === 'Nybörjare BJJ' && c.trainingDay === 'WEDNESDAY')
  if (upcoming) {
    id += 1
    const d = new Date()
    d.setDate(d.getDate() + 2)
    seeded.push({
      id,
      memberId: 1,
      trainingClass: { ...upcoming },
      bookingStatus: 'CONFIRMED',
      bookingDate: d.toISOString().slice(0, 10),
      bookingTimeStamp: d.toISOString(),
      attended: false,
    })
  }

  return seeded
}

let nextBookingId = 500
const classes: TrainingClass[] = seedClasses()
let members: MemberRecord[] = seedMembers()
let bookings: StoredBooking[] = seedBookings(classes)
let sessionMemberId: number | null = null

export function getSessionMemberId(): number | null {
  return sessionMemberId
}

export function setSessionMemberId(id: number | null): void {
  sessionMemberId = id
}

export function getMembers(): MemberRecord[] {
  return members
}

export function addMember(m: MemberRecord): void {
  members = [...members, m]
}

export function nextMemberId(): number {
  const max = members.reduce((acc, u) => Math.max(acc, u.id), 0)
  return max + 1
}

export function getClasses(): TrainingClass[] {
  return classes
}

export function getBookingsForMember(memberId: number): Booking[] {
  return bookings.filter((b) => b.memberId === memberId).map(stripBookingRow)
}

export function addBooking(memberId: number, booking: Booking): void {
  bookings = [...bookings, { ...booking, memberId }]
}

export function allocateBookingId(): number {
  nextBookingId += 1
  return nextBookingId
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function patchBookingStatus(
  memberId: number,
  id: number,
  status: BookingStatus,
): Booking | undefined {
  const idx = bookings.findIndex((x) => x.id === id && x.memberId === memberId)
  if (idx === -1) return undefined
  bookings[idx].bookingStatus = status
  return stripBookingRow(bookings[idx])
}

export function nextOccurrence(dayName: string): string {
  const dayIndex = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].indexOf(dayName)
  if (dayIndex === -1) return todayIso()
  const today = new Date()
  const todayDow = (today.getDay() + 6) % 7
  let diff = dayIndex - todayDow
  if (diff < 0) diff += 7
  const target = new Date(today)
  target.setDate(today.getDate() + diff)
  return target.toISOString().slice(0, 10)
}

export function updateMember(memberId: number, data: Partial<MemberRecord>): MemberRecord | undefined {
  const idx = members.findIndex((m) => m.id === memberId)
  if (idx === -1) return undefined
  members[idx] = { ...members[idx], ...data, id: memberId }
  return members[idx]
}

export function cancelAllBookingsForMember(memberId: number): void {
  for (let i = 0; i < bookings.length; i++) {
    if (
      bookings[i].memberId === memberId &&
      bookings[i].bookingStatus !== 'CANCELLED' &&
      bookings[i].bookingStatus !== 'CANCELLED_BY_MEMBER'
    ) {
      bookings[i].bookingStatus = 'CANCELLED_BY_MEMBER'
    }
  }
}
