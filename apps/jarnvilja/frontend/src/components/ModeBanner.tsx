import { getApiMode } from '@/services/api'

export function ModeBanner() {
  const mode = getApiMode()
  return (
    <div className={`mode-banner mode-banner--${mode}`} role="status" aria-live="polite">
      {mode === 'mock' ? 'Mock mode — no backend' : 'Live mode — Spring API'}
    </div>
  )
}
