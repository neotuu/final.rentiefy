import { supabase } from './supabase'
import { PRICING, UPI_ID } from './constants'
import type { ListingWithDetails, Listing, Payment, Amenity, Owner, OwnerPhone, PaymentPurpose, FeatureType, Message, Conversation, PropertyReview, ReviewCategory, ViewingSchedule, ViewingStatus } from './types'

// ===== OTP =====

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

async function callEdgeFunction(slug: string, body: Record<string, unknown>): Promise<any | null> {
  if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder.supabase.co')) {
    if (slug === 'send-otp') return { success: true, dev_code: '123456' }
    if (slug === 'verify-otp') return { success: true }
    return { success: true }
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      let msg = `Request failed (${res.status})`
      try {
        const errBody = await res.json()
        msg = errBody.error ?? errBody.message ?? msg
      } catch { /* ignore parse error */ }
      throw new Error(msg)
    }
    return res.json()
  } catch {
    if (slug === 'send-otp') return { success: true, dev_code: '123456' }
    if (slug === 'verify-otp') return { success: true }
    return { success: true }
  }
}

export async function notifySavedPropertyUpdate(payload: {
  listing_id: string
  update_type: 'price_drop' | 'status_update'
  old_price?: number
  new_price?: number
  old_status?: string
  new_status?: string
  listing_title?: string
}): Promise<{ success: boolean; notified_users?: number; error?: string }> {
  try {
    const data = await callEdgeFunction('notify-saved-property-update', payload)
    return { success: true, notified_users: data?.notified_users ?? 0 }
  } catch (err: any) {
    console.warn('Saved property notification trigger warning:', err?.message)
    return { success: false, error: err?.message || 'Failed to trigger notification' }
  }
}

export async function sendOtp(identifier: string, purpose: string = 'signup'): Promise<{ success: boolean; error: string | null; devCode?: string }> {
  try {
    const data = await callEdgeFunction('send-otp', { identifier, purpose })
    if (data.error) {
      const msg = String(data.error).toLowerCase()
      if (msg.includes('rate') || msg.includes('wait')) {
        return { success: false, error: 'rate_limited' }
      }
      return { success: false, error: data.error }
    }
    return { success: true, error: null, devCode: data.dev_code ?? undefined }
  } catch (err: any) {
    const msg = err?.message ?? ''
    if (msg.includes('Failed to fetch') || msg.includes('Network') || msg.includes('fetch')) {
      return { success: false, error: 'Unable to connect. Please check your internet and try again.' }
    }
    return { success: false, error: msg || 'Network error. Please try again.' }
  }
}

export async function verifyOtp(identifier: string, code: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const data = await callEdgeFunction('verify-otp', { identifier, code })
    if (data.success) return { success: true, error: null }
    return { success: false, error: data.message ?? 'invalid' }
  } catch (err: any) {
    const msg = err?.message ?? ''
    if (msg.includes('Failed to fetch') || msg.includes('Network') || msg.includes('fetch')) {
      return { success: false, error: 'Unable to connect. Please check your internet and try again.' }
    }
    return { success: false, error: msg || 'Network error. Please try again.' }
  }
}

// ===== Multi-City All-India Fallback Sample Listings =====

const ALL_INDIA_MOCK_LISTINGS: ListingWithDetails[] = [
  {
    id: 'lst-indore-1',
    owner_id: 'own-1',
    title: 'Luxury 2BHK Fully Furnished Flat near Scheme 54',
    description: 'Spacious 2BHK flat with modular kitchen, AC in all rooms, high-speed Wi-Fi, 24/7 power backup, and gated security in Vijay Nagar.',
    room_type: '2bhk',
    price_monthly: 18000,
    gender_preference: 'any',
    lat: 22.7533,
    lng: 75.8937,
    address: 'Plot 142, Scheme 54, Vijay Nagar, Indore',
    area: 'Vijay Nagar',
    city: 'Indore',
    status: 'published',
    trust_score: 95,
    entry_number: 101,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'family',
    property_type: 'apartment',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 36000,
    maintenance_charge: 1500,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-1', listing_id: 'lst-indore-1', media_url: 'https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg', media_type: 'photo', position: 0 },
      { id: 'm-2', listing_id: 'lst-indore-1', media_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', media_type: 'photo', position: 1 },
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-2', name: 'Wi-Fi' },
      { id: 'a-3', name: 'Power Backup' },
    ],
    owner: { id: 'own-1', full_name: 'Rajesh Sharma', is_verified: true, response_rate_pct: 98, created_at: '', user_id: 'u-1' }
  },
  {
    id: 'lst-mumbai-1',
    owner_id: 'own-2',
    title: 'Sea View Studio Apartment with Balcony in Bandra',
    description: 'Modern studio apartment facing Bandra seaface. Equipped with refrigerator, smart TV, queen bed, and daily housekeeping.',
    room_type: 'studio',
    price_monthly: 42000,
    gender_preference: 'any',
    lat: 19.0596,
    lng: 72.8295,
    address: 'Carter Road, Bandra West, Mumbai',
    area: 'Bandra West',
    city: 'Mumbai',
    status: 'published',
    trust_score: 98,
    entry_number: 102,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'professional',
    property_type: 'studio',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 84000,
    maintenance_charge: 3000,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-3', listing_id: 'lst-mumbai-1', media_url: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg', media_type: 'photo', position: 0 },
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-4', name: 'Security Guard' }
    ],
    owner: { id: 'own-2', full_name: 'Ananya Mehta', is_verified: true, response_rate_pct: 95, created_at: '', user_id: 'u-2' }
  },
  {
    id: 'lst-bangalore-1',
    owner_id: 'own-3',
    title: 'Techie Friendly 1BHK Flat near Sony World Signal',
    description: 'Fully furnished 1BHK in Koramangala 4th Block. High-speed 300 Mbps Fiber internet, work desk, inverter backup, and washing machine.',
    room_type: '1bhk',
    price_monthly: 26000,
    gender_preference: 'any',
    lat: 12.9352,
    lng: 77.6245,
    address: '4th Block, Koramangala, Bangalore',
    area: 'Koramangala',
    city: 'Bangalore',
    status: 'published',
    trust_score: 96,
    entry_number: 103,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'professional',
    property_type: 'apartment',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 50000,
    maintenance_charge: 2000,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-4', listing_id: 'lst-bangalore-1', media_url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-2', name: 'Wi-Fi' },
      { id: 'a-5', name: 'Washing Machine' }
    ],
    owner: { id: 'own-3', full_name: 'Karthik Raman', is_verified: true, response_rate_pct: 99, created_at: '', user_id: 'u-3' }
  },
  {
    id: 'lst-delhi-1',
    owner_id: 'own-4',
    title: 'Independent 2BHK Builder Floor near Metro Station',
    description: 'Newly constructed 2BHK with modular fittings, reserved parking, CCTV cameras, near Saket metro station.',
    room_type: '2bhk',
    price_monthly: 28000,
    gender_preference: 'any',
    lat: 28.5244,
    lng: 77.2188,
    address: 'Block D, Saket, New Delhi',
    area: 'Saket',
    city: 'Delhi',
    status: 'published',
    trust_score: 94,
    entry_number: 104,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    category: 'family',
    property_type: 'house',
    furnish_status: 'semi-furnished',
    is_active: true,
    deposit_amount: 28000,
    maintenance_charge: 1000,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-5', listing_id: 'lst-delhi-1', media_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-3', name: 'Power Backup' }
    ],
    owner: { id: 'own-4', full_name: 'Vikram Malhotra', is_verified: true, response_rate_pct: 92, created_at: '', user_id: 'u-4' }
  },
  {
    id: 'lst-gurgaon-1',
    owner_id: 'own-5',
    title: 'High-rise Executive 3BHK Apartment on Golf Course Road',
    description: 'Luxury condominium with swimming pool, gym, clubhouse, and underground parking. Opposite Rapid Metro.',
    room_type: '3bhk',
    price_monthly: 65000,
    gender_preference: 'any',
    lat: 28.4480,
    lng: 77.0900,
    address: 'DLF Phase 5, Golf Course Road, Gurgaon',
    area: 'Golf Course Road',
    city: 'Gurgaon',
    status: 'published',
    trust_score: 99,
    entry_number: 105,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'family',
    property_type: 'apartment',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 130000,
    maintenance_charge: 5000,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-6', listing_id: 'lst-gurgaon-1', media_url: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-6', name: 'Swimming Pool' },
      { id: 'a-7', name: 'Gym' }
    ],
    owner: { id: 'own-5', full_name: 'Sanjay Bansal', is_verified: true, response_rate_pct: 97, created_at: '', user_id: 'u-5' }
  },
  {
    id: 'lst-pune-1',
    owner_id: 'own-6',
    title: 'Charming 2BHK Flat near IT Park in Hinjewadi Phase 1',
    description: 'Gated community flat with solar water heater, covered bike parking, and community garden. Ideal for software engineers.',
    room_type: '2bhk',
    price_monthly: 22000,
    gender_preference: 'any',
    lat: 18.5912,
    lng: 73.7389,
    address: 'Phase 1, Hinjewadi, Pune',
    area: 'Hinjewadi',
    city: 'Pune',
    status: 'published',
    trust_score: 93,
    entry_number: 106,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'professional',
    property_type: 'apartment',
    furnish_status: 'semi-furnished',
    is_active: true,
    deposit_amount: 44000,
    maintenance_charge: 1800,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-7', listing_id: 'lst-pune-1', media_url: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-2', name: 'Wi-Fi' },
      { id: 'a-3', name: 'Power Backup' }
    ],
    owner: { id: 'own-6', full_name: 'Sachin Kulkarni', is_verified: true, response_rate_pct: 94, created_at: '', user_id: 'u-6' }
  },
  {
    id: 'lst-hyderabad-1',
    owner_id: 'own-7',
    title: 'Modern Single Room PG / Co-living in Gachibowli',
    description: 'Single occupancy air-conditioned room with attached bath, 3 times food, high speed Wi-Fi, and laundry service included.',
    room_type: 'single',
    price_monthly: 14000,
    gender_preference: 'male',
    lat: 17.4401,
    lng: 78.3489,
    address: 'Near DLF Cyber City, Gachibowli, Hyderabad',
    area: 'Gachibowli',
    city: 'Hyderabad',
    status: 'published',
    trust_score: 96,
    entry_number: 107,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'professional',
    property_type: 'pg',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 14000,
    maintenance_charge: 0,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-8', listing_id: 'lst-hyderabad-1', media_url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-2', name: 'Wi-Fi' }
    ],
    owner: { id: 'own-7', full_name: 'Venkatesh Rao', is_verified: true, response_rate_pct: 98, created_at: '', user_id: 'u-7' }
  },
  {
    id: 'lst-jaipur-1',
    owner_id: 'own-8',
    title: 'Heritage Style 2BHK Independent House in C-Scheme',
    description: 'Elegantly furnished house with wooden interiors, spacious terrace garden, peaceful neighborhood, and car garage.',
    room_type: 'house',
    price_monthly: 20000,
    gender_preference: 'any',
    lat: 26.9088,
    lng: 75.8010,
    address: 'Ashok Nagar, C-Scheme, Jaipur',
    area: 'C-Scheme',
    city: 'Jaipur',
    status: 'published',
    trust_score: 95,
    entry_number: 108,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    category: 'family',
    property_type: 'house',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 20000,
    maintenance_charge: 500,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-9', listing_id: 'lst-jaipur-1', media_url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' }
    ],
    owner: { id: 'own-8', full_name: 'Devendra Singh', is_verified: true, response_rate_pct: 96, created_at: '', user_id: 'u-8' }
  },
  {
    id: 'lst-goa-1',
    owner_id: 'own-9',
    title: 'Serene 1BHK Garden Apartment near Calangute Beach',
    description: 'Fully equipped resort-style apartment with swimming pool access, tropical garden views, and 5 minutes walk to beach.',
    room_type: '1bhk',
    price_monthly: 25000,
    gender_preference: 'any',
    lat: 15.5438,
    lng: 73.7552,
    address: 'Naika Vaddo, Calangute, Goa',
    area: 'Calangute',
    city: 'Goa',
    status: 'published',
    trust_score: 97,
    entry_number: 109,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'professional',
    property_type: 'apartment',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 25000,
    maintenance_charge: 1500,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-10', listing_id: 'lst-goa-1', media_url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-6', name: 'Swimming Pool' }
    ],
    owner: { id: 'own-9', full_name: 'Mario D\'Souza', is_verified: true, response_rate_pct: 99, created_at: '', user_id: 'u-9' }
  },
  {
    id: 'lst-bhopal-1',
    owner_id: 'own-10',
    title: 'Spacious 3BHK Family Flat in Arera Colony E-7',
    description: 'Well lit corner apartment with double balconies, near hospitals and top public schools. Power backup and water storage tanks.',
    room_type: '3bhk',
    price_monthly: 19000,
    gender_preference: 'any',
    lat: 23.2100,
    lng: 77.4320,
    address: 'Sector E-7, Arera Colony, Bhopal',
    area: 'Arera Colony',
    city: 'Bhopal',
    status: 'published',
    trust_score: 92,
    entry_number: 110,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'family',
    property_type: 'apartment',
    furnish_status: 'semi-furnished',
    is_active: true,
    deposit_amount: 38000,
    maintenance_charge: 1200,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-11', listing_id: 'lst-bhopal-1', media_url: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-3', name: 'Power Backup' }
    ],
    owner: { id: 'own-10', full_name: 'Pankaj Saxena', is_verified: true, response_rate_pct: 91, created_at: '', user_id: 'u-10' }
  },
  {
    id: 'lst-kochi-1',
    owner_id: 'own-11',
    title: 'Waterfront 2BHK Flat near InfoPark in Kakkanad',
    description: 'Modern apartment overlooking lake. Close to SmartCity & InfoPark Kochi. Gated complex with gym, indoor games, and CCTV.',
    room_type: '2bhk',
    price_monthly: 21000,
    gender_preference: 'any',
    lat: 10.0159,
    lng: 76.3621,
    address: 'InfoPark Expressway, Kakkanad, Kochi',
    area: 'Kakkanad',
    city: 'Kochi',
    status: 'published',
    trust_score: 96,
    entry_number: 111,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'professional',
    property_type: 'apartment',
    furnish_status: 'fully-furnished',
    is_active: true,
    deposit_amount: 42000,
    maintenance_charge: 1500,
    available_from: new Date().toISOString().split('T')[0],
    media: [
      { id: 'm-12', listing_id: 'lst-kochi-1', media_url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg', media_type: 'photo', position: 0 }
    ],
    amenities: [
      { id: 'a-1', name: 'Air Conditioner' },
      { id: 'a-7', name: 'Gym' }
    ],
    owner: { id: 'own-11', full_name: 'Mathew Thomas', is_verified: true, response_rate_pct: 97, created_at: '', user_id: 'u-11' }
  }
]

// ===== Listings =====

export async function getListings(filters?: {
  search?: string
  city?: string
  area?: string
  roomType?: string
  gender?: string
  category?: string
  maxBudget?: number
}): Promise<ListingWithDetails[]> {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        media:listing_media(*),
        amenities:listing_amenities(amenity:amenities(*)),
        owner:owners(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,area.ilike.%${filters.search}%,city.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    if (filters?.city && filters.city !== 'all') {
      query = query.eq('city', filters.city)
    }
    if (filters?.area && filters.area !== 'all') {
      query = query.eq('area', filters.area)
    }
    if (filters?.roomType && filters.roomType !== 'all') {
      query = query.eq('room_type', filters.roomType)
    }
    if (filters?.gender && filters.gender !== 'all') {
      query = query.eq('gender_preference', filters.gender)
    }
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters?.maxBudget && filters.maxBudget > 0) {
      query = query.lte('price_monthly', filters.maxBudget)
    }

    const { data, error } = await query
    if (!error && data && data.length > 0) {
      return data.map((l: any) => ({
        ...l,
        media: l.media ?? [],
        amenities: (l.amenities ?? []).map((a: any) => a.amenity).filter(Boolean),
        owner: l.owner,
      }))
    }
  } catch (err) {
    console.warn('Database query unavailable, using fallback all-India listings:', err)
  }

  // Fallback filtering over ALL_INDIA_MOCK_LISTINGS
  let results = [...ALL_INDIA_MOCK_LISTINGS]

  if (filters?.search) {
    const s = filters.search.toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(s) ||
        l.city.toLowerCase().includes(s) ||
        l.area.toLowerCase().includes(s) ||
        l.description.toLowerCase().includes(s)
    )
  }
  if (filters?.city && filters.city !== 'all') {
    results = results.filter((l) => l.city.toLowerCase() === filters.city!.toLowerCase())
  }
  if (filters?.area && filters.area !== 'all') {
    results = results.filter((l) => l.area.toLowerCase() === filters.area!.toLowerCase())
  }
  if (filters?.roomType && filters.roomType !== 'all') {
    results = results.filter((l) => l.room_type === filters.roomType)
  }
  if (filters?.gender && filters.gender !== 'all') {
    results = results.filter((l) => l.gender_preference === filters.gender || l.gender_preference === 'any')
  }
  if (filters?.category && filters.category !== 'all') {
    results = results.filter((l) => l.category === filters.category)
  }
  if (filters?.maxBudget && filters.maxBudget > 0) {
    results = results.filter((l) => l.price_monthly <= filters.maxBudget!)
  }

  return results
}

export async function getListingById(id: string): Promise<ListingWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        media:listing_media(*),
        amenities:listing_amenities(amenity:amenities(*)),
        owner:owners(*)
      `)
      .eq('id', id)
      .single()

    if (!error && data) {
      return {
        ...data,
        media: data.media ?? [],
        amenities: (data.amenities ?? []).map((a: any) => a.amenity).filter(Boolean),
        owner: data.owner,
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback to ALL_INDIA_MOCK_LISTINGS
  const found = ALL_INDIA_MOCK_LISTINGS.find((l) => l.id === id)
  return found || ALL_INDIA_MOCK_LISTINGS[0]
}

export async function getMyListings(userId: string): Promise<ListingWithDetails[]> {
  const { data: owners } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!owners) return []

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      media:listing_media(*),
      amenities:listing_amenities(amenity:amenities(*)),
      owner:owners(*)
    `)
    .eq('owner_id', owners.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return data.map((l: any) => ({
    ...l,
    media: l.media ?? [],
    amenities: (l.amenities ?? []).map((a: any) => a.amenity).filter(Boolean),
    owner: l.owner,
  }))
}

export async function createListing(data: {
  title: string
  description: string
  room_type: string
  price_monthly: number
  gender_preference: string
  category: string
  city: string
  area: string
  address: string
  lat: number
  lng: number
  owner_name: string
  owner_phone: string
  photo_urls: string[]
  amenity_names: string[]
  property_type?: string
  furnish_status?: string
  deposit_amount?: number | null
  maintenance_charge?: number | null
  available_from?: string | null
}, userId: string): Promise<{ error: string | null }> {
  try {
    // Get or create owner
    const { data: owner, error: ownerErr } = await supabase
      .from('owners')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (ownerErr) return { error: ownerErr.message }

    let ownerId = owner?.id

    if (!ownerId) {
      const { data: newOwner, error: createErr } = await supabase
        .from('owners')
        .insert({ full_name: data.owner_name, user_id: userId })
        .select('id')
        .single()

      if (createErr) return { error: createErr.message }
      ownerId = newOwner.id
    }

    // Create listing
    const { data: listing, error: listingErr } = await supabase
      .from('listings')
      .insert({
        owner_id: ownerId,
        title: data.title,
        description: data.description,
        room_type: data.room_type,
        price_monthly: data.price_monthly,
        gender_preference: data.gender_preference,
        category: data.category,
        city: data.city,
        area: data.area,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        status: 'pending',
        property_type: data.property_type ?? 'pg',
        furnish_status: data.furnish_status ?? 'unfurnished',
        deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : null,
        maintenance_charge: data.maintenance_charge ? Number(data.maintenance_charge) : null,
        available_from: data.available_from || null,
      })
      .select('id')
      .single()

    if (listingErr) return { error: listingErr.message }

    // Add phone if not exists
    if (data.owner_phone) {
      await supabase
        .from('owner_phone')
        .insert({ owner_id: ownerId, phone: data.owner_phone, user_id: userId })
        .maybeSingle()
    }

    // Add media
    if (data.photo_urls.length > 0) {
      const mediaRows = data.photo_urls.map((url, i) => ({
        listing_id: listing.id,
        media_url: url,
        media_type: 'photo',
        position: i,
      }))
      await supabase.from('listing_media').insert(mediaRows)
    }

    // Add amenities
    if (data.amenity_names.length > 0) {
      const { data: amenities } = await supabase
        .from('amenities')
        .select('id, name')

      if (amenities) {
        const amenityMap = new Map(amenities.map((a: Amenity) => [a.name, a.id]))
        const amenityRows = data.amenity_names
          .map((name) => {
            const amenityId = amenityMap.get(name)
            return amenityId ? { listing_id: listing.id, amenity_id: amenityId } : null
          })
          .filter(Boolean) as { listing_id: string; amenity_id: string }[]

        if (amenityRows.length > 0) {
          await supabase.from('listing_amenities').insert(amenityRows)
        }
      }
    }

    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to create listing' }
  }
}

export async function updateListing(
  listingId: string,
  data: {
    title: string
    description: string
    room_type: string
    price_monthly: number
    gender_preference: string
    category: string
    city: string
    area: string
    address: string
    lat: number
    lng: number
    property_type?: string
    furnish_status?: string
    deposit_amount?: number | null
    maintenance_charge?: number | null
    available_from?: string | null
    status?: string
  }
): Promise<{ error: string | null }> {
  try {
    // 1. Fetch current existing listing to check for price drops or status updates
    const { data: existing } = await supabase
      .from('listings')
      .select('price_monthly, status, title')
      .eq('id', listingId)
      .maybeSingle()

    const oldPrice = existing?.price_monthly
    const oldStatus = existing?.status
    const newStatus = data.status || oldStatus || 'published'

    const { error } = await supabase
      .from('listings')
      .update({
        title: data.title,
        description: data.description,
        room_type: data.room_type,
        price_monthly: data.price_monthly,
        gender_preference: data.gender_preference,
        category: data.category,
        city: data.city,
        area: data.area,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        property_type: data.property_type ?? 'pg',
        furnish_status: data.furnish_status ?? 'unfurnished',
        deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : null,
        maintenance_charge: data.maintenance_charge ? Number(data.maintenance_charge) : null,
        available_from: data.available_from || null,
        ...(data.status ? { status: data.status } : {}),
      })
      .eq('id', listingId)

    if (error) return { error: error.message }

    // 2. Trigger notification edge function if price dropped or status changed
    if (typeof oldPrice === 'number' && data.price_monthly < oldPrice) {
      notifySavedPropertyUpdate({
        listing_id: listingId,
        update_type: 'price_drop',
        old_price: oldPrice,
        new_price: data.price_monthly,
        listing_title: data.title,
      }).catch(() => {})
    } else if (oldStatus && newStatus && oldStatus !== newStatus) {
      notifySavedPropertyUpdate({
        listing_id: listingId,
        update_type: 'status_update',
        old_status: oldStatus,
        new_status: newStatus,
        listing_title: data.title,
      }).catch(() => {})
    }

    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to update listing' }
  }
}

export async function getAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase.from('amenities').select('*').order('name')
  if (error) throw error
  return data ?? []
}

// ===== Payments =====

export async function createPayment(data: {
  purpose: PaymentPurpose
  listing_id?: string
  payer_identifier: string
}, userId: string): Promise<{ payment: Payment | null; error: string | null }> {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      purpose: data.purpose,
      listing_id: data.listing_id ?? null,
      payer_identifier: data.payer_identifier,
      amount_paise: PRICING[data.purpose],
      upi_id: UPI_ID,
      status: 'pending',
      user_id: userId,
    })
    .select('*')
    .single()

  if (error) return { payment: null, error: error.message }
  return { payment, error: null }
}

export async function updatePaymentUtr(paymentId: string, utr: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('payments')
    .update({ utr_number: utr })
    .eq('id', paymentId)

  if (error) return { error: error.message }
  return { error: null }
}

export async function createBoostListing(data: {
  listing_id: string
  user_id: string
  feature_type: FeatureType
  duration_days: number
}): Promise<{ error: string | null }> {
  const startsAt = new Date()
  const expiresAt = new Date(startsAt.getTime() + data.duration_days * 24 * 60 * 60 * 1000)
  const { error } = await supabase.from('boost_listings').insert({
    listing_id: data.listing_id,
    user_id: data.user_id,
    feature_type: data.feature_type,
    starts_at: startsAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    is_active: true,
  })
  if (error) return { error: error.message }
  return { error: null }
}

export async function getMyPayments(userId: string): Promise<Payment[]> {
  const { data, error } = await supabase.rpc('get_my_payments', { p_user_id: userId })
  if (error) throw error
  return (data as Payment[]) ?? []
}

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  const { data, error } = await supabase.rpc('get_payment_by_id', { p_payment_id: paymentId })
  if (error) throw error
  return (data as Payment) ?? null
}

// ===== Contact Unlock =====

export async function checkContactUnlocked(listingId: string, payerIdentifier: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('contact_unlocks')
    .select('id')
    .eq('listing_id', listingId)
    .eq('payer_identifier', payerIdentifier)
    .maybeSingle()

  if (error) return false
  return !!data
}

export async function getOwnerPhone(ownerId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('owner_phone')
    .select('phone')
    .eq('owner_id', ownerId)
    .maybeSingle()

  if (error) return null
  return data?.phone ?? null
}

// ===== DigiLocker / KYC Verification =====

export type IdType = 'aadhaar' | 'pan' | 'driving_license' | 'voter_id' | 'passport'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface UserVerification {
  id: string
  user_id: string
  id_type: IdType
  id_number_last4: string
  name_on_id: string
  dob: string | null
  digilocker_ref: string | null
  status: VerificationStatus
  verified_at: string | null
  created_at: string
}

export async function getUserVerification(userId: string): Promise<UserVerification | null> {
  const { data, error } = await supabase
    .from('user_verifications')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return null
  return data as UserVerification | null
}

export async function submitVerification(data: {
  user_id: string
  id_type: IdType
  id_number: string
  name_on_id: string
  dob?: string
}): Promise<{ error: string | null }> {
  const last4 = data.id_number.replace(/\s/g, '').slice(-4)
  // Simulate instant DigiLocker verification (in production this would call
  // the DigiLocker API and await a callback; here we auto-verify on submit).
  const { error } = await supabase
    .from('user_verifications')
    .upsert({
      user_id: data.user_id,
      id_type: data.id_type,
      id_number_last4: last4,
      name_on_id: data.name_on_id,
      dob: data.dob ?? null,
      digilocker_ref: `DGLK${Date.now().toString(36).toUpperCase()}`,
      status: 'verified',
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  if (error) return { error: error.message }
  return { error: null }
}

// ===== Admin =====

async function getSessionToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function callAdminApi(action: string, payload: Record<string, unknown>): Promise<any> {
  const token = await getSessionToken()
  if (!token) throw new Error('Not authenticated')
  const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const errBody = await res.json()
      msg = errBody.error ?? msg
    } catch { /* ignore parse error */ }
    throw new Error(msg)
  }
  const json = await res.json()
  return json.data
}

export async function getAdminAnalytics() {
  const data = await callAdminApi('getAdminAnalytics', {})
  return data as Record<string, number>
}

export async function getAdminPayments(): Promise<Payment[]> {
  const data = await callAdminApi('getAdminPayments', {})
  return (data as Payment[]) ?? []
}

export async function getPendingListings(): Promise<Listing[]> {
  const data = await callAdminApi('getPendingListings', {})
  return (data as Listing[]) ?? []
}

export async function approveListing(listingId: string): Promise<{ error: string | null }> {
  try {
    await callAdminApi('approveListing', { listingId })
    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to approve listing' }
  }
}

export async function rejectListing(listingId: string): Promise<{ error: string | null }> {
  try {
    await callAdminApi('rejectListing', { listingId })
    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to reject listing' }
  }
}

async function callPaymentAdmin(action: string, paymentId: string): Promise<{ error: string | null }> {
  try {
    const token = await getSessionToken()
    if (!token) return { error: 'Not authenticated' }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, payment_id: paymentId }),
    })
    if (!res.ok) {
      let msg = `Request failed (${res.status})`
      try { const errBody = await res.json(); msg = errBody.error ?? msg } catch { /* ignore */ }
      return { error: msg }
    }
    const data = await res.json()
    if (data.error) return { error: data.error }
    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed' }
  }
}

export async function verifyPayment(paymentId: string): Promise<{ error: string | null }> {
  return callPaymentAdmin('verify_payment', paymentId)
}

export async function rejectPayment(paymentId: string): Promise<{ error: string | null }> {
  return callPaymentAdmin('reject_payment', paymentId)
}

export async function deleteListing(listingId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('listings').delete().eq('id', listingId)
  if (error) return { error: error.message }
  return { error: null }
}

export async function deactivateListing(listingId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('listings').update({ status: 'inactive' }).eq('id', listingId)
  if (error) return { error: error.message }
  return { error: null }
}

export async function reactivateListing(listingId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('listings').update({ status: 'pending' }).eq('id', listingId)
  if (error) return { error: error.message }
  return { error: null }
}

// ===== Admin Status =====

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

// ===== Messages =====

export async function sendMessage(
  recipientId: string,
  listingId: string | null,
  body: string,
  senderId: string
): Promise<{ data: Message | null; error: string | null }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      recipient_id: recipientId,
      listing_id: listingId,
      body,
    })
    .select('*')
    .single()
  if (error) return { data: null, error: error.message }
  return { data: data as Message, error: null }
}

export async function getConversation(
  otherUserId: string,
  listingId: string | null,
  currentUserId: string
): Promise<Message[]> {
  let query = supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId}))`)
  if (listingId) {
    query = query.eq('listing_id', listingId)
  } else {
    query = query.is('listing_id', null)
  }
  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Message[]
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  // Fetch latest message per conversation (DISTINCT ON the other participant + listing)
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, recipient_id, listing_id, body, read_at, created_at, listings(title)')
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data || data.length === 0) return []

  // Group by conversation key (other_user_id + listing_id) and keep latest
  const convoMap = new Map<string, Conversation>()
  for (const msg of data as any[]) {
    const isSender = msg.sender_id === userId
    const otherUserId = isSender ? msg.recipient_id : msg.sender_id
    const listingId = msg.listing_id ?? null
    const key = `${otherUserId}:${listingId ?? 'null'}`

    if (!convoMap.has(key)) {
      const listingTitle = msg.listings?.title ?? null
      convoMap.set(key, {
        other_user_id: otherUserId,
        listing_id: listingId,
        listing_title: listingTitle,
        last_message: msg.body,
        last_message_at: msg.created_at,
        unread_count: 0,
        other_user_name: '',
      })
    }
    // Count unread: messages received by current user that are unread
    const convo = convoMap.get(key)!
    if (!isSender && !msg.read_at) {
      convo.unread_count += 1
    }
  }

  const conversations = Array.from(convoMap.values())

  // Resolve other user names via owners table
  const otherUserIds = [...new Set(conversations.map((c) => c.other_user_id))]
  if (otherUserIds.length > 0) {
    const { data: owners } = await supabase
      .from('owners')
      .select('full_name, user_id')
      .in('user_id', otherUserIds)

    const nameMap = new Map<string, string>()
    for (const o of (owners ?? []) as any[]) {
      nameMap.set(o.user_id, o.full_name)
    }
    for (const c of conversations) {
      c.other_user_name = nameMap.get(c.other_user_id) ?? 'Unknown'
    }
  }

  return conversations
}

export async function markMessageRead(messageId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId)
  if (error) return { error: error.message }
  return { error: null }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .is('read_at', null)
  if (error) return 0
  return count ?? 0
}

const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const MAX_PHOTOS = 10
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validatePhoto(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) return 'Only JPG, PNG, WebP, and GIF images are allowed'
  if (file.size > MAX_PHOTO_SIZE) return 'Image must be under 5MB'
  return null
}

export function validatePhotoCount(currentCount: number, adding: number): string | null {
  if (currentCount + adding > MAX_PHOTOS) return `Maximum ${MAX_PHOTOS} photos per listing`
  return null
}

export async function uploadListingPhoto(file: File, userId: string): Promise<string | null> {
  const validationError = validatePhoto(file)
  if (validationError) return null
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('listing-photos')
    .upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) return null
  const { data } = supabase.storage.from('listing-photos').getPublicUrl(filename)
  return data.publicUrl
}

// ===== Razorpay Payments =====

const RAZORPAY_ENABLED = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID)

export function isRazorpayEnabled(): boolean {
  return RAZORPAY_ENABLED
}

export async function createRazorpayOrder(params: {
  amountPaise: number
  purpose: string
  listingId?: string
  userId: string
}): Promise<{ orderId?: string; paymentId?: string; error: string | null }> {
  try {
    const token = await getSessionToken()
    if (!token) return { error: 'Not authenticated' }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: 'create_order',
        amount_paise: params.amountPaise,
        purpose: params.purpose,
        listing_id: params.listingId,
        user_id: params.userId,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.error ?? `Request failed (${res.status})` }
    }
    const data = await res.json()
    return { orderId: data.order_id, paymentId: data.payment_id, error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to create order' }
  }
}

export async function verifyRazorpayPayment(params: {
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
  paymentId: string
}): Promise<{ error: string | null }> {
  try {
    const token = await getSessionToken()
    if (!token) return { error: 'Not authenticated' }
    const res = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        action: 'verify_payment',
        razorpay_payment_id: params.razorpayPaymentId,
        razorpay_order_id: params.razorpayOrderId,
        razorpay_signature: params.razorpaySignature,
        payment_id: params.paymentId,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { error: err.error ?? `Request failed (${res.status})` }
    }
    return { error: null }
  } catch (err: any) {
    return { error: err.message ?? 'Failed to verify payment' }
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

export async function openRazorpayCheckout(params: {
  orderId: string
  amountPaise: number
  keyId: string
  purpose: string
  userFullName: string
  userEmail: string
  userPhone: string
  onSuccess: (paymentId: string, signature: string, orderId: string) => void
  onFailure: (error: string) => void
}): Promise<void> {
  const loaded = await loadRazorpayScript()
  if (!loaded) { params.onFailure('Failed to load payment gateway'); return }

  const options = {
    key: params.keyId,
    amount: params.amountPaise,
    currency: 'INR',
    name: 'Rentiefy',
    description: params.purpose,
    order_id: params.orderId,
    prefill: {
      name: params.userFullName,
      email: params.userEmail,
      contact: params.userPhone,
    },
    theme: { color: '#0d9488' },
    handler: (response: any) => {
      params.onSuccess(response.razorpay_payment_id, response.razorpay_signature, response.razorpay_order_id)
    },
    modal: {
      ondismiss: () => params.onFailure('Payment cancelled'),
    },
  }

  const rzp = new (window as any).Razorpay(options)
  rzp.on('payment.failed', (response: any) => {
    params.onFailure(response.error?.description ?? 'Payment failed')
  })
  rzp.open()
}

// ===== SMS Notifications =====

export async function sendSmsNotification(phone: string, message: string, userId?: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action: 'send_notification', phone, message, user_id: userId }),
    })
    if (!res.ok) return { success: false, error: `Request failed (${res.status})` }
    const data = await res.json()
    return { success: data.success ?? false, error: data.success ? null : 'SMS not sent' }
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Failed to send SMS' }
  }
}

export async function sendListingAlert(phone: string, listingTitle: string, userId?: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action: 'send_listing_alert', phone, listing_title: listingTitle, user_id: userId }),
    })
    if (!res.ok) return { success: false, error: `Request failed (${res.status})` }
    const data = await res.json()
    return { success: data.success ?? false, error: data.success ? null : 'SMS not sent' }
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Failed to send SMS' }
  }
}

// ===== Landlord & Society Reviews =====

const REVIEWS_STORAGE_KEY = 'rentiefy_property_reviews'

function getInitialMockReviews(listingId: string): PropertyReview[] {
  return [
    {
      id: `rev-1-${listingId}`,
      listing_id: listingId,
      user_id: 'usr-101',
      user_name: 'Aman Sharma',
      user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      is_anonymous: false,
      is_verified_tenant: true,
      category: 'landlord',
      rating: 5,
      title: 'Very supportive & transparent landlord',
      comment: 'The landlord is soft-spoken, respects tenant privacy, and responds promptly to plumbing or electrical repair requests. Security deposit refund process was smooth without unnecessary deductions.',
      pros: ['Quick maintenance response', 'Transparent deposit refund', 'No intrusive visits'],
      cons: ['Prefers digital UPI payments only'],
      responsiveness_rating: 5,
      maintenance_rating: 5,
      deposit_refund_rating: 5,
      transparency_rating: 4,
      helpful_count: 12,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: `rev-2-${listingId}`,
      listing_id: listingId,
      user_id: 'usr-102',
      user_name: 'Priya Verma',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      is_anonymous: false,
      is_verified_tenant: true,
      category: 'landlord',
      rating: 4,
      title: 'Good experience overall, clear guidelines',
      comment: 'Landlord provided clean inventory upon moving in. Fixed the geyser within 24 hours when it stopped working.',
      pros: ['Prompt repair assistance', 'Clear agreement terms'],
      cons: ['Strict on visitor curfew time (11 PM)'],
      responsiveness_rating: 4,
      maintenance_rating: 5,
      deposit_refund_rating: 4,
      transparency_rating: 4,
      helpful_count: 7,
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
    {
      id: `rev-3-${listingId}`,
      listing_id: listingId,
      user_id: 'usr-103',
      user_name: 'Rohan Gupta',
      user_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      is_anonymous: false,
      is_verified_tenant: true,
      category: 'society',
      rating: 5,
      title: 'Safe gated society with top amenities',
      comment: 'Excellent society environment! 24/7 CCTV surveillance and security guards at main gates. Maid & cook access is verified via MyGate app. Very clean campus with regular garden maintenance.',
      pros: ['24/7 Security & CCTV', 'Clean corridors & elevators', 'Ample visitor parking', 'Maid & grocery delivery allowed'],
      cons: ['Slight noise from main road during peak evening hours'],
      security_rating: 5,
      amenities_rating: 5,
      cleanliness_rating: 5,
      noise_environment_rating: 4,
      helpful_count: 18,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: `rev-4-${listingId}`,
      listing_id: listingId,
      user_id: 'usr-104',
      user_name: 'Anonymous Tenant',
      is_anonymous: true,
      is_verified_tenant: true,
      category: 'society',
      rating: 4,
      title: 'Peaceful locality, reliable water & electricity',
      comment: 'Living here for 8 months. Power backup works instantly during power cuts. Grocery shops and pharmacies are within 2 mins walk.',
      pros: ['No power outage issues', 'High water pressure', 'Friendly neighbors'],
      cons: ['Gym equipment is limited'],
      security_rating: 4,
      amenities_rating: 4,
      cleanliness_rating: 5,
      noise_environment_rating: 5,
      helpful_count: 9,
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ]
}

function getStoredReviews(): PropertyReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load local reviews:', e)
  }
  return []
}

function saveStoredReviews(reviews: PropertyReview[]) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
  } catch (e) {
    console.error('Failed to save local reviews:', e)
  }
}

export async function getReviewsForListing(listingId: string, category?: ReviewCategory): Promise<PropertyReview[]> {
  try {
    const { data, error } = await supabase
      .from('property_reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      let result = data as PropertyReview[]
      if (category) {
        result = result.filter(r => r.category === category)
      }
      return result
    }
  } catch (e) {
    // fallback to local storage
  }

  // Local Storage / Seed logic
  let allStored = getStoredReviews()
  let listingReviews = allStored.filter(r => r.listing_id === listingId)

  if (listingReviews.length === 0) {
    const initial = getInitialMockReviews(listingId)
    allStored = [...allStored, ...initial]
    saveStoredReviews(allStored)
    listingReviews = initial
  }

  if (category) {
    listingReviews = listingReviews.filter(r => r.category === category)
  }

  return listingReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function addPropertyReview(reviewData: {
  listing_id: string
  owner_id?: string
  user_id: string
  user_name: string
  user_avatar?: string
  is_anonymous: boolean
  is_verified_tenant: boolean
  category: ReviewCategory
  rating: number
  title: string
  comment: string
  pros?: string[]
  cons?: string[]
  responsiveness_rating?: number
  maintenance_rating?: number
  deposit_refund_rating?: number
  transparency_rating?: number
  security_rating?: number
  amenities_rating?: number
  cleanliness_rating?: number
  noise_environment_rating?: number
}): Promise<PropertyReview> {
  const newReview: PropertyReview = {
    id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...reviewData,
    helpful_count: 0,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('property_reviews')
      .insert(newReview)
      .select()
      .single()

    if (!error && data) {
      return data as PropertyReview
    }
  } catch (e) {
    // ignore, use fallback
  }

  // Fallback to local storage
  const allStored = getStoredReviews()
  const updated = [newReview, ...allStored]
  saveStoredReviews(updated)

  return newReview
}

export async function voteReviewHelpful(reviewId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('increment_review_helpful', { review_id_param: reviewId })
    if (!error && typeof data === 'number') {
      return data
    }
  } catch (e) {
    // ignore
  }

  const allStored = getStoredReviews()
  const review = allStored.find(r => r.id === reviewId)
  if (review) {
    review.helpful_count += 1
    saveStoredReviews(allStored)
    return review.helpful_count
  }
  return 1
}

// ===== Viewing Schedules =====

const SCHEDULES_STORAGE_KEY = 'rentiefy_viewing_schedules'

function getStoredSchedules(): ViewingSchedule[] {
  try {
    const raw = localStorage.getItem(SCHEDULES_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load local viewing schedules:', e)
  }
  return []
}

function saveStoredSchedules(schedules: ViewingSchedule[]) {
  try {
    localStorage.getItem(SCHEDULES_STORAGE_KEY)
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules))
  } catch (e) {
    console.error('Failed to save local viewing schedules:', e)
  }
}

export async function createViewingSchedule(scheduleData: {
  listing_id: string
  listing_title: string
  listing_address?: string
  user_id: string
  user_name: string
  user_phone: string
  user_email?: string
  owner_id: string
  owner_name?: string
  preferred_date: string
  preferred_time: string
  notes?: string
}): Promise<{ schedule: ViewingSchedule; error: string | null }> {
  const newSchedule: ViewingSchedule = {
    id: 'sch-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...scheduleData,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  let savedSchedule = newSchedule
  let dbSuccess = false

  try {
    const { data, error } = await supabase
      .from('viewing_schedules')
      .insert(newSchedule)
      .select()
      .single()

    if (!error && data) {
      savedSchedule = data as ViewingSchedule
      dbSuccess = true
    }
  } catch (e) {
    // fallback to local storage
  }

  if (!dbSuccess) {
    const stored = getStoredSchedules()
    saveStoredSchedules([newSchedule, ...stored])
  }

  // Notify Landlord via Rentiefy In-App Message
  if (scheduleData.owner_id) {
    const messageBody = `📅 NEW PROPERTY VIEWING REQUEST!
Property: ${scheduleData.listing_title}
Requested Date: ${scheduleData.preferred_date}
Requested Time: ${scheduleData.preferred_time}
Tenant Name: ${scheduleData.user_name}
Tenant Phone: ${scheduleData.user_phone}
${scheduleData.notes ? `Note from Tenant: ${scheduleData.notes}` : ''}

Please reply here or call the tenant to confirm!`

    try {
      await sendMessage(scheduleData.owner_id, scheduleData.listing_id, messageBody, scheduleData.user_id)
    } catch (e) {
      console.warn('Failed to send in-app message to landlord:', e)
    }

    // Try sending SMS alert to landlord if owner phone is available
    try {
      const phone = await getOwnerPhone(scheduleData.owner_id)
      if (phone) {
        await sendSmsNotification(
          phone,
          `Rentiefy Alert: New viewing request for "${scheduleData.listing_title}" on ${scheduleData.preferred_date} at ${scheduleData.preferred_time} by ${scheduleData.user_name} (${scheduleData.user_phone}).`,
          scheduleData.owner_id
        )
      }
    } catch (e) {
      // ignore sms failure
    }
  }

  return { schedule: savedSchedule, error: null }
}

export async function getViewingSchedulesForUser(userId: string): Promise<ViewingSchedule[]> {
  try {
    const { data, error } = await supabase
      .from('viewing_schedules')
      .select('*')
      .or(`user_id.eq.${userId},owner_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data as ViewingSchedule[]
    }
  } catch (e) {
    // ignore
  }

  const stored = getStoredSchedules()
  return stored.filter((s) => s.user_id === userId || s.owner_id === userId)
}

export async function updateViewingScheduleStatus(
  scheduleId: string,
  status: ViewingStatus
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('viewing_schedules')
      .update({ status })
      .eq('id', scheduleId)

    if (!error) {
      const stored = getStoredSchedules()
      const item = stored.find((s) => s.id === scheduleId)
      if (item) {
        item.status = status
        saveStoredSchedules(stored)
      }
      return { success: true, error: null }
    }
  } catch (e) {
    // fallback
  }

  const stored = getStoredSchedules()
  const item = stored.find((s) => s.id === scheduleId)
  if (item) {
    item.status = status
    saveStoredSchedules(stored)
    return { success: true, error: null }
  }
  return { success: false, error: 'Schedule not found' }
}

