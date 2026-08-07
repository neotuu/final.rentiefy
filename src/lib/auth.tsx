import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

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

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
      if (data.session?.user) {
        supabase.from('admin_users').select('user_id').eq('user_id', data.session.user.id).maybeSingle()
          .then(({ data: adminData }) => { if (mounted) setIsAdmin(!!adminData) })
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
      setIsAdmin(false)
      if (newSession?.user) {
        (async () => {
          const { data: adminData } = await supabase.from('admin_users').select('user_id').eq('user_id', newSession.user.id).maybeSingle()
          if (mounted) setIsAdmin(!!adminData)
        })()
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUpWithEmail = async (email: string, password: string, options?: SignUpOptions) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: options?.fullName ?? '',
          phone: options?.phone ?? '',
          gender: options?.gender ?? 'any',
        },
      },
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { error: null }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      return { error: null }
    } catch (err: any) {
      return { error: err.message ?? 'Failed to sign out' }
    }
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
