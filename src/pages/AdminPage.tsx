import { useState, useEffect, useCallback } from 'react'
import { Shield, CheckCircle2, X, Clock, TrendingUp, Building2, Users, BadgeCheck, Star, Phone, Crown, AlertCircle } from 'lucide-react'
import { getAdminAnalytics, getAdminPayments, getPendingListings, approveListing, rejectListing, verifyPayment, rejectPayment } from '../lib/api'
import { PURPOSE_TRANSLATION_KEYS } from '../lib/constants'
import type { Payment, Listing } from '../lib/types'
import { useI18n } from '../lib/i18n'
import type { TranslationKey } from '../lib/language-types'

export default function AdminPage() {
  const { t } = useI18n()
  const [analytics, setAnalytics] = useState<Record<string, number> | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [pending, setPending] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true); setActionError('')
    try {
      const [a, p, pl] = await Promise.all([getAdminAnalytics(), getAdminPayments(), getPendingListings()])
      setAnalytics(a); setPayments(p); setPending(pl)
    } catch (err: any) { setActionError(err.message ?? 'Failed') }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null)

  const handleApprove = async (id: string) => { const { error } = await approveListing(id); if (error) { setActionError(error); return }; loadData() }
  const handleReject = async (id: string) => { const { error } = await rejectListing(id); if (error) { setActionError(error); return }; loadData() }
  const handleVerifyPayment = async (id: string) => { const { error } = await verifyPayment(id); if (error) { setActionError(error); return }; loadData() }
  const handleRejectPayment = async (id: string) => { const { error } = await rejectPayment(id); if (error) { setActionError(error); return }; loadData() }

  const executeConfirmedAction = async () => {
    if (!confirmAction) return
    if (confirmAction.type === 'approve') handleApprove(confirmAction.id)
    else if (confirmAction.type === 'rejectListing') handleReject(confirmAction.id)
    else if (confirmAction.type === 'verifyPayment') handleVerifyPayment(confirmAction.id)
    else if (confirmAction.type === 'rejectPayment') handleRejectPayment(confirmAction.id)
    setConfirmAction(null)
  }

  if (loading) return <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>

  return (
    <div className="container-app">
      <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1></div>

      {actionError && <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"><AlertCircle className="h-4 w-4 shrink-0" /> {actionError}</div>}

      {analytics && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: Building2, label: t('admin.totalListings'), value: analytics.total_listings },
            { icon: CheckCircle2, label: t('admin.published'), value: analytics.published_listings },
            { icon: Clock, label: t('admin.pendingListings'), value: analytics.pending_listings },
            { icon: Users, label: t('admin.owners'), value: analytics.total_owners },
            { icon: BadgeCheck, label: t('admin.verifiedOwners'), value: analytics.verified_owners },
            { icon: TrendingUp, label: t('admin.revenue'), value: Math.floor((analytics.total_revenue_paise ?? 0) / 100) },
          ].map((s) => (
            <div key={s.label} className="card p-3 text-center"><s.icon className="mx-auto h-5 w-5 text-brand-500" /><p className="mt-1 text-xl font-bold text-gray-900">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900"><Clock className="h-5 w-5 text-amber-500" />{t('admin.pendingListings')} ({pending.length})</h2>
        {pending.length === 0 ? <p className="mt-2 text-sm text-gray-500">{t('admin.noPending')}</p> : (
          <div className="mt-3 space-y-2">
            {pending.map((l) => (
              <div key={l.id} className="card flex items-center justify-between p-4">
                <div><p className="text-sm font-semibold text-gray-900">{l.title}</p><p className="text-xs text-gray-500">{l.area} &middot; Rs. {l.price_monthly.toLocaleString('en-IN')}/mo &middot; {l.room_type}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmAction({ type: 'approve', id: l.id })} className="btn-primary text-xs"><CheckCircle2 className="h-3 w-3" /> {t('admin.approve')}</button>
                  <button onClick={() => setConfirmAction({ type: 'rejectListing', id: l.id })} className="btn-secondary text-xs"><X className="h-3 w-3" /> {t('admin.reject')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900"><TrendingUp className="h-5 w-5 text-brand-600" />{t('admin.paymentVerification')} ({payments.length})</h2>
        {payments.length === 0 ? <p className="mt-2 text-sm text-gray-500">{t('admin.noPayments')}</p> : (
          <div className="mt-3 space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.purpose === 'featured' && <Star className="h-4 w-4 text-amber-500" />}
                    {p.purpose === 'verification' && <BadgeCheck className="h-4 w-4 text-brand-600" />}
                    {p.purpose === 'contact_unlock' && <Phone className="h-4 w-4 text-blue-500" />}
                    {p.purpose === 'subscription' && <Crown className="h-4 w-4 text-amber-500" />}
                    <div><p className="text-sm font-medium text-gray-900">{t(PURPOSE_TRANSLATION_KEYS[p.purpose] as TranslationKey)}</p><p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{p.payer_identifier && ` · ${p.payer_identifier}`}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">Rs. {(p.amount_paise / 100).toFixed(0)}</span>
                    {p.status === 'pending' && <div className="flex gap-1"><button onClick={() => setConfirmAction({ type: 'verifyPayment', id: p.id })} className="btn-primary text-xs"><CheckCircle2 className="h-3 w-3" /> {t('admin.verify')}</button><button onClick={() => setConfirmAction({ type: 'rejectPayment', id: p.id })} className="btn-secondary text-xs"><X className="h-3 w-3" /> {t('admin.reject')}</button></div>}
                    {p.status === 'pending' && <span className="badge bg-amber-100 text-amber-700"><Clock className="h-3 w-3" /> {t('dash.pending')}</span>}
                    {p.status === 'verified' && <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {t('dash.published')}</span>}
                    {p.status === 'rejected' && <span className="badge bg-red-100 text-red-700"><X className="h-3 w-3" /> {t('dash.rejected')}</span>}
                  </div>
                </div>
                {p.utr_number && <p className="mt-2 text-xs text-gray-500">{t('admin.utr')}: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">{p.utr_number}</code></p>}
              </div>
            ))}
          </div>
        )}
      </div>
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to proceed with this action? This cannot be undone.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={executeConfirmedAction} className="btn-primary flex-1">Confirm</button>
              <button onClick={() => setConfirmAction(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
