import { Link } from 'react-router-dom'
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Scale, Globe, Mail, MapPin, Gavel, UserCheck, CreditCard, HelpCircle } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

export default function TermsPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      <Seo title="Terms & Conditions — Rentiefy" description="Rentiefy Terms & Conditions governing user eligibility, marketplace rules, listings, payments, enforcement, and governing law." url="https://rentiefy.com/terms" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-blue-100">
            <FileText className="h-3.5 w-3.5 text-blue-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 max-w-2xl text-base text-blue-100 sm:text-lg">
            Essential terms, user rights, platform responsibilities, and marketplace policies for using Rentiefy.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="mt-8 space-y-6">

        {/* 1. Acceptance */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Acceptance of Terms</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            By accessing or using Rentiefy, creating an account, or listing properties, you agree to be bound by these Terms and Conditions.
          </p>
        </div>

        {/* 2. Eligibility */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Eligibility</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must be at least 18 years old to register, list properties, or communicate with other users on Rentiefy.
          </p>
        </div>

        {/* 3. Platform */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Technology Platform Role</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy is a technology marketplace connecting tenants, property owners, agents, builders, and property managers. Rentiefy does not own, manage, or physically inspect listed properties.
          </p>
        </div>

        {/* 4. Accounts */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Account Security & Registration</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must provide accurate, complete information during registration and maintain the confidentiality of their account credentials and login details at all times.
          </p>
        </div>

        {/* 5. Listings */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Property Listings Responsibility</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Property posters are solely responsible for the accuracy, truthfulness, completeness, and legal compliance of their property descriptions, pricing, photos, and contact information.
          </p>
        </div>

        {/* 6. Prohibited Conduct */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Prohibited Conduct</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must not engage in fraudulent activities, impersonation, spamming, posting illegal or infringing content, harassing other users, or creating misleading property listings.
          </p>
        </div>

        {/* 7. Verification */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Identity & Property Verification</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Property and user verification is optional. Verified badges indicate completed checks but may be revoked or removed at any time for policy misuse or false documentation.
          </p>
        </div>

        {/* 8. Payments */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payments & Commission-Free Rental</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Optional premium services (e.g., featured boosts, subscriptions) are processed securely via Razorpay. Rentiefy does not charge commission on rental deals or tenant-owner agreements.
          </p>
        </div>

        {/* 9. User Content */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              9
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Content & Licensing</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users retain full ownership of uploaded content (photos, videos, text) while granting Rentiefy a worldwide, non-exclusive, royalty-free licence to host, display, and distribute it solely for platform operations and promotion.
          </p>
        </div>

        {/* 10. Enforcement */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              10
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enforcement & Violation System</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Policy violations trigger progressive enforcement:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-4">
              <div className="font-bold text-yellow-900 text-sm">First Violation</div>
              <p className="mt-1 text-yellow-800">Formal warning and policy notification.</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4">
              <div className="font-bold text-orange-900 text-sm">Second Violation</div>
              <p className="mt-1 text-orange-800">Final warning and listing removal.</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <div className="font-bold text-red-900 text-sm">Third Violation</div>
              <p className="mt-1 text-red-800">Account suspension or permanent ban depending on severity.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 italic">
            Serious violations or legal infractions may result in immediate account termination without prior notice.
          </p>
        </div>

        {/* 11. Appeals */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              11
            </div>
            <h2 className="text-xl font-bold text-gray-900">Appeals Process</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users may appeal content moderation or account enforcement decisions by emailing <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a> or visiting our <Link to="/appeals" className="font-semibold text-brand-600 hover:underline">Appeals Page</Link>.
          </p>
        </div>

        {/* 12. Liability */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              12
            </div>
            <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy is not a party to rental agreements or lease contracts and is not responsible for transactions, tenancy disputes, or property damages between users.
          </p>
        </div>

        {/* 13. Governing Law */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              13
            </div>
            <h2 className="text-xl font-bold text-gray-900">Governing Law & Jurisdiction</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            These Terms are governed by the laws of India. Courts with appropriate jurisdiction in Madhya Pradesh shall have jurisdiction unless otherwise required by applicable law.
          </p>
        </div>

        {/* 14. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-brand-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-400 font-bold text-lg border border-slate-700">
              14
            </div>
            <h2 className="text-xl font-bold text-white">Contact & Official Support</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-brand-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-brand-300 transition">
                support@rentiefy.com
              </a>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Globe className="h-5 w-5 text-teal-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Official Website</p>
              <a href="https://rentiefy.com" target="_blank" rel="noopener noreferrer" className="mt-0.5 text-sm font-bold text-white hover:text-teal-300 transition">
                rentiefy.com
              </a>
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
