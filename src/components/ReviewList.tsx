import { useEffect, useState, useMemo } from 'react'
import { Star, ShieldCheck, ThumbsUp, Plus, User, Building, Search, Filter, CheckCircle2 } from 'lucide-react'
import { getReviewsForListing, voteReviewHelpful } from '../lib/api'
import AddReviewModal from './AddReviewModal'
import type { PropertyReview, ReviewCategory } from '../lib/types'

interface ReviewListProps {
  listingId: string
  ownerId?: string
  ownerName?: string
}

export default function ReviewList({ listingId, ownerId, ownerName }: ReviewListProps) {
  const [activeTab, setActiveTab] = useState<ReviewCategory>('landlord')
  const [reviews, setReviews] = useState<PropertyReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({})

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const data = await getReviewsForListing(listingId)
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [listingId])

  // Filtered reviews based on active category & search query
  const categoryReviews = useMemo(() => {
    return reviews.filter((r) => r.category === activeTab)
  }, [reviews, activeTab])

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return categoryReviews
    const q = searchQuery.toLowerCase()
    return categoryReviews.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.user_name.toLowerCase().includes(q) ||
        r.pros?.some((p) => p.toLowerCase().includes(q)) ||
        r.cons?.some((c) => c.toLowerCase().includes(q))
    )
  }, [categoryReviews, searchQuery])

  // Aggregate Stats Calculations
  const stats = useMemo(() => {
    const list = categoryReviews
    if (list.length === 0) {
      return {
        avg: 0,
        total: 0,
        starsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        subRatings: activeTab === 'landlord'
          ? { responsiveness: 0, maintenance: 0, depositRefund: 0, transparency: 0 }
          : { security: 0, amenities: 0, cleanliness: 0, noise: 0 }
      }
    }

    const total = list.length
    const sum = list.reduce((acc, r) => acc + r.rating, 0)
    const avg = Number((sum / total).toFixed(1))

    const starsBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    list.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
      starsBreakdown[rounded] += 1
    })

    if (activeTab === 'landlord') {
      const respSum = list.reduce((acc, r) => acc + (r.responsiveness_rating ?? r.rating), 0)
      const maintSum = list.reduce((acc, r) => acc + (r.maintenance_rating ?? r.rating), 0)
      const depSum = list.reduce((acc, r) => acc + (r.deposit_refund_rating ?? r.rating), 0)
      const transSum = list.reduce((acc, r) => acc + (r.transparency_rating ?? r.rating), 0)

      return {
        avg,
        total,
        starsBreakdown,
        subRatings: {
          responsiveness: Number((respSum / total).toFixed(1)),
          maintenance: Number((maintSum / total).toFixed(1)),
          depositRefund: Number((depSum / total).toFixed(1)),
          transparency: Number((transSum / total).toFixed(1)),
        }
      }
    } else {
      const secSum = list.reduce((acc, r) => acc + (r.security_rating ?? r.rating), 0)
      const amenSum = list.reduce((acc, r) => acc + (r.amenities_rating ?? r.rating), 0)
      const cleanSum = list.reduce((acc, r) => acc + (r.cleanliness_rating ?? r.rating), 0)
      const noiseSum = list.reduce((acc, r) => acc + (r.noise_environment_rating ?? r.rating), 0)

      return {
        avg,
        total,
        starsBreakdown,
        subRatings: {
          security: Number((secSum / total).toFixed(1)),
          amenities: Number((amenSum / total).toFixed(1)),
          cleanliness: Number((cleanSum / total).toFixed(1)),
          noise: Number((noiseSum / total).toFixed(1)),
        }
      }
    }
  }, [categoryReviews, activeTab])

  const handleHelpfulVote = async (reviewId: string) => {
    if (votedMap[reviewId]) return
    setVotedMap((prev) => ({ ...prev, [reviewId]: true }))

    try {
      const newCount = await voteReviewHelpful(reviewId)
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: newCount } : r))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleReviewAdded = (newReview: PropertyReview) => {
    setReviews((prev) => [newReview, ...prev])
    setActiveTab(newReview.category)
  }

  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Landlord & Society Reviews</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Ratings verified by genuine past and current tenants
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary shrink-0 text-xs"
        >
          <Plus className="h-4 w-4" /> Write a Review
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mt-5 flex gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab('landlord')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'landlord'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="h-4 w-4" />
          Landlord Reviews ({reviews.filter((r) => r.category === 'landlord').length})
        </button>

        <button
          onClick={() => setActiveTab('society')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
            activeTab === 'society'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building className="h-4 w-4" />
          Society & Locality Reviews ({reviews.filter((r) => r.category === 'society').length})
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="mt-6 grid grid-cols-1 gap-6 rounded-xl bg-gray-50 p-5 md:grid-cols-3">
        {/* Rating Score */}
        <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pr-6 md:pb-0">
          <span className="text-4xl font-extrabold text-gray-900">{stats.avg || 'N/A'}</span>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(stats.avg)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="mt-1 text-xs text-gray-500 font-medium">
            Based on {stats.total} {activeTab} review{stats.total === 1 ? '' : 's'}
          </span>
        </div>

        {/* Star Rating Breakdown Bars */}
        <div className="space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = stats.starsBreakdown[s as keyof typeof stats.starsBreakdown] ?? 0
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="w-12 font-medium text-gray-600 flex items-center gap-0.5">
                  {s} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-gray-400">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Sub-ratings Metrics */}
        <div className="border-t border-gray-200 pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
            {activeTab === 'landlord' ? 'Landlord Evaluation' : 'Society Evaluation'}
          </h4>

          {activeTab === 'landlord' ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Responsiveness</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.responsiveness}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maintenance & Repairs</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.maintenance}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Deposit Refund Speed</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.depositRefund}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transparency & Rules</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.transparency}/5
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Security & Guards</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.security}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amenities Quality</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.amenities}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cleanliness & Hygiene</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.cleanliness}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quiet & Locality</span>
                <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {stats.subRatings.noise}/5
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab} reviews...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Review Cards List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm font-medium text-gray-600">No {activeTab} reviews yet.</p>
            <p className="mt-1 text-xs text-gray-400">Be the first tenant to share your review!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4 text-xs"
            >
              Write First Review
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-gray-100 bg-white p-5 transition hover:border-gray-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 text-sm">
                    {review.user_avatar ? (
                      <img src={review.user_avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      review.user_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">
                        {review.is_anonymous ? 'Anonymous Tenant' : review.user_name}
                      </span>
                      {review.is_verified_tenant && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="h-3 w-3" /> Verified Tenant
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-700 font-bold text-xs border border-amber-200">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{review.rating} / 5</span>
                </div>
              </div>

              {/* Title & Comment */}
              <div className="mt-3">
                <h4 className="font-semibold text-sm text-gray-900">{review.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{review.comment}</p>
              </div>

              {/* Pros & Cons Chips */}
              {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {review.pros?.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" /> {p}
                    </span>
                  ))}
                  {review.cons?.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 border border-rose-100"
                    >
                      • {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Helpful vote */}
              <div className="mt-4 flex items-center justify-between pt-2 text-xs text-gray-400 border-t border-gray-50">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => handleHelpfulVote(review.id)}
                  disabled={votedMap[review.id]}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    votedMap[review.id]
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Helpful ({review.helpful_count})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        open={showAddModal}
        listingId={listingId}
        ownerId={ownerId}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleReviewAdded}
      />
    </div>
  )
}
