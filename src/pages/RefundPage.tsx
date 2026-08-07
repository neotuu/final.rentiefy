import { Link } from 'react-router-dom'
import { RotateCcw, ShieldCheck, FileText, CheckCircle2, AlertCircle, Ban, CreditCard, Mail, Globe, MapPin, Zap, RefreshCw } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

export default function RefundPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      <Seo title="Refund & Cancellation Policy — Rentiefy" description="Rentiefy Refund & Cancellation Policy for paid services, boosts, subscriptions, and Razorpay transactions." url="https://rentiefy.com/refund" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-rose-100">
            <FileText className="h-3.5 w-3.5 text-rose-300" /> Version 1.0 • Effective Date: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-rose-100 sm:text-lg">
            Clear guidelines on cancellations, refund eligibility, Razorpay payments, and non-refundable services on Rentiefy.
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
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy explains refunds and cancellations for paid services offered on Rentiefy.
          </p>
        </div>

        {/* 2. Covered Services */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Covered Services</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Paid services covered under this policy include Premium Listings, Featured Listings, Property Boosts, Monthly/Yearly Subscriptions, Verified Badge fees, and Advertising Packages.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-800">
            {[
              'Premium Listings', 'Featured Listings', 'Property Boosts',
              'Monthly/Yearly Subscriptions', 'Verified Badge', 'Advertising Packages'
            ].map((svc) => (
              <div key={svc} className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/40 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{svc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. No Commission */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">No Commission</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy does not charge commission on rental transactions. All agreements and rental payouts occur directly between tenants and property owners or agents.
          </p>
        </div>

        {/* 4. Payments */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payments</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Payments are processed through authorised gateways such as Razorpay. All transactions are protected using industry-standard encryption and security protocols.
          </p>
        </div>

        {/* 5. Cancellation */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Cancellation</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Subscriptions may be cancelled before the next renewal date through your account settings or by reaching out to support. Cancellation prevents future automatic billing.
          </p>
        </div>

        {/* 6. Refunds */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Refunds</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Refunds may be considered for duplicate payments, technical failures resulting in undelivered services, or where required by applicable consumer law.
          </p>
        </div>

        {/* 7. Non-Refundable */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Non-Refundable Services</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Completed promotional services (such as used property boosts or active featured listing durations) are generally non-refundable unless required by law.
          </p>
        </div>

        {/* 8. Disputes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Disputes & Chargebacks</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Payment disputes and chargebacks may temporarily suspend paid benefits while under review by our support team and payment gateway partners.
          </p>
        </div>

        {/* 9. Support & Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-rose-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-rose-400 font-bold text-lg border border-slate-700">
              9
            </div>
            <h2 className="text-xl font-bold text-white">Refund Support & Contact</h2>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            To submit a refund request or inquire about billing, please email us with your payment ID and account details:
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-rose-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Refund Requests</p>
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
