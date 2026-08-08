import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { LANGUAGES } from '../lib/language-types'
import type { Language } from '../lib/language-types'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 sm:px-2.5 sm:py-1.5 sm:text-xs"
        title="Change Language"
      >
        <Globe className="h-3.5 w-3.5 text-brand-600" />
        <span className="inline-block max-w-[80px] truncate sm:max-w-none">{current.nativeLabel}</span>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5">
          <div className="px-3 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Select Language ({LANGUAGES.length})
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as Language); setOpen(false) }}
              className={`flex w-full items-center justify-between px-3.5 py-2 text-xs transition hover:bg-brand-50/60 sm:text-sm ${
                language === lang.code ? 'font-bold text-brand-600 bg-brand-50/40' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <div className="flex flex-col text-left">
                  <span className="font-medium text-gray-900">{lang.nativeLabel}</span>
                  {lang.code !== 'en' && <span className="text-[10px] text-gray-400">{lang.label}</span>}
                </div>
              </div>
              {language === lang.code && <Check className="h-4 w-4 text-brand-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

