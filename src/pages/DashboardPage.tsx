import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star, BadgeCheck, Crown, TrendingUp, Phone, Lock, CheckCircle2, Clock, X,
  Sparkles, Building2, Flame, Mail, MessageCircle, Video, Trash2, Power, AlertCircle, Pencil,
  Calendar, MapPin, UserCheck, Check,
} from 'lucide-react'
import { getMyPayments, getMyListings, deleteListing, deactivateListing, reactivateListing, getViewingSchedulesForUser, updateViewingScheduleStatus } from '../lib/api'
import { PRICING_LABELS, PURPOSE_TRANSLATION_KEYS, MONETIZATION_FEATURES } from '../lib/constants'
import type { Payment, PaymentPurpose, ListingWithDetails, ViewingSchedule } from '../lib/types'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import type { TranslationKey } from '../lib/language-types'
import UPIPaymentModal from '../components/UPIPaymentModal'
import DigiLockerVerification from '../components/DigiLockerVerification'

const PURPOSE_ICONS: Record<PaymentPurpose, typeof Star> = {
  contact_unlock: Phone, featured: Star, verification: BadgeCheck, subscription: Crown,
  sponsored: Flame, boost: TrendingUp, premium_badge: Crown, ai_price_opt: Sparkles,
  email_alerts: Mail, whatsapp_alerts: MessageCircle, reel_creation: Video, builder_subscription: Building2,
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [payments, setPayments] = useState<Payment[]>([])
  const [listings, setListings] = useState<ListingWithDetails[]>([])
  const [schedules, setSchedules] = useState<ViewingSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>('featured')
  const [paymentListingId, setPaymentListingId] = useState<string | undefined>()
  const [selectedListingId, setSelectedListingId] = useState<string>('')
  const [actionError, setActionError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [pays, lists, schs] = await Promise.all([
        getMyPayments(user.id),
        getMyListings(user.id),
        getViewingSchedulesForUser(user.id),
      ])
      setPayments(pays)
      setListings(lists)
      setSchedules(schs)
    } catch { }
    setLoading(false)
  }, [user])

  const handleUpdateSchedule = async (scheduleId: string, status: 'confirmed' | 'cancelled') => {
    const res = await updateViewingScheduleStatus(scheduleId, status)
    if (res.success) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status } : s))
      )
    }
  }

  useEffect(() => { loadData() }, [loadData])

  const openPayment = (purpose: PaymentPurpose, listingId?: string) => {
    setPaymentPurpose(purpose); setPaymentListingId(listingId); setShowPayment(true)
  }

  const openFeaturePayment = (purpose: PaymentPurpose) => {
    if (!selectedListingId) return
    openPayment(purpose, selectedListingId)
  }

  const handleDelete = async (listingId: string) => {
    setActionError('')
    const { error } = await deleteListing(listingId)
    if (error) { setActionError(error); return }
    setConfirmDelete(null)
    loadData()
  }

  const handleDeactivate = async (listingId: string) => {
    setActionError('')
    const { error } = await deactivateListing(listingId)
    if (error) { setActionError(error); return }
    loadData()
  }

  const handleReactivate = async (listingId: string) => {
    setActionError('')
    const { error } = await reactivateListing(listingId)
    if (error) { setActionError(error); return }
    loadData()
  }

  const totalSpent = payments.filter((p) => p.status === 'verified').reduce((sum, p) => sum + p.amount_paise, 0)
  const isVerified = payments.some((p) => p.status === 'verified' && p.purpose === 'verification')
  const isSubscribed = payments.some((p) => p.status === 'verified' && p.purpose === 'subscription')

  const activeFeatures = new Set<PaymentPurpose>()
  payments.forEach((p) => {
    if (p.status === 'verified' && p.listing_id === selectedListingId) {
      activeFeatures.add(p.purpose)
    }
  })

  return (
    <div className="container-app">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dash.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('dash.welcome', { name: user?.email ?? 'User' })}</p>
      </div>

      {actionError && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {actionError}
        </div>
      )}

      {loading && <div className="flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>}

      {!loading && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="card p-4"><div className="flex items-center gap-2 text-brand-600"><TrendingUp className="h-4 w-4" /><span className="text-xs font-medium text-gray-500">{t('dash.totalSpent')}</span></div><p className="mt-2 text-lg font-bold text-gray-900">Rs. {(totalSpent / 100).toLocaleString('en-IN')}</p></div>
            <div className="card p-4"><div className="flex items-center gap-2 text-amber-500"><Star className="h-4 w-4" /><span className="text-xs font-medium text-gray-500">{t('dash.featured')}</span></div><p className="mt-2 text-lg font-bold text-gray-900">{payments.filter((p) => p.status === 'verified' && p.purpose === 'featured').length}</p></div>
            <div className="card p-4"><div className="flex items-center gap-2"><BadgeCheck className={`h-4 w-4 ${isVerified ? 'text-brand-600' : 'text-gray-300'}`} /><span className="text-xs font-medium text-gray-500">{t('dash.verified')}</span></div><p className="mt-2 text-lg font-bold text-gray-900">{isVerified ? t('dash.yes') : t('dash.no')}</p></div>
            <div className="card p-4"><div className="flex items-center gap-2"><Crown className={`h-4 w-4 ${isSubscribed ? 'text-amber-500' : 'text-gray-300'}`} /><span className="text-xs font-medium text-gray-500">{t('dash.premium')}</span></div><p className="mt-2 text-lg font-bold text-gray-900">{isSubscribed ? t('dash.active') : t('dash.inactive')}</p></div>
          </div>

          {user && (
            <div className="mt-6">
              <DigiLockerVerification userId={user.id} />
            </div>
          )}

          {/* Scheduled Property Visits Section */}
          <div className="mt-6 card p-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">Scheduled Property Visits</h3>
              </div>
              <span className="badge bg-emerald-100 text-emerald-800 text-xs font-semibold">
                {schedules.length} {schedules.length === 1 ? 'Visit' : 'Visits'}
              </span>
            </div>

            {schedules.length === 0 ? (
              <div className="py-6 text-center">
                <Calendar className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-xs font-medium text-gray-500">No scheduled visits yet.</p>
                <p className="text-[11px] text-gray-400">Visit any listing page to schedule a property viewing with the landlord.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {schedules.map((sch) => {
                  const isLandlord = sch.owner_id === user?.id
                  return (
                    <div
                      key={sch.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-slate-50/50 p-3.5 text-xs transition hover:border-emerald-200"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{sch.listing_title}</span>
                          <span
                            className={`badge capitalize text-[10px] ${
                              sch.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sch.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sch.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
                          <span className="flex items-center gap-1 font-medium text-emerald-800">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            {new Date(sch.preferred_date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at {sch.preferred_time}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Phone className="h-3 w-3" />
                            {isLandlord ? `Tenant: ${sch.user_name} (${sch.user_phone})` : `Phone: ${sch.user_phone}`}
                          </span>
                        </div>
                        {sch.notes && (
                          <p className="text-[11px] text-gray-500 italic bg-white p-1.5 rounded-md border border-gray-100">
                            "{sch.notes}"
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => navigate(`/listing/${sch.listing_id}`)}
                          className="btn-outline text-[11px] py-1 px-2.5"
                        >
                          View Listing
                        </button>

                        {isLandlord && sch.status === 'pending' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateSchedule(sch.id, 'confirmed')}
                              className="btn-primary text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" /> Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateSchedule(sch.id, 'cancelled')}
                              className="btn-ghost text-[11px] py-1 px-2 text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {listings.length > 0 && (
            <div className="mt-6 card p-5">
              <h3 className="text-sm font-semibold text-gray-900">{t('dash.myListings')}</h3>
              <div className="mt-3 space-y-2">
                {listings.map((l) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{l.title}</p>
                        <p className="text-xs text-gray-400">{l.area} &middot; Rs. {l.price_monthly.toLocaleString('en-IN')}/mo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {l.status === 'pending' && <span className="badge bg-amber-100 text-amber-700"><Clock className="h-3 w-3" /> {t('dash.pending')}</span>}
                      {l.status === 'published' && <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {t('dash.published')}</span>}
                      {l.status === 'rejected' && <span className="badge bg-red-100 text-red-700"><X className="h-3 w-3" /> {t('dash.rejected')}</span>}
                      {l.status === 'inactive' && <span className="badge bg-gray-100 text-gray-500"><Power className="h-3 w-3" /> {t('dash.inactive')}</span>}
                      <button
                        onClick={() => navigate(`/list-property?edit=${l.id}`)}
                        className="btn-ghost text-xs text-brand-600"
                        title="Edit listing"
                      >
                        <Pencil className="h-3 w-3" /> {t('dash.edit')}
                      </button>
                      {l.status === 'published' && (
                        <button
                          onClick={() => { setSelectedListingId(l.id); openPayment('featured', l.id) }}
                          className={`btn-ghost text-xs ${selectedListingId === l.id ? 'ring-2 ring-brand-300' : ''}`}
                        >
                          <Star className="h-3 w-3" /> {selectedListingId === l.id ? t('dash.selected') : t('dash.boost')}
                        </button>
                      )}
                      {l.status !== 'inactive' ? (
                        <button onClick={() => handleDeactivate(l.id)} className="btn-ghost text-xs text-gray-500" title="Deactivate">
                          <Power className="h-3 w-3" />
                        </button>
                      ) : (
                        <button onClick={() => handleReactivate(l.id)} className="btn-ghost text-xs text-brand-600" title="Reactivate">
                          <Power className="h-3 w-3" />
                        </button>
                      )}
                      {confirmDelete === l.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(l.id)} className="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-700">{t('dash.confirm')}</button>
                          <button onClick={() => setConfirmDelete(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500">{t('dash.cancel')}</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(l.id)} className="btn-ghost text-xs text-red-500" title="Delete">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900">{t('dash.monetizationTitle')}</h2>
            <p className="mt-1 text-sm text-gray-500">{t('dash.monetizationSubtitle')}</p>

            {listings.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <select
                  value={selectedListingId}
                  onChange={(e) => setSelectedListingId(e.target.value)}
                  className="input max-w-xs"
                >
                  <option value="">{t('dash.selectListing')}</option>
                  {listings.filter((l) => l.status === 'published').map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MONETIZATION_FEATURES.map((feat) => {
                const Icon = PURPOSE_ICONS[feat.purpose]
                const isActive = activeFeatures.has(feat.purpose)
                return (
                  <div key={feat.purpose} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 ${feat.color}`}><Icon className="h-5 w-5" /></div>
                      {isActive && <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {t('dash.activeFeature')}</span>}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">{t(PURPOSE_TRANSLATION_KEYS[feat.purpose] as TranslationKey)}</h3>
                    <p className="mt-1 text-xs text-gray-500">{t(feat.descKey as TranslationKey)}</p>
                    <p className="mt-3 text-lg font-bold text-gray-900">{PRICING_LABELS[feat.purpose].label}</p>
                    <p className="text-xs text-gray-400">{PRICING_LABELS[feat.purpose].sub}</p>
                    <button
                      onClick={() => openFeaturePayment(feat.purpose)}
                      disabled={!selectedListingId || isActive}
                      className="btn-primary mt-3 w-full"
                    >
                      {isActive ? t('dash.activeFeature') : t('dash.getStarted')}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-4"><div className="flex items-center gap-2 text-amber-500"><Star className="h-5 w-5" /><h3 className="text-sm font-semibold text-gray-900">{t('dash.featuredListing')}</h3></div><p className="mt-2 text-xs text-gray-500">{t('dash.featuredListingDesc')}</p><p className="mt-2 text-lg font-bold text-gray-900">{PRICING_LABELS.featured.label}</p><p className="text-xs text-gray-400">{PRICING_LABELS.featured.sub}</p><button onClick={() => openPayment('featured')} className="btn-primary mt-3 w-full"><Star className="h-4 w-4" /> {t('dash.getFeatured')}</button></div>
            <div className="card p-4"><div className="flex items-center gap-2 text-brand-600"><BadgeCheck className="h-5 w-5" /><h3 className="text-sm font-semibold text-gray-900">{t('dash.verifiedBadge')}</h3></div><p className="mt-2 text-xs text-gray-500">{t('dash.verifiedBadgeDesc')}</p><p className="mt-2 text-lg font-bold text-gray-900">{PRICING_LABELS.verification.label}</p><p className="text-xs text-gray-400">{PRICING_LABELS.verification.sub}</p><button onClick={() => openPayment('verification')} disabled={isVerified} className="btn-primary mt-3 w-full"><BadgeCheck className="h-4 w-4" /> {isVerified ? t('dash.alreadyVerified') : t('dash.getVerified')}</button></div>
            <div className="card p-4"><div className="flex items-center gap-2 text-blue-500"><Phone className="h-5 w-5" /><h3 className="text-sm font-semibold text-gray-900">{t('dash.contactUnlocks')}</h3></div><p className="mt-2 text-xs text-gray-500">{t('dash.contactUnlocksDesc')}</p><p className="mt-2 text-lg font-bold text-gray-900">{PRICING_LABELS.contact_unlock.label}</p><p className="text-xs text-gray-400">{PRICING_LABELS.contact_unlock.sub}</p><div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-500"><Lock className="mr-1 inline h-3 w-3" /> {t('dash.automatic')}</div></div>
            <div className="card p-4"><div className="flex items-center gap-2 text-amber-500"><Crown className="h-5 w-5" /><h3 className="text-sm font-semibold text-gray-900">{t('dash.premiumPlan')}</h3></div><p className="mt-2 text-xs text-gray-500">{t('dash.premiumPlanDesc')}</p><p className="mt-2 text-lg font-bold text-gray-900">{PRICING_LABELS.subscription.label}</p><p className="text-xs text-gray-400">{PRICING_LABELS.subscription.sub}</p><button onClick={() => openPayment('subscription')} disabled={isSubscribed} className="btn-primary mt-3 w-full"><Crown className="h-4 w-4" /> {isSubscribed ? t('dash.active') : t('dash.subscribe')}</button></div>
          </div>

          {payments.length > 0 ? (
            <div className="mt-6 card p-5">
              <h3 className="text-sm font-semibold text-gray-900">{t('dash.paymentHistory')}</h3>
              <div className="mt-3 space-y-2">
                {payments.map((p) => {
                  const Icon = PURPOSE_ICONS[p.purpose] ?? Star
                  return (
                    <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <div><p className="text-sm font-medium text-gray-900">{t(PURPOSE_TRANSLATION_KEYS[p.purpose] as TranslationKey)}</p><p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">Rs. {(p.amount_paise / 100).toFixed(0)}</span>
                        {p.status === 'pending' && <span className="badge bg-amber-100 text-amber-700"><Clock className="h-3 w-3" /> {t('dash.pending')}</span>}
                        {p.status === 'verified' && <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {t('dash.published')}</span>}
                        {p.status === 'rejected' && <span className="badge bg-red-100 text-red-700"><X className="h-3 w-3" /> {t('dash.rejected')}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 card flex flex-col items-center justify-center py-12 text-center"><Sparkles className="h-10 w-10 text-gray-300" /><h3 className="mt-3 text-base font-semibold text-gray-900">{t('dash.noPayments')}</h3><p className="mt-1 text-sm text-gray-500">{t('dash.noPaymentsDesc')}</p></div>
          )}
        </>
      )}

      <UPIPaymentModal open={showPayment} purpose={paymentPurpose} listingId={paymentListingId} payerIdentifier={user?.email ?? ''} userId={user?.id ?? ''} onSuccess={() => { setShowPayment(false); setTimeout(() => loadData(), 1000) }} onClose={() => setShowPayment(false)} />
    </div>
  )
}
