import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2, CheckCircle2, AlertCircle, Image as ImageIcon, Upload, X } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { createListing, updateListing, getListingById, getAmenities, uploadListingPhoto, validatePhoto, validatePhotoCount } from '../lib/api'
import { CITIES, CITY_AREAS, CITY_COORDS, ROOM_TYPE_TRANSLATION_KEYS, GENDER_TRANSLATION_KEYS, CATEGORY_TRANSLATION_KEYS, PROPERTY_TYPES, PROPERTY_TYPE_TRANSLATION_KEYS, FURNISH_TRANSLATION_KEYS } from '../lib/constants'
import type { Amenity, PropertyType, FurnishStatus } from '../lib/types'
import type { TranslationKey } from '../lib/language-types'

const emptyForm = {
  title: '', description: '', room_type: 'shared', price_monthly: '', gender_preference: 'any', category: 'student',
  city: 'Indore', area: '', address: '', owner_name: '', owner_phone: '', photos: '',
  property_type: 'pg' as PropertyType, furnish_status: 'unfurnished' as FurnishStatus,
  deposit: '', maintenance: '', available_from: '',
}

export default function ListPropertyPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)

  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loadingListing, setLoadingListing] = useState(isEditMode)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(emptyForm)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  useEffect(() => {
    getAmenities().then(setAmenities).catch(() => {})
  }, [])

  useEffect(() => {
    if (!editId) return
    setLoadingListing(true)
    getListingById(editId)
      .then((listing) => {
        if (!listing) { setError(t('list.notFound')); return }
        setForm({
          title: listing.title ?? '',
          description: listing.description ?? '',
          room_type: listing.room_type ?? 'shared',
          price_monthly: listing.price_monthly != null ? String(listing.price_monthly) : '',
          gender_preference: listing.gender_preference ?? 'any',
          category: listing.category ?? 'student',
          city: listing.city ?? 'Indore',
          area: listing.area ?? '',
          address: listing.address ?? '',
          owner_name: listing.owner?.full_name ?? '',
          owner_phone: '',
          photos: (listing.media ?? []).map((m) => m.media_url).join('\n'),
          property_type: listing.property_type ?? 'pg',
          furnish_status: listing.furnish_status ?? 'unfurnished',
          deposit: listing.deposit_amount != null ? String(listing.deposit_amount) : '',
          maintenance: listing.maintenance_charge != null ? String(listing.maintenance_charge) : '',
          available_from: listing.available_from ?? '',
        })
        setSelectedAmenities((listing.amenities ?? []).map((a) => a.name))
      })
      .catch(() => setError(t('list.loadFailed')))
      .finally(() => setLoadingListing(false))
  }, [editId])

  const availableAreas = CITY_AREAS[form.city] ?? []

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.price_monthly || !form.city || !form.area || !form.owner_name.trim()) {
      setError(t('contact.allRequired'))
      return
    }

    if (!user) {
      setError(t('common.error'))
      return
    }

    setSubmitting(true)
    const photoUrls = form.photos.split('\n').map((u) => u.trim()).filter((u) => u.length > 0)
    const coords = CITY_COORDS[form.city] ?? { lat: 22.7196, lng: 75.8577 }

    let err: string | null = null

    if (isEditMode && editId) {
      const res = await updateListing(editId, {
        title: form.title.trim(),
        description: form.description.trim(),
        room_type: form.room_type,
        price_monthly: parseInt(form.price_monthly, 10),
        gender_preference: form.gender_preference,
        category: form.category,
        city: form.city,
        area: form.area,
        address: form.address.trim(),
        lat: coords.lat,
        lng: coords.lng,
        property_type: form.property_type,
        furnish_status: form.furnish_status,
        deposit_amount: form.deposit ? Number(form.deposit) : null,
        maintenance_charge: form.maintenance ? Number(form.maintenance) : null,
        available_from: form.available_from || null,
      })
      err = res.error
    } else {
      const res = await createListing({
        title: form.title.trim(),
        description: form.description.trim(),
        room_type: form.room_type,
        price_monthly: parseInt(form.price_monthly, 10),
        gender_preference: form.gender_preference,
        category: form.category,
        city: form.city,
        area: form.area,
        address: form.address.trim(),
        lat: coords.lat,
        lng: coords.lng,
        owner_name: form.owner_name.trim(),
        owner_phone: form.owner_phone.trim(),
        photo_urls: photoUrls,
        amenity_names: selectedAmenities,
        property_type: form.property_type,
        furnish_status: form.furnish_status,
        deposit_amount: form.deposit ? Number(form.deposit) : null,
        maintenance_charge: form.maintenance ? Number(form.maintenance) : null,
        available_from: form.available_from || null,
      }, user.id)
      err = res.error
    }

    setSubmitting(false)

    if (err) {
      setError(err)
      return
    }

    setSuccess(true)
    if (!isEditMode) {
      setForm(emptyForm)
      setSelectedAmenities([])
    }
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="container-app max-w-2xl">
      <div className="flex items-center gap-2"><Building2 className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('list.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('list.subtitle')}</p>

      {success && <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700"><CheckCircle2 className="h-4 w-4 shrink-0" /> {isEditMode ? t('list.updatedSuccess') : t('list.success')}</div>}
      {error && <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}

      {loadingListing ? (
        <div className="mt-6 flex h-32 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>
      ) : (
      <form onSubmit={handleSubmit} className="mt-6 card space-y-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.propertyTitle')}</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value.slice(0, 120) })} maxLength={120} className="input" placeholder={t('list.propertyTitlePlaceholder')} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.description')}</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 2000) })} maxLength={2000} rows={3} className="input resize-none" placeholder={t('list.descriptionPlaceholder')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.roomType')}</label>
            <select value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })} className="input">
              {Object.entries(ROOM_TYPE_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.priceMonthly')}</label>
            <input type="number" value={form.price_monthly} onChange={(e) => setForm({ ...form, price_monthly: e.target.value.slice(0, 8) })} maxLength={8} className="input" placeholder={t('list.priceMonthlyPlaceholder')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.propertyType')}</label>
            <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value as PropertyType })} className="input">
              {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(PROPERTY_TYPE_TRANSLATION_KEYS[pt] as TranslationKey)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.furnishStatus')}</label>
            <select value={form.furnish_status} onChange={(e) => setForm({ ...form, furnish_status: e.target.value as FurnishStatus })} className="input">
              {Object.entries(FURNISH_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.gender')}</label>
            <select value={form.gender_preference} onChange={(e) => setForm({ ...form, gender_preference: e.target.value })} className="input">
              {Object.entries(GENDER_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.category')}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
              {Object.entries(CATEGORY_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.deposit')}</label>
            <input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value.slice(0, 8) })} maxLength={8} className="input" placeholder="Rs." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.maintenance')}</label>
            <input type="number" value={form.maintenance} onChange={(e) => setForm({ ...form, maintenance: e.target.value.slice(0, 6) })} maxLength={6} className="input" placeholder="Rs." />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.availableFrom')}</label>
          <input type="date" value={form.available_from} onChange={(e) => setForm({ ...form, available_from: e.target.value })} className="input" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('landing.searchByCity')}</label>
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value, area: '' })} className="input">
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.area')}</label>
            <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="input">
              <option value="">{t('list.selectArea')}</option>
              {availableAreas.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.address')}</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value.slice(0, 200) })} maxLength={200} className="input" placeholder={t('list.addressPlaceholder')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.ownerName')}</label>
            <input value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value.slice(0, 80) })} maxLength={80} className="input" placeholder={t('list.ownerNamePlaceholder')} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.ownerPhone')}</label>
            <input type="tel" value={form.owner_phone} onChange={(e) => setForm({ ...form, owner_phone: e.target.value.slice(0, 15) })} maxLength={15} className="input" placeholder={t('list.ownerPhonePlaceholder')} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.photos')}</label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {form.photos.split('\n').map((u) => u.trim()).filter((u) => u.length > 0).map((url, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, photos: form.photos.split('\n').map((u) => u.trim()).filter((_, j) => j !== i).join('\n') })} className="absolute right-0 top-0 rounded-bl-lg bg-black/60 px-1 text-white hover:bg-black/80"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition hover:border-brand-400 hover:bg-brand-50">
                {uploading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /> : <Upload className="h-5 w-5 text-gray-400" />}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={async (e) => {
                  const files = Array.from(e.target.files ?? [])
                  if (files.length === 0) return
                  const existing = form.photos.split('\n').map((u) => u.trim()).filter((u) => u.length > 0)
                  const countErr = validatePhotoCount(existing.length, files.length)
                  if (countErr) { setError(countErr); return }
                  for (const file of files) {
                    const validationError = validatePhoto(file)
                    if (validationError) { setError(validationError); return }
                  }
                  if (!user) return
                  setUploading(true)
                  const urls: string[] = []
                  for (const file of files) {
                    const url = await uploadListingPhoto(file, user.id)
                    if (url) urls.push(url)
                  }
                  setUploading(false)
                  if (urls.length > 0) {
                    setForm({ ...form, photos: [...existing, ...urls].join('\n') })
                  }
                }} />
              </label>
            </div>
            <textarea value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value.slice(0, 2000) })} maxLength={2000} rows={2} className="input resize-none text-xs" placeholder={t('list.photosPlaceholder')} />
            <p className="flex items-center gap-1 text-xs text-gray-400"><ImageIcon className="h-3 w-3" /> Upload photos or paste image URLs</p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('list.amenities')}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((a) => (
              <button key={a.id} type="button" onClick={() => toggleAmenity(a.name)} className={`badge cursor-pointer transition ${selectedAmenities.includes(a.name) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <CheckCircle2 className="h-3 w-3" /> {a.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? t('list.submitting') : isEditMode ? t('list.update') : t('list.submit')}
        </button>
      </form>
      )}
    </div>
  )
}
