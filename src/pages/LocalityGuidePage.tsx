import { useState } from 'react'
import { MapPin, ShieldCheck, Wifi, Bus, ShoppingCart, GraduationCap, Cross, TreePine, TrendingUp } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { CITIES, CITY_AREAS, LOCALITY_DATA } from '../lib/constants'

export default function LocalityGuidePage() {
  const { t } = useI18n()
  const [selectedCity, setSelectedCity] = useState('Indore')
  const [selectedArea, setSelectedArea] = useState('')

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

  return (
    <div className="container-app max-w-4xl">
      <Seo 
        title="Locality Guide & Neighborhood Insights — Rentiefy" 
        description="Discover safety ratings, transit options, rent trends, schools, and nearby amenities for top residential localities across India." 
        url="https://rentiefy.com/locality-guide" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locality Guide', url: '/locality-guide' }
        ]}
      />
      <div className="flex items-center gap-2"><MapPin className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('locality.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('locality.subtitle')}</p>

      {/* City selector */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-gray-500">{t('landing.searchByCity')}</label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button key={c} onClick={() => { setSelectedCity(c); setSelectedArea('') }} className={`badge cursor-pointer transition ${selectedCity === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <MapPin className="h-3 w-3" /> {c}
            </button>
          ))}
        </div>
      </div>

      {/* Area selector */}
      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-gray-500">{t('locality.selectArea')}</label>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button key={a} onClick={() => setSelectedArea(a)} className={`badge cursor-pointer transition ${selectedArea === a ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <MapPin className="h-3 w-3" /> {a}
            </button>
          ))}
        </div>
      </div>

      {!selectedArea && <p className="mt-8 text-center text-sm text-gray-400">{t('locality.selectArea')}</p>}

      {data && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="card p-4 text-center">
              <item.icon className="mx-auto h-6 w-6 text-brand-600" />
              <p className="mt-2 text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {selectedArea && !data && (
        <div className="mt-6 card p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">Detailed data for {selectedArea} coming soon. Try another area.</p>
        </div>
      )}
    </div>
  )
}
