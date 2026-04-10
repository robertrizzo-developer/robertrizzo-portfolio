import { useContext } from 'react'
import { ApiContext } from './apiContext'
import type { AppApi } from './contracts'

export function useApi(): AppApi {
  const ctx = useContext(ApiContext)
  if (!ctx) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return ctx
}
