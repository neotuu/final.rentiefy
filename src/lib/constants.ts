import type { PaymentPurpose, RoomType, GenderPreference, ListingCategory, PropertyType, FurnishStatus } from './types'

export const PRICING = {
  contact_unlock: 1000,
  featured: 9900,
  verification: 4900,
  subscription: 29900,
  sponsored: 29900,
  boost: 19900,
  premium_badge: 9900,
  ai_price_opt: 14900,
  email_alerts: 49900,
  whatsapp_alerts: 9900,
  reel_creation: 199900,
  builder_subscription: 299900,
} as const

export const PRICING_LABELS: Record<PaymentPurpose, { label: string; sub: string }> = {
  contact_unlock: { label: 'Rs. 10', sub: 'per contact unlock' },
  featured: { label: 'Rs. 99', sub: '7-day boost' },
  verification: { label: 'Rs. 49', sub: 'one-time badge' },
  subscription: { label: 'Rs. 299', sub: '30-day premium' },
  sponsored: { label: 'Rs. 299', sub: 'per week' },
  boost: { label: 'Rs. 199', sub: '7 days' },
  premium_badge: { label: 'Rs. 99', sub: 'per month' },
  ai_price_opt: { label: 'Rs. 149', sub: 'per month' },
  email_alerts: { label: 'Rs. 499', sub: 'per campaign' },
  whatsapp_alerts: { label: 'Rs. 99', sub: 'per month' },
  reel_creation: { label: 'Rs. 1,999', sub: 'one-time' },
  builder_subscription: { label: 'Rs. 2,999', sub: 'per month' },
}

export const UPI_ID = 'rentifyindore@upi'

export const CITIES = [
  'Indore', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata',
  'Gurgaon', 'Noida', 'Thane', 'Navi Mumbai', 'Ahmedabad', 'Surat', 'Vadodara', 'Jaipur',
  'Chandigarh', 'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Dehradun', 'Ludhiana', 'Amritsar',
  'Kochi', 'Trivandrum', 'Coimbatore', 'Visakhapatnam', 'Vijayawada', 'Mysore', 'Madurai',
  'Bhopal', 'Patna', 'Bhubaneswar', 'Ranchi', 'Raipur', 'Nagpur', 'Nashik', 'Goa',
  'Guwahati', 'Shillong', 'Gwalior', 'Jabalpur', 'Udaipur', 'Jodhpur',
]

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Gurgaon': { lat: 28.4595, lng: 77.0266 },
  'Noida': { lat: 28.5355, lng: 77.3910 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Navi Mumbai': { lat: 19.0330, lng: 73.0297 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Dehradun': { lat: 30.3165, lng: 78.0322 },
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Trivandrum': { lat: 8.5241, lng: 76.9366 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Vijayawada': { lat: 16.5062, lng: 80.6480 },
  'Mysore': { lat: 12.2958, lng: 76.6394 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Raipur': { lat: 21.2514, lng: 81.6296 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Goa': { lat: 15.4989, lng: 73.8278 },
  'Guwahati': { lat: 26.1445, lng: 91.7362 },
  'Shillong': { lat: 25.5788, lng: 91.8933 },
  'Gwalior': { lat: 26.2183, lng: 78.1828 },
  'Jabalpur': { lat: 23.1815, lng: 79.9864 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
}

export const CITY_AREAS: Record<string, string[]> = {
  'Indore': ['Vijay Nagar', 'Bhawarkua', 'Palasia', 'Geeta Bhavan', 'LIG Colony', 'Sapna Sangeeta', 'AB Road', 'Super Corridor', 'Rajendra Nagar', 'Snehlata Ganj', 'Navlakha', 'Bombay Hospital Road'],
  'Delhi': ['Dwarka', 'Laxmi Nagar', 'Saket', 'Rohini', 'Pitampura', 'Greater Kailash', 'Vasant Kunj', 'Karol Bagh', 'Janakpuri', 'Mayur Vihar', 'Uttam Nagar', 'Lajpat Nagar'],
  'Mumbai': ['Bandra West', 'Andheri East', 'Powai', 'Juhu', 'Goregaon', 'Malad', 'Kandivali', 'Borivali', 'Colaba', 'Worli', 'Dadar', 'Ghatkopar'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'BTM Layout', 'Marathahalli', 'Electronic City', 'JP Nagar', 'Hebbal', 'Malleshwaram', 'Yelahanka'],
  'Hyderabad': ['Gachibowli', 'Madhapur', 'Banjara Hills', 'Kukatpally', 'Begumpet', 'Hitech City', 'Kondapur', 'Manikonda', 'Jubilee Hills', 'Secunderabad', 'Miyapur', 'Nallagandla'],
  'Pune': ['Koregaon Park', 'Hinjewadi', 'Viman Nagar', 'Kothrud', 'Baner', 'Wakad', 'Hadapsar', 'Aundh', 'Camp', 'Shivaji Nagar', 'Kalyani Nagar', 'Magarpatta'],
  'Chennai': ['Adyar', 'T Nagar', 'Velachery', 'Anna Nagar', 'Tambaram', 'Guindy', 'Mylapore', 'Besant Nagar', 'Perungudi', 'Sholinganallur', 'Porur', 'Chrompet'],
  'Kolkata': ['Salt Lake', 'Park Street', 'New Town', 'Ballygunge', 'Gariahat', 'Jadavpur', 'Behala', 'Tollygunge', 'Howrah', 'Dum Dum', 'Rajarhat', 'Esplanade'],
  'Gurgaon': ['Cyber City', 'Golf Course Road', 'Sector 56', 'Sector 45', 'DLF Phase 1', 'DLF Phase 3', 'Sohna Road', 'Sector 23', 'MG Road', 'Sector 57'],
  'Noida': ['Sector 62', 'Sector 18', 'Sector 50', 'Sector 137', 'Greater Noida West', 'Sector 76', 'Sector 128', 'Noida Extension', 'Sector 15', 'Sector 44'],
  'Thane': ['Ghodbunder Road', 'Majiwada', 'Vartak Nagar', 'Panchpakhadi', 'Thane West', 'Kolshet Road', 'Hiranandani Estate', 'Naupada', 'Naupada', 'Wagle Estate'],
  'Navi Mumbai': ['Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Airoli', 'Seawoods', 'Panvel', 'Ghansoli', 'Kamothe', 'Koperkhairane'],
  'Ahmedabad': ['Prahlad Nagar', 'Bodakdev', 'Satellite', 'Bopal', 'Thaltej', 'Vastrapur', 'SG Highway', 'Maninagar', 'Naranpura', 'Navrangpura', 'C.G. Road', 'Gota'],
  'Surat': ['Vesu', 'Adajan', 'Piplod', 'Ghod Dod Road', 'Varachha', 'Katargam', 'City Light', 'Pal', 'Bhatar', 'Althan'],
  'Vadodara': ['Alkapuri', 'Vasna Road', 'Gotri', 'Akota', 'Bhayli', 'OP Road', 'Manjalpur', 'Karelibaug', 'Sama', 'Subhanpura'],
  'Jaipur': ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Tonk Road', 'Civil Lines', 'Sodala', 'Raja Park', 'Vidhyadhar Nagar', 'Sanganer', 'Pratap Nagar'],
  'Chandigarh': ['Sector 35', 'Sector 22', 'Sector 17', 'Sector 8', 'Sector 43', 'Sector 44', 'Mohali Sector 70', 'Panchkula Sector 20', 'Sector 11', 'Sector 15', 'Sector 26', 'Zirakpur'],
  'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Rajajipuram', 'Aashiana', 'Chowk', 'Aminabad', 'Vikas Nagar', 'Alambagh', 'Nirala Nagar', 'Janakipuram'],
  'Kanpur': ['Swaroop Nagar', 'Civil Lines', 'Kidwai Nagar', 'Kakadeo', 'Sharda Nagar', 'Govind Nagar', 'Pankha', 'Mall Road'],
  'Varanasi': ['Lanka', 'Sigra', 'Mahmoorganj', 'Cantonment', 'Godowlia', 'Bhelupur', 'Sarnath', 'Assi Ghat'],
  'Agra': ['Tajganj', 'Sanjay Place', 'Dayal Bagh', 'Kamla Nagar', 'Civil Lines', 'Shastripuram', 'Khandari'],
  'Dehradun': ['Rajpur Road', 'EC Road', 'Clement Town', 'Sahastradhara Road', 'Chakrata Road', 'Vasant Vihar', 'Ballupur', 'Dalanwala'],
  'Ludhiana': ['Sarabha Nagar', 'Model Town', 'BRS Nagar', 'Civil Lines', 'Ferozepur Road', 'Pakhowal Road', 'Dugri'],
  'Amritsar': ['Ranjit Avenue', 'Mall Road', 'Green Avenue', 'Court Road', 'Albert Road', 'GT Road', 'Model Town'],
  'Kochi': ['Kakkanad', 'Edappally', 'Marine Drive', 'Fort Kochi', 'Panampilly Nagar', 'Vyttila', 'Tripunithura', 'Aluva', 'Kalamassery', 'Thevara', 'Kadvanthra', 'Palarivattom'],
  'Trivandrum': ['Kazhakoottam', 'Vazhuthacaud', 'Kowdiar', 'Pattom', 'Sasthamangalam', 'Technopark Area', 'Vellayambalam', 'Palayam'],
  'Coimbatore': ['RS Puram', 'Peelamedu', 'Gandhipuram', 'Saibaba Colony', 'Race Course', 'Saravanampatti', 'Singanallur', 'Ramanathapuram'],
  'Visakhapatnam': ['MVP Colony', 'Gajuwaka', 'Seethammadhara', 'Siripuram', 'Rushikonda', 'Dwaraka Nagar', 'Madhurawada', 'Waltair Uplands'],
  'Vijayawada': ['Benz Circle', 'Moghalrajpuram', 'Governorpet', 'Satyanarayanapuram', 'Gannavaram', 'Tadepalli', 'Labbipet'],
  'Mysore': ['Gokulam', 'Jayalakshmipuram', 'VV Mohalla', 'Vijayanagar', 'Kuvempunagar', 'Saraswathipuram', 'Hebbal'],
  'Madurai': ['Anna Nagar', 'KK Nagar', 'SS Colony', 'TVS Nagar', 'TALLAKULAM', 'Simmakkal', 'Ellis Nagar'],
  'Bhopal': ['Arera Colony', 'MP Nagar', 'Gulmohar', 'Kolar Road', 'Shahpura', 'Habibganj', 'Hoshangabad Road', 'Chinar Park', 'Bairagarh', 'Shyamla Hills'],
  'Patna': ['Boring Road', 'Kankerbagh', 'Bailey Road', 'Patliputra Colony', 'Rajendra Nagar', 'Ashiana Nagar', 'Danapur', 'Exhibition Road'],
  'Bhubaneswar': ['Patia', 'Jaydev Vihar', 'Saheed Nagar', 'Khandagiri', 'Nayapalli', 'Chandrasekharpur', 'Old Town', 'Unit 4'],
  'Ranchi': ['Kanke Road', 'Lalpur', 'Doranda', 'Bariatu', 'Morabadi', 'Harmu', 'Hinoo', 'Ratu Road'],
  'Raipur': ['Shankar Nagar', 'Telibandha', 'Devendra Nagar', 'Pandri', 'Tatibandh', 'VIP Road', 'Kachna', 'Kabir Nagar'],
  'Nagpur': ['Dharampeth', 'Civil Lines', 'Ramdaspeth', 'Manewada', 'Manish Nagar', 'Wardha Road', 'Besha', 'Sitabuldi'],
  'Nashik': ['College Road', 'Gangapur Road', 'Indira Nagar', 'Govind Nagar', 'Mahatmanagar', 'Pathardi Phata', 'Panchavati'],
  'Goa': ['Panaji', 'Calangute', 'Candolim', 'Margao', 'Vasco da Gama', 'Porvorim', 'Mapusa', 'Dona Paula', 'Anjuna', 'Benaulim'],
  'Guwahati': ['GS Road', 'Zoo Road', 'Ganeshguri', 'Beltola', 'Dispur', 'Uzan Bazar', 'Chandmari', 'Rehabari', 'Bhatapara'],
  'Shillong': ['Laitumkhrah', 'Police Bazar', 'Police Reserve', 'Labat', 'Mawkhar', 'Nongthyrmai', 'Upper Shillong'],
  'Gwalior': ['City Centre', 'Lashkar', 'Morar', 'Thatipur', 'DD Nagar', 'Gwalior Fort Area', 'Kampoo'],
  'Jabalpur': ['Wright Town', 'Civil Lines', 'Vijay Nagar', 'Napier Town', 'Gorakhpur', 'Madan Mahal', 'Tilhari'],
  'Udaipur': ['Fatehpura', 'Hiran Magri', 'Panchwati', 'Shobhagpura', 'Sukher', 'Old City', 'Bhuwana'],
  'Jodhpur': ['Shastri Nagar', 'Ratanada', 'Sardarpura', 'Pal Road', 'Chopasni Housing Board', 'Paota'],
}

// City cost multipliers for rent estimation (relative to base)
export const CITY_MULTIPLIERS: Record<string, number> = {
  'Mumbai': 3.5, 'Delhi': 2.8, 'Gurgaon': 2.7, 'Bangalore': 2.5, 'Noida': 2.2,
  'Hyderabad': 2.0, 'Pune': 2.0, 'Thane': 2.0, 'Navi Mumbai': 1.9, 'Chennai': 1.8,
  'Goa': 1.8, 'Chandigarh': 1.6, 'Kolkata': 1.5, 'Ahmedabad': 1.4, 'Kochi': 1.3,
  'Surat': 1.3, 'Dehradun': 1.3, 'Visakhapatnam': 1.3, 'Coimbatore': 1.3,
  'Jaipur': 1.2, 'Vadodara': 1.2, 'Lucknow': 1.1, 'Bhubaneswar': 1.1, 'Guwahati': 1.1,
  'Indore': 1.0, 'Bhopal': 0.95, 'Patna': 1.0, 'Nagpur': 1.0, 'Nashik': 1.0,
  'Kanpur': 0.9, 'Ranchi': 0.9, 'Raipur': 0.9, 'Gwalior': 0.85, 'Jabalpur': 0.85,
  'Agra': 0.9, 'Varanasi': 0.9, 'Ludhiana': 1.0, 'Amritsar': 0.9, 'Trivandrum': 1.1,
  'Vijayawada': 1.1, 'Mysore': 1.1, 'Madurai': 0.9, 'Shillong': 1.0, 'Udaipur': 1.1, 'Jodhpur': 0.9,
}

export const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'pg', 'hostel', 'room', 'studio', 'office', 'shop', 'warehouse']

export const ROOM_TYPE_TRANSLATION_KEYS: Record<RoomType, string> = {
  'shared': 'roomType.shared', 'single': 'roomType.single', 'twin-sharing': 'roomType.twinSharing',
  '1bhk': 'roomType.1bhk', '2bhk': 'roomType.2bhk', '3bhk': 'roomType.3bhk',
  'house': 'roomType.house', 'studio': 'roomType.studio',
}

export const GENDER_TRANSLATION_KEYS: Record<GenderPreference, string> = {
  'any': 'gender.any', 'male': 'gender.male', 'female': 'gender.female',
  'non-binary': 'gender.nonBinary', 'other': 'gender.other', 'prefer-not': 'gender.preferNot',
}

export const CATEGORY_TRANSLATION_KEYS: Record<ListingCategory, string> = {
  'student': 'category.student', 'professional': 'category.professional', 'family': 'category.family',
}

export const PURPOSE_TRANSLATION_KEYS: Record<PaymentPurpose, string> = {
  'contact_unlock': 'purpose.contactUnlock', 'featured': 'purpose.featured',
  'verification': 'purpose.verification', 'subscription': 'purpose.subscription',
  'sponsored': 'purpose.sponsored', 'boost': 'purpose.boost',
  'premium_badge': 'purpose.premiumBadge', 'ai_price_opt': 'purpose.aiPriceOpt',
  'email_alerts': 'purpose.emailAlerts', 'whatsapp_alerts': 'purpose.whatsappAlerts',
  'reel_creation': 'purpose.reelCreation', 'builder_subscription': 'purpose.builderSubscription',
}

// Metadata for monetization feature cards
export const MONETIZATION_FEATURES: { purpose: PaymentPurpose; icon: string; color: string; descKey: string }[] = [
  { purpose: 'sponsored', icon: 'Flame', color: 'text-orange-500', descKey: 'dash.sponsoredDesc' },
  { purpose: 'boost', icon: 'TrendingUp', color: 'text-blue-500', descKey: 'dash.boostDesc' },
  { purpose: 'premium_badge', icon: 'Crown', color: 'text-amber-500', descKey: 'dash.premiumBadgeDesc' },
  { purpose: 'ai_price_opt', icon: 'Sparkles', color: 'text-violet-500', descKey: 'dash.aiPriceDesc' },
  { purpose: 'email_alerts', icon: 'Mail', color: 'text-rose-500', descKey: 'dash.emailAlertsDesc' },
  { purpose: 'whatsapp_alerts', icon: 'MessageCircle', color: 'text-green-500', descKey: 'dash.whatsappAlertsDesc' },
  { purpose: 'reel_creation', icon: 'Video', color: 'text-pink-500', descKey: 'dash.reelDesc' },
  { purpose: 'builder_subscription', icon: 'Building2', color: 'text-indigo-500', descKey: 'dash.builderSubDesc' },
]

export const PROPERTY_TYPE_TRANSLATION_KEYS: Record<PropertyType, string> = {
  'apartment': 'propType.apartment', 'house': 'propType.house', 'pg': 'propType.pg',
  'hostel': 'propType.hostel', 'room': 'propType.room', 'studio': 'propType.studio',
  'office': 'propType.office', 'shop': 'propType.shop', 'warehouse': 'propType.warehouse',
}

export const FURNISH_TRANSLATION_KEYS: Record<FurnishStatus, string> = {
  'unfurnished': 'furnish.unfurnished', 'semi-furnished': 'furnish.semi', 'fully-furnished': 'furnish.fully',
}

// Rent estimate base prices per sq ft per month (Rs.) by property type
export const RENT_ESTIMATE_BASE: Record<PropertyType, number> = {
  'apartment': 12, 'house': 10, 'pg': 8, 'hostel': 5, 'room': 7,
  'studio': 15, 'office': 20, 'shop': 25, 'warehouse': 8,
}

// Area multipliers within each city (relative to city base)
export const AREA_MULTIPLIERS: Record<string, number> = {
  // Indore
  'Vijay Nagar': 1.3, 'Palasia': 1.4, 'AB Road': 1.2, 'Super Corridor': 1.1,
  'Bhawarkua': 0.9, 'Geeta Bhavan': 1.0, 'LIG Colony': 1.1, 'Sapna Sangeeta': 1.0,
  'Rajendra Nagar': 0.95, 'Snehlata Ganj': 0.85, 'Navlakha': 0.8, 'Bombay Hospital Road': 1.05,
  // Delhi
  'Dwarka': 1.1, 'Laxmi Nagar': 0.85, 'Saket': 1.3, 'Rohini': 1.0, 'Pitampura': 1.1,
  'Greater Kailash': 1.5, 'Vasant Kunj': 1.4, 'Karol Bagh': 1.0, 'Janakpuri': 1.0,
  'Mayur Vihar': 1.1, 'Uttam Nagar': 0.8, 'Lajpat Nagar': 1.3,
  // Mumbai
  'Bandra West': 1.8, 'Andheri East': 1.2, 'Powai': 1.4, 'Juhu': 1.7, 'Goregaon': 1.1,
  'Malad': 1.0, 'Kandivali': 0.95, 'Borivali': 0.85, 'Thane': 0.9, 'Navi Mumbai': 0.85,
  'Colaba': 1.9, 'Worli': 1.6,
  // Pune
  'Koregaon Park': 1.4, 'Hinjewadi': 1.1, 'Viman Nagar': 1.2, 'Kothrud': 1.0,
  'Baner': 1.15, 'Wakad': 1.0, 'Hadapsar': 0.95, 'Aundh': 1.2,
  'Camp': 1.3, 'Shivaji Nagar': 1.1, 'Kalyani Nagar': 1.3, 'Magarpatta': 1.1,
  // Bangalore
  'Koramangala': 1.4, 'Indiranagar': 1.5, 'Whitefield': 1.2, 'Jayanagar': 1.1,
  'HSR Layout': 1.3, 'BTM Layout': 1.0, 'Marathahalli': 1.15, 'Electronic City': 0.95,
  'JP Nagar': 1.2, 'Hebbal': 1.1, 'Malleshwaram': 1.2, 'Yelahanka': 0.85,
  // Hyderabad
  'Gachibowli': 1.3, 'Madhapur': 1.2, 'Banjara Hills': 1.6, 'Kukatpally': 0.95,
  'Begumpet': 1.1, 'Hitech City': 1.3, 'Kondapur': 1.2, 'Manikonda': 1.0,
  'Jubilee Hills': 1.5, 'Secunderabad': 1.0, 'Miyapur': 0.85, 'Nallagandla': 0.9,
  // Chennai
  'Adyar': 1.3, 'T Nagar': 1.2, 'Velachery': 1.1, 'Anna Nagar': 1.2,
  'Tambaram': 0.85, 'Guindy': 1.1, 'Mylapore': 1.15, 'Besant Nagar': 1.3,
  'Perungudi': 1.0, 'Sholinganallur': 0.95, 'Porur': 1.0, 'Chrompet': 0.8,
  // Kolkata
  'Salt Lake': 1.3, 'Park Street': 1.5, 'New Town': 1.2, 'Ballygunge': 1.4,
  'Gariahat': 1.2, 'Jadavpur': 1.0, 'Behala': 0.85, 'Tollygunge': 1.0,
  'Howrah': 0.8, 'Dum Dum': 0.9, 'Rajarhat': 1.1, 'Esplanade': 1.3,
  // Jaipur
  'C-Scheme': 1.3, 'Malviya Nagar': 1.1, 'Vaishali Nagar': 1.15, 'Mansarovar': 0.95,
  'Jagatpura': 1.0, 'Tonk Road': 1.2, 'Civil Lines': 1.3, 'Sodala': 1.0,
  'Raja Park': 1.1, 'Vidhyadhar Nagar': 1.0, 'Sanganer': 0.85, 'Pratap Nagar': 0.9,
  // Ahmedabad
  'Prahlad Nagar': 1.3, 'Bodakdev': 1.2, 'Satellite': 1.2, 'Bopal': 1.0,
  'Thaltej': 1.15, 'Vastrapur': 1.1, 'SG Highway': 1.15, 'Maninagar': 0.9,
  'Naranpura': 1.0, 'Navrangpura': 1.2, 'C.G. Road': 1.2, 'Gota': 1.0,
  // Chandigarh
  'Sector 35': 1.3, 'Sector 22': 1.2, 'Sector 17': 1.3, 'Sector 8': 1.4,
  'Sector 43': 1.2, 'Sector 44': 1.2, 'Mohali': 0.95, 'Panchkula': 1.0,
  'Sector 11': 1.1, 'Sector 15': 1.1, 'Sector 26': 1.2, 'Sector 61': 1.0,
  // Kochi
  'Kakkanad': 1.2, 'Edappally': 1.1, 'Marine Drive': 1.4, 'Fort Kochi': 1.2,
  'Panampilly Nagar': 1.3, 'Vyttila': 1.1, 'Tripunithura': 0.95, 'Aluva': 0.85,
  'Kalamassery': 0.9, 'Thevara': 1.1, 'Kadvanthra': 1.2, 'Palarivattom': 1.1,
  // Lucknow
  'Gomti Nagar': 1.3, 'Hazratganj': 1.4, 'Aliganj': 1.0, 'Indira Nagar': 1.1,
  'Rajajipuram': 0.95, 'Aashiana': 1.0, 'Chowk': 1.1, 'Aminabad': 1.0,
  'Vikas Nagar': 1.05, 'Alambagh': 0.9, 'Nirala Nagar': 1.1, 'Janakipuram': 1.0,
  // Gurgaon
  'Cyber City': 1.6, 'Golf Course Road': 1.8, 'Sector 56': 1.1, 'Sector 45': 1.2, 'DLF Phase 1': 1.5, 'Sohna Road': 1.0,
  // Noida
  'Sector 62': 1.2, 'Sector 18': 1.4, 'Sector 50': 1.3, 'Sector 137': 1.0, 'Greater Noida West': 0.85,
  // Thane & Navi Mumbai
  'Ghodbunder Road': 1.0, 'Hiranandani Estate': 1.4, 'Vashi': 1.3, 'Belapur': 1.1, 'Kharghar': 1.0, 'Airoli': 1.1,
  // Surat & Vadodara
  'Vesu': 1.3, 'Adajan': 1.1, 'Piplod': 1.2, 'Alkapuri': 1.4, 'Gotri': 1.1, 'Vasna Road': 1.1,
  // Bhopal & Central India
  'Arera Colony': 1.4, 'MP Nagar': 1.2, 'Gulmohar': 1.1, 'Kolar Road': 0.9, 'City Centre': 1.3, 'Wright Town': 1.2,
  // Patna, Ranchi, Bhubaneswar, Raipur
  'Boring Road': 1.3, 'Kankerbagh': 1.1, 'Patia': 1.3, 'Kanke Road': 1.2, 'Shankar Nagar': 1.3,
  // South Cities
  'Kazhakoottam': 1.2, 'Kowdiar': 1.4, 'RS Puram': 1.4, 'Peelamedu': 1.2, 'MVP Colony': 1.3, 'Benz Circle': 1.3, 'Gokulam': 1.3,
  // North & West
  'Rajpur Road': 1.4, 'EC Road': 1.2, 'Sarabha Nagar': 1.3, 'Ranjit Avenue': 1.3, 'Panaji': 1.5, 'Calangute': 1.3,
  'GS Road': 1.3, 'Zoo Road': 1.2, 'Laitumkhrah': 1.3, 'Tajganj': 1.1, 'Swaroop Nagar': 1.3, 'Lanka': 1.2,
}

// Locality data for major areas across India
export const LOCALITY_DATA: Record<string, { safety: string; internet: string; transport: string; grocery: number; schools: number; hospitals: number; parks: number; trend: string }> = {
  // Indore
  'Vijay Nagar': { safety: '4.5/5', internet: '100 Mbps', transport: 'Excellent', grocery: 15, schools: 10, hospitals: 6, parks: 4, trend: '+8% YoY' },
  'Palasia': { safety: '4.7/5', internet: '100 Mbps', transport: 'Good', grocery: 12, schools: 8, hospitals: 5, parks: 3, trend: '+6% YoY' },
  'Bhawarkua': { safety: '4.0/5', internet: '50 Mbps', transport: 'Good', grocery: 18, schools: 6, hospitals: 4, parks: 2, trend: '+4% YoY' },
  'Geeta Bhavan': { safety: '4.2/5', internet: '50 Mbps', transport: 'Good', grocery: 10, schools: 7, hospitals: 3, parks: 3, trend: '+5% YoY' },
  'LIG Colony': { safety: '4.3/5', internet: '50 Mbps', transport: 'Average', grocery: 8, schools: 5, hospitals: 3, parks: 2, trend: '+5% YoY' },
  'Sapna Sangeeta': { safety: '4.1/5', internet: '50 Mbps', transport: 'Good', grocery: 11, schools: 4, hospitals: 4, parks: 2, trend: '+3% YoY' },
  'AB Road': { safety: '4.2/5', internet: '100 Mbps', transport: 'Excellent', grocery: 14, schools: 8, hospitals: 5, parks: 3, trend: '+7% YoY' },
  'Super Corridor': { safety: '4.4/5', internet: '100 Mbps', transport: 'Average', grocery: 6, schools: 3, hospitals: 2, parks: 5, trend: '+12% YoY' },
  // Delhi & NCR
  'Dwarka': { safety: '4.3/5', internet: '100 Mbps', transport: 'Excellent', grocery: 20, schools: 15, hospitals: 8, parks: 6, trend: '+6% YoY' },
  'Laxmi Nagar': { safety: '4.0/5', internet: '100 Mbps', transport: 'Excellent', grocery: 25, schools: 10, hospitals: 6, parks: 3, trend: '+5% YoY' },
  'Saket': { safety: '4.4/5', internet: '100 Mbps', transport: 'Excellent', grocery: 18, schools: 12, hospitals: 8, parks: 5, trend: '+7% YoY' },
  'Rohini': { safety: '4.1/5', internet: '100 Mbps', transport: 'Good', grocery: 22, schools: 14, hospitals: 7, parks: 4, trend: '+5% YoY' },
  'Cyber City': { safety: '4.7/5', internet: '300 Mbps', transport: 'Excellent', grocery: 22, schools: 10, hospitals: 6, parks: 5, trend: '+11% YoY' },
  'Sector 62': { safety: '4.4/5', internet: '200 Mbps', transport: 'Excellent', grocery: 20, schools: 11, hospitals: 7, parks: 4, trend: '+9% YoY' },
  // Mumbai & Metropolitan Region
  'Bandra West': { safety: '4.6/5', internet: '100 Mbps', transport: 'Excellent', grocery: 30, schools: 15, hospitals: 10, parks: 4, trend: '+10% YoY' },
  'Andheri East': { safety: '4.2/5', internet: '100 Mbps', transport: 'Excellent', grocery: 28, schools: 12, hospitals: 8, parks: 3, trend: '+8% YoY' },
  'Powai': { safety: '4.5/5', internet: '100 Mbps', transport: 'Good', grocery: 20, schools: 10, hospitals: 6, parks: 5, trend: '+9% YoY' },
  'Hiranandani Estate': { safety: '4.8/5', internet: '200 Mbps', transport: 'Good', grocery: 18, schools: 8, hospitals: 5, parks: 8, trend: '+8% YoY' },
  'Vashi': { safety: '4.5/5', internet: '100 Mbps', transport: 'Excellent', grocery: 24, schools: 12, hospitals: 7, parks: 6, trend: '+7% YoY' },
  // Bangalore
  'Koramangala': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 25, schools: 12, hospitals: 8, parks: 6, trend: '+12% YoY' },
  'Indiranagar': { safety: '4.5/5', internet: '100 Mbps', transport: 'Excellent', grocery: 22, schools: 10, hospitals: 7, parks: 5, trend: '+11% YoY' },
  'Whitefield': { safety: '4.2/5', internet: '100 Mbps', transport: 'Average', grocery: 18, schools: 8, hospitals: 5, parks: 7, trend: '+10% YoY' },
  // Pune
  'Koregaon Park': { safety: '4.5/5', internet: '100 Mbps', transport: 'Good', grocery: 20, schools: 10, hospitals: 6, parks: 5, trend: '+8% YoY' },
  'Hinjewadi': { safety: '4.1/5', internet: '100 Mbps', transport: 'Average', grocery: 15, schools: 6, hospitals: 4, parks: 4, trend: '+7% YoY' },
  'Viman Nagar': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 18, schools: 8, hospitals: 5, parks: 3, trend: '+8% YoY' },
  // Hyderabad
  'Gachibowli': { safety: '4.4/5', internet: '100 Mbps', transport: 'Good', grocery: 20, schools: 10, hospitals: 6, parks: 5, trend: '+10% YoY' },
  'Madhapur': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 22, schools: 8, hospitals: 5, parks: 4, trend: '+9% YoY' },
  'Banjara Hills': { safety: '4.7/5', internet: '100 Mbps', transport: 'Good', grocery: 25, schools: 12, hospitals: 8, parks: 6, trend: '+8% YoY' },
  // Chennai
  'Adyar': { safety: '4.4/5', internet: '100 Mbps', transport: 'Good', grocery: 20, schools: 12, hospitals: 7, parks: 5, trend: '+6% YoY' },
  'T Nagar': { safety: '4.2/5', internet: '100 Mbps', transport: 'Excellent', grocery: 30, schools: 10, hospitals: 6, parks: 3, trend: '+5% YoY' },
  // Kolkata
  'Salt Lake': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 22, schools: 12, hospitals: 8, parks: 6, trend: '+7% YoY' },
  'Park Street': { safety: '4.4/5', internet: '100 Mbps', transport: 'Excellent', grocery: 25, schools: 10, hospitals: 7, parks: 4, trend: '+6% YoY' },
  // Gujarat (Ahmedabad, Surat, Vadodara)
  'Prahlad Nagar': { safety: '4.4/5', internet: '100 Mbps', transport: 'Good', grocery: 18, schools: 10, hospitals: 6, parks: 5, trend: '+7% YoY' },
  'Bodakdev': { safety: '4.5/5', internet: '100 Mbps', transport: 'Good', grocery: 15, schools: 8, hospitals: 5, parks: 4, trend: '+6% YoY' },
  'Vesu': { safety: '4.6/5', internet: '100 Mbps', transport: 'Good', grocery: 20, schools: 10, hospitals: 6, parks: 5, trend: '+9% YoY' },
  'Alkapuri': { safety: '4.7/5', internet: '100 Mbps', transport: 'Excellent', grocery: 22, schools: 12, hospitals: 7, parks: 6, trend: '+7% YoY' },
  // Rajasthan (Jaipur, Udaipur, Jodhpur)
  'C-Scheme': { safety: '4.4/5', internet: '50 Mbps', transport: 'Good', grocery: 18, schools: 10, hospitals: 6, parks: 4, trend: '+6% YoY' },
  'Malviya Nagar': { safety: '4.2/5', internet: '50 Mbps', transport: 'Good', grocery: 20, schools: 8, hospitals: 5, parks: 3, trend: '+5% YoY' },
  'Fatehpura': { safety: '4.5/5', internet: '100 Mbps', transport: 'Good', grocery: 16, schools: 7, hospitals: 5, parks: 4, trend: '+8% YoY' },
  // Central & East (Bhopal, Patna, Bhubaneswar, Ranchi, Raipur, Guwahati)
  'Arera Colony': { safety: '4.6/5', internet: '100 Mbps', transport: 'Good', grocery: 18, schools: 12, hospitals: 7, parks: 6, trend: '+6% YoY' },
  'Boring Road': { safety: '4.2/5', internet: '100 Mbps', transport: 'Good', grocery: 22, schools: 10, hospitals: 6, parks: 3, trend: '+8% YoY' },
  'Patia': { safety: '4.5/5', internet: '100 Mbps', transport: 'Excellent', grocery: 20, schools: 9, hospitals: 5, parks: 5, trend: '+10% YoY' },
  'GS Road': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 24, schools: 11, hospitals: 6, parks: 4, trend: '+7% YoY' },
  // Punjab, Haryana, UP, Uttarakhand (Chandigarh, Lucknow, Dehradun)
  'Sector 35': { safety: '4.6/5', internet: '100 Mbps', transport: 'Excellent', grocery: 20, schools: 12, hospitals: 8, parks: 7, trend: '+6% YoY' },
  'Gomti Nagar': { safety: '4.3/5', internet: '50 Mbps', transport: 'Good', grocery: 18, schools: 10, hospitals: 6, parks: 5, trend: '+6% YoY' },
  'Rajpur Road': { safety: '4.6/5', internet: '100 Mbps', transport: 'Good', grocery: 15, schools: 10, hospitals: 6, parks: 6, trend: '+9% YoY' },
  // Kerala & Tamil Nadu (Kochi, Trivandrum, Coimbatore)
  'Kakkanad': { safety: '4.3/5', internet: '100 Mbps', transport: 'Good', grocery: 15, schools: 8, hospitals: 5, parks: 4, trend: '+8% YoY' },
  'Kazhakoottam': { safety: '4.4/5', internet: '200 Mbps', transport: 'Excellent', grocery: 18, schools: 9, hospitals: 6, parks: 4, trend: '+10% YoY' },
  'RS Puram': { safety: '4.6/5', internet: '100 Mbps', transport: 'Excellent', grocery: 22, schools: 11, hospitals: 8, parks: 5, trend: '+7% YoY' },
  // Goa
  'Panaji': { safety: '4.7/5', internet: '100 Mbps', transport: 'Good', grocery: 18, schools: 8, hospitals: 5, parks: 6, trend: '+11% YoY' },
}

// Backward compatibility alias
export const INDORE_AREAS = CITY_AREAS['Indore']
