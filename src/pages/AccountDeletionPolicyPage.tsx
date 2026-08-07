import { Link } from 'react-router-dom'
import { ShieldAlert, Trash2, HelpCircle, Mail, Globe, MapPin, AlertTriangle, CheckCircle2, FileText, ArrowLeft, RefreshCw, UserX, Lock } from 'lucide-react'
import Logo from '../components/Logo'

export default function AccountDeletionPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-red-100">
            <FileText className="h-3.5 w-3.5 text-rose-300" /> Version 1.0 • Effective & Last Updated: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Account Deletion Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-rose-100 sm:text-lg">
            How to request permanent deletion of your Rentiefy account and how your personal data is handled.
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
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy explains how users can permanently delete their Rentiefy account and how personal information is handled after deletion.
          </p>
        </div>

        {/* 2. Eligibility */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Eligibility</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Any registered user may request deletion of their account through the application settings or by contacting <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 transition hover:bg-red-100">
              <Mail className="h-4 w-4" /> Contact Support for Deletion
            </Link>
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-200">
              <UserX className="h-4 w-4" /> Go to Account Settings
            </Link>
          </div>
        </div>

        {/* 3. What Happens After Deletion */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">What Happens After Deletion</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Your profile will be deactivated. Personal information will be removed or anonymised where reasonably possible, subject to legal, security and fraud-prevention requirements.
          </p>
        </div>

        {/* 4. Data Retention */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Retention</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Certain records such as invoices, payment records, fraud-prevention logs and information required by applicable law may be retained for the required retention period.
          </p>
        </div>

        {/* 5. Active Services */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Active Services</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users should cancel any active subscriptions before requesting account deletion. Deletion does not automatically entitle the user to a refund.
          </p>
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
            <strong>Note:</strong> To view refund eligibility, please review our <Link to="/refund" className="underline font-bold">Refund Policy</Link>.
          </div>
        </div>

        {/* 6. Recovery */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recovery</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Once an account has been permanently deleted, it may not be recoverable. Users wishing to return may need to create a new account.
          </p>
        </div>

        {/* 7. Abuse Prevention */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Abuse Prevention</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy may delay or refuse deletion requests where necessary to investigate fraud, resolve disputes or comply with legal obligations.
          </p>
        </div>

        {/* 8. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-rose-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-rose-400 font-bold text-lg border border-slate-700">
              8
            </div>
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-rose-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-rose-300 transition">
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
