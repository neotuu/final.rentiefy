import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, BadgeCheck, Phone, Lock, ArrowLeft, CheckCircle2, ShieldCheck, Star, MessageCircle } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { useAuth } from '../lib/auth'
import { getListingById, checkContactUnlocked, getOwnerPhone } from '../lib/api'
import { ROOM_TYPE_TRANSLATION_KEYS, GENDER_TRANSLATION_KEYS, CATEGORY_TRANSLATION_KEYS, PROPERTY_TYPE_TRANSLATION_KEYS, FURNISH_TRANSLATION_KEYS } from '../lib/constants'
import UPIPaymentModal from '../components/UPIPaymentModal'
import ReviewList from '../components/ReviewList'
import type { ListingWithDetails } from '../lib/types'
import type { TranslationKey } from '../lib/language-types'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [listing, setListing] = useState<ListingWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getListingById(id)
      .then((data) => {
        setListing(data)
        if (data && user) {
          const identifier = user.email ?? user.id
          checkContactUnlocked(data.id, identifier).then((isUnlocked) => {
            setUnlocked(isUnlocked)
            if (isUnlocked && data.owner_id) {
              getOwnerPhone(data.owner_id).then(setOwnerPhone)
            }
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id, user])

  if (loading) return <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>
  if (!listing) return <div className="container-app text-center"><p className="text-gray-500">{t('common.error')}</p></div>

  const photos = listing.media?.length > 0 ? listing.media.map((m) => m.media_url) : ['https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg']

  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': listing.title,
    'description': listing.description ?? `${listing.title} for rent in ${listing.area}, ${listing.city}`,
    'url': `https://rentiefy.com/listing/${listing.id}`,
    'image': photos,
    'offers': {
      '@type': 'Offer',
      'price': listing.price_monthly,
      'priceCurrency': 'INR',
      'priceSpecification': {
        '@type': 'UnitPriceSpecification',
        'price': listing.price_monthly,
        'priceCurrency': 'INR',
        'unitCode': 'MON'
      }
    }
  }

  return (
    <div className="container-app">
      <Seo 
        title={`${listing.title} — Rentiefy`} 
        description={listing.description?.slice(0, 160) ?? `View this verified ${listing.property_type} rental property in ${listing.area}, ${listing.city} on Rentiefy.`} 
        image={photos[0]} 
        url={`https://rentiefy.com/listing/${listing.id}`} 
        type="article"
        jsonLd={propertySchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Browse', url: '/browse' },
          { name: listing.title, url: `/listing/${listing.id}` }
        ]}
      />
      <Link to="/browse" className="mb-4 flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> {t('common.back')}</Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gallery + Info */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="relative h-72 overflow-hidden bg-gray-100 sm:h-96">
              <img src={photos[activePhoto]} alt={listing.title} className="h-full w-full object-cover" />
              {listing.owner?.is_verified && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-600/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"><BadgeCheck className="h-3 w-3" /> {t('detail.verified')}</div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {photos.map((url, i) => (
                  <button key={i} onClick={() => setActivePhoto(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${activePhoto === i ? 'border-brand-500' : 'border-transparent'}`}>
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500"><MapPin className="h-4 w-4" /> {listing.area}, {listing.city}</p>
              </div>
              <p className="text-2xl font-bold text-brand-600">Rs. {listing.price_monthly.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-400">{t('common.perMonth')}</span></p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.propertyType')}</p><p className="text-sm font-semibold text-gray-900">{t(PROPERTY_TYPE_TRANSLATION_KEYS[listing.property_type] as TranslationKey)}</p></div>
              <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.furnishStatus')}</p><p className="text-sm font-semibold text-gray-900">{t(FURNISH_TRANSLATION_KEYS[listing.furnish_status] as TranslationKey)}</p></div>
              <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.gender')}</p><p className="text-sm font-semibold text-gray-900">{t(GENDER_TRANSLATION_KEYS[listing.gender_preference])}</p></div>
              <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.category')}</p><p className="text-sm font-semibold text-gray-900">{t(CATEGORY_TRANSLATION_KEYS[listing.category])}</p></div>
              <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.trustScore')}</p><p className="text-sm font-semibold text-gray-900">{listing.trust_score}/100</p></div>
              {listing.deposit_amount != null && <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.deposit')}</p><p className="text-sm font-semibold text-gray-900">Rs. {listing.deposit_amount.toLocaleString('en-IN')}</p></div>}
              {listing.maintenance_charge != null && listing.maintenance_charge > 0 && <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.maintenance')}</p><p className="text-sm font-semibold text-gray-900">Rs. {listing.maintenance_charge.toLocaleString('en-IN')}</p></div>}
              {listing.available_from && <div className="rounded-xl bg-gray-50 px-3 py-2"><p className="text-xs text-gray-400">{t('detail.availableFrom')}</p><p className="text-sm font-semibold text-gray-900">{new Date(listing.available_from).toLocaleDateString('en-IN')}</p></div>}
            </div>

            {/* Cost breakdown */}
            <div className="mt-4 rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-900">{t('detail.costBreakdown')}</h3>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">{t('detail.monthlyRent')}</span><span className="font-semibold text-gray-900">Rs. {listing.price_monthly.toLocaleString('en-IN')}</span></div>
                {listing.maintenance_charge != null && listing.maintenance_charge > 0 && <div className="flex justify-between"><span className="text-gray-500">{t('detail.maintenance')}</span><span className="font-semibold text-gray-900">Rs. {listing.maintenance_charge.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between border-t border-gray-100 pt-1.5"><span className="font-medium text-gray-700">{t('detail.totalMonthly')}</span><span className="font-bold text-brand-600">Rs. {(listing.price_monthly + (listing.maintenance_charge ?? 0)).toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {listing.description && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">{t('detail.description')}</h3>
                <p className="mt-1 text-sm text-gray-600">{listing.description}</p>
              </div>
            )}

            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900">{t('detail.amenities')}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {listing.amenities.map((a) => <span key={a.id} className="badge bg-brand-50 text-brand-700"><CheckCircle2 className="h-3 w-3" /> {a.name}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Landlord & Society Reviews Section */}
          <ReviewList listingId={listing.id} ownerId={listing.owner_id} ownerName={listing.owner?.full_name} />
        </div>

        {/* Contact panel */}
        <div>
          <div className="sticky top-20 card p-5">
            <h3 className="text-sm font-semibold text-gray-900">{t('detail.contactOwner')}</h3>

            {unlocked ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700"><CheckCircle2 className="h-4 w-4 shrink-0" /> {t('detail.contactUnlocked')}</div>
                <div className="rounded-xl border border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-400">{t('detail.ownerPhone')}</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">{ownerPhone ?? '—'}</p>
                </div>
                {ownerPhone && (
                  <a href={`tel:${ownerPhone}`} className="btn-primary w-full"><Phone className="h-4 w-4" /> {t('detail.callNow')}</a>
                )}
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                  <Lock className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-xs text-gray-500">{t('detail.unlockContactDesc')}</p>
                </div>
                <button onClick={() => setShowPayment(true)} className="btn-primary w-full"><Lock className="h-4 w-4" /> {t('detail.payAndUnlock')}</button>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
              {listing.owner_id && (
                <button
                  onClick={() => navigate(`/messages?listing=${listing.id}&owner=${listing.owner_id}`)}
                  className="btn-ghost w-full"
                >
                  <MessageCircle className="h-4 w-4" /> Message Owner
                </button>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500"><ShieldCheck className="h-3 w-3" /> {t('detail.listingNumber', { n: listing.entry_number })}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500"><Star className="h-3 w-3" /> {t('detail.trustScore')}: {listing.trust_score}/100</div>
            </div>
          </div>
        </div>
      </div>

      <UPIPaymentModal
        open={showPayment}
        purpose="contact_unlock"
        listingId={listing.id}
        payerIdentifier={user?.email ?? user?.id ?? ''}
        userId={user?.id ?? ''}
        onSuccess={() => {
          setShowPayment(false)
          setUnlocked(true)
          if (listing.owner_id) getOwnerPhone(listing.owner_id).then(setOwnerPhone)
        }}
        onClose={() => setShowPayment(false)}
      />
    </div>
  )
}
