import { useState } from 'react'
import { X, Star, ShieldCheck, Check, Plus, AlertCircle, User, Building, ThumbsUp } from 'lucide-react'
import { addPropertyReview } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { PropertyReview, ReviewCategory } from '../lib/types'

interface AddReviewModalProps {
  open: boolean
  listingId: string
  ownerId?: string
  onClose: () => void
  onSuccess: (review: PropertyReview) => void
}

export default function AddReviewModal({ open, listingId, ownerId, onClose, onSuccess }: AddReviewModalProps) {
  const { user } = useAuth()
  const [category, setCategory] = useState<ReviewCategory>('landlord')
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isVerifiedTenant, setIsVerifiedTenant] = useState(true)

  // Landlord breakdown ratings
  const [responsiveness, setResponsiveness] = useState(5)
  const [maintenance, setMaintenance] = useState(5)
  const [depositRefund, setDepositRefund] = useState(5)
  const [transparency, setTransparency] = useState(4)

  // Society breakdown ratings
  const [security, setSecurity] = useState(5)
  const [amenities, setAmenities] = useState(4)
  const [cleanliness, setCleanliness] = useState(5)
  const [noise, setNoise] = useState(4)

  // Pros & Cons
  const [proInput, setProInput] = useState('')
  const [pros, setPros] = useState<string[]>([])
  const [conInput, setConInput] = useState('')
  const [cons, setCons] = useState<string[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleAddPro = () => {
    if (proInput.trim() && !pros.includes(proInput.trim())) {
      setPros([...pros, proInput.trim()])
      setProInput('')
    }
  }

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index))
  }

  const handleAddCon = () => {
    if (conInput.trim() && !cons.includes(conInput.trim())) {
      setCons([...cons, conInput.trim()])
      setConInput('')
    }
  }

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please provide a review title.')
      return
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least 10 characters for your review experience.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const reviewPayload = {
        listing_id: listingId,
        owner_id: ownerId,
        user_id: user?.id ?? 'guest-user',
        user_name: isAnonymous ? 'Anonymous Tenant' : (user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Tenant'),
        user_avatar: user?.user_metadata?.avatar_url,
        is_anonymous: isAnonymous,
        is_verified_tenant: isVerifiedTenant,
        category,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        pros: pros.length > 0 ? pros : undefined,
        cons: cons.length > 0 ? cons : undefined,
        ...(category === 'landlord' ? {
          responsiveness_rating: responsiveness,
          maintenance_rating: maintenance,
          deposit_refund_rating: depositRefund,
          transparency_rating: transparency,
        } : {
          security_rating: security,
          amenities_rating: amenities,
          cleanliness_rating: cleanliness,
          noise_environment_rating: noise,
        }),
      }

      const created = await addPropertyReview(reviewPayload)
      onSuccess(created)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to post review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
        <p className="mt-1 text-xs text-gray-500">
          Share your authentic experience to help future tenants make informed decisions.
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Review Category Toggle */}
          <div>
            <label className="text-xs font-semibold text-gray-700">What are you reviewing?</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory('landlord')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                  category === 'landlord'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4" /> Landlord / Owner
              </button>
              <button
                type="button"
                onClick={() => setCategory('society')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                  category === 'society'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building className="h-4 w-4" /> Society & Locality
              </button>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="text-xs font-semibold text-gray-700">Overall Rating</label>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-gray-700">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Detailed Criteria Ratings */}
          <div className="rounded-xl bg-gray-50 p-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
              {category === 'landlord' ? 'Landlord Evaluation Breakdown' : 'Society & Building Breakdown'}
            </h4>

            {category === 'landlord' ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Responsiveness</span>
                    <span className="text-brand-600 font-semibold">{responsiveness}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={responsiveness}
                    onChange={(e) => setResponsiveness(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Maintenance & Repairs</span>
                    <span className="text-brand-600 font-semibold">{maintenance}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Deposit Refund Process</span>
                    <span className="text-brand-600 font-semibold">{depositRefund}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={depositRefund}
                    onChange={(e) => setDepositRefund(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Transparency / Fair Rules</span>
                    <span className="text-brand-600 font-semibold">{transparency}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={transparency}
                    onChange={(e) => setTransparency(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Security & Guarding</span>
                    <span className="text-brand-600 font-semibold">{security}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={security}
                    onChange={(e) => setSecurity(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Amenities Quality</span>
                    <span className="text-brand-600 font-semibold">{amenities}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={amenities}
                    onChange={(e) => setAmenities(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Cleanliness & Maintenance</span>
                    <span className="text-brand-600 font-semibold">{cleanliness}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-medium text-gray-700 mb-1">
                    <span>Noise & Locality Vibes</span>
                    <span className="text-brand-600 font-semibold">{noise}/5</span>
                  </div>
                  <input
                    type="range" min="1" max="5" value={noise}
                    onChange={(e) => setNoise(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Title & Comment */}
          <div>
            <label className="text-xs font-semibold text-gray-700">Review Headline</label>
            <input
              type="text"
              placeholder={category === 'landlord' ? 'e.g., Soft-spoken, cooperative owner with quick repair support' : 'e.g., Safe gated society with excellent water backup'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input mt-1 w-full text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Detailed Feedback</label>
            <textarea
              rows={3}
              placeholder="Describe your living experience, landlord behavior, society environment, water/electricity status, etc."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input mt-1 w-full text-sm resize-none"
              required
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> Key Pros
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Quick AC fix"
                  value={proInput}
                  onChange={(e) => setProInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPro())}
                  className="input w-full text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPro}
                  className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {pros.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pros.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700 border border-emerald-200">
                      + {p}
                      <button type="button" onClick={() => handleRemovePro(i)} className="hover:text-emerald-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Cons / Watchouts
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Visitor parking limited"
                  value={conInput}
                  onChange={(e) => setConInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCon())}
                  className="input w-full text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCon}
                  className="rounded-xl bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {cons.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {cons.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs text-rose-700 border border-rose-200">
                      - {c}
                      <button type="button" onClick={() => handleRemoveCon(i)} className="hover:text-rose-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification & Anonymity Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerifiedTenant}
                onChange={(e) => setIsVerifiedTenant(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" /> Mark as Verified Tenant (I have resided or unlocked contact)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Post Anonymously</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
