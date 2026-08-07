import { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { supabase } from '../lib/supabase'
import Seo from '../components/Seo'

export default function ContactPage() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!name.trim() || !email.trim() || !message.trim()) { setError(t('contact.allRequired')); return }
    setLoading(true)
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() })
    setLoading(false)
    if (dbError) { setError(t('common.error')); return }
    setSent(true); setName(''); setEmail(''); setMessage('')
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="container-app max-w-3xl">
      <Seo 
        title="Contact Us — Rentiefy Support" 
        description="Get in touch with Rentiefy support for help with rental listings, accounts, or inquiries. Email support@rentiefy.com based in Indore, MP, India." 
        url="https://rentiefy.com/contact" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' }
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900">{t('contact.title')}</h1>
      <p className="mt-1 text-sm text-gray-500">{t('contact.subtitle')}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, label: t('contact.email'), value: 'hello@rentiefy.com' },
          { icon: Phone, label: t('contact.phone'), value: '+91 98765 43210' },
          { icon: MapPin, label: t('contact.location'), value: 'Indore, MP' },
        ].map((c) => (
          <div key={c.label} className="card p-4 text-center"><c.icon className="mx-auto h-5 w-5 text-brand-600" /><p className="mt-2 text-xs font-medium text-gray-500">{c.label}</p><p className="text-sm font-semibold text-gray-900">{c.value}</p></div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-6 card space-y-4 p-5">
        <div><label className="mb-1 block text-xs font-medium text-gray-500">{t('contact.name')}</label><input value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} maxLength={80} className="input" placeholder={t('contact.namePlaceholder')} /></div>
        <div><label className="mb-1 block text-xs font-medium text-gray-500">{t('contact.email')}</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 120))} maxLength={120} className="input" placeholder="you@example.com" /></div>
        <div><label className="mb-1 block text-xs font-medium text-gray-500">{t('contact.message')}</label><textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 1000))} maxLength={1000} rows={4} className="input resize-none" placeholder={t('contact.messagePlaceholder')} /></div>
        {error && <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}
        {sent && <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700"><CheckCircle2 className="h-4 w-4 shrink-0" /> {t('contact.sent')}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('common.loading')}</> : <><Send className="h-4 w-4" /> {t('contact.send')}</>}
        </button>
      </form>
    </div>
  )
}
