import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '@/services/api/useApi'

export function RegisterPage() {
  const api = useApi()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.auth.register({ firstName, lastName, username, email, password })
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registrering misslyckades')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page--narrow">
      <h1>Registrera</h1>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Förnamn
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label>
          Efternamn
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <label>
          Användarnamn
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          E-post
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'Skickar…' : 'Skapa konto'}
        </button>
      </form>
      <p>
        <Link to="/login">Till inloggning</Link>
      </p>
    </div>
  )
}
