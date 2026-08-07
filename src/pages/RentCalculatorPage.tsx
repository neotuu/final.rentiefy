import { useState } from 'react'
import { Calculator, MapPin, Building2, BedDouble, TrendingUp, Info } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { CITIES, CITY_AREAS, PROPERTY_TYPES, PROPERTY_TYPE_TRANSLATION_KEYS, RENT_ESTIMATE_BASE, AREA_MULTIPLIERS, CITY_MULTIPLIERS } from '../lib/constants'
import type { TranslationKey } from '../lib/language-types'
import type { PropertyType } from '../lib/types'

export default function RentCalculatorPage() {
  const { t } = useI18n()
  const [city, setCity] = useState('Indore')
  const [area, setArea] = useState('')
  const [propType, setPropType] = useState<PropertyType>('apartment')
  const [bedrooms, setBedrooms] = useState(1)
  const [estimate, setEstimate] = useState<number | null>(null)

  const availableAreas = CITY_AREAS[city] ?? []

  const calculate = () => {
    if (!area) return
    const base = RENT_ESTIMATE_BASE[propType] ?? 10
    const cityMultiplier = CITY_MULTIPLIERS[city] ?? 1.0
    const areaMultiplier = AREA_MULTIPLIERS[area] ?? 1.0
    const bedMultiplier = 1 + (bedrooms - 1) * 0.35
    const estimated = Math.round(base * 350 * cityMultiplier * areaMultiplier * bedMultiplier / 10) * 10
    setEstimate(estimated)
  }

  return (
    <div className="container-app max-w-2xl">
      <Seo 
        title="Fair Rent Calculator — Rentiefy" 
        description="Estimate realistic monthly rent for apartments, flats, PGs, and houses across Indian cities based on location, locality, and property size." 
        url="https://rentiefy.com/rent-calculator" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Rent Calculator', url: '/rent-calculator' }
        ]}
      />
      <div className="flex items-center gap-2"><Calculator className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('calc.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('calc.subtitle')}</p>

      <div className="mt-6 card space-y-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('landing.searchByCity')}</label>
          <select value={city} onChange={(e) => { setCity(e.target.value); setArea('') }} className="input">
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('calc.area')}</label>
          <select value={area} onChange={(e) => setArea(e.target.value)} className="input">
            <option value="">--</option>
            {availableAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('calc.propType')}</label>
          <select value={propType} onChange={(e) => setPropType(e.target.value as PropertyType)} className="input">
            {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(PROPERTY_TYPE_TRANSLATION_KEYS[pt] as TranslationKey)}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">{t('calc.bedrooms')}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} onClick={() => setBedrooms(n)} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-semibold transition ${bedrooms === n ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-600'}`}>{n}</button>
            ))}
          </div>
        </div>
        <button onClick={calculate} disabled={!area} className="btn-primary w-full"><Calculator className="h-4 w-4" /> {t('calc.estimate')}</button>
      </div>

      {estimate !== null && (
        <div className="mt-4 card p-6 text-center">
          <p className="text-xs text-gray-500">{t('calc.estimatedRent')}</p>
          <p className="mt-2 text-4xl font-bold text-brand-600">Rs. {estimate.toLocaleString('en-IN')}</p>
          <p className="mt-2 text-xs text-gray-400">{t('calc.disclaimer')}</p>
        </div>
      )}
    </div>
  )
}
