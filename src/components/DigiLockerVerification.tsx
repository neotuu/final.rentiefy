import { useState, useEffect } from 'react'
import {
  ShieldCheck, FileCheck2, Loader2, CheckCircle2, Clock, X, Fingerprint, ChevronDown,
} from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { getUserVerification, submitVerification, type IdType, type UserVerification } from '../lib/api'
import type { TranslationKey } from '../lib/language-types'

const ID_TYPES: { value: IdType; labelKey: string }[] = [
  { value: 'aadhaar', labelKey: 'kyc.aadhaar' },
  { value: 'pan', labelKey: 'kyc.pan' },
  { value: 'driving_license', labelKey: 'kyc.drivingLicense' },
  { value: 'voter_id', labelKey: 'kyc.voterId' },
  { value: 'passport', labelKey: 'kyc.passport' },
]

interface Props {
  userId: string
  onVerified?: () => void
}

export default function DigiLockerVerification({ userId, onVerified }: Props) {
  const { t } = useI18n()
  const [verification, setVerification] = useState<UserVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    id_type: 'aadhaar' as IdType,
    id_number: '',
    name_on_id: '',
    dob: '',
  })

  useEffect(() => {
    getUserVerification(userId).then((v) => {
      setVerification(v)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.id_number.trim() || !form.name_on_id.trim()) {
      setError(t('kyc.allFieldsRequired'))
      return
    }
    setSubmitting(true)
    const { error: err } = await submitVerification({
      user_id: userId,
      id_type: form.id_type,
      id_number: form.id_number.trim(),
      name_on_id: form.name_on_id.trim(),
      dob: form.dob || undefined,
    })
    setSubmitting(false)
    if (err) {
      setError(err)
      return
    }
    const updated = await getUserVerification(userId)
    setVerification(updated)
    setShowForm(false)
    setForm({ id_type: 'aadhaar' as IdType, id_number: '', name_on_id: '', dob: '' })
    if (updated?.status === 'verified' && onVerified) onVerified()
  }

  if (loading) {
    return (
      <div className="card flex items-center gap-3 p-5">
        <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
        <span className="text-sm text-gray-500">{t('common.loading')}</span>
      </div>
    )
  }

  const isVerified = verification?.status === 'verified'
  const isPending = verification?.status === 'pending'

  return (
    <div className="card overflow-hidden p-0">
      {/* Header */}
      <div className={`flex items-center gap-3 p-5 ${isVerified ? 'bg-brand-50' : isPending ? 'bg-amber-50' : 'bg-gray-50'}`}>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isVerified ? 'bg-brand-100 text-brand-600' : isPending ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
          {isVerified ? <ShieldCheck className="h-6 w-6" /> : isPending ? <Clock className="h-6 w-6" /> : <Fingerprint className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{t('kyc.digiLockerTitle')}</h3>
          <p className="text-xs text-gray-500">
            {isVerified ? t('kyc.verifiedStatus') : isPending ? t('kyc.pendingStatus') : t('kyc.notVerifiedStatus')}
          </p>
        </div>
        {isVerified && <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {t('kyc.verified')}</span>}
        {isPending && <span className="badge bg-amber-100 text-amber-700"><Clock className="h-3 w-3" /> {t('kyc.pending')}</span>}
      </div>

      {/* Body */}
      <div className="p-5">
        {isVerified && verification ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileCheck2 className="h-4 w-4 text-brand-500" />
              <span>{t(ID_TYPES.find((i) => i.value === verification.id_type)?.labelKey ?? 'kyc.aadhaar' as TranslationKey)}</span>
              <span className="text-gray-400">****{verification.id_number_last4}</span>
            </div>
            <p className="text-xs text-gray-500">{t('kyc.verifiedDesc')}</p>
          </div>
        ) : isPending && verification ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileCheck2 className="h-4 w-4 text-amber-500" />
              <span>{t(ID_TYPES.find((i) => i.value === verification.id_type)?.labelKey ?? 'kyc.aadhaar' as TranslationKey)}</span>
              <span className="text-gray-400">****{verification.id_number_last4}</span>
            </div>
            <p className="text-xs text-gray-500">{t('kyc.pendingDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t('kyc.introDesc')}</p>
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="btn-primary w-full">
                <Fingerprint className="h-4 w-4" /> {t('kyc.verifyNow')}
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('kyc.idType')}</label>
                  <div className="relative">
                    <select
                      value={form.id_type}
                      onChange={(e) => setForm({ ...form, id_type: e.target.value as IdType })}
                      className="input appearance-none pr-10"
                    >
                      {ID_TYPES.map((i) => <option key={i.value} value={i.value}>{t(i.labelKey as TranslationKey)}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('kyc.idNumber')}</label>
                  <input
                    type="text"
                    value={form.id_number}
                    onChange={(e) => setForm({ ...form, id_number: e.target.value.slice(0, 20) })}
                    maxLength={20}
                    className="input"
                    placeholder={t('kyc.idNumberPlaceholder')}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('kyc.nameOnId')}</label>
                  <input
                    type="text"
                    value={form.name_on_id}
                    onChange={(e) => setForm({ ...form, name_on_id: e.target.value.slice(0, 80) })}
                    maxLength={80}
                    className="input"
                    placeholder={t('kyc.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">{t('kyc.dob')}</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="input"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    <X className="h-4 w-4 shrink-0" /> {error}
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {t('kyc.submit')}
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400">{t('kyc.privacyNote')}</p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
