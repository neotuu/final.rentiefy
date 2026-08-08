import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN || ''

export function initSentry() {
  if (!dsn) {
    console.log('[Sentry] VITE_SENTRY_DSN not configured. Local error tracking initialized.')
    return
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE || 'production',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.2, // Capture 20% of transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample rate for all sessions
      replaysOnErrorSampleRate: 1.0, // If error occurs, sample 100% of session
    })
    console.log('[Sentry] Successfully initialized Sentry monitoring.')
  } catch (err) {
    console.error('[Sentry] Failed to initialize Sentry:', err)
  }
}

export function captureException(error: unknown, extraContext?: Record<string, any>) {
  console.error('[Sentry captureException]:', error, extraContext)
  if (dsn) {
    Sentry.captureException(error, {
      extra: extraContext,
    })
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  console.log(`[Sentry captureMessage - ${level}]:`, message)
  if (dsn) {
    Sentry.captureMessage(message, level)
  }
}

export function setUserContext(user: { id: string; email?: string; name?: string } | null) {
  if (user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    })
  } else {
    Sentry.setUser(null)
  }
}

export function clearUserContext() {
  Sentry.setUser(null)
}
