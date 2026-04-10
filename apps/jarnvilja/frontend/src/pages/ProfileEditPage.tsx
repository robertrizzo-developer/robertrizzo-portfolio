import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/services/auth/AuthProvider'
import { useApi } from '@/services/api/useApi'
import { getApiMode } from '@/services/api'

export function ProfileEditPage() {
  const api = useApi()
  const { member, loading, setMember } = useAuth()
  const isMock = getApiMode() === 'mock'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileVisible, setProfileVisible] = useState(true)
  const [inited, setInited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (loading) return <p className="page muted">Laddar...</p>

  if (!member) {
    return (
      <main className="page page--narrow" style={{ textAlign: 'center' }}>
        <h1>Redigera profil</h1>
        <p>Du behöver vara inloggad för att se den här sidan.</p>
        <Link to="/login" className="btn-primary">Logga in</Link>
      </main>
    )
  }

  if (!inited) {
    setUsername(member.username)
    setEmail(member.email)
    setFirstName(member.firstName ?? '')
    setLastName(member.lastName ?? '')
    setProfileVisible(member.profileVisible ?? true)
    setInited(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!member || isMock) return
    setSaving(true)
    setMessage(null)
    try {
      const updated = await api.member.updateProfile(member.id, {
        username,
        email,
        firstName,
        lastName,
        profileVisible,
      })
      setMember(updated)
      setMessage('Profilen har uppdaterats.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Kunde inte spara.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page page--narrow">
      <h1>Redigera profil</h1>

      {isMock && (
        <div className="onboarding-banner">
          <p>Redigering inaktiverad i demoläge</p>
        </div>
      )}

      {message && <p className="alert alert-success">{message}</p>}

      <form className="profile-edit-form" onSubmit={(e) => void handleSubmit(e)}>
        <label>
          Användarnamn
          <input type="text" value={username} disabled={isMock} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          E-post
          <input type="email" value={email} disabled={isMock} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Förnamn
          <input type="text" value={firstName} disabled={isMock} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Efternamn
          <input type="text" value={lastName} disabled={isMock} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={profileVisible}
            disabled={isMock}
            onChange={(e) => setProfileVisible(e.target.checked)}
          />
          Synlig profil
        </label>

        {!isMock && (
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Sparar...' : 'Spara ändringar'}
          </button>
        )}
      </form>

      <p className="muted" style={{ marginTop: '1.5rem' }}>
        <Link to="/app">← Tillbaka till Min sida</Link>
      </p>
    </main>
  )
}
