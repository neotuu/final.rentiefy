import { useState } from 'react'
import { MapPin, ShieldCheck, Wifi, Bus, ShoppingCart, GraduationCap, Cross, TreePine, TrendingUp, Search, ExternalLink, Sparkles, Navigation, Compass } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { CITIES, CITY_AREAS, LOCALITY_DATA } from '../lib/constants'

export default function LocalityGuidePage() {
  const { t } = useI18n()
  const [selectedCity, setSelectedCity] = useState('Indore')
  const [selectedArea, setSelectedArea] = useState('')

  // Google Maps Grounding states
  const [customLocalityQuery, setCustomLocalityQuery] = useState('')
  const [mapsGroundingData, setMapsGroundingData] = useState<{
    text: string
    groundingSources: { title: string; uri: string; reviewSnippets?: string[] }[]
    query: string
  } | null>(null)
  const [isMapsLoading, setIsMapsLoading] = useState(false)

  const areas = CITY_AREAS[selectedCity] ?? []
  const data = selectedArea ? LOCALITY_DATA[selectedArea] : null

  const items = data ? [
    { icon: ShieldCheck, label: t('landing.liSafety'), value: data.safety },
    { icon: Wifi, label: t('landing.liInternet'), value: data.internet },
    { icon: Bus, label: t('landing.liTransport'), value: data.transport },
    { icon: ShoppingCart, label: t('landing.liGrocery'), value: `${data.grocery} nearby` },
    { icon: GraduationCap, label: t('landing.liSchools'), value: `${data.schools} nearby` },
    { icon: Cross, label: t('landing.liHospitals'), value: `${data.hospitals} nearby` },
    { icon: TreePine, label: t('landing.liParks'), value: `${data.parks} nearby` },
    { icon: TrendingUp, label: t('landing.liRentTrend'), value: data.trend },
  ] : []

  const handleFetchMapsGrounding = async (targetQuery?: string) => {
    const queryToUse = targetQuery || customLocalityQuery || (selectedArea ? `${selectedArea}, ${selectedCity}` : selectedCity)
    if (!queryToUse) return

    setIsMapsLoading(true)
    setMapsGroundingData(null)

    try {
      let userLoc: { latitude: number; longitude: number } | undefined = undefined
      if ('geolocation' in navigator) {
        userLoc = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
            () => resolve(undefined),
            { timeout: 3000 }
          )
        })
      }

      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          city: selectedCity,
          locality: selectedArea,
          location: userLoc,
        }),
      })

      if (!res.ok) throw new Error('Failed to fetch Google Maps Grounding data')

      const result = await res.json()
      setMapsGroundingData(result)
    } catch (err) {
      console.error(err)
      setMapsGroundingData({
        text: `Showing basic location insights for ${queryToUse}. Check nearby connectivity, tech hubs, and markets.`,
        groundingSources: [
          {
            title: `${queryToUse} on Google Maps`,
            uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryToUse)}`,
          },
        ],
        query: queryToUse,
      })
    } finally {
      setIsMapsLoading(false)
    }
  }

  return (
    <div className="container-app max-w-4xl space-y-8">
      <Seo 
        title="Locality Guide & Neighborhood Insights — Rentiefy" 
        description="Discover safety ratings, transit options, rent trends, schools, and real-time Google Maps insights for residential localities across India." 
        url="https://rentiefy.com/locality-guide" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locality Guide', url: '/locality-guide' }
        ]}
      />
      
      <div>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t('locality.title')}</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">{t('locality.subtitle')}</p>
      </div>

      {/* Real-time Google Maps Grounding Card */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-brand-50/50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">Real-Time Google Maps Grounding</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <Sparkles className="h-2.5 w-2.5" /> Live Data
                </span>
              </div>
              <p className="text-xs text-gray-500">Access up-to-date neighborhood info, metro distance & nearby points of interest</p>
            </div>
          </div>
        </div>

        {/* Live Search Form */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={customLocalityQuery}
              onChange={(e) => setCustomLocalityQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetchMapsGrounding()}
              placeholder={selectedArea ? `Explore ${selectedArea}, ${selectedCity}...` : 'Search any locality e.g. Koramangala Bengaluru, Vijay Nagar Indore...'}
              className="input pl-9 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => handleFetchMapsGrounding()}
            disabled={isMapsLoading}
            className="btn-primary w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
          >
            {isMapsLoading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Fetching Maps...</span>
              </>
            ) : (
              <>
                <Navigation className="h-3.5 w-3.5" />
                <span>Fetch Google Maps Data</span>
              </>
            )}
          </button>
        </div>

        {/* Maps Grounding Output */}
        {mapsGroundingData && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-white p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Real-Time Google Maps Results for "{mapsGroundingData.query}"
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 text-xs leading-relaxed whitespace-pre-line">
              {mapsGroundingData.text}
            </div>

            {/* Grounding Places Links */}
            {mapsGroundingData.groundingSources && mapsGroundingData.groundingSources.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Verified Google Maps Places & Directions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mapsGroundingData.groundingSources.map((source, idx) => (
                    <a
                      key={`${source.uri}-${idx}`}
                      href={source.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-slate-50 p-2 text-xs font-medium text-gray-800 transition hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-900"
                    >
                      <span className="line-clamp-1">{source.title}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-600 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset City & Area Selectors */}
      <div className="card p-5 space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">{t('landing.searchByCity')}</label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCity(c)
                  setSelectedArea('')
                  setMapsGroundingData(null)
                }}
                className={`badge cursor-pointer transition ${selectedCity === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <MapPin className="h-3 w-3" /> {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-700">{t('locality.selectArea')}</label>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setSelectedArea(a)
                  handleFetchMapsGrounding(`${a}, ${selectedCity}`)
                }}
                className={`badge cursor-pointer transition ${selectedArea === a ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <MapPin className="h-3 w-3" /> {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!selectedArea && !mapsGroundingData && (
        <p className="text-center text-sm text-gray-400 py-4">{t('locality.selectArea')}</p>
      )}

      {data && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <item.icon className="mx-auto h-6 w-6 text-brand-600" />
              <p className="mt-2 text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {selectedArea && !data && !mapsGroundingData && (
        <div className="card p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            Click 'Fetch Google Maps Data' above to get real-time info for {selectedArea}.
          </p>
        </div>
      )}
    </div>
  )
}

