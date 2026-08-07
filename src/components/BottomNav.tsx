import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Plus, LayoutDashboard, MessageCircle } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { getUnreadCount } from '../lib/api'
import { RentIcon } from './Logo'

export default function BottomNav() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    let active = true
    const loadUnread = () => getUnreadCount(user.id).then((c) => { if (active) setUnreadCount(c) })
    loadUnread()
    const interval = setInterval(loadUnread, 30000)
    return () => { active = false; clearInterval(interval) }
  }, [user])

  const items = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/browse', label: t('nav.findRentals'), icon: Search },
    { to: '/list-property', label: t('nav.postProperty'), icon: Plus, primary: true },
    { to: '/saved', label: t('nav.savedProperties'), icon: Heart },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadCount },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-end justify-around px-2">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))
          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="-mt-5 flex flex-col items-center gap-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 shadow-lg ring-4 ring-white transition-transform duration-200 hover:scale-105 active:scale-95">
                  <RentIcon size={26} houseFill="#FFFFFF" windowFill="#0d9488" />
                </span>
                <span className="text-[10px] font-medium text-brand-600">{item.label}</span>
              </Link>
            )
          }
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
                active ? 'text-brand-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                {item.badge ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
