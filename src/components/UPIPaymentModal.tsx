import { useState } from 'react'
import { X, Copy, Check, ArrowRight } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { UPI_ID, PRICING, PRICING_LABELS, PURPOSE_TRANSLATION_KEYS } from '../lib/constants'
import { createPayment, updatePaymentUtr, createBoostListing } from '../lib/api'
import type { PaymentPurpose } from '../lib/types'
import type { TranslationKey } from '../lib/language-types'

// Duration in days for each feature type
const FEATURE_DURATIONS: Record<string, number> = {
  sponsored: 7, boost: 7, premium_badge: 30, ai_price_opt: 30,
  email_alerts: 7, whatsapp_alerts: 30, reel_creation: 90, builder_subscription: 30,
  featured: 7, verification: 365, subscription: 30,
}

interface Props {
  open: boolean
  purpose: PaymentPurpose
  listingId?: string
  payerIdentifier: string
  userId: string
  onSuccess: () => void
  onClose: () => void
}

export default function UPIPaymentModal({ open, purpose, listingId, payerIdentifier, userId, onSuccess, onClose }: Props) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [utr, setUtr] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [paymentId, setPaymentId] = useState<string | null>(null)

  if (!open) return null

  const amount = PRICING[purpose]
  const amountRs = (amount / 100).toFixed(0)

  const handlePaid = async () => {
    setSubmitting(true); setError('')
    try {
      const { payment, error: err } = await createPayment({ purpose, listing_id: listingId, payer_identifier: payerIdentifier }, userId)
      if (err || !payment) { setError(err ?? 'Failed'); setSubmitting(false); return }
      setPaymentId(payment.id)
      setStep(2)
    } catch { setError('Failed'); }
    setSubmitting(false)
  }

  const handleSubmitUtr = async () => {
    if (!utr.trim() || utr.trim().length < 8) { setError(t('payment.invalidUtr')); return }
    setSubmitting(true); setError('')
    try {
      if (!paymentId) { setError('No payment'); setSubmitting(false); return }
      const { error: err } = await updatePaymentUtr(paymentId, utr.trim())
      if (err) { setError(err); setSubmitting(false); return }
      setStep(3)
    } catch { setError('Failed'); }
    setSubmitting(false)
  }

  const handleDone = () => {
    // Create boost listing record for monetization features
    if (listingId && userId && FEATURE_DURATIONS[purpose]) {
      createBoostListing({
        listing_id: listingId,
        user_id: userId,
        feature_type: purpose as any,
        duration_days: FEATURE_DURATIONS[purpose],
      }).catch(() => {})
    }
    setStep(1); setUtr(''); setPaymentId(null); setError('')
    onSuccess()
  }

  const copyUpi = () => {
    navigator.clipboard?.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t(PURPOSE_TRANSLATION_KEYS[purpose] as TranslationKey)}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        {step === 1 && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">{t('payment.step1Desc', { amount: amountRs, upiId: UPI_ID })}</p>
            <div className="flex items-center justify-center rounded-xl bg-gray-50 p-4">
              <div className="text-center">
                <div className="mx-auto h-32 w-32 rounded-xl bg-white p-2 shadow-sm">
                  <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">UPI ID</p>
                      <p className="mt-1 font-mono text-sm font-bold text-brand-600">{UPI_ID}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <div><p className="text-xs text-gray-400">{t('payment.upiId')}</p><p className="font-mono text-sm font-semibold text-gray-900">{UPI_ID}</p></div>
              <button onClick={copyUpi} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100">{copied ? <Check className="h-4 w-4 text-brand-600" /> : <Copy className="h-4 w-4" />}</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400">{t('payment.amount')}</p>
              <p className="text-lg font-bold text-brand-600">{PRICING_LABELS[purpose].label}</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handlePaid} disabled={submitting} className="btn-primary w-full">
              {submitting ? t('common.loading') : <>{t('payment.paid')} <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">{t('payment.step2Desc')}</p>
            <input value={utr} onChange={(e) => setUtr(e.target.value.slice(0, 20))} maxLength={20} className="input" placeholder={t('payment.utrPlaceholder')} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handleSubmitUtr} disabled={submitting} className="btn-primary w-full">
              {submitting ? t('common.loading') : t('payment.submitUtr')}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-4 space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Check className="h-7 w-7" /></div>
            <h3 className="text-base font-semibold text-gray-900">{t('payment.step3Title')}</h3>
            <p className="text-sm text-gray-500">{t('payment.step3Desc')}</p>
            <button onClick={handleDone} className="btn-primary w-full">{t('payment.done')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
