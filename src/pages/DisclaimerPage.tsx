import { Link } from 'react-router-dom'
import { AlertCircle, ShieldAlert, FileText, CheckCircle2, Scale, ExternalLink, Globe, Mail, MapPin, ShieldCheck, UserCheck } from 'lucide-react'
import Logo from '../components/Logo'

export default function DisclaimerPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-slate-200">
            <FileText className="h-3.5 w-3.5 text-slate-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Rentiefy Disclaimer
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300 sm:text-lg">
            Important legal notice regarding platform services, listing accuracy, user responsibilities, and limitation of liability.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="mt-8 space-y-6">

        {/* 1. General Disclaimer */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">General Disclaimer</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy is a technology platform that connects tenants, property owners, agents, builders and property managers. Rentiefy does not own, broker, inspect, lease or manage properties unless explicitly stated.
          </p>
        </div>

        {/* 2. Listing Accuracy */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Listing Accuracy</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Property information is provided by users. Rentiefy does not guarantee the accuracy, legality, completeness or availability of any listing.
          </p>
        </div>

        {/* 3. No Professional Advice */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">No Professional Advice</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Content on Rentiefy is for general informational purposes and should not be considered legal, financial, tax or real estate advice.
          </p>
        </div>

        {/* 4. Transactions */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rental agreements and negotiations are solely between users. Rentiefy is not a party to those agreements.
          </p>
        </div>

        {/* 5. Verification */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Verified badges indicate completion of Rentiefy's verification process only and are not a guarantee of trustworthiness or transaction outcomes.
          </p>
        </div>

        {/* 6. Third-Party Services */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Third-Party Services</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Payments, maps, authentication and communications may rely on third-party providers operating under their own terms and privacy policies.
          </p>
        </div>

        {/* 7. Limitation of Liability */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            To the maximum extent permitted by law, Rentiefy is not liable for losses arising from property listings, user interactions, fraud, service interruptions or third-party actions.
          </p>
        </div>

        {/* 8. User Responsibility */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Responsibility</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must independently verify property details, ownership, pricing and legal documentation before entering into any agreement.
          </p>
        </div>

        {/* 9. Changes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-lg">
              9
            </div>
            <h2 className="text-xl font-bold text-gray-900">Changes</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This Disclaimer may be updated periodically. Continued use of Rentiefy constitutes acceptance of the updated version.
          </p>
        </div>

        {/* 10. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 font-bold text-lg border border-slate-700">
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
