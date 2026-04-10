import { trainers } from '@/services/api/mock/state'

interface TrainerInfo {
  name: string
  initials: string
  role: string
}

const trainerList: TrainerInfo[] = [
  { name: 'Leif "Benlåset"', initials: 'LB', role: 'BJJ-tränare' },
  { name: 'Tony McClinch', initials: 'TM', role: 'Thaiboxningstränare' },
  { name: 'Hanna "Kroknäsa" Karlsson', initials: 'HK', role: 'Boxningstränare' },
  { name: 'Kettlebell-Kajsa', initials: 'KK', role: 'Fystränare' },
  { name: 'Fanny "Stenpanna" Berg', initials: 'FB', role: 'Thaiboxningstränare' },
  { name: 'Bella "Strypnacke" Johansson', initials: 'BJ', role: 'BJJ-tränare' },
  { name: 'Micke "Huvudskada" Andersson', initials: 'MA', role: 'Boxningstränare' },
]

void trainers

export function TrainersPage() {
  return (
    <main>
      <h1>Våra Tränare</h1>
      <div className="trainer-grid">
        {trainerList.map((t) => (
          <div key={t.initials} className="trainer-card">
            <div className="trainer-avatar">{t.initials}</div>
            <h2>{t.name}</h2>
            <p className="trainer-role">{t.role}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
