import { useEffect } from 'react'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined

let loaded = false

function loadGAScript(measurementId: string) {
  if (loaded || !measurementId || measurementId.startsWith('your_')) return
  loaded = true

  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: false });
  `
  document.head.appendChild(script2)
}

export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.startsWith('your_')) return
  if (typeof window === 'undefined' || !(window as any).gtag) return
  ;(window as any).gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.startsWith('your_')) return
  if (typeof window === 'undefined' || !(window as any).gtag) return
  ;(window as any).gtag('event', name, params ?? {})
}

export function useAnalytics() {
  useEffect(() => {
    if (GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.startsWith('your_')) {
      loadGAScript(GA_MEASUREMENT_ID)
    }
  }, [])
}
