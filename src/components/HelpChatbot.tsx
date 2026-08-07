import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Trash2, 
  ChevronRight, 
  Building2, 
  Calculator, 
  MapPin, 
  ShieldCheck, 
  PlusCircle, 
  HelpCircle,
  ExternalLink,
  MessageSquare,
  User,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  actions?: { label: string; path: string }[]
}

const QUICK_SUGGESTIONS = [
  { label: '🔍 Find rentals', prompt: 'How can I search for PGs or 1BHK flats on Rentiefy?' },
  { label: '💰 Rent Estimator', prompt: 'How do I use the Rent Calculator to check fair rent?' },
  { label: '🛡️ Zero Brokerage', prompt: 'Is Rentiefy really 0 brokerage? How do contact unlocks work?' },
  { label: '🏢 List Property', prompt: 'How can I list my property for rent as an owner?' },
  { label: '🆔 DigiLocker KYC', prompt: 'What is DigiLocker KYC verification for tenants and owners?' },
  { label: '📍 Locality Guide', prompt: 'How can I check neighborhood safety and transport ratings?' },
]

export default function HelpChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Hello! 👋 Welcome to Rentiefy AI Support. I am your personal rental guide. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: 'Browse Rentals', path: '/browse' },
        { label: 'Fair Rent Calculator', path: '/rent-calculator' },
        { label: 'Locality Guide', path: '/locality-guide' }
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setHasUnread(false)
    }
  }, [messages, isOpen])

  // Voice speech-to-text
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please type your query.')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
        setIsListening(false)
      }

      recognition.start()
    } catch (e) {
      console.error(e)
      setIsListening(false)
    }
  }

  const parseActionsFromResponse = (text: string) => {
    const actions: { label: string; path: string }[] = []
    if (text.includes('/browse')) actions.push({ label: 'Browse Listings', path: '/browse' })
    if (text.includes('/rent-calculator')) actions.push({ label: 'Rent Calculator', path: '/rent-calculator' })
    if (text.includes('/locality-guide')) actions.push({ label: 'Locality Guides', path: '/locality-guide' })
    if (text.includes('/list-property')) actions.push({ label: 'List Property', path: '/list-property' })
    if (text.includes('/contact')) actions.push({ label: 'Contact Support', path: '/contact' })
    if (text.includes('/about')) actions.push({ label: 'About Rentiefy', path: '/about' })
    return actions.length > 0 ? actions : undefined
  }

  const handleSend = async (userPrompt?: string) => {
    const query = (userPrompt || input).trim()
    if (!query || isLoading) return

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    if (!userPrompt) setInput('')
    setIsLoading(true)

    try {
      // Build conversation payload for backend API
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      const replyText = data.reply || 'Thank you for reaching out! How else can I guide you?'

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: parseActionsFromResponse(replyText)
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.warn('Backend /api/chat error, using fallback assistance:', err)

      // Fallback response matrix
      let fallbackReply = "I'm here to assist! Rentiefy connects tenants directly with property owners across India with zero brokerage fees."
      const lower = query.toLowerCase()

      if (lower.includes('search') || lower.includes('find') || lower.includes('1bhk') || lower.includes('pg') || lower.includes('flat')) {
        fallbackReply = "You can search verified PGs, rooms, flats, and houses on Rentiefy!\n\n• Use filters by city (Indore, Bengaluru, Mumbai, Delhi, etc.), max budget, room type, and furnishing.\n• Direct owner contact numbers can be unlocked instantly for Rs. 10 via UPI."
      } else if (lower.includes('rent') || lower.includes('calculator') || lower.includes('estimate') || lower.includes('fair')) {
        fallbackReply = "Our Rent Estimator helps you calculate fair market rent based on city locality, property size, and room type.\n\nVisit our Fair Rent Calculator to test your area!"
      } else if (lower.includes('list') || lower.includes('owner') || lower.includes('post')) {
        fallbackReply = "Property owners can list properties completely free of cost!\n\n1. Tap 'List Property'.\n2. Add details & upload photo photos.\n3. Get verified tenant calls directly."
      } else if (lower.includes('kyc') || lower.includes('digilocker') || lower.includes('verify')) {
        fallbackReply = "Rentiefy features DigiLocker KYC verification for both tenants and landlords.\n\nBy linking Aadhaar/PAN/DL, your profile gains a Verified Trust Badge, boosting response rates!"
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('number') || lower.includes('unlock')) {
        fallbackReply = "To keep our platform broker-free and spam-free, owner contact details are unlocked for a nominal Rs. 10 fee via UPI or Razorpay."
      }

      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: parseActionsFromResponse(fallbackReply) || [
          { label: 'Browse Rentals', path: '/browse' },
          { label: 'Rent Calculator', path: '/rent-calculator' }
        ]
      }

      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Chat history cleared. How can I help you now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          id="help-chatbot-trigger"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-600 px-4 py-3 text-white shadow-xl shadow-brand-600/30 ring-2 ring-white/50 transition hover:shadow-2xl md:bottom-6 md:right-6"
          aria-label="Open Rentiefy AI Help Chatbot"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
              </span>
            )}
          </div>
          <span className="hidden font-medium text-sm sm:inline">Need Help? Ask AI</span>
        </motion.button>
      )}

      {/* Chat Window Modal / Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="help-chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 flex h-[85vh] max-h-[620px] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 md:bottom-6 md:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 via-brand-700 to-slate-900 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                  <Bot className="h-5 w-5 text-amber-300" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-brand-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm">Rentiefy AI Guide</h3>
                    <span className="rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                      24/7 Support
                    </span>
                  </div>
                  <p className="text-xs text-brand-100">Verified Rental Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear Chat"
                  className="rounded-lg p-1.5 text-brand-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-brand-200 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {msg.role === 'assistant' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      
                      {/* Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                          {msg.actions.map((act) => (
                            <button
                              key={act.path}
                              type="button"
                              onClick={() => {
                                setIsOpen(false)
                                navigate(act.path)
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-100 hover:text-brand-800"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          msg.role === 'user' ? 'text-brand-100' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Wave */}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            {messages.length <= 2 && (
              <div className="border-t border-gray-100 bg-white p-2.5">
                <p className="mb-1.5 text-[11px] font-medium text-gray-400 px-1">Suggested topics:</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {QUICK_SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="shrink-0 rounded-full border border-gray-200 bg-slate-50 px-3 py-1 text-xs text-gray-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="border-t border-gray-100 bg-white p-3"
            >
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-slate-50 px-3 py-1.5 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about rentals, rent, or KYC..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  disabled={isLoading}
                />

                {/* Voice mic toggle */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`rounded-lg p-1.5 transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice Search'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-lg bg-brand-600 p-2 text-white transition hover:bg-brand-700 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
