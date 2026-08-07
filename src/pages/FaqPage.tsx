import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, Mail, Globe, FileText, CheckCircle2, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react'
import Logo from '../components/Logo'
import Seo from '../components/Seo'

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    {
      q: "What is Rentiefy?",
      a: "Rentiefy is a modern rental marketplace connecting tenants, property owners, agents, builders, and property managers directly with verified listings, direct chat, and zero-brokerage search across India."
    },
    {
      q: "Is it free?",
      a: "Yes! Rentiefy is free to search, browse properties, contact owners, and post basic listings. Premium features, featured listing boosts, and priority support are completely optional."
    }
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  }

  return (
    <div className="container-app max-w-4xl py-6">
      <Seo 
        title="Frequently Asked Questions (FAQs) — Rentiefy" 
        description="Find answers to common questions about finding rental properties, zero-brokerage listings, owner verification, and payments on Rentiefy."
        url="https://rentiefy.com/faq"
        jsonLd={faqSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQs', url: '/faq' }
        ]}
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-700 to-slate-900 p-8 text-white shadow-xl md:p-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md text-brand-100">
            <FileText className="h-3.5 w-3.5 text-brand-300" /> Version 1.0 • Effective: August 2, 2026
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Rentiefy FAQ
          </h1>
          <p className="mt-3 max-w-2xl text-base text-brand-100 sm:text-lg">
            Frequently Asked Questions about Rentiefy's platform, features, and pricing.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Logo variant="icon" size="xl" />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="mt-8 space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden transition-all duration-200 border border-gray-100">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-bold text-sm">
                  Q{i + 1}
                </div>
                <span className="text-base font-bold text-gray-900">{faq.q}</span>
              </div>
              <ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180 text-brand-600' : ''}`} />
            </button>
            {open === i && (
              <div className="border-t border-gray-100 bg-gray-50/30 p-6 pt-4 text-sm leading-relaxed text-gray-700">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Extra Help Banner */}
      <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-brand-600 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-gray-900">Have more questions?</h3>
            <p className="text-xs text-gray-600">Explore our Help Center or contact our support team directly.</p>
          </div>
        </div>
        <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-700 transition">
          <MessageCircle className="h-4 w-4" /> Contact Support
        </Link>
      </div>

      {/* Contact Section */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-slate-900 p-6 text-white sm:p-8">
        <div className="flex items-center gap-3 text-brand-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-brand-400 font-bold text-lg border border-slate-700">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Contact Information</h2>
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
            <p className="mt-2 text-xs text-slate-400 font-medium">Website</p>
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
  )
}
