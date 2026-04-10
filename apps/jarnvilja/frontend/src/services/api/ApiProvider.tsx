import { useMemo, type ReactNode } from 'react'
import { ApiContext } from './apiContext'
import { createApi } from './factory'

export function ApiProvider({ children }: { children: ReactNode }) {
  const api = useMemo(() => createApi(), [])
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
