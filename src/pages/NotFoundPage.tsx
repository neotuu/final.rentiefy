import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { useI18n } from '../lib/i18n'

export default function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Home className="h-8 w-8" /></div>
      <h1 className="mt-4 text-4xl font-bold text-gray-900">{t('notfound.title')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('notfound.desc')}</p>
      <Link to="/" className="mt-4 btn-primary"><ArrowLeft className="h-4 w-4" /> {t('notfound.back')}</Link>
    </div>
  )
}
