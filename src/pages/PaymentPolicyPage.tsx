import { Link } from 'react-router-dom'
import { CreditCard, ShieldCheck, Zap, RefreshCw, Receipt, AlertCircle, FileText, Globe, Mail, MapPin, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

export default function PaymentPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-emerald-100">
            <FileText className="h-3.5 w-3.5 text-emerald-300" /> Version 1.0 • Effective & Last Updated: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Payment & Subscription Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-emerald-100 sm:text-lg">
            How paid features, property boosts, Razorpay transactions, subscriptions, and billing are managed on Rentiefy.
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
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy explains how paid features, subscriptions and billing are managed on Rentiefy.
          </p>
        </div>

        {/* 2. Paid Services */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Paid Services</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Paid services may include Premium Listings, Featured Listings, Property Boosts, Verified Badge fees (if introduced) and advertising packages.
          </p>
        </div>

        {/* 3. Payment Methods */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Payments are processed through authorised payment providers such as Razorpay. Available methods may include UPI, cards, net banking and other supported options.
          </p>
        </div>

        {/* 4. Billing */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Billing</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Subscriptions may be offered on monthly or yearly plans. Charges are displayed before purchase.
          </p>
        </div>

        {/* 5. Renewals */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Renewals</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            If auto-renewal is enabled, subscriptions renew automatically until cancelled. Users may cancel before the next billing cycle to prevent future charges.
          </p>
        </div>

        {/* 6. Failed Payments */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Failed Payments</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            If payment fails, premium benefits may be suspended or not activated until successful payment is received.
          </p>
        </div>

        {/* 7. Taxes & Invoices */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Taxes & Invoices</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Applicable taxes may be added where required by law. Users may receive invoices or payment confirmations electronically.
          </p>
        </div>

        {/* 8. Refunds */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Refunds</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Refund eligibility is governed by the <Link to="/refund" className="font-semibold text-brand-600 hover:underline">Rentiefy Refund & Cancellation Policy</Link>.
          </p>
        </div>

        {/* 9. Changes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg">
              9
            </div>
            <h2 className="text-xl font-bold text-gray-900">Changes</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy may revise pricing, plans or features with reasonable notice where required.
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
              <Mail className="h-5 w-5 text-emerald-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-emerald-300 transition">
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
