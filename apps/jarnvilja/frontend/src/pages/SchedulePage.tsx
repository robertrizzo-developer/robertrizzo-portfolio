import { useEffect, useMemo, useState } from 'react'
import type { TrainingClass, TrainingCategory } from '@/services/api/types'
import { useApi } from '@/services/api/useApi'

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

function formatTime(t?: string) { return t ? t.slice(0, 5) : '' }
function catClass(c?: TrainingCategory) { return c ? `cat-${c.toLowerCase()}` : '' }

export function SchedulePage() {
  const api = useApi()
  const [classes, setClasses] = useState<TrainingClass[]>([])
  const [activeCategory, setActiveCategory] = useState<TrainingCategory | 'all'>('all')

  useEffect(() => {
    void api.booking.getAvailableClasses().then(setClasses)
  }, [api])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return classes
    return classes.filter((c) => c.category === activeCategory)
  }, [classes, activeCategory])

  const byDay = useMemo(() => {
    const map = new Map<string, TrainingClass[]>()
    for (const d of DAYS) map.set(d, [])
    for (const c of filtered) {
      if (c.trainingDay) map.get(c.trainingDay)?.push(c)
    }
    return map
  }, [filtered])

  return (
    <main className="schedule-page">
      <h1>Terminsschema</h1>

      <div className="schedule-info">
        <p><strong>Klubbens öppettider:</strong> Mån–Fre: 08:00 – 22:00 | Lör–Sön: 08:00 – 14:00</p>
        <p><strong>Sparringpass</strong> kräver minst 6 månaders erfarenhet. <strong>Öppen matta</strong> är tillgänglig när inga schemalagda pass pågår.</p>
      </div>

      <div className="schedule-legend">
        <span className="legend-item"><span className="legend-dot cat-bjj" /> BJJ</span>
        <span className="legend-item"><span className="legend-dot cat-thaiboxning" /> Thaiboxning</span>
        <span className="legend-item"><span className="legend-dot cat-boxning" /> Boxning</span>
        <span className="legend-item"><span className="legend-dot cat-fys" /> Fys</span>
        <span className="legend-item"><span className="legend-dot cat-sparring" /> Sparring</span>
      </div>

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

      {/* Desktop table */}
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              {DAYS.map((d) => <th key={d}>{DAY_LABELS[d]}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS.map((d) => (
                <td key={d}>
                  {(byDay.get(d) ?? []).map((tc) => (
                    <div key={tc.id} className={`schedule-cell ${catClass(tc.category)}`}>
                      <div className="schedule-cell-title">{tc.title}</div>
                      <div className="schedule-cell-time">
                        {formatTime(tc.startTime)}–{formatTime(tc.endTime)}
                      </div>
                      <div className="schedule-cell-matta">{tc.matta === 'MATTA_1' ? 'Matta 1' : 'Matta 2'}</div>
                      {tc.trainer && <div className="schedule-cell-trainer">{tc.trainer.username}</div>}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile accordion */}
      <div className="schedule-mobile">
        {DAYS.map((d) => {
          const dayCls = byDay.get(d) ?? []
          return (
            <details key={d} className="schedule-day-details">
              <summary>{DAY_LABELS[d]} ({dayCls.length} pass)</summary>
              <div className="schedule-day-list">
                {dayCls.map((tc) => (
                  <div key={tc.id} className={`schedule-cell ${catClass(tc.category)}`}>
                    <div className="schedule-cell-title">{tc.title}</div>
                    <div className="schedule-cell-time">
                      {formatTime(tc.startTime)}–{formatTime(tc.endTime)}
                      <span className="schedule-cell-matta"> · {tc.matta === 'MATTA_1' ? 'Matta 1' : 'Matta 2'}</span>
                    </div>
                    {tc.trainer && <div className="schedule-cell-trainer">{tc.trainer.username}</div>}
                  </div>
                ))}
              </div>
            </details>
          )
        })}
      </div>
    </main>
  )
}
