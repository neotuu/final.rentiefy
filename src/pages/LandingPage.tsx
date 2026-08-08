import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Home, Search, BadgeCheck, Users, MapPin, ShieldCheck, Wallet, ArrowRight, Building2,
  Heart, Star, Calculator, TrendingUp, Wifi, Bus, ShoppingCart, GraduationCap,
  Cross, TreePine, ChevronDown, Clock, MessageCircle, Zap, Award, PhoneCall,
  Smartphone, FileText, HelpCircle, PawPrint, Sparkles, Download, Mic,
} from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Seo from '../components/Seo'
import { getListings } from '../lib/api'
import { PROPERTY_TYPES, PROPERTY_TYPE_TRANSLATION_KEYS, CITIES } from '../lib/constants'
import type { TranslationKey } from '../lib/language-types'
import type { ListingWithDetails } from '../lib/types'
import ListingCard from '../components/ListingCard'
import Reveal from '../components/Reveal'
import VoiceSearchButton from '../components/VoiceSearchButton'

export default function LandingPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [listings, setListings] = useState<ListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoc, setSearchLoc] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [searchBudget, setSearchBudget] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    getListings().then((d) => setListings(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchLoc) params.set('search', searchLoc)
    if (searchType !== 'all') params.set('type', searchType)
    if (searchBudget) params.set('budget', searchBudget)
    navigate(`/browse?${params.toString()}`)
  }

  const quickFilters = [
    { key: 'landing.qfFamily', icon: Users, filter: 'category=family' },
    { key: 'landing.qfBachelor', icon: Building2, filter: 'category=professional' },
    { key: 'landing.qfGirls', icon: Heart, filter: 'gender=female' },
    { key: 'landing.qfBoys', icon: Building2, filter: 'gender=male' },
    { key: 'landing.qfPetFriendly', icon: PawPrint, filter: '' },
    { key: 'landing.qfFurnished', icon: Home, filter: 'furnish=fully-furnished' },
    { key: 'landing.qfImmediate', icon: Zap, filter: '' },
  ]

  const categoryIcons: Record<string, any> = {
    apartment: Building2, house: Home, pg: Users, room: Building2,
    office: Building2, warehouse: Building2, studio: Building2, hostel: Users, shop: Building2,
  }

  const localityData = [
    { icon: ShieldCheck, label: t('landing.liSafety'), value: '4.5/5' },
    { icon: Wifi, label: t('landing.liInternet'), value: '50 Mbps' },
    { icon: Bus, label: t('landing.liTransport'), value: 'Excellent' },
    { icon: ShoppingCart, label: t('landing.liGrocery'), value: '12 nearby' },
    { icon: GraduationCap, label: t('landing.liSchools'), value: '8 nearby' },
    { icon: Cross, label: t('landing.liHospitals'), value: '5 nearby' },
    { icon: TreePine, label: t('landing.liParks'), value: '3 nearby' },
    { icon: TrendingUp, label: t('landing.liRentTrend'), value: '+5% YoY' },
  ]

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Student', text: 'Found my PG in Vijay Nagar within 2 days. No broker, direct owner. Saved Rs. 5000!', rating: 5 },
    { name: 'Priya Patel', role: 'Working Professional', text: 'The verified badge gave me confidence. The owner was genuine and responsive.', rating: 5 },
    { name: 'Amit Verma', role: 'Property Owner', text: 'Listed my 2BHK for free and got 3 tenants in a week. The dashboard makes management easy.', rating: 5 },
  ]

  const blogPosts = [
    { key: 'blog1', icon: FileText }, { key: 'blog2', icon: ShieldCheck },
    { key: 'blog3', icon: Home }, { key: 'blog4', icon: Heart },
    { key: 'blog5', icon: FileText },
  ]

  const faqs = [
    { q: t('landing.faq1Q'), a: t('landing.faq1A') },
    { q: t('landing.faq2Q'), a: t('landing.faq2A') },
    { q: t('landing.faq3Q'), a: t('landing.faq3A') },
    { q: t('landing.faq4Q'), a: t('landing.faq4A') },
  ]

  const ownerBenefits = [
    { icon: Wallet, label: t('landing.ownerBenefit1') },
    { icon: BadgeCheck, label: t('landing.ownerBenefit2') },
    { icon: Zap, label: t('landing.ownerBenefit3') },
    { icon: Building2, label: t('landing.ownerBenefit4') },
  ]

  return (
    <div>
      <Seo 
        title="Rentiefy | Find Rental Properties, Flats, Houses & PGs in India" 
        description="Find verified rental properties across India with Rentiefy. Browse flats, apartments, PGs, houses and commercial spaces." 
        url="https://rentiefy.com" 
        keywords="rental properties, flats for rent, houses for rent, PGs in India, zero brokerage rentals, Rentiefy"
      />
      {/* Hero */}
      <section className="animated-gradient relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
        {/* Floating decorative blobs */}
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="animate-fade-in-up text-center text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> {t('landing.heroBadge') ?? 'India\'s trusted rental platform'}
            </div>
            <h1 className="text-3xl font-bold sm:text-5xl">{t('landing.heroHeadline')}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-brand-50 sm:text-lg">{t('landing.heroSub')}</p>
          </div>

          {/* Search Box */}
          <div className="animate-scale-in mx-auto mt-8 max-w-4xl rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  value={searchLoc}
                  onChange={(e) => setSearchLoc(e.target.value.slice(0, 80))}
                  className="input pl-9 pr-10"
                  placeholder={t('landing.searchLocationPh')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                  <VoiceSearchButton
                    onTranscript={(text) => setSearchLoc(text)}
                    onSearchSubmit={(text) => {
                      setSearchLoc(text)
                      const params = new URLSearchParams()
                      if (text) params.set('search', text)
                      if (searchType !== 'all') params.set('type', searchType)
                      if (searchBudget) params.set('budget', searchBudget)
                      navigate(`/browse?${params.toString()}`)
                    }}
                  />
                </div>
              </div>
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="input">
                <option value="all">{t('landing.searchPropType')}</option>
                {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{t(PROPERTY_TYPE_TRANSLATION_KEYS[pt] as TranslationKey)}</option>)}
              </select>
              <input type="number" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value.slice(0, 8))} className="input" placeholder={t('landing.searchBudget')} />
              <button onClick={handleSearch} className="btn-primary w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"><Search className="h-4 w-4" /> {t('landing.searchBtn')}</button>
            </div>
            {/* Quick Filters */}
            <div className="mt-3 flex flex-wrap gap-2">
              {quickFilters.map((f, i) => (
                <button
                  key={f.key}
                  onClick={() => navigate(f.filter ? `/browse?${f.filter}` : '/browse')}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-100 hover:shadow-sm"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <f.icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" /> {t(f.key as TranslationKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t('landing.whyChooseUs')}</h2>
          <div className="stagger mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeCheck, title: t('landing.wcuVerified'), desc: t('landing.wcuVerifiedDesc') },
              { icon: Wallet, title: t('landing.wcuZeroBrokerage'), desc: t('landing.wcuZeroBrokerageDesc') },
              { icon: MapPin, title: t('landing.wcuNearby'), desc: t('landing.wcuNearbyDesc') },
              { icon: MessageCircle, title: t('landing.wcuInstantChat'), desc: t('landing.wcuInstantChatDesc') },
            ].map((f, i) => (
              <div key={f.title} className="card p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ '--i': i } as any}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110"><f.icon className="h-6 w-6" /></div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Featured Properties */}
      <Reveal as="section" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{t('landing.featuredProps')}</h2>
            <Link to="/browse" className="flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:gap-2 hover:text-brand-700">{t('common.viewAll')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
            </div>
          ) : (
            <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {listings.slice(0, 4).map((l, i) => <div key={l.id} style={{ '--i': i } as any}><ListingCard listing={l} /></div>)}
            </div>
          )}
        </div>
      </Reveal>

      {/* Search by Category */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.searchByCategory')}</h2>
          <div className="stagger mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-9">
            {PROPERTY_TYPES.map((pt, i) => {
              const Icon = categoryIcons[pt] ?? Building2
              return (
                <Link key={pt} to={`/browse?type=${pt}`} className="card group flex flex-col items-center gap-2 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ '--i': i } as any}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110"><Icon className="h-5 w-5" /></div>
                  <span className="text-xs font-medium text-gray-700">{t(PROPERTY_TYPE_TRANSLATION_KEYS[pt] as TranslationKey)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Search by City */}
      <Reveal as="section" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.searchByCity')}</h2>
          <div className="stagger mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {CITIES.map((city, i) => {
              const count = listings.filter((l) => l.city === city).length
              return (
                <Link key={city} to={`/browse?city=${city}`} className="card group flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ '--i': i } as any}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110"><MapPin className="h-5 w-5" /></div>
                  <div><p className="text-sm font-semibold text-gray-900">{city}</p><p className="text-xs text-gray-400">{count} {count === 1 ? 'listing' : 'listings'}</p></div>
                </Link>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Locality Insights */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.localityInsights')}</h2>
          <p className="mt-2 text-center text-sm text-gray-500">{t('landing.localityInsightsDesc')}</p>
          <div className="stagger mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {localityData.map((item, i) => (
              <div key={item.label} className="card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ '--i': i } as any}>
                <item.icon className="mx-auto h-6 w-6 text-brand-600" />
                <p className="mt-2 text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/locality-guide" className="btn-secondary transition-transform duration-200 hover:scale-105">{t('nav.localityGuide')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </Reveal>

      {/* Rent Estimator */}
      <Reveal as="section" className="bg-gradient-to-r from-brand-50 to-brand-100 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="animate-float mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white"><Calculator className="h-7 w-7" /></div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('landing.rentEstimator')}</h2>
          <p className="mt-2 text-sm text-gray-500">{t('landing.rentEstimatorDesc')}</p>
          <Link to="/rent-calculator" className="mt-6 btn-primary transition-transform duration-200 hover:scale-105"><Calculator className="h-4 w-4" /> {t('calc.estimate')}</Link>
        </div>
      </Reveal>

      {/* Owner Section */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('landing.ownerSection')}</h2>
              <p className="mt-2 text-sm text-gray-500">{t('landing.ownerSectionDesc')}</p>
              <div className="stagger mt-6 grid grid-cols-2 gap-4">
                {ownerBenefits.map((b, i) => (
                  <div key={b.label} className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:border-brand-200 hover:shadow-sm" style={{ '--i': i } as any}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><b.icon className="h-5 w-5" /></div>
                    <span className="text-sm font-medium text-gray-900">{b.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/list-property" className="mt-6 btn-primary transition-transform duration-200 hover:scale-105">{t('nav.postProperty')} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="card w-full max-w-sm p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Building2 className="h-8 w-8" /></div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">Free Forever</h3>
                <p className="mt-1 text-sm text-gray-500">List unlimited properties at zero cost. Only pay Rs. 10 when someone unlocks your contact.</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400"><Award className="h-4 w-4 text-amber-500" /> Trusted by owners across India</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Recently Added */}
      <Reveal as="section" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{t('landing.recentlyAdded')}</h2>
            <Link to="/browse?sort=new" className="flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:gap-2 hover:text-brand-700">{t('common.viewAll')} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listings.slice(4, 8).map((l, i) => <div key={l.id} style={{ '--i': i } as any}><ListingCard listing={l} /></div>)}
          </div>
        </div>
      </Reveal>

      {/* Testimonials */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.testimonials')}</h2>
          <div className="stagger mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((tm, i) => (
              <div key={tm.name} className="card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ '--i': i } as any}>
                <div className="flex gap-1">{Array.from({ length: tm.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="mt-3 text-sm text-gray-600">"{tm.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold">{tm.name[0]}</div>
                  <div><p className="text-sm font-semibold text-gray-900">{tm.name}</p><p className="text-xs text-gray-400">{tm.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Blog */}
      <Reveal as="section" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.blogSection')}</h2>
          <div className="stagger mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, i) => (
              <Link key={post.key} to="/help" className="card group block p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ '--i': i } as any}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110"><post.icon className="h-6 w-6" /></div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-brand-600">{t(post.key as TranslationKey)}</h3>
                <p className="mt-1 text-xs text-gray-400">Read more...</p>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* App Promo */}
      <Reveal as="section" className="bg-gradient-to-r from-brand-600 to-brand-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <Smartphone className="animate-float mx-auto h-12 w-12" />
          <h2 className="mt-4 text-2xl font-bold">{t('landing.appPromo')}</h2>
          <p className="mt-2 text-brand-50">{t('landing.appPromoDesc')}</p>
          <p className="mt-1 text-xs text-brand-100/80">No app store needed — install directly from your browser.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => {
              const evt = new Event('rentiefy-install-request')
              window.dispatchEvent(evt)
            }} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-50">
              <Download className="h-4 w-4" /> {t('landing.downloadAndroid')}
            </button>
            <button onClick={() => {
              const evt = new Event('rentiefy-install-request')
              window.dispatchEvent(evt)
            }} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-50">
              <Download className="h-4 w-4" /> {t('landing.downloadIOS')}
            </button>
          </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal as="section" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">{t('landing.faq')}</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden transition-shadow duration-300 hover:shadow-md">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left">
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-gray-600">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal as="section" className="bg-gradient-to-r from-brand-700 to-brand-800 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('landing.ctaTitle')}</h2>
          <p className="mt-2 text-brand-50">{t('landing.ctaSubtitle')}</p>
          <Link to="/browse" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-50">{t('landing.getStarted')} <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Reveal>
    </div>
  )
}
