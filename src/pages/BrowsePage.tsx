import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, BadgeCheck, ChevronDown, Mic, Zap } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { getListings } from '../lib/api'
import { CITIES, CITY_AREAS, ROOM_TYPE_TRANSLATION_KEYS, GENDER_TRANSLATION_KEYS, CATEGORY_TRANSLATION_KEYS, PROPERTY_TYPES, PROPERTY_TYPE_TRANSLATION_KEYS, FURNISH_TRANSLATION_KEYS } from '../lib/constants'
import ListingCard from '../components/ListingCard'
import { ListingGridSkeleton } from '../components/Skeletons'
import VoiceSearchButton from '../components/VoiceSearchButton'
import PropertyCompareModal from '../components/PropertyCompareModal'
import type { ListingWithDetails } from '../lib/types'
import type { TranslationKey } from '../lib/language-types'

const PAGE_SIZE = 9
const MAX_BUDGET = 50000

type SortOption = 'newest' | 'price-low' | 'price-high' | 'trust'

export default function BrowsePage() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const [allListings, setAllListings] = useState<ListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? 'all')
  const [area, setArea] = useState('all')
  const [roomType, setRoomType] = useState('all')
  const [gender, setGender] = useState('all')
  const [category, setCategory] = useState('all')
  const [propType, setPropType] = useState(searchParams.get('type') ?? 'all')
  const [furnish, setFurnish] = useState(searchParams.get('furnish') ?? 'all')
  const [budget, setBudget] = useState(searchParams.get('budget') ? parseInt(searchParams.get('budget')!) : MAX_BUDGET)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  // Property comparison state
  const [comparedListings, setComparedListings] = useState<ListingWithDetails[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const toggleCompare = (listing: ListingWithDetails) => {
    setComparedListings((prev) => {
      const exists = prev.some((item) => item.id === listing.id)
      if (exists) {
        return prev.filter((item) => item.id !== listing.id)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, listing]
    })
  }

  const availableAreas = city !== 'all' ? (CITY_AREAS[city] ?? []) : []

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getListings({
        search: search || undefined,
        city: city !== 'all' ? city : undefined,
        area: area !== 'all' ? area : undefined,
        roomType: roomType !== 'all' ? roomType : undefined,
        gender: gender !== 'all' ? gender : undefined,
        category: category !== 'all' ? category : undefined,
        maxBudget: budget < MAX_BUDGET ? budget : undefined,
      })
      let filtered = data
      if (propType !== 'all') filtered = filtered.filter((l) => l.property_type === propType)
      if (furnish !== 'all') filtered = filtered.filter((l) => l.furnish_status === furnish)
      if (verifiedOnly) filtered = filtered.filter((l) => l.owner?.is_verified)
      if (availableOnly) {
        const today = new Date().toISOString().slice(0, 10)
        filtered = filtered.filter((l) => !l.available_from || l.available_from <= today)
      }
      setAllListings(filtered)
    } catch { setAllListings([]) }
    setLoading(false)
  }, [search, city, area, roomType, gender, category, propType, furnish, budget, verifiedOnly, availableOnly])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, city, area, roomType, gender, category, propType, furnish, budget, verifiedOnly, availableOnly, sort])

  const sorted = useMemo(() => {
    const arr = [...allListings]
    switch (sort) {
      case 'price-low': arr.sort((a, b) => a.price_monthly - b.price_monthly); break
      case 'price-high': arr.sort((a, b) => b.price_monthly - a.price_monthly); break
      case 'trust': arr.sort((a, b) => (b.owner?.is_verified ? 1 : 0) - (a.owner?.is_verified ? 1 : 0) || b.trust_score - a.trust_score); break
      default: arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return arr
  }, [allListings, sort])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    setSearch(''); setCity('all'); setArea('all'); setRoomType('all'); setGender('all')
    setCategory('all'); setPropType('all'); setFurnish('all'); setBudget(MAX_BUDGET)
    setVerifiedOnly(false); setAvailableOnly(false)
  }

  const handleVoiceSearch = (transcript: string) => {
    setSearch(transcript)
    const lower = transcript.toLowerCase()

    // Smart parsing for city names
    for (const c of CITIES) {
      if (lower.includes(c.toLowerCase())) {
        setCity(c)
        break
      }
    }

    // Smart parsing for property types
    if (lower.includes('pg') || lower.includes('paying guest') || lower.includes('hostel')) {
      setPropType('pg')
    } else if (lower.includes('flat') || lower.includes('apartment') || lower.includes('bhk')) {
      setPropType('apartment')
    } else if (lower.includes('house') || lower.includes('villa') || lower.includes('independent')) {
      setPropType('house')
    } else if (lower.includes('room') || lower.includes('1rk') || lower.includes('single')) {
      setPropType('room')
    }

    // Smart parsing for room types
    if (lower.includes('1bhk') || lower.includes('1 bhk')) setRoomType('1bhk')
    else if (lower.includes('2bhk') || lower.includes('2 bhk')) setRoomType('2bhk')
    else if (lower.includes('3bhk') || lower.includes('3 bhk')) setRoomType('3bhk')
    else if (lower.includes('single')) setRoomType('single')
    else if (lower.includes('double') || lower.includes('shared')) setRoomType('double')

    // Smart budget parsing (e.g. "under 15k", "below 20000")
    const budgetMatch = lower.match(/(?:under|below|budget|max|around|rs|inr|\u20B9)?\s*(\d{1,2})k\b/)
    if (budgetMatch) {
      const numK = parseInt(budgetMatch[1], 10) * 1000
      if (numK >= 2000 && numK <= MAX_BUDGET) setBudget(numK)
    } else {
      const numMatch = lower.match(/(?:under|below|budget|max|around|rs|inr|\u20B9)?\s*(\d{4,5})\b/)
      if (numMatch) {
        const num = parseInt(numMatch[1], 10)
        if (num >= 2000 && num <= MAX_BUDGET) setBudget(num)
      }
    }
  }

  const hasFilters = search || city !== 'all' || area !== 'all' || roomType !== 'all' || gender !== 'all' || category !== 'all' || propType !== 'all' || furnish !== 'all' || budget < MAX_BUDGET || verifiedOnly || availableOnly

  return (
    <div className="container-app">
      <Seo 
        title="Browse Rentals — Rentiefy" 
        description="Search verified PGs, rooms, flats, apartments, and houses for rent across India. Filter by budget, city, property type, and furnishing." 
        url="https://rentiefy.com/browse" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Browse Rentals', url: '/browse' }
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900">{t('browse.title')}</h1>

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.slice(0, 100))}
            maxLength={100}
            className="input pl-10 pr-12"
            placeholder={t('browse.searchPlaceholder')}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <VoiceSearchButton
              onTranscript={handleVoiceSearch}
              onSearchSubmit={(final) => {
                handleVoiceSearch(final)
                load()
              }}
            />
          </div>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary"><SlidersHorizontal className="h-4 w-4" /> {t('common.filter')}</button>
      </div>

      {showFilters && (
        <div className="mt-3 card p-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('landing.searchByCity')}</label>
              <select value={city} onChange={(e) => { setCity(e.target.value); setArea('all') }} className="input">
                <option value="all">{t('browse.allAreas')}</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('browse.filterArea')}</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} className="input" disabled={city === 'all'}>
                <option value="all">{t('browse.allAreas')}</option>
                {availableAreas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('landing.searchPropType')}</label>
              <select value={propType} onChange={(e) => setPropType(e.target.value)} className="input">
                <option value="all">{t('browse.allTypes')}</option>
                {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(PROPERTY_TYPE_TRANSLATION_KEYS[pt] as TranslationKey)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('browse.filterRoomType')}</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="input">
                <option value="all">{t('browse.allTypes')}</option>
                {Object.entries(ROOM_TYPE_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('detail.furnishStatus')}</label>
              <select value={furnish} onChange={(e) => setFurnish(e.target.value)} className="input">
                <option value="all">{t('browse.allTypes')}</option>
                {Object.entries(FURNISH_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('browse.filterGender')}</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="input">
                <option value="all">{t('browse.allGenders')}</option>
                {Object.entries(GENDER_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('browse.filterCategory')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                <option value="all">{t('browse.allCategories')}</option>
                {Object.entries(CATEGORY_TRANSLATION_KEYS).map(([key, val]) => <option key={key} value={key}>{t(val)}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">{t('browse.filterBudget')}: Rs. {budget.toLocaleString('en-IN')}</label>
              <input type="range" min={2000} max={MAX_BUDGET} step={500} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <BadgeCheck className="h-4 w-4 text-brand-600" /> {t('detail.verified')}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              {t('landing.qfImmediate')}
            </label>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-700"><X className="h-3 w-3" /> {t('common.clear')}</button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{t('browse.resultsCount', { n: sorted.length })}</p>
        <div className="relative">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="input py-1.5 pr-8 text-xs">
            <option value="newest">{t('nav.recentlyAdded')}</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="trust">{t('detail.trustScore')}</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="mt-6"><ListingGridSkeleton count={6} /></div>
      ) : paged.length === 0 ? (
        <div className="mt-6 card flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-10 w-10 text-gray-300" />
          <h3 className="mt-3 text-base font-semibold text-gray-900">{t('browse.noResults')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('browse.noResultsDesc')}</p>
          {hasFilters && <button onClick={clearFilters} className="btn-secondary mt-4">{t('common.clear')} {t('common.filter')}</button>}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((l, idx) => (
              <ListingCard
                key={l.id}
                listing={l}
                index={idx}
                isCompared={comparedListings.some((item) => item.id === l.id)}
                onToggleCompare={toggleCompare}
                compareDisabled={comparedListings.length >= 3}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Property Comparison Bar */}
      {comparedListings.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/90 text-white p-3 px-4 sm:px-5 shadow-2xl backdrop-blur-md border border-slate-700/60 max-w-xl w-[92%] animate-fade-in">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 shrink">
            {comparedListings.map((item) => (
              <div key={item.id} className="relative group shrink-0">
                <img
                  src={item.media?.[0]?.media_url || 'https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg'}
                  alt={item.title}
                  className="h-10 w-12 rounded-lg object-cover border border-slate-700"
                />
                <button
                  onClick={() => toggleCompare(item)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition shadow-2xs"
                  title="Remove from compare"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {comparedListings.length < 3 && (
              <div className="h-10 w-12 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs shrink-0">
                + Add
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-300 hidden sm:inline font-medium">
              {comparedListings.length}/3 selected
            </span>
            <button
              onClick={() => setShowCompareModal(true)}
              className="btn-primary bg-brand-500 hover:bg-brand-600 py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md border border-brand-400/30"
            >
              <Zap className="h-3.5 w-3.5" /> Compare Now
            </button>
            <button
              onClick={() => setComparedListings([])}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Clear all selected"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Side-by-side Property Comparison Modal */}
      <PropertyCompareModal
        isOpen={showCompareModal}
        listings={comparedListings}
        onClose={() => setShowCompareModal(false)}
        onRemoveListing={(id) => setComparedListings((prev) => prev.filter((item) => item.id !== id))}
        onClearAll={() => {
          setComparedListings([])
          setShowCompareModal(false)
        }}
      />
    </div>
  )
}

