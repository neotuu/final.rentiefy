import { Link } from 'react-router-dom'
import { Scale, ShieldCheck, Mail, Globe, MapPin, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react'
import Logo from '../components/Logo'

export default function AppealsPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-brand-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-indigo-100">
            <FileText className="h-3.5 w-3.5 text-indigo-300" /> Version 1.0 • Effective & Last Updated: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Appeals Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-indigo-100 sm:text-lg">
            Understand how users can request a review of moderation decisions and enforcement actions on Rentiefy.
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
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This Appeals Policy explains how users may request a review of moderation decisions made by Rentiefy.
          </p>
        </div>

        {/* 2. Decisions That May Be Appealed */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Decisions That May Be Appealed</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may appeal listing removals, account suspensions, account bans, rejected verification requests and other enforcement actions where applicable.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Listing Removals & Deactivations',
              'Account Suspensions',
              'Permanent Account Bans',
              'Rejected Landlord/Tenant Verifications',
              'Content Moderation Warnings',
              'Review & Rating Disputes'
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-indigo-50/60 p-3 text-xs font-bold text-indigo-900">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. How to Submit an Appeal */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">How to Submit an Appeal</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Appeals may be submitted through the platform (when available) or by emailing <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a>. Users should include their account details, relevant listing or transaction information and the reason for the appeal.
          </p>
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <h3 className="text-sm font-bold text-gray-900">Recommended Appeal Details:</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-700 list-disc list-inside">
              <li>Full name & registered email address</li>
              <li>Property Listing ID or Account ID (if applicable)</li>
              <li>Date & description of the enforcement action</li>
              <li>Detailed explanation and supporting evidence or documents</li>
            </ul>
          </div>
          <div className="mt-4">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 shadow-sm">
              <Mail className="h-4 w-4" /> Submit Appeal via Support
            </Link>
          </div>
        </div>

        {/* 4. Review Process */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Review Process</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Appeals are reviewed by the Rentiefy team based on available evidence, platform policies and applicable law. Additional information may be requested.
          </p>
        </div>

        {/* 5. Timeframe */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Timeframe</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy aims to review appeals and communicate a decision within a reasonable timeframe. Complex matters may require additional time.
          </p>
        </div>

        {/* 6. Outcomes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Outcomes</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            An appeal may be approved, partially approved or denied. Rentiefy may restore content, maintain the original decision or apply a different enforcement measure where appropriate.
          </p>
        </div>

        {/* 7. Abuse of Appeals */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Abuse of Appeals</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Repeated frivolous, abusive or fraudulent appeals may be rejected and may result in additional account action.
          </p>
        </div>

        {/* 8. Final Decision */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Final Decision</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            After review, Rentiefy's decision will be final unless required otherwise by applicable law.
          </p>
        </div>

        {/* 9. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-indigo-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 font-bold text-lg border border-slate-700">
              9
            </div>
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-indigo-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-indigo-300 transition">
                support@rentiefy.com
              </a>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Globe className="h-5 w-5 text-teal-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Website</p>
              <a href="https://rentiefy.com" target="_blank" rel="noopener noreferrer" className="mt-0.5 text-sm font-bold text-white hover:text-teal-300 transition">
                rentiefy.com
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
