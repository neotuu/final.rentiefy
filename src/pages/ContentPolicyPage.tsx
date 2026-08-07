import { Link } from 'react-router-dom'
import { FileCheck, Shield, Camera, AlertOctagon, CheckCircle2, UserCheck, Flag, ShieldAlert, Mail, Globe, MapPin, FileText, AlertTriangle } from 'lucide-react'
import Logo from '../components/Logo'

export default function ContentPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-blue-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-blue-100">
            <FileText className="h-3.5 w-3.5 text-blue-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Content & Listing Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-blue-100 sm:text-lg">
            Standards and requirements for property listings and user-generated content on Rentiefy.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="mt-8 space-y-6">

        {/* 1. Purpose */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy governs all property listings and user-generated content published on Rentiefy.
          </p>
        </div>

        {/* 2. Eligible Listings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Eligible Listings</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may list only properties they are legally authorised to advertise, including apartments, houses, PGs, commercial properties, land and other supported categories.
          </p>
        </div>

        {/* 3. Listing Accuracy */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Listing Accuracy</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            All information including pricing, location, amenities, availability, images and videos must be accurate, current and not misleading.
          </p>
        </div>

        {/* 4. Photos & Videos */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Photos & Videos</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may upload only content they own or have permission to use. Edited or AI-enhanced images must not misrepresent the property.
          </p>
        </div>

        {/* 5. Prohibited Listings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Prohibited Listings</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Fake, duplicate, misleading, illegal, unavailable or fraudulent listings are prohibited. Listings promoting unlawful activity are strictly forbidden.
          </p>
        </div>

        {/* 6. User Responsibilities */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Responsibilities</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users are responsible for the legality, accuracy and maintenance of their listings and must respond honestly to enquiries.
          </p>
        </div>

        {/* 7. Reporting */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Reporting</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may report listings they believe violate this policy. Rentiefy may investigate and take appropriate action.
          </p>
        </div>

        {/* 8. Enforcement */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enforcement</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            First violation: warning. Second: final warning and listing removal. Third: temporary suspension or permanent ban depending on severity. Serious fraud, impersonation or illegal activity may result in immediate removal and account action.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs">
              <strong className="block text-amber-900 font-bold">1st Violation</strong>
              <span className="text-amber-800">Formal warning issued</span>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3.5 text-xs">
              <strong className="block text-orange-900 font-bold">2nd Violation</strong>
              <span className="text-orange-800">Final warning & listing removal</span>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs">
              <strong className="block text-red-900 font-bold">3rd Violation</strong>
              <span className="text-red-800">Temporary suspension or permanent ban</span>
            </div>
          </div>
        </div>

        {/* 9. Appeals */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              9
            </div>
            <h2 className="text-xl font-bold text-gray-900">Appeals</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may appeal listing removals by contacting <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a>. Appeals will be reviewed within a reasonable time.
          </p>
          <div className="mt-3">
            <Link to="/appeals" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
              View full Appeals Policy →
            </Link>
          </div>
        </div>

        {/* 10. Changes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              10
            </div>
            <h2 className="text-xl font-bold text-gray-900">Changes</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy may update this policy periodically. Continued use of the platform constitutes acceptance of the updated policy.
          </p>
        </div>

        {/* 11. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-brand-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-400 font-bold text-lg border border-slate-700">
              11
            </div>
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
          </div>
          
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

          <div className="mt-6 border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
            Rentiefy © 2026. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  )
}
