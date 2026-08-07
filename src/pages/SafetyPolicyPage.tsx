import { Link } from 'react-router-dom'
import { ShieldAlert, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Eye, Lock, Mail, Globe, MapPin, Flag, UserX, Scale } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

export default function SafetyPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      <Seo title="Safety & Anti-Fraud Policy — Rentiefy" description="Rentiefy Safety and Anti-Fraud Policy detailing user responsibilities, fraud prevention, reporting procedures, and enforcement levels." url="https://rentiefy.com/safety-policy" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-amber-100">
            <FileText className="h-3.5 w-3.5 text-amber-300" /> Version 1.0 • Effective & Last Updated: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Safety & Anti-Fraud Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-amber-100 sm:text-lg">
            Rentiefy's commitment to maintaining a secure, trustworthy rental marketplace and preventing fraudulent behavior.
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
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy explains Rentiefy's commitment to maintaining a safe marketplace and reducing fraud for all tenants, owners, agents, and property managers.
          </p>
        </div>

        {/* 2. User Responsibility */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Responsibility</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must provide truthful information, communicate honestly and avoid deceptive practices across all interactions, property listings, and messages on Rentiefy.
          </p>
        </div>

        {/* 3. Common Fraud Risks */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Common Fraud Risks</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Examples of prohibited fraudulent behavior include:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-800">
            {[
              'Fake property listings & duplicate photos',
              'Impersonation of property owners or agents',
              'Advance-fee scams or wire transfer requests',
              'Forged ownership documents or fake utility bills',
              'Phishing links or off-platform payment lures',
              'Misleading advertisements or hidden extra charges'
            ].map((risk) => (
              <div key={risk} className="flex items-center gap-2.5 rounded-lg border border-amber-100 bg-amber-50/40 p-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Safe Practices */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Safe Practices</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users should verify property details, inspect properties in person or via live video where possible, avoid sharing account passwords or OTPs, and use trusted payment methods.
          </p>
        </div>

        {/* 5. Reporting Fraud */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Reporting Fraud</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Suspected scams, fake listings, suspicious requests, or abusive behaviour should be reported directly through the platform's "Report" feature or by emailing <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a>.
          </p>
        </div>

        {/* 6. Investigation */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Investigation Process</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy may review user reports, request additional verification documents, temporarily hide reported listings, or restrict accounts while investigations are actively underway.
          </p>
        </div>

        {/* 7. Enforcement */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enforcement Actions</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Violations of this policy result in progressive enforcement actions:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-4">
              <div className="font-bold text-yellow-900 text-sm">First Violation</div>
              <p className="mt-1 text-yellow-800">Formal warning and advisory notification.</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
              <div className="font-bold text-orange-900 text-sm">Second Violation</div>
              <p className="mt-1 text-orange-800">Final warning and mandatory listing removal.</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <div className="font-bold text-red-900 text-sm">Third Violation</div>
              <p className="mt-1 text-red-800">Account suspension or permanent ban depending on severity.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-600 italic">
            Note: Serious fraud or criminal activity may result in immediate account termination and full cooperation with law enforcement authorities.
          </p>
        </div>

        {/* 8. Limitation */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            While Rentiefy continuously works to improve platform safety and screening, users remain responsible for exercising independent due diligence and judgment before entering into binding rental agreements or transferring money.
          </p>
        </div>

        {/* 9. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-amber-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-400 font-bold text-lg border border-slate-700">
              9
            </div>
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-amber-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Fraud Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-amber-300 transition">
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
