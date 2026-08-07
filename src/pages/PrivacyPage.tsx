import { Link } from 'react-router-dom'
import { Shield, FileText, Globe, Mail, MapPin, User, Server, Lock, CheckCircle2, Users, Database, ShieldCheck, AlertCircle, Building, Cpu, Key } from 'lucide-react'
import Logo from '../components/Logo'

export default function PrivacyPage() {
  const thirdParties = [
    'Supabase', 'MSG91', 'Resend', 'Razorpay', 'Google services',
    'Firebase', 'Cloudflare', 'Vercel', 'GitHub', 'Microsoft Clarity'
  ]

  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-blue-100">
            <FileText className="h-3.5 w-3.5 text-blue-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-blue-100 sm:text-lg">
            How Rentiefy collects, uses, protects, and handles your personal information.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="mt-8 space-y-6">

        {/* 1. Introduction */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy is a rental marketplace connecting tenants, owners, agents, builders and property managers. This Privacy Policy explains how personal information is collected, used and protected across our platform and services.
          </p>
        </div>

        {/* 2. Company Details */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Company Details</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <span className="text-xs text-gray-500 font-medium block">Owner / Proprietor</span>
              <span className="font-bold text-gray-900">Nikhil Prajapat</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <span className="text-xs text-gray-500 font-medium block">Business Name</span>
              <span className="font-bold text-gray-900">Rentiefy</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <span className="text-xs text-gray-500 font-medium block">Location</span>
              <span className="font-bold text-gray-900">Indore, Madhya Pradesh, India</span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
              <span className="text-xs text-gray-500 font-medium block">Website & Support</span>
              <span className="font-bold text-gray-900">rentiefy.com | support@rentiefy.com</span>
            </div>
          </div>
        </div>

        {/* 3. Information Collected */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Information Collected</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            We collect personal information necessary to deliver our rental marketplace features, including:
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            {[
              'Account information (Name, Email, Phone, Role)',
              'Property listings & descriptions',
              'Profile photos, property images & videos',
              'In-app chats & communications',
              'Transaction metadata & payment logs',
              'Device information, IP & system logs',
              'Geolocation (only with user permission)',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-2.5 shadow-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" />
                <span className="text-xs font-semibold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Use of Information */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Use of Information</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            We use collected data solely to operate the platform, authenticate users, process premium services, improve platform security, prevent fraud and spam, and comply with applicable legal obligations.
          </p>
        </div>

        {/* 5. Third Parties */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Third-Party Service Providers</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy partners with trusted infrastructure, authentication, payment, and analytics providers to power platform features:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {thirdParties.map((tp) => (
              <span key={tp} className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-900">
                <Server className="h-3.5 w-3.5 text-blue-600" />
                {tp}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            All third parties process data securely according to their respective privacy and security standards.
          </p>
        </div>

        {/* 6. User Rights */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Rights & Data Control</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users maintain full control over their personal data, including rights to access, correction, deletion requests, account deletion, and general privacy inquiries.
          </p>
          <div className="mt-4">
            <Link to="/account-deletion" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline">
              View Account Deletion Policy & Request Instructions →
            </Link>
          </div>
        </div>

        {/* 7. Children */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-brand-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Age Limits / Children's Privacy</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must be at least 18 years old to create an account, list properties, or transact on Rentiefy. We do not knowingly collect personal information from individuals under 18 years of age.
          </p>
        </div>

        {/* 8. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-brand-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-400 font-bold text-lg border border-slate-700">
              8
            </div>
            <h2 className="text-xl font-bold text-white">Contact & Company Info</h2>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <User className="h-5 w-5 text-brand-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Owner</p>
              <p className="mt-0.5 text-sm font-bold text-white">Nikhil Prajapat</p>
              <p className="text-xs text-slate-400">Business: Rentiefy</p>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-4 border border-slate-700">
              <Mail className="h-5 w-5 text-teal-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Support & Email</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-teal-300 transition">
                support@rentiefy.com
              </a>
              <p className="text-xs text-slate-400">Website: rentiefy.com</p>
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
