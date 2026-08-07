import { Home, Shield, Zap, Users, MapPin, Heart, Globe, Mail, Award, CheckCircle2, FileText, Sparkles, UserCheck, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'
import { CITIES } from '../lib/constants'

export default function AboutPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      <Seo 
        title="About Us — Rentiefy Rental Marketplace" 
        description="Learn about Rentiefy's mission to simplify property rentals across India with zero brokerage, verified listings, and direct communication." 
        url="https://rentiefy.com/about" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' }
        ]}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" /> Version 1.0 • Effective Date: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            About Rentiefy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-brand-100 sm:text-lg">
            Empowering India's rental ecosystem with trust, innovation, and seamless digital connections.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-8 space-y-8">
        
        {/* Who We Are & Founder */}
        <div className="card overflow-hidden p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <UserCheck className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">Who We Are</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            <strong className="text-brand-700 font-semibold">Rentiefy</strong> is a premier Indian property rental marketplace founded by <strong className="text-gray-900 font-semibold">Nikhil Prajapat</strong>. Our mission is to simplify the process of finding and listing rental properties through a secure, transparent, and user-friendly platform tailored specifically for Indian cities and neighborhoods.
          </p>
        </div>

        {/* Our Mission */}
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-emerald-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-3 text-teal-700">
            <Award className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="mt-3 text-base font-medium leading-relaxed text-gray-800">
            To connect tenants, property owners, agents, builders, and property managers with a transparent, direct, and efficient digital experience.
          </p>
        </div>

        {/* What We Offer */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <Zap className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">What We Offer</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: 'Property Discovery', desc: 'Browse apartments, PG accommodations, independent houses, and villas with detailed photos and filters.' },
              { title: 'Verified User Features', desc: 'Verified landlord badges, tenant profiles, and authentic reviews to build community trust.' },
              { title: 'Search & Interactive Maps', desc: 'Locality guides, interactive location map search, distance calculators, and nearby amenities.' },
              { title: 'Instant Direct Messaging', desc: 'Chat directly with property owners and tenants without unnecessary middleman friction.' },
              { title: 'Premium Listings', desc: 'Featured property visibility for faster tenant matching and landlord management.' },
              { title: 'Future AI-Powered Features', desc: 'Smart AI rental valuation, intelligent search recommendations, and automated agreement drafts.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-white hover:shadow-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Core Values */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <Heart className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">Our Values</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Trust, transparency, innovation, safety, fairness, and continuous improvement guide how we build and scale Rentiefy every day.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {['Trust', 'Transparency', 'Innovation', 'Safety', 'Fairness', 'Continuous Improvement'].map((val) => (
              <div key={val} className="flex items-center justify-center rounded-xl bg-brand-50/60 px-4 py-3 text-center text-sm font-bold text-brand-800">
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Integrity */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-700">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">Safety & Trust</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            We encourage honest listings, active user reporting, proactive content moderation, and fraud prevention mechanisms to continuously improve marketplace trust across India.
          </p>
        </div>

        {/* Cities We Cover */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <MapPin className="h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900">Cities We Cover Across India</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">Available in major metropolitan hubs and rapidly growing tier-1/tier-2 urban centers.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <span key={city} className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800">
                <MapPin className="h-3 w-3 text-brand-600" /> {city}
              </span>
            ))}
          </div>
        </div>

        {/* Official Contact & Corporate Details */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold text-white">Contact Us</h2>
          <p className="mt-1 text-sm text-slate-400">Reach out to our founding team or support center for inquiries and partnerships.</p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Globe className="h-5 w-5 text-teal-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Website</p>
              <a href="https://rentiefy.com" target="_blank" rel="noopener noreferrer" className="mt-0.5 text-sm font-bold text-white hover:text-teal-300 transition">
                rentiefy.com
              </a>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-brand-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-brand-300 transition">
                support@rentiefy.com
              </a>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Location</p>
              <p className="mt-0.5 text-sm font-bold text-white">
                Indore, Madhya Pradesh, India
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Founded by <strong>Nikhil Prajapat</strong></span>
            <span>Rentiefy © 2026. All rights reserved.</span>
          </div>
        </div>

      </div>
    </div>
  )
}

