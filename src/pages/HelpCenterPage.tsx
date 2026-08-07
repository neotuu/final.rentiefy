import { useState } from 'react'
import { HelpCircle, ChevronDown, Mail, Phone, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../lib/i18n'

export default function HelpCenterPage() {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    { q: t('landing.faq1Q'), a: t('landing.faq1A') },
    { q: t('landing.faq2Q'), a: t('landing.faq2A') },
    { q: t('landing.faq3Q'), a: t('landing.faq3A') },
    { q: t('landing.faq4Q'), a: t('landing.faq4A') },
  ]

  return (
    <div className="container-app max-w-3xl">
      <div className="flex items-center gap-2"><HelpCircle className="h-6 w-6 text-brand-600" /><h1 className="text-2xl font-bold text-gray-900">{t('help.title')}</h1></div>
      <p className="mt-1 text-sm text-gray-500">{t('help.subtitle')}</p>

      <div className="mt-6 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left">
              <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href="mailto:hello@rentiefy.com" className="card flex flex-col items-center gap-2 p-5 text-center transition hover:shadow-md">
          <Mail className="h-6 w-6 text-brand-600" /><p className="text-sm font-semibold text-gray-900">{t('contact.email')}</p><p className="text-xs text-gray-400">hello@rentiefy.com</p>
        </a>
        <a href="tel:+919876543210" className="card flex flex-col items-center gap-2 p-5 text-center transition hover:shadow-md">
          <Phone className="h-6 w-6 text-brand-600" /><p className="text-sm font-semibold text-gray-900">{t('contact.phone')}</p><p className="text-xs text-gray-400">+91 98765 43210</p>
        </a>
        <Link to="/contact" className="card flex flex-col items-center gap-2 p-5 text-center transition hover:shadow-md">
          <MessageCircle className="h-6 w-6 text-brand-600" /><p className="text-sm font-semibold text-gray-900">{t('help.contactSupport')}</p><p className="text-xs text-gray-400">Send a message</p>
        </Link>
      </div>
    </div>
  )
}
