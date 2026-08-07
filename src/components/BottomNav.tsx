import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Plus, LayoutDashboard, MessageCircle } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { getUnreadCount } from '../lib/api'

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
    { to: '/browse', label: t('nav.browse'), icon: Search },
    { to: '/list-property', label: t('nav.postProperty'), icon: Plus, primary: true },
    { to: '/saved', label: t('nav.savedProperties'), icon: Heart },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadCount },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/80 bg-white/95 shadow-lg backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-1">
        {items.map((item) => {
          const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))

          if (item.primary) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative flex flex-1 flex-col items-center justify-center h-full text-center"
              >
                <div className="relative -mt-6 flex items-center justify-center">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-white transition-all duration-200 group-hover:scale-105 group-hover:bg-brand-700 active:scale-95 ${active ? 'ring-brand-100 bg-brand-700' : ''}`}>
                    <Plus className="h-6 w-6 stroke-[2.5]" />
                  </span>
                </div>
                <span className={`mt-0.5 text-[10px] font-semibold leading-tight tracking-tight ${active ? 'text-brand-600' : 'text-brand-600 group-hover:text-brand-700'}`}>
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex flex-1 flex-col items-center justify-center h-full px-0.5 transition-colors ${
                active ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative flex h-6 items-center justify-center">
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110 text-brand-600' : 'text-gray-500 group-hover:text-gray-800'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`mt-1 text-[10px] font-medium leading-none text-center truncate max-w-[62px] ${active ? 'font-semibold text-brand-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

