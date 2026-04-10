import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Booking, MemberStats, TrainingClass, TrainingCategory } from '@/services/api/types'
import { useApi } from '@/services/api/useApi'
import { getApiMode } from '@/services/api'
import { useAuth } from '@/services/auth/AuthProvider'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Måndag', TUESDAY: 'Tisdag', WEDNESDAY: 'Onsdag', THURSDAY: 'Torsdag',
  FRIDAY: 'Fredag', SATURDAY: 'Lördag', SUNDAY: 'Söndag',
}
const CATEGORIES: { value: TrainingCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alla pass' },
  { value: 'BJJ', label: 'BJJ' },
  { value: 'THAIBOXNING', label: 'Thaiboxning' },
  { value: 'BOXNING', label: 'Boxning' },
  { value: 'FYS', label: 'Fys' },
  { value: 'SPARRING', label: 'Sparring' },
]

function todayDayName(): string {
  const js = new Date().getDay()
  return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][js]
}

function formatTime(t?: string): string {
  return t ? t.slice(0, 5) : ''
}

const SWEDISH_MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

function formatBookingDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const dayIdx = (dt.getDay() + 6) % 7
  const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']
  return `${dayNames[dayIdx]} ${d} ${SWEDISH_MONTHS[m - 1]}`
}

export function MemberDashboardPage() {
  const api = useApi()
  const { member, loading: authLoading, logout, setMember } = useAuth()

  const [stats, setStats] = useState<MemberStats | null>(null)
  const [classes, setClasses] = useState<TrainingClass[]>([])
  const [upcoming, setUpcoming] = useState<Booking[]>([])
  const [past, setPast] = useState<Booking[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeDay, setActiveDay] = useState(todayDayName)
  const [activeCategory, setActiveCategory] = useState<TrainingCategory | 'all'>('all')
  const [bookingTab, setBookingTab] = useState<'upcoming' | 'past'>('upcoming')

  const load = useCallback(async () => {
    if (!member) return
    setError(null)
    const [cls, up, pa, st] = await Promise.all([
      api.booking.getAvailableClasses(),
      api.booking.getUpcomingForMember(member.id),
      api.booking.getPastForMember(member.id),
      api.member.getStats(member.id),
    ])
    setClasses(cls)
    setUpcoming(up)
    setPast(pa)
    setStats(st)
  }, [api, member])

  useEffect(() => { void load() }, [load])

  const dayClasses = useMemo(() => {
    return classes.filter((cl) => {
      if (cl.trainingDay !== activeDay) return false
      if (activeCategory !== 'all' && cl.category !== activeCategory) return false
      return true
    })
  }, [classes, activeDay, activeCategory])

  const matta1 = useMemo(() => dayClasses.filter((c) => c.matta === 'MATTA_1'), [dayClasses])
  const matta2 = useMemo(() => dayClasses.filter((c) => c.matta === 'MATTA_2'), [dayClasses])

  function bookingMessage(action: 'book' | 'cancel'): string {
    const isMock = getApiMode() === 'mock'
    const wantsEmail = member?.emailNotifications !== false
    if (isMock && wantsEmail) {
      return action === 'book'
        ? `Tack för din bokning! En bekräftelse har skickats till ${member?.email ?? 'din e-post'}.`
        : `Bokning avbokad. En bekräftelse har skickats till ${member?.email ?? 'din e-post'}.`
    }
    return action === 'book' ? 'Bokning skapad.' : 'Bokning avbokad.'
  }

  async function handleBook(classId: number) {
    if (!member) return
    setBusy(true); setMessage(null); setError(null)
    try {
      await api.booking.createBooking(member.id, classId)
      setMessage(bookingMessage('book'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte boka')
    } finally { setBusy(false) }
  }

  async function handleCancel(bookingId: number) {
    setBusy(true); setMessage(null); setError(null)
    try {
      await api.booking.cancelBooking(bookingId)
      setMessage(bookingMessage('cancel'))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte avboka')
    } finally { setBusy(false) }
  }

  async function handleCancelAll() {
    if (!member || upcoming.length === 0) return
    setBusy(true); setMessage(null); setError(null)
    try {
      await api.booking.cancelAllForMember(member.id)
      setMessage('Alla bokningar avbokade.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte avboka')
    } finally { setBusy(false) }
  }

  async function toggleEmailNotifications() {
    if (!member) return
    const next = member.emailNotifications === false
    try {
      const updated = await api.member.updateProfile(member.id, { emailNotifications: next })
      setMember(updated)
    } catch {
      setError('Kunde inte uppdatera inställningen.')
    }
  }

  if (authLoading) return <p className="page muted">Laddar...</p>

  if (!member) {
    return (
      <main className="page page--narrow" style={{ textAlign: 'center' }}>
        <h1>Min sida</h1>
        <p>Du behöver vara inloggad för att se den här sidan.</p>
        <Link to="/login" className="btn-primary">Logga in</Link>
      </main>
    )
  }

  const displayName = member.firstName && member.lastName
    ? `${member.firstName} ${member.lastName}`
    : member.username
  const avatarLetter = (member.username?.[0] ?? '?').toUpperCase()

  return (
    <div className="page-with-sidebar">
      {/* Sidebar */}
      <aside className="sidebar" role="complementary">
        <h2>Mitt Konto</h2>
        <ul>
          <li><a href="#profile-section">Min profil</a></li>
          <li><a href="#stats-section">Träningsstatistik</a></li>
          <li><a href="#bookings-section">Mina bokningar</a></li>
          <li><a href="#schedule-section">Tillgängliga pass</a></li>
          <li><Link to="/app/profil">Redigera profil</Link></li>
        </ul>
        <button type="button" className="btn-ghost sidebar-logout" onClick={() => void logout()}>
          Logga ut
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Onboarding banner */}
        {member.demo && showOnboarding && (
          <div className="onboarding-banner">
            <p>Välkommen till Järnviljas demo! Bläddra bland träningspass per dag, boka ett pass och se dina bokningar nedan.</p>
            <button type="button" className="close-banner" onClick={() => setShowOnboarding(false)}>Stäng</button>
          </div>
        )}

        {/* Toast messages */}
        {message && <p className="alert alert-success">{message}</p>}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Profile section */}
        <section id="profile-section">
          <h1>Välkommen, {member.username}!</h1>

          <div className="profile-info-card">
            <div className="profile-avatar"><span>{avatarLetter}</span></div>
            <div className="profile-info-body">
              <h3>{displayName}</h3>
              <p>{member.email}</p>
              <div className="profile-meta">
                <span className="role-badge">Medlem</span>
                {member.profileVisible !== undefined && (
                  <span className={`visibility-badge ${member.profileVisible ? 'visible' : 'hidden'}`}>
                    {member.profileVisible ? 'Synlig' : 'Dold'}
                  </span>
                )}
                {member.createdAt && (
                  <span className="member-since">Sedan {member.createdAt}</span>
                )}
              </div>
              <label className="toggle-label email-toggle">
                <input
                  type="checkbox"
                  checked={member.emailNotifications !== false}
                  onChange={() => void toggleEmailNotifications()}
                />
                E-postnotiser (bokningsbekräftelse)
              </label>
            </div>
            {stats && (
              <div className="profile-quick-stats">
                <div><strong>{stats.totalBookings}</strong> bokningar</div>
                <div><strong>{stats.currentStreak}</strong> veckor i rad</div>
                <div>Favorit: <strong>{stats.mostBookedClass ?? '\u2013'}</strong></div>
              </div>
            )}
          </div>
        </section>

        {/* Stats section */}
        <section id="stats-section">
          <h2>Träningsstatistik</h2>
          <div className="member-stats">
            <div className="stat-card">
              <span className="stat-number">{stats?.totalBookings ?? 0}</span>
              <span className="stat-label">Bokningar</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats?.mostBookedClass ?? '\u2013'}</span>
              <span className="stat-label">Mest bokat</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats?.avgSessionsPerWeek?.toFixed(1) ?? '0'}</span>
              <span className="stat-label">Pass/vecka</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats?.currentStreak ?? 0}</span>
              <span className="stat-label">Veckor i rad</span>
            </div>
          </div>
        </section>

        {/* Schedule section */}
        <section id="schedule-section">
          <h2>Tillgängliga Träningspass</h2>

          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`category-btn${activeCategory === cat.value ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="day-buttons">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                className={activeDay === day ? 'active' : ''}
                onClick={() => setActiveDay(day)}
              >
                {DAY_LABELS[day]}
              </button>
            ))}
          </div>

          <div className="day-schedule">
            <h3>{DAY_LABELS[activeDay]}</h3>
            <div className="matta-columns">
              <MattaColumn label="Matta 1" classes={matta1} busy={busy} onBook={handleBook} />
              <MattaColumn label="Matta 2" classes={matta2} busy={busy} onBook={handleBook} />
            </div>
          </div>
        </section>

        {/* Bookings section */}
        <section id="bookings-section">
          <div className="section-header">
            <h2>Mina Bokningar</h2>
            {upcoming.length > 0 && (
              <button type="button" className="btn-danger" disabled={busy} onClick={() => void handleCancelAll()}>
                Avboka alla
              </button>
            )}
          </div>

          <div className="booking-tabs">
            <button
              type="button"
              className={`booking-tab${bookingTab === 'upcoming' ? ' active' : ''}`}
              onClick={() => setBookingTab('upcoming')}
            >
              Kommande
            </button>
            <button
              type="button"
              className={`booking-tab${bookingTab === 'past' ? ' active' : ''}`}
              onClick={() => setBookingTab('past')}
            >
              Tidigare
            </button>
          </div>

          {bookingTab === 'upcoming' && (
            <div className="booking-panel">
              {upcoming.length === 0 ? (
                <p className="empty-message">Du har inga kommande bokningar.</p>
              ) : (
                <div className="booking-cards">
                  {upcoming.map((b) => (
                    <div key={b.id} className="booking-card">
                      <div className="booking-card-header">
                        <strong>{b.trainingClass.title}</strong>
                        <span className={`booking-badge ${b.bookingStatus === 'WAITLISTED' ? 'badge-waitlisted' : 'badge-confirmed'}`}>
                          {b.bookingStatus === 'WAITLISTED' ? 'Väntelista' : 'Bekräftad'}
                        </span>
                      </div>
                      <div className="booking-card-body">
                        {formatBookingDate(b.bookingDate)} &middot;{' '}
                        {formatTime(b.trainingClass.startTime)} - {formatTime(b.trainingClass.endTime)} &middot;{' '}
                        {b.trainingClass.trainer?.username ?? 'Ej tilldelad'}
                      </div>
                      <div className="booking-card-footer">
                        <span className="booking-date">{formatBookingDate(b.bookingDate)}</span>
                        <button type="button" className="btn-danger btn-small" disabled={busy} onClick={() => void handleCancel(b.id)}>
                          Avboka
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {bookingTab === 'past' && (
            <div className="booking-panel">
              {past.length === 0 ? (
                <p className="empty-message">Du har inga tidigare bokningar.</p>
              ) : (
                <div className="booking-cards">
                  {past.map((b) => (
                    <div key={b.id} className="booking-card booking-card-past">
                      <div className="booking-card-header">
                        <strong>{b.trainingClass.title}</strong>
                      </div>
                      <div className="booking-card-body">
                        {formatBookingDate(b.bookingDate)} &middot;{' '}
                        {formatTime(b.trainingClass.startTime)} - {formatTime(b.trainingClass.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <p className="muted" style={{ marginTop: '2rem' }}>
          <Link to="/login">Byt konto</Link>
        </p>
      </main>
    </div>
  )
}

function MattaColumn({ label, classes, busy, onBook }: {
  label: string
  classes: TrainingClass[]
  busy: boolean
  onBook: (id: number) => void
}) {
  return (
    <div className="matta-column">
      <h4>{label}</h4>
      {classes.length === 0 && <p className="muted">Inga pass</p>}
      {classes.map((tc) => (
        <div key={tc.id} className="class-entry" data-category={tc.category ?? ''}>
          <div className="class-info">
            <strong>{tc.title}</strong><br />
            {formatTime(tc.startTime)} - {formatTime(tc.endTime)}<br />
            Tränare: {tc.trainer?.username ?? 'Ej tilldelad'}<br />
            <span className="capacity-text">0/{tc.maxCapacity ?? 20} platser</span>
          </div>
          <button type="button" className="btn-primary btn-small" disabled={busy} onClick={() => onBook(tc.id)}>
            Boka
          </button>
        </div>
      ))}
    </div>
  )
}
