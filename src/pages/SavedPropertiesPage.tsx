import { useEffect, useState } from 'react'
import { Heart, Link as LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import ListingCard from '../components/ListingCard'
import type { ListingWithDetails } from '../lib/types'

export default function SavedPropertiesPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [saved, setSaved] = useState<ListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="container-app">
      <div className="flex items-center gap-2"><Heart className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('saved.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('saved.subtitle')}</p>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>
      ) : saved.length === 0 ? (
        <div className="mt-6 card flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-10 w-10 text-gray-300" />
          <h3 className="mt-3 text-base font-semibold text-gray-900">{t('saved.empty')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('saved.emptyDesc')}</p>
          <Link to="/browse" className="mt-4 btn-primary"><LinkIcon className="h-4 w-4" /> {t('nav.findRentals')}</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((l: ListingWithDetails) => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
