import { Link } from 'react-router-dom'
import { Cookie, Shield, Settings, Activity, Lock, Sliders, Globe, Mail, MapPin, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import Logo from '../components/Logo'

export default function CookiePolicyPage() {
  return (
    <div className="container-app max-w-4xl py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-amber-100">
            <FileText className="h-3.5 w-3.5 text-amber-300" /> Version 1.0 • Effective & Last Updated: August 1, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-3 max-w-2xl text-base text-amber-100 sm:text-lg">
            How Rentiefy uses cookies and similar web technologies to enhance security, functionality, and performance.
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
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              1
            </div>
            <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            This Cookie Policy explains how Rentiefy uses cookies and similar technologies when you access our website and services.
          </p>
        </div>

        {/* 2. What Are Cookies? */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">What Are Cookies?</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Cookies are small text files stored on your device to remember preferences, improve functionality, enhance security and analyse website usage.
          </p>
        </div>

        {/* 3. Types of Cookies We Use */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Types of Cookies We Use</h2>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            We categorize the cookies operating on Rentiefy into the following standard functions:
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { title: 'Essential Cookies', desc: 'Required for login, security authentication, and core platform functionality.', icon: Lock },
              { title: 'Functional Cookies', desc: 'Remember preferences such as language selection, saved filters, and UI settings.', icon: Sliders },
              { title: 'Performance Cookies', desc: 'Help improve website speed, caching, and server load reliability.', icon: Activity },
              { title: 'Analytics Cookies', desc: 'Measure usage trends, popular features, and user interaction performance.', icon: Cookie },
              { title: 'Security Cookies', desc: 'Detect suspicious activity, prevent unauthorized access, and protect user accounts.', icon: Shield },
            ].map((c) => (
              <div key={c.title} className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                <c.icon className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{c.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Third-Party Cookies */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              4
            </div>
            <h2 className="text-xl font-bold text-gray-900">Third-Party Cookies</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            Trusted providers such as Google Analytics and Microsoft Clarity may place cookies to provide analytics. Their use is governed by their own privacy policies.
          </p>
        </div>

        {/* 5. Managing Cookies */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              5
            </div>
            <h2 className="text-xl font-bold text-gray-900">Managing Cookies</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            You may accept, reject or delete cookies through your browser settings. Disabling some cookies may affect website functionality.
          </p>
        </div>

        {/* 6. Updates */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-lg">
              6
            </div>
            <h2 className="text-xl font-bold text-gray-900">Updates</h2>
          </div>
          <p className="mt-3 text-base leading-relaxed text-gray-700">
            We may update this Cookie Policy periodically. Changes become effective once published on Rentiefy.
          </p>
        </div>

        {/* 7. Contact */}
        <div className="rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3 text-amber-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-amber-400 font-bold text-lg border border-slate-700">
              7
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
              <Mail className="h-5 w-5 text-amber-400" />
              <p className="mt-2 text-xs text-slate-400 font-medium">Email Support</p>
              <a href="mailto:support@rentiefy.com" className="mt-0.5 text-sm font-bold text-white hover:text-amber-300 transition">
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
