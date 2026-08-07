import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import Logo from './Logo'

export default function Footer() {
  const { t } = useI18n()
  const sections = [
    { title: t('nav.forTenants'), links: [
      { to: '/browse', label: t('nav.searchProperties') },
      { to: '/map-search', label: t('nav.mapSearch') },
      { to: '/rent-calculator', label: t('nav.rentCalculator') },
      { to: '/locality-guide', label: t('nav.localityGuide') },
      { to: '/saved', label: t('nav.savedProperties') },
    ]},
    { title: t('nav.forOwners'), links: [
      { to: '/list-property', label: t('nav.postProperty') },
      { to: '/dashboard', label: t('nav.manageListings') },
      { to: '/rent-calculator', label: t('nav.pricingSuggestions') },
      { to: '/dashboard', label: t('nav.propertyVerification') },
    ]},
    { title: t('nav.company'), links: [
      { to: '/about', label: t('nav.about') },
      { to: '/about', label: t('nav.careers') },
      { to: '/contact', label: t('nav.contact') },
      { to: '/about', label: t('nav.partnerWithUs') },
      { to: '/terms', label: t('footer.terms') },
      { to: '/privacy', label: t('footer.privacy') },
      { to: '/refund', label: t('footer.refund') },
      { to: '/account-deletion', label: 'Account Deletion' },
      { to: '/appeals', label: 'Appeals Policy' },
      { to: '/community-guidelines', label: 'Community Guidelines' },
      { to: '/content-policy', label: 'Content & Listing Policy' },
      { to: '/cookies', label: 'Cookie Policy' },
      { to: '/disclaimer', label: 'Disclaimer' },
      { to: '/intellectual-property', label: 'IP Policy' },
      { to: '/payment-policy', label: 'Payment Policy' },
      { to: '/safety-policy', label: 'Safety Policy' },
    ]},
    { title: t('nav.helpCenter'), links: [
      { to: '/help', label: t('nav.helpCenter') },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: t('nav.contact') },
      { to: '/signin', label: t('auth.signIn') },
      { to: '/signup', label: t('auth.signUp') },
    ]},
  ]

  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <p className="mt-2 text-xs text-gray-500">{t('common.tagline')}</p>
            <div className="mt-3 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 transition hover:text-brand-600"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h3 className="text-xs font-semibold text-gray-900">{s.title}</h3>
              <ul className="mt-2 space-y-1.5">
                {s.links.map((l) => (
                  <li key={l.label}><Link to={l.to} className="text-xs text-gray-500 transition hover:text-brand-600">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {t('common.appName')}. {t('footer.rights')}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400"><Mail className="h-3 w-3" /> hello@rentiefy.com</div>
        </div>
      </div>
    </footer>
  )
}
