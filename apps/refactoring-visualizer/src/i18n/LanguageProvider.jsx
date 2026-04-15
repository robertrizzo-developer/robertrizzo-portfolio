import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nContext } from './i18nContext'
import { translations } from './translations'

function getNested(obj, path) {
  const parts = path.split('.')
  let v = obj
  for (const p of parts) {
    v = v?.[p]
  }
  return typeof v === 'string' ? v : null
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('sv')

  const t = useCallback(
    (key) => {
      const dict = translations[lang] ?? translations.sv
      return getNested(dict, key) ?? getNested(translations.en, key) ?? key
    },
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang === 'sv' ? 'sv' : 'en'
  }, [lang])

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, t],
  )

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}
