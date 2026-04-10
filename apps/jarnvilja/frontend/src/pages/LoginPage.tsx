import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getApiMode } from '@/services/api'
import { useAuth } from '@/services/auth/AuthProvider'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isMock = getApiMode() === 'mock'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inloggning misslyckades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--narrow">
      <h1>Logga in</h1>
      {isMock ? (
        <div className="demo-banner">
          <h3>Demo-läge</h3>
          <p>Appen körs utan backend. Logga in med testuppgifterna nedan.</p>
          <p>Användarnamn: <strong>demo</strong> &middot; Lösenord: <strong>demo123</strong></p>
        </div>
      ) : (
        <p className="muted">Logga in med ditt konto. Backend måste vara igång.</p>
      )}
      <form onSubmit={handleSubmit} className="card">
        <label>
          Användarnamn
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Loggar in…' : 'Logga in'}
        </button>
      </form>
      <p>
        <Link to="/register">Skapa konto</Link>
      </p>
    </div>
  )
}
