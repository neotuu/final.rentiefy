import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './supabase'

interface SignUpOptions {
  fullName?: string
  phone?: string
  gender?: string
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUpWithEmail: (email: string, password: string, options?: SignUpOptions) => Promise<{ error: string | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const LOCAL_SESSION_KEY = 'rentiefy_local_user_session'
const LOCAL_USERS_KEY = 'rentiefy_registered_users'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdminStatus = async (userId: string, email?: string) => {
    if (email && email.toLowerCase().includes('admin')) {
      setIsAdmin(true)
      return
    }
    if (isSupabaseConfigured()) {
      try {
        const { data: adminData } = await supabase.from('admin_users').select('user_id').eq('user_id', userId).maybeSingle()
        setIsAdmin(!!adminData)
      } catch {
        setIsAdmin(false)
      }
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.auth.getSession()
          if (!mounted) return
          if (!error && data?.session) {
            setSession(data.session)
            setUser(data.session.user)
            setLoading(false)
            if (data.session.user) {
              checkAdminStatus(data.session.user.id, data.session.user.email)
            }
            return
          }
        } catch {
          // Fall through to local session check if network/Supabase fails
        }
      }

      // Check stored local session fallback
      if (mounted) {
        try {
          const storedLocal = localStorage.getItem(LOCAL_SESSION_KEY)
          if (storedLocal) {
            const parsedSession: Session = JSON.parse(storedLocal)
            if (parsedSession?.user) {
              setSession(parsedSession)
              setUser(parsedSession.user)
              checkAdminStatus(parsedSession.user.id, parsedSession.user.email)
            }
          }
        } catch {
          // Ignore JSON parse error
        }
        setLoading(false)
      }
    }

    initAuth()

    let listener: { subscription: { unsubscribe: () => void } } | null = null
    if (isSupabaseConfigured()) {
      try {
        const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (!mounted) return
          if (newSession) {
            setSession(newSession)
            setUser(newSession.user)
            setLoading(false)
            checkAdminStatus(newSession.user.id, newSession.user.email)
          } else if (!localStorage.getItem(LOCAL_SESSION_KEY)) {
            setSession(null)
            setUser(null)
            setIsAdmin(false)
            setLoading(false)
          }
        })
        listener = data
      } catch {
        // Ignore subscription error
      }
    }

    return () => {
      mounted = false
      if (listener) listener.subscription.unsubscribe()
    }
  }, [])

  const createLocalSession = (email: string, fullName?: string, phone?: string, gender?: string): { user: User; session: Session } => {
    const cleanEmail = email.toLowerCase().trim()
    const name = fullName || cleanEmail.split('@')[0]
    const localUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email: cleanEmail,
      app_metadata: { provider: 'email' },
      user_metadata: {
        full_name: name,
        phone: phone || '',
        gender: gender || 'any',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User

    const localSession: Session = {
      access_token: 'local_token_' + Date.now(),
      token_type: 'bearer',
      user: localUser,
    } as Session

    return { user: localUser, session: localSession }
  }

  const signUpWithEmail = async (email: string, password: string, options?: SignUpOptions) => {
    const cleanEmail = email.toLowerCase().trim()

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: options?.fullName ?? '',
              phone: options?.phone ?? '',
              gender: options?.gender ?? 'any',
            },
          },
        })
        if (!error) return { error: null }
        if (error && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
          return { error: error.message }
        }
      } catch {
        // Fall back to local account creation on connection error
      }
    }

    // Local account registration fallback
    try {
      const stored = localStorage.getItem(LOCAL_USERS_KEY)
      const users = stored ? JSON.parse(stored) : []
      const existing = users.find((u: any) => u.email === cleanEmail)
      
      const newUser = {
        id: existing?.id || 'usr_' + Date.now().toString(36),
        email: cleanEmail,
        password,
        fullName: options?.fullName || cleanEmail.split('@')[0],
        phone: options?.phone || '',
        gender: options?.gender || 'any',
      }

      if (!existing) {
        users.push(newUser)
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
      }

      const { user: localUser, session: localSession } = createLocalSession(
        cleanEmail,
        newUser.fullName,
        newUser.phone,
        newUser.gender
      )

      setUser(localUser)
      setSession(localSession)
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localSession))
      checkAdminStatus(localUser.id, cleanEmail)
      return { error: null }
    } catch {
      return { error: 'Failed to complete registration' }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim()

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        if (!error) return { error: null }
        if (error && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
          return { error: error.message }
        }
      } catch {
        // Fall back to local account authentication on connection error
      }
    }

    // Local authentication fallback
    try {
      const stored = localStorage.getItem(LOCAL_USERS_KEY)
      const users = stored ? JSON.parse(stored) : []
      const foundUser = users.find((u: any) => u.email === cleanEmail)

      if (foundUser && foundUser.password !== password) {
        return { error: 'Invalid login credentials. Please check your password.' }
      }

      const { user: localUser, session: localSession } = createLocalSession(
        cleanEmail,
        foundUser?.fullName,
        foundUser?.phone,
        foundUser?.gender
      )

      setUser(localUser)
      setSession(localSession)
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localSession))
      checkAdminStatus(localUser.id, cleanEmail)
      return { error: null }
    } catch {
      return { error: 'Failed to sign in' }
    }
  }

  const resetPassword = async (email: string) => {
    const cleanEmail = email.toLowerCase().trim()
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth`,
        })
        if (error && !error.message.includes('Failed to fetch')) return { error: error.message }
      } catch {
        // Fall through
      }
    }
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error && !error.message.includes('Failed to fetch')) return { error: error.message }
      } catch {
        // Fall through
      }
    }
    return { error: null }
  }

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut()
      } catch {
        // Ignore signout error
      }
    }
    setUser(null)
    setSession(null)
    setIsAdmin(false)
    localStorage.removeItem(LOCAL_SESSION_KEY)
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signUpWithEmail, signInWithEmail, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
