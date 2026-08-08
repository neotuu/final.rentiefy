import { useEffect, useState } from 'react'
import { Heart, Link as LinkIcon, Bell, CheckCircle2, Send, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { notifySavedPropertyUpdate } from '../lib/api'
import ListingCard from '../components/ListingCard'
import type { ListingWithDetails } from '../lib/types'

export default function SavedPropertiesPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [saved, setSaved] = useState<ListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [testSending, setTestSending] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<{ id: string; msg: string; success: boolean } | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    (async () => {
      try {
        const { data: savedRows } = await supabase.from('saved_properties').select('listing_id').eq('user_id', user.id)
        if (!savedRows || savedRows.length === 0) { setSaved([]); return }
        const ids = savedRows.map((r: any) => r.listing_id)
        const { data: listings } = await supabase
          .from('listings')
          .select(`*, media:listing_media(*), amenities:listing_amenities(amenity:amenities(*)), owner:owners(*)`)
          .in('id', ids)
          .eq('status', 'published')
        if (listings) {
          setSaved(listings.map((l: any) => ({ ...l, media: l.media ?? [], amenities: (l.amenities ?? []).map((a: any) => a.amenity).filter(Boolean), owner: l.owner })))
        }
      } catch { }
      setLoading(false)
    })()
  }, [user])

  const handleTestTrigger = async (listing: ListingWithDetails) => {
    setTestSending(listing.id)
    setTestStatus(null)
    const oldPrice = listing.price_monthly + 2000
    const res = await notifySavedPropertyUpdate({
      listing_id: listing.id,
      update_type: 'price_drop',
      old_price: oldPrice,
      new_price: listing.price_monthly,
      listing_title: listing.title,
    })
    setTestSending(null)
    if (res.success) {
      setTestStatus({
        id: listing.id,
        msg: `Supabase Edge Function executed successfully! Triggered price drop email notification for ${res.notified_users ?? 1} saved subscriber(s).`,
        success: true,
      })
    } else {
      setTestStatus({
        id: listing.id,
        msg: `Trigger test failed: ${res.error || 'Unknown error'}`,
        success: false,
      })
    }
  }

  return (
    <div className="container-app">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-gray-900">{t('saved.title')}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">{t('saved.subtitle')}</p>
        </div>
      </div>

      {/* Edge Function Email Alert Info Banner */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-brand-200 bg-brand-50/60 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-brand-600 p-2 text-white">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-brand-900">
              <CheckCircle2 className="h-4 w-4 text-brand-600" />
              <span>Email Price Drop & Status Notifications Active</span>
            </div>
            <p className="mt-0.5 text-xs text-brand-700">
              Supabase Edge Function (<code className="rounded bg-brand-100 px-1 py-0.5 font-mono text-[11px]">notify-saved-property-update</code>) automatically sends instant email alerts to your registered email whenever any of your saved properties drop in rent or change availability status.
            </p>
          </div>
        </div>
      </div>

      {testStatus && (
        <div className={`mt-3 flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${testStatus.success ? 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'border border-rose-200 bg-rose-50 text-rose-800'}`}>
          {testStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />}
          <span>{testStatus.msg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      ) : saved.length === 0 ? (
        <div className="mt-6 card flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-10 w-10 text-gray-300" />
          <h3 className="mt-3 text-base font-semibold text-gray-900">{t('saved.empty')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('saved.emptyDesc')}</p>
          <Link to="/browse" className="mt-4 btn-primary">
            <LinkIcon className="h-4 w-4" /> {t('nav.findRentals')}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((l: ListingWithDetails) => (
            <div key={l.id} className="group relative flex flex-col">
              <ListingCard listing={l} />
              <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <Bell className="h-3.5 w-3.5 text-brand-600" /> Alerts Enabled
                </span>
                <button
                  onClick={() => handleTestTrigger(l)}
                  disabled={testSending === l.id}
                  className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-semibold text-brand-600 shadow-xs border border-gray-200 transition hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                  title="Simulate a price drop event and invoke the Supabase Edge Function email trigger"
                >
                  <Send className="h-3 w-3" />
                  {testSending === l.id ? 'Triggering...' : 'Test Email Alert'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

