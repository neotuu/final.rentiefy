import { Link } from 'react-router-dom'
import { MapPin, BadgeCheck, Heart, Star, CheckSquare, Square } from 'lucide-react'
import { motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { PROPERTY_TYPE_TRANSLATION_KEYS, GENDER_TRANSLATION_KEYS, FURNISH_TRANSLATION_KEYS } from '../lib/constants'
import type { ListingWithDetails } from '../lib/types'
import type { TranslationKey } from '../lib/language-types'

interface ListingCardProps {
  listing: ListingWithDetails
  index?: number
  isCompared?: boolean
  onToggleCompare?: (listing: ListingWithDetails) => void
  compareDisabled?: boolean
}

export default function ListingCard({
  listing,
  index = 0,
  isCompared = false,
  onToggleCompare,
  compareDisabled = false,
}: ListingCardProps) {
  const { t } = useI18n()
  const photo = listing.media?.[0]?.media_url ?? 'https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Link to={`/listing/${listing.id}`} className="group block h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img src={photo} alt={listing.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
          
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleCompare(listing)
              }}
              disabled={compareDisabled && !isCompared}
              className={`absolute left-2 bottom-2 z-10 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition shadow-xs ${
                isCompared
                  ? 'bg-brand-600 text-white ring-1 ring-white/30'
                  : 'bg-slate-900/70 text-white hover:bg-slate-900/90'
              } ${compareDisabled && !isCompared ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={compareDisabled && !isCompared ? 'Max 3 properties selected' : 'Compare property'}
            >
              <input
                type="checkbox"
                checked={isCompared}
                onChange={() => {}}
                className="h-3.5 w-3.5 rounded border-white/40 text-brand-600 focus:ring-0 pointer-events-none"
              />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

          {listing.owner?.is_verified && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-brand-600/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <BadgeCheck className="h-3 w-3" /> {t('detail.verified')}
            </div>
          )}
          {Date.now() - new Date(listing.created_at).getTime() < 3 * 24 * 60 * 60 * 1000 && (
            <div className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">{t('landing.justAdded')}</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{listing.title}</h3>
            <p className="shrink-0 text-sm font-bold text-brand-600">Rs. {listing.price_monthly.toLocaleString('en-IN')}{t('common.perMonth')}</p>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {listing.area}
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="badge bg-brand-50 text-brand-700">{t(PROPERTY_TYPE_TRANSLATION_KEYS[listing.property_type] as TranslationKey)}</span>
            <span className="badge bg-gray-100 text-gray-600">{t(GENDER_TRANSLATION_KEYS[listing.gender_preference])}</span>
            <span className="badge bg-gray-100 text-gray-600">{t(FURNISH_TRANSLATION_KEYS[listing.furnish_status] as TranslationKey)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}


