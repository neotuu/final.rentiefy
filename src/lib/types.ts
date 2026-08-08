export type RoomType = 'shared' | 'single' | 'twin-sharing' | '1bhk' | '2bhk' | '3bhk' | 'house' | 'studio'
export type GenderPreference = 'any' | 'male' | 'female' | 'non-binary' | 'other' | 'prefer-not'
export type ListingCategory = 'student' | 'professional' | 'family'
export type ListingStatus = 'pending' | 'published' | 'rejected' | 'inactive'
export type PaymentPurpose =
  | 'contact_unlock' | 'featured' | 'verification' | 'subscription'
  | 'sponsored' | 'boost' | 'premium_badge' | 'ai_price_opt'
  | 'email_alerts' | 'whatsapp_alerts' | 'reel_creation' | 'builder_subscription'
export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export type PropertyType = 'apartment' | 'house' | 'pg' | 'hostel' | 'room' | 'studio' | 'office' | 'shop' | 'warehouse'
export type FurnishStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished'
export type FeatureType = 'sponsored' | 'boost' | 'premium_badge' | 'ai_price_opt' | 'email_alerts' | 'whatsapp_alerts' | 'reel_creation' | 'builder_subscription'

export interface Owner {
  id: string
  full_name: string
  is_verified: boolean
  response_rate_pct: number
  created_at: string
  user_id: string | null
}

export interface Listing {
  id: string
  owner_id: string
  title: string
  description: string
  room_type: RoomType
  price_monthly: number
  gender_preference: GenderPreference
  lat: number
  lng: number
  address: string
  area: string
  status: ListingStatus
  trust_score: number
  entry_number: number
  created_at: string
  category: ListingCategory
  city: string
  property_type: PropertyType
  furnish_status: FurnishStatus
  is_active: boolean
  deposit_amount: number | null
  maintenance_charge: number | null
  available_from: string | null
}

export interface ListingMedia {
  id: string
  listing_id: string
  media_url: string
  media_type: string
  position: number
}

export interface Amenity {
  id: string
  name: string
}

export interface OwnerPhone {
  id: string
  owner_id: string
  phone: string
  created_at: string
  user_id: string | null
}

export interface Payment {
  id: string
  purpose: PaymentPurpose
  listing_id: string | null
  payer_identifier: string
  amount_paise: number
  upi_id: string
  utr_number: string | null
  status: PaymentStatus
  notes: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

export interface ContactUnlock {
  id: string
  listing_id: string
  payment_id: string
  payer_identifier: string
  unlocked_at: string
  user_id: string | null
}

export interface BoostListing {
  id: string
  listing_id: string
  user_id: string
  feature_type: FeatureType
  starts_at: string
  expires_at: string
  is_active: boolean
  created_at: string
}

export interface SavedProperty {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  listing_id: string | null
  body: string
  read_at: string | null
  created_at: string
}

export interface Conversation {
  other_user_id: string
  listing_id: string | null
  listing_title: string | null
  last_message: string
  last_message_at: string
  unread_count: number
  other_user_name: string
}

export interface ListingWithDetails extends Listing {
  media: ListingMedia[]
  amenities: Amenity[]
  owner: Owner | null
  is_saved?: boolean
}

export type ReviewCategory = 'landlord' | 'society'

export interface PropertyReview {
  id: string
  listing_id: string
  owner_id?: string
  user_id: string
  user_name: string
  user_avatar?: string
  is_anonymous: boolean
  is_verified_tenant: boolean
  category: ReviewCategory
  rating: number // 1 to 5
  title: string
  comment: string
  pros?: string[]
  cons?: string[]
  // Landlord ratings (1-5)
  responsiveness_rating?: number
  maintenance_rating?: number
  deposit_refund_rating?: number
  transparency_rating?: number
  // Society ratings (1-5)
  security_rating?: number
  amenities_rating?: number
  cleanliness_rating?: number
  noise_environment_rating?: number
  helpful_count: number
  created_at: string
}

export type ViewingStatus = 'pending' | 'confirmed' | 'rescheduled' | 'cancelled'

export interface ViewingSchedule {
  id: string
  listing_id: string
  listing_title?: string
  listing_address?: string
  user_id: string
  user_name: string
  user_phone: string
  user_email?: string
  owner_id: string
  owner_name?: string
  preferred_date: string // YYYY-MM-DD
  preferred_time: string // e.g. "10:30 AM" or "04:00 PM"
  notes?: string
  status: ViewingStatus
  created_at: string
}

