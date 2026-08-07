import { Link } from 'react-router-dom'
import { Users, Heart, Shield, AlertTriangle, MessageSquare, Flag, ShieldAlert, RefreshCw, Mail, Globe, MapPin, FileText, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

export default function CommunityGuidelinesPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-emerald-100">
            <FileText className="h-3.5 w-3.5 text-emerald-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Community Guidelines
          </h1>
          <p className="mt-3 max-w-2xl text-base text-emerald-100 sm:text-lg">
            Keeping Rentiefy safe, respectful, transparent, and trustworthy for all tenants, owners, and agents across India.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Guidelines Content Sections */}
      <div className="mt-8 space-y-6">

        {/* 1. Purpose */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            These Community Guidelines help keep Rentiefy safe, respectful and trustworthy for all users.
          </p>
        </div>

        {/* 2. Respectful Behaviour */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Respectful Behaviour</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Treat all users respectfully. Harassment, hate speech, threats and abusive language are prohibited.
          </p>
        </div>

        {/* 3. Honest Listings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Honest Listings</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Only publish accurate property information. Do not post fake, duplicate or misleading listings.
          </p>
        </div>

        {/* 4. Prohibited Content */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Prohibited Content</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            No illegal content, scams, impersonation, spam, malware, copyrighted material without permission or explicit content.
          </p>
        </div>

        {/* 5. Communication */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Communication</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Use chat and contact tools responsibly. Do not send unsolicited promotions or abusive messages.
          </p>
        </div>

        {/* 6. Reporting */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Reporting</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may report listings, chats or accounts suspected of violating these Guidelines.
          </p>
        </div>

        {/* 7. Enforcement */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enforcement</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            First violation: warning. Second: final warning and listing removal. Third: suspension or permanent ban. Serious fraud or illegal activity may result in immediate action.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs">
              <strong className="block text-amber-900 font-bold">1st Violation</strong>
              <span className="text-amber-800">Warning message issued to account</span>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3.5 text-xs">
              <strong className="block text-orange-900 font-bold">2nd Violation</strong>
              <span className="text-orange-800">Final warning & listing removal</span>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs">
              <strong className="block text-red-900 font-bold">3rd Violation</strong>
              <span className="text-red-800">Account suspension or permanent ban</span>
            </div>
          </div>
        </div>

        {/* 8. Appeals */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Appeals</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may appeal moderation decisions by contacting <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a> or visiting our <Link to="/appeals" className="font-semibold text-brand-600 hover:underline">Appeals Policy</Link> page.
          </p>
        </div>

        {/* 9. Updates */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              9
            </div>
            <h2 className="text-xl font-bold text-gray-900">Updates</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            These Guidelines may change over time. Continued use indicates acceptance.
          </p>
        </div>

        {/* 10. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-emerald-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 font-bold text-lg border border-slate-700">
              10
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
              <Mail className="h-5 w-5 text-emerald-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-emerald-300 transition">
                support@rentiefy.com
              </a>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <MapPin className="h-5 w-5 text-amber-400" />
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
