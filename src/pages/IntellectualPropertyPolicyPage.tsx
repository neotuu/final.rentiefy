import { Link } from 'react-router-dom'
import { Copyright, Shield, FileText, CheckCircle2, AlertTriangle, Scale, Globe, Mail, MapPin, ShieldAlert, Award } from 'lucide-react'
import Logo from '../components/Logo'

export default function IntellectualPropertyPolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-indigo-100">
            <FileText className="h-3.5 w-3.5 text-indigo-300" /> Version 1.0 • Effective & Last Updated: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Intellectual Property Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-indigo-100 sm:text-lg">
            Guidelines governing Rentiefy brand ownership, trademarks, user content copyright, and licensing rights.
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
            This policy explains ownership of intellectual property associated with Rentiefy and the responsibilities of users regarding content uploaded to the platform.
          </p>
        </div>

        {/* 2. Rentiefy Intellectual Property */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Rentiefy Intellectual Property</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            The Rentiefy name, logo, branding, website design, software, graphics, text and other original content are owned by or licensed to Rentiefy and are protected by applicable intellectual property laws.
          </p>
        </div>

        {/* 3. User Content */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">User Content</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users retain ownership of the content they upload, including property descriptions, photographs and videos, provided they have the legal right to use that content.
          </p>
        </div>

        {/* 4. Licence to Rentiefy */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Licence to Rentiefy</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            By uploading content, users grant Rentiefy a non-exclusive, worldwide, royalty-free licence to host, display, reproduce and distribute the content solely for operating, promoting and improving the platform.
          </p>
        </div>

        {/* 5. Prohibited Conduct */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Prohibited Conduct</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Users must not upload content that infringes copyrights, trademarks or other intellectual property rights. Copying, scraping, reverse engineering or unauthorised commercial use of Rentiefy content is prohibited.
          </p>
        </div>

        {/* 6. Copyright Complaints */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Copyright Complaints</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            If you believe your intellectual property rights have been infringed, contact <a href="mailto:support@rentiefy.com" className="font-semibold text-brand-600 hover:underline">support@rentiefy.com</a> with sufficient information to investigate your claim.
          </p>
        </div>

        {/* 7. Enforcement */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              7
            </div>
            <h2 className="text-xl font-bold text-gray-900">Enforcement</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Rentiefy may remove infringing content, suspend accounts or take other action consistent with its policies and applicable law.
          </p>
        </div>

        {/* 8. Changes */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
              8
            </div>
            <h2 className="text-xl font-bold text-gray-900">Changes</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This policy may be updated from time to time. Continued use of the platform constitutes acceptance of the updated version.
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
