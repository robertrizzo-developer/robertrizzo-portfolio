import { createContext } from 'react'
import type { AppApi } from './contracts'

export const ApiContext = createContext<AppApi | null>(null)
