import { useEffect, useState, useRef } from 'react'
import { MapPin, Map as MapIcon, Navigation, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { getListings } from '../lib/api'
import { CITIES, CITY_COORDS } from '../lib/constants'
import ListingCard from '../components/ListingCard'
import type { ListingWithDetails } from '../lib/types'

export default function MapSearchPage() {
  const { t } = useI18n()
  const [allListings, setAllListings] = useState<ListingWithDetails[]>([])
  const [listings, setListings] = useState<ListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ListingWithDetails | null>(null)
  const [selectedCity, setSelectedCity] = useState('Indore')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    getListings().then((data) => {
      setAllListings(data)
      const cityListings = data.filter((l) => l.city === 'Indore')
      setListings(cityListings)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const filtered = selectedCity === 'all' ? allListings : allListings.filter((l) => l.city === selectedCity)
    setListings(filtered)
    setSelected(null)
  }, [selectedCity, allListings])

  const center = selectedCity !== 'all' ? CITY_COORDS[selectedCity] : { lat: 22.7196, lng: 75.8577 }
  // Use Google Maps embed (no API key needed for basic embed via q parameter)
  const mapSrc = `https://www.google.com/maps?q=${center.lat},${center.lng}&z=12&output=embed`

  return (
    <div className="container-app">
      <div className="flex items-center gap-2"><MapIcon className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('mapSearch.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('mapSearch.subtitle')}</p>

      {/* City selector */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500"><Navigation className="h-3 w-3" /> City:</span>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="input max-w-[200px]">
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs text-gray-400">{listings.length} properties</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Google Maps embed */}
        <div className="lg:col-span-2">
          <div className="relative h-[500px] overflow-hidden rounded-2xl border border-gray-200">
            <iframe
              ref={iframeRef}
              src={mapSrc}
              className="h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Map"
            />
            {/* Property pins overlay */}
            <div className="pointer-events-none absolute inset-0">
              {listings.map((l) => {
                // Position pins relative to map center using lat/lng offsets
                const latOffset = (l.lat - center.lat) * 1000
                const lngOffset = (l.lng - center.lng) * 1000
                // Convert to percentage (approximate, for visual pin placement)
                const x = 50 + lngOffset * 2
                const y = 50 - latOffset * 2
                // Clamp to visible area
                if (x < 5 || x > 95 || y < 5 || y > 95) return null
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={`flex flex-col items-center transition ${selected?.id === l.id ? 'scale-125' : 'hover:scale-110'}`}>
                      <div className={`rounded-full px-2 py-1 text-xs font-bold shadow-md ${selected?.id === l.id ? 'bg-brand-600 text-white' : 'bg-white text-brand-600'}`}>
                        Rs. {(l.price_monthly / 1000).toFixed(0)}k
                      </div>
                      <MapPin className={`h-5 w-5 ${selected?.id === l.id ? 'text-brand-600' : 'text-brand-500'}`} fill="currentColor" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {selected ? (
            <ListingCard listing={selected} />
          ) : loading ? (
            <div className="card h-full p-5">
              <div className="h-6 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500">{listings.length} properties in {selectedCity}</p>
              <div className="max-h-[440px] space-y-2 overflow-y-auto">
                {listings.slice(0, 10).map((l) => (
                  <button key={l.id} onClick={() => setSelected(l)} className="card w-full p-3 text-left transition hover:shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900">{l.title}</p>
                      <p className="shrink-0 text-xs font-bold text-brand-600">Rs. {(l.price_monthly / 1000).toFixed(0)}k</p>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3 w-3" /> {l.area}</p>
                  </button>
                ))}
              </div>
              <Link to="/browse" className="btn-secondary w-full text-xs">{t('common.viewAll')}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
