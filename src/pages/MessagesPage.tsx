import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MessageCircle, Send, ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { getConversations, getConversation, sendMessage, markMessageRead } from '../lib/api'
import type { Conversation, Message } from '../lib/types'
import { supabase } from '../lib/supabase'
import { useI18n } from '../lib/i18n'

type ActiveConvo = { otherUserId: string; listingId: string | null }

export default function MessagesPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvo, setActiveConvo] = useState<ActiveConvo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const targetOwner = searchParams.get('owner')
  const targetListing = searchParams.get('listing')

  const loadConversations = useCallback(async () => {
    if (!user) return
    try {
      const convos = await getConversations(user.id)
      setConversations(convos)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadMessages = useCallback(async (otherUserId: string, listingId: string | null) => {
    if (!user) return
    setLoadingMessages(true)
    try {
      const msgs = await getConversation(otherUserId, listingId, user.id)
      setMessages(msgs)
      for (const msg of msgs) {
        if (msg.recipient_id === user.id && !msg.read_at) {
          await markMessageRead(msg.id)
        }
      }
    } catch {
      setError('Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }, [user])

  const handleOpenConvo = (convo: Conversation) => {
    setActiveConvo({ otherUserId: convo.other_user_id, listingId: convo.listing_id })
    loadMessages(convo.other_user_id, convo.listing_id)
  }

  const handleSend = async () => {
    if (!user || !activeConvo || !newMessage.trim()) return
    setSending(true)
    try {
      await sendMessage(activeConvo.otherUserId, activeConvo.listingId, newMessage.trim(), user.id)
      setNewMessage('')
      loadMessages(activeConvo.otherUserId, activeConvo.listingId)
      loadConversations()
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (targetOwner && targetListing && user && !activeConvo) {
      const existing = conversations.find(
        (c) => c.other_user_id === targetOwner && c.listing_id === targetListing
      )
      if (existing) {
        handleOpenConvo(existing)
      } else {
        setActiveConvo({ otherUserId: targetOwner, listingId: targetListing })
        loadMessages(targetOwner, targetListing)
      }
      setSearchParams({})
    }
  }, [targetOwner, targetListing, user, conversations, activeConvo, loadMessages, setSearchParams])

  useEffect(() => { loadConversations() }, [loadConversations])

  useEffect(() => {
    if (!user || !activeConvo) return
    const ac = activeConvo
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`,
      }, () => {
        loadMessages(ac.otherUserId, ac.listingId)
        loadConversations()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, activeConvo, loadMessages, loadConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>
  }

  if (activeConvo) {
    const ac = activeConvo
    const otherUser = conversations.find((c) => c.other_user_id === ac.otherUserId)
    return (
      <div className="container-app max-w-2xl">
        <button onClick={() => { setActiveConvo(null); setMessages([]) }} className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> {t('messages.back')}
        </button>
        <div className="card flex h-[60vh] flex-col overflow-hidden">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {loadingMessages && <p className="text-center text-sm text-gray-400">{t('common.loading')}</p>}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender_id === user?.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {msg.body}
                  <span className={`mt-1 block text-xs ${msg.sender_id === user?.id ? 'text-brand-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !sending) handleSend() }}
                placeholder={t('messages.typeMessage')}
                className="input flex-1"
                disabled={sending}
              />
              <button onClick={handleSend} disabled={sending || !newMessage.trim()} className="btn-primary flex items-center gap-1">
                <Send className="h-4 w-4" /> {t('messages.send')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-app max-w-2xl">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-brand-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('messages.title')}</h1>
      </div>
      <p className="mt-1 text-sm text-gray-500">{t('messages.subtitle')}</p>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6">
        {conversations.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <Mail className="h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">{t('messages.noConversations')}</p>
            <p className="mt-1 text-xs text-gray-400">{t('messages.noConversationsDesc')}</p>
            <Link to="/browse" className="btn-primary mt-4">Browse Listings</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((convo) => (
              <button
                key={`${convo.other_user_id}:${convo.listing_id ?? 'null'}`}
                onClick={() => handleOpenConvo(convo)}
                className="card flex w-full items-center gap-3 p-4 text-left transition hover:border-brand-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <span className="text-base font-semibold text-brand-700">
                    {convo.other_user_name.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{convo.other_user_name}</p>
                  {convo.listing_title && <p className="truncate text-xs text-gray-400">{convo.listing_title}</p>}
                  <p className="truncate text-xs text-gray-500">{convo.last_message}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-400">
                    {new Date(convo.last_message_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  {convo.unread_count > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
                      {convo.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
