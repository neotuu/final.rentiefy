import { useState, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, Phone, Eye, EyeOff, AlertCircle, Loader2, Check, ShieldCheck, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import { supabase } from '../lib/supabase'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Logo from '../components/Logo'

type Mode = 'signin' | 'signup'

interface AuthPageProps {
  initialMode?: Mode
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const { user, signUpWithEmail, signInWithEmail, resetPassword, updatePassword, signOut } = useAuth()
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const queryMode = searchParams.get('mode') || searchParams.get('tab')
  const pathIsSignup = location.pathname.includes('signup') || location.pathname.includes('register')
  
  const defaultMode: Mode = initialMode || (queryMode === 'signup' || pathIsSignup ? 'signup' : 'signin')
  const [mode, setMode] = useState<Mode>(defaultMode)

  useEffect(() => {
    if (queryMode === 'signup' || queryMode === 'signin') {
      setMode(queryMode as Mode)
    } else if (pathIsSignup) {
      setMode('signup')
    }
  }, [queryMode, pathIsSignup])

  // Sign-in fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [resetDone, setResetDone] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  // Sign-up fields
  const [fullName, setFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [gender, setGender] = useState('any')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Email verification screen
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resent, setResent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setShowForgot(false)
    setShowReset(false)
    setShowEmailVerification(false)
    setResent(false)
    setSearchParams({ mode: newMode }, { replace: true })
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!loginEmail.trim() || !loginPassword) {
      setError(t('auth.allFieldsRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setError(t('auth.invalidEmail'))
      return
    }
    setLoading(true)
    const { error } = await signInWithEmail(loginEmail.trim().toLowerCase(), loginPassword)
    setLoading(false)
    if (error) setError(error)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setError(t('auth.allFieldsRequired'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setError(t('auth.invalidEmail'))
      return
    }
    if (signupPassword.length < 8) {
      setError(t('auth.passwordTooShort'))
      return
    }
    if (signupPassword !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    if (!acceptTerms) {
      setError(t('auth.mustAcceptTerms'))
      return
    }

    setLoading(true)
    const { error } = await signUpWithEmail(signupEmail.trim().toLowerCase(), signupPassword, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      gender,
    })
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setPendingEmail(signupEmail.trim().toLowerCase())
      setShowEmailVerification(true)
      setSuccess('')
    }
  }

  const handleResendVerification = async () => {
    setError('')
    setResendLoading(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingEmail,
    })
    setResendLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setResent(true)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setError(t('auth.invalidEmail'))
      return
    }
    setLoading(true)
    const { error } = await resetPassword(resetEmail.trim().toLowerCase())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setResetSent(true)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError(t('auth.passwordTooShort'))
      return
    }
    setLoading(true)
    const { error } = await updatePassword(newPassword)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setResetDone(true)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSocialLoading('google')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
    setSocialLoading(null)
  }

  const handleAppleSignIn = async () => {
    setError('')
    setSocialLoading('apple')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin },
    })
    if (error) setError(error.message)
    setSocialLoading(null)
  }

  if (user) {
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 px-4 py-8">
        <div className="absolute right-4 top-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <Logo variant="vertical" size="lg" showTagline />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">You are signed in!</h2>
            <p className="mt-1 text-sm text-gray-600">
              Signed in as <span className="font-semibold text-gray-900">{userName}</span> ({user.email})
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/dashboard" className="btn-primary w-full py-2.5">
                Go to Dashboard
              </Link>
              <Link to="/browse" className="btn-secondary w-full py-2.5">
                Browse Properties
              </Link>
              <button
                onClick={async () => {
                  await signOut()
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" /> Sign Out / Switch Account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-50 px-4 py-8">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <Logo variant="vertical" size="lg" showTagline />
          </div>
          <p className="text-sm font-medium text-gray-600 mt-2">
            {mode === 'signin' ? 'Sign in to manage listings, save properties, and message owners' : 'Create an account to start renting and listing properties'}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* Email Verification Screen */}
          {showEmailVerification ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                <Mail className="h-8 w-8 text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t('auth.checkYourEmail')}</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {t('auth.verificationSentTo')} <span className="font-semibold text-gray-700">{pendingEmail}</span>
                </p>
                <p className="mt-2 text-sm text-gray-500">{t('auth.clickLinkToVerify')}</p>
              </div>

              {resent && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  <Check className="h-4 w-4 shrink-0" /> {t('auth.verificationResent')}
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="btn-secondary w-full"
              >
                {resendLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.sending')}</>
                ) : (
                  t('auth.resendVerification')
                )}
              </button>

              <button
                onClick={() => {
                  setShowEmailVerification(false)
                  setMode('signin')
                  setError('')
                  setResent(false)
                }}
                className="flex w-full items-center justify-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" /> {t('auth.backToLogin')}
              </button>
            </div>
          ) : (
            <>
              {/* Mode toggle */}
              <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${mode === 'signin' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <User className="h-4 w-4" />
                  {t('auth.signIn')}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${mode === 'signup' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <UserPlus className="h-4 w-4" />
                  {t('auth.signUp')}
                </button>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  <Check className="h-4 w-4 shrink-0" /> {success}
                </div>
              )}

              {mode === 'signin' && !showForgot && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="input pl-10"
                        placeholder={t('auth.emailPlaceholder')}
                        maxLength={100}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="input px-10"
                        placeholder={t('auth.passwordPlaceholder')}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowForgot(true); setError(''); setResetEmail(loginEmail) }}
                      className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>

                  {/* Login button */}
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.signingIn')}</>
                    ) : (
                      t('auth.signIn')
                    )}
                  </button>
                </form>
              )}

              {mode === 'signin' && showForgot && !showReset && (
                <div className="space-y-4">
                  <button onClick={() => { setShowForgot(false); setError(''); setResetSent(false) }} className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700">
                    <Mail className="h-4 w-4" /> {t('auth.backToLogin')}
                  </button>

                  {resetSent ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                        <ShieldCheck className="h-4 w-4 shrink-0" /> {t('auth.resetEmailSent')}
                      </div>
                      <button onClick={() => { setShowReset(true); setResetSent(false) }} className="btn-primary w-full">
                        {t('auth.sendResetLink')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.resetEmailLabel')}</label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="input pl-10"
                            placeholder={t('auth.emailPlaceholder')}
                            maxLength={100}
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.sending')}</>
                        ) : (
                          t('auth.sendResetLink')
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {mode === 'signin' && showReset && (
                <div className="space-y-4">
                  <button onClick={() => { setShowReset(false); setError(''); setResetDone(false) }} className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700">
                    <Mail className="h-4 w-4" /> {t('auth.backToLogin')}
                  </button>
                  {resetDone ? (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                      <Check className="h-4 w-4 shrink-0" /> {t('auth.passwordUpdated')}
                    </div>
                  ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.newPassword')}</label>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="input px-10"
                            placeholder={t('auth.newPasswordPlaceholder')}
                            autoComplete="new-password"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600" tabIndex={-1}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">{t('auth.passwordMinLength')}</p>
                      </div>
                      <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.updating')}</> : t('auth.updatePassword')}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.fullName')}</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input pl-10"
                        placeholder={t('auth.fullNamePlaceholder')}
                        maxLength={80}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="input pl-10"
                        placeholder={t('auth.emailPlaceholder')}
                        maxLength={100}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Phone (optional) */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      {t('auth.phoneNumber')} <span className="font-normal text-gray-400">({t('common.optional')})</span>
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input pl-10"
                        placeholder={t('auth.phonePlaceholder')}
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.gender')}</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
                      <option value="any">{t('gender.any')}</option>
                      <option value="male">{t('gender.male')}</option>
                      <option value="female">{t('gender.female')}</option>
                      <option value="non-binary">{t('gender.nonBinary')}</option>
                      <option value="other">{t('gender.other')}</option>
                      <option value="prefer-not">{t('gender.preferNot')}</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="input px-10"
                        placeholder={t('auth.passwordPlaceholder')}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{t('auth.passwordMinLength')}</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('auth.confirmPassword')}</label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input pl-10"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Accept terms */}
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span>
                      {t('auth.acceptTermsPrefix')}{' '}
                      <span className="font-medium text-brand-600">{t('auth.termsOfService')}</span>{' '}
                      {t('auth.and')}{' '}
                      <span className="font-medium text-brand-600">{t('auth.privacyPolicy')}</span>
                    </span>
                  </label>

                  {/* Sign up button */}
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.signingUp')}</>
                    ) : (
                      t('auth.signUp')
                    )}
                  </button>
                </form>
              )}

              {/* Divider + Social (hidden in forgot-password view) */}
              {!(mode === 'signin' && (showForgot || showReset)) && (
                <>
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{t('auth.orContinueWith')}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={socialLoading !== null}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      {socialLoading === 'google' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      {t('auth.continueWithGoogle')}
                    </button>
                    <button
                      onClick={handleAppleSignIn}
                      disabled={socialLoading !== null}
                      className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      {socialLoading === 'apple' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      )}
                      {t('auth.continueWithApple')}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {!showEmailVerification && !(mode === 'signin' && showForgot) && (
          <p className="mt-4 text-center text-sm text-gray-500">
            {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
            <button onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="ml-1 font-semibold text-brand-600 transition hover:text-brand-700">
              {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
