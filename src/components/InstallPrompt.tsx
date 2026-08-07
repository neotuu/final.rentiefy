import { useEffect, useRef, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { RentIcon } from './Logo'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'rentiefy-install-dismissed'
const DISMISS_DAYS = 14

export default function InstallPrompt() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const last = localStorage.getItem(DISMISS_KEY)
    if (last && Date.now() - Number(last) < DISMISS_DAYS * 86400000) return

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    if (isStandalone) return

    const ua = window.navigator.userAgent
    const ios = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)
    setIsIOS(ios)

    const handler = (e: Event) => {
      e.preventDefault()
      const evt = e as BeforeInstallPromptEvent
      deferredRef.current = evt
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const requestHandler = () => {
      if (deferredRef.current) {
 deferredRef.current.prompt()
      } else {
        setVisible(true)
      }
    }
    window.addEventListener('rentiefy-install-request', requestHandler)

    if (ios) {
      const t = setTimeout(() => setVisible(true), 4000)
      return () => {
        clearTimeout(t)
        window.removeEventListener('beforeinstallprompt', handler)
        window.removeEventListener('rentiefy-install-request', requestHandler)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('rentiefy-install-request', requestHandler)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }

  const install = async () => {
    if (deferredRef.current) {
      await deferredRef.current.prompt()
      await deferredRef.current.userChoice
      deferredRef.current = null
      setVisible(false)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  return (
    <div className="animate-fade-in-up fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-sm rounded-2xl border border-gray-100 bg-white p-4 shadow-xl lg:bottom-6">
      <button onClick={dismiss} className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
          <RentIcon size={28} houseFill="#0d9488" windowFill="#FFFFFF" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">Install Rentiefy</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {isIOS
              ? 'Tap the Share icon, then "Add to Home Screen" to install the app.'
              : 'Add Rentiefy to your home screen for a faster, full-screen experience.'}
          </p>
          {!isIOS && (
            <button onClick={install} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700">
              <Download className="h-3.5 w-3.5" /> Install now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
