import React from 'react'
import { Link } from 'react-router-dom'
import { X, Check, Minus, MapPin, BadgeCheck, Star, ArrowRight, Trash2, ShieldCheck, Zap } from 'lucide-react'
import type { ListingWithDetails } from '../lib/types'
import { PROPERTY_TYPE_TRANSLATION_KEYS, GENDER_TRANSLATION_KEYS, FURNISH_TRANSLATION_KEYS, ROOM_TYPE_TRANSLATION_KEYS } from '../lib/constants'
import { useI18n } from '../lib/i18n'
import type { TranslationKey } from '../lib/language-types'

interface PropertyCompareModalProps {
  isOpen: boolean
  listings: ListingWithDetails[]
  onClose: () => void
  onRemoveListing: (listingId: string) => void
  onClearAll: () => void
}

export default function PropertyCompareModal({
  isOpen,
  listings,
  onClose,
  onRemoveListing,
  onClearAll,
}: PropertyCompareModalProps) {
  const { t } = useI18n()

  if (!isOpen) return null

  // Collect all unique amenities across selected listings for matrix comparison
  const allAmenities = Array.from(
    new Set(listings.flatMap((l) => l.amenities?.map((a) => a.name) || []))
  ).sort()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-6 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/90 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Compare Properties ({listings.length}/3)</h2>
              <p className="text-xs text-gray-500">Side-by-side feature comparison</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {listings.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable Table */}
        <div className="overflow-x-auto overflow-y-auto p-4 sm:p-6 flex-1">
          {listings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Zap className="mx-auto h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">No properties selected for comparison</p>
              <p className="text-xs text-gray-500">Select checkboxes on property cards to compare them side-by-side.</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px] border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="w-40 p-3 bg-gray-50/80 font-bold text-gray-600 rounded-l-xl border-b border-gray-100">
                    Feature
                  </th>
                  {listings.map((item) => (
                    <th key={item.id} className="p-3 border-b border-gray-100 min-w-[200px] align-top">
                      <div className="relative group">
                        <button
                          onClick={() => onRemoveListing(item.id)}
                          className="absolute -top-1 -right-1 z-10 rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-red-50 hover:text-red-600 transition shadow-2xs"
                          title="Remove from comparison"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-2xs">
                          <img
                            src={item.media?.[0]?.media_url || 'https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg'}
                            alt={item.title}
                            className="h-28 w-full rounded-lg object-cover"
                          />
                          <h3 className="mt-2 font-bold text-gray-900 text-xs line-clamp-1">{item.title}</h3>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-gray-400" /> {item.area}, {item.city}
                          </p>
                          <p className="mt-1 text-sm font-extrabold text-brand-600">
                            Rs. {item.price_monthly.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-gray-500">/mo</span>
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty column slots if fewer than 3 listings */}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <th key={`empty-${i}`} className="p-3 border-b border-gray-100 min-w-[200px] align-top">
                      <div className="h-44 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 text-center text-gray-400">
                        <span className="text-xs font-medium">+ Select another property to compare</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Rent Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Monthly Rent</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3 font-bold text-brand-700 text-sm">
                      Rs. {item.price_monthly.toLocaleString('en-IN')}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-rent-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Security Deposit */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Security Deposit</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3 text-gray-800 font-medium">
                      Rs. {(item.deposit_amount || 0).toLocaleString('en-IN')}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-dep-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Property Type */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Property Type</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3">
                      <span className="badge bg-brand-50 text-brand-700">
                        {t(PROPERTY_TYPE_TRANSLATION_KEYS[item.property_type] as TranslationKey)}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-pt-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Room Type */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Room Configuration</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3 font-medium text-gray-800">
                      {item.room_type ? t(ROOM_TYPE_TRANSLATION_KEYS[item.room_type] as TranslationKey) : '—'}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-rt-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Furnishing Status */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Furnishing</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3">
                      <span className="badge bg-gray-100 text-gray-700">
                        {t(FURNISH_TRANSLATION_KEYS[item.furnish_status] as TranslationKey)}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-furn-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Gender Preference */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Gender Preference</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3">
                      <span className="badge bg-indigo-50 text-indigo-700">
                        {t(GENDER_TRANSLATION_KEYS[item.gender_preference])}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-gen-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Verification & Trust */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Landlord Trust & Badge</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3">
                      <div className="space-y-1">
                        {item.owner?.is_verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified Landlord
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Standard Owner</span>
                        )}
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Trust Score: {item.trust_score}/100
                        </div>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-trust-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Available From */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Available From</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3 font-medium text-gray-800">
                      {item.available_from ? new Date(item.available_from).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Immediate Move-in'}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-avail-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>

                {/* Amenities Matrix */}
                {allAmenities.length > 0 && (
                  <tr className="bg-gray-100/60 font-bold text-gray-900">
                    <td colSpan={4} className="p-2.5 text-center uppercase tracking-wider text-[11px] text-gray-500">
                      Amenities Comparison
                    </td>
                  </tr>
                )}

                {allAmenities.map((amenityName) => (
                  <tr key={amenityName} className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-gray-700 bg-gray-50/50 capitalize">{amenityName}</td>
                    {listings.map((item) => {
                      const hasIt = item.amenities?.some(
                        (a) => a.name.toLowerCase() === amenityName.toLowerCase()
                      )
                      return (
                        <td key={item.id} className="p-3">
                          {hasIt ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <Check className="h-4 w-4" /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-300">
                              <Minus className="h-4 w-4" /> Not specified
                            </span>
                          )}
                        </td>
                      )
                    })}
                    {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                      <td key={`empty-amenity-${amenityName}-${i}`} className="p-3 text-gray-300">—</td>
                    ))}
                  </tr>
                ))}

                {/* Action Row */}
                <tr>
                  <td className="p-3 font-semibold text-gray-700 bg-gray-50/50">Action</td>
                  {listings.map((item) => (
                    <td key={item.id} className="p-3">
                      <Link
                        to={`/listing/${item.id}`}
                        onClick={onClose}
                        className="btn-primary w-full py-1.5 px-3 text-xs flex items-center justify-center gap-1"
                      >
                        <span>View Details</span> <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - listings.length) }).map((_, i) => (
                    <td key={`empty-action-${i}`} className="p-3 text-gray-300">—</td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-100 bg-slate-50/80 px-6 py-3 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">Comparing {listings.length} out of max 3 properties</p>
          <button onClick={onClose} className="btn-secondary py-1.5 px-4 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
