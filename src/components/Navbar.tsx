import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, ChevronDown, Menu, X, MessageCircle, User, UserPlus, Plus } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useI18n } from '../lib/i18n'
import { getUnreadCount } from '../lib/api'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpenMenu(null); setMobileOpen(false) }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    let active = true
    const loadUnread = () => getUnreadCount(user.id).then((c) => { if (active) setUnreadCount(c) })
    loadUnread()
    const interval = setInterval(loadUnread, 30000)
    return () => { active = false; clearInterval(interval) }
  }, [user])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''

  const dropdowns: Record<string, { label: string; items: { to: string; label: string }[] }> = {
    tenants: { label: t('nav.forTenants'), items: [
      { to: '/browse', label: t('nav.searchProperties') },
      { to: '/map-search', label: t('nav.nearbyRentals') },
      { to: '/browse?verified=1', label: t('nav.verifiedProperties') },
      { to: '/browse?sort=new', label: t('nav.recentlyAdded') },
      { to: '/browse?furnish=fully-furnished', label: t('nav.furnishedHomes') },
      { to: '/rent-calculator', label: t('nav.rentCalculator') },
    ]},
    owners: { label: t('nav.forOwners'), items: [
      { to: '/list-property', label: t('nav.postProperty') },
      { to: '/dashboard', label: t('nav.manageListings') },
      { to: '/dashboard', label: t('nav.leadsEnquiries') },
      { to: '/rent-calculator', label: t('nav.pricingSuggestions') },
      { to: '/dashboard', label: t('nav.propertyVerification') },
    ]},
    company: { label: t('nav.company'), items: [
      { to: '/about', label: t('nav.about') },
      { to: '/about', label: t('nav.careers') },
      { to: '/contact', label: t('nav.contact') },
      { to: '/terms', label: t('footer.terms') },
      { to: '/privacy', label: t('footer.privacy') },
    ]},
  }

  const mainNavItems = [
    { to: '/', label: t('nav.home') },
    { to: '/browse', label: t('nav.findRentals') },
    { to: '/saved', label: t('nav.savedProperties') },
    { to: '/map-search', label: t('nav.mapSearch') },
    { to: '/locality-guide', label: t('nav.localityGuide') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md" ref={ref}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size="md" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {mainNavItems.map((item) => {
              const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {Object.entries(dropdowns).map(([key, dd]) => (
              <div key={key} className="relative">
                <button onMouseEnter={() => setOpenMenu(key)} onClick={() => setOpenMenu(openMenu === key ? null : key)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                  {dd.label} <ChevronDown className="h-3 w-3" />
                </button>
                {openMenu === key && (
                  <div onMouseLeave={() => setOpenMenu(null)} className="animate-fade-in absolute left-0 top-full z-50 mt-1 w-56 origin-top overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                    {dd.items.map((item, i) => (
                      <Link key={i} to={item.to} className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 hover:pl-5">{item.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />

          {/* Primary CTA: Post Property */}
          <Link
            to="/list-property"
            className="hidden items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:flex sm:text-sm"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{t('nav.postProperty')}</span>
          </Link>

          {user && (
            <Link to="/messages" className="relative hidden rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 sm:block" title="Messages">
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden text-sm font-semibold text-gray-700 md:inline">{userName}</span>
              <Link to="/auth" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-2.5 sm:text-xs" title="Account Details">
                <User className="h-4 w-4 text-brand-600" />
                <span className="hidden xs:inline">Account</span>
              </Link>
              <button onClick={handleSignOut} className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 sm:flex sm:text-sm">
                <LogOut className="h-4 w-4" /> {t('nav.signOut')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link to="/signin" className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 sm:px-3 sm:py-2 sm:text-sm">
                <User className="h-3.5 w-3.5 text-brand-600 sm:h-4 sm:w-4" />
                <span>{t('auth.signIn')}</span>
              </Link>
              <Link to="/signup" className="flex items-center gap-1 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:px-3 sm:py-2 sm:text-sm">
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{t('auth.signUp')}</span>
              </Link>
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-1.5 text-gray-600 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="animate-fade-in border-t border-gray-100 px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {[
              { to: '/', label: t('nav.home') },
              { to: '/browse', label: t('nav.findRentals') },
              { to: '/list-property', label: t('nav.listProperty') },
              { to: '/map-search', label: t('nav.mapSearch') },
              { to: '/saved', label: t('nav.savedProperties') },
              { to: '/rent-calculator', label: t('nav.rentCalculator') },
              { to: '/locality-guide', label: t('nav.localityGuide') },
              { to: '/help', label: t('nav.helpCenter') },
              { to: '/about', label: t('nav.about') },
              { to: '/contact', label: t('nav.contact') },
              { to: '/dashboard', label: t('nav.dashboard') },
              { to: '/messages', label: 'Messages' },
              { to: '/admin', label: t('nav.admin') },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">{item.label}</Link>
            ))}
          </div>
          {user ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                <User className="h-4 w-4" /> Account Details
              </Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                <LogOut className="h-4 w-4" /> {t('nav.signOut')}
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              <Link to="/signin" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 flex items-center justify-center gap-1.5">
                <User className="h-4 w-4" /> {t('auth.signIn')}
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-1.5">
                <UserPlus className="h-4 w-4" /> {t('auth.signUp')}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
