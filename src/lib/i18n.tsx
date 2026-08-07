import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Language, TranslationKey } from './language-types'
import en from './translations/en'
import hi from './translations/hi'
import mr from './translations/mr'
import bn from './translations/bn'
import te from './translations/te'
import ta from './translations/ta'
import gu from './translations/gu'
import kn from './translations/kn'
import ml from './translations/ml'
import pa from './translations/pa'
import or from './translations/or'
import ur from './translations/ur'

const translations: Record<Language, Record<string, string>> = {
  en, hi, mr, bn, te, ta, gu, kn, ml, pa, or, ur
}

const STORAGE_KEY = 'rentiefy-language'

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored && translations[stored]) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  const formatFallbackKey = (key: string): string => {
    if (!key) return ''
    const parts = key.split('.')
    const raw = parts[parts.length - 1]
    const words = raw
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .trim()
    return words.charAt(0).toUpperCase() + words.slice(1)
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = translations[language]
    const valFromLang = langDict?.[key]
    const valFromEn = translations.en?.[key]

    let str = (valFromLang && valFromLang.trim().length > 0)
      ? valFromLang
      : (valFromEn && valFromEn.trim().length > 0)
        ? valFromEn
        : formatFallbackKey(key)

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return str
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}


export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
