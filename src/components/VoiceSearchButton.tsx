import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useI18n } from '../lib/i18n'

interface VoiceSearchButtonProps {
  onTranscript: (transcript: string) => void
  onSearchSubmit?: (finalTranscript: string) => void
  className?: string
  placeholderHint?: string
}

const LANG_SPEECH_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
}

export default function VoiceSearchButton({
  onTranscript,
  onSearchSubmit,
  className = '',
  placeholderHint = "Try saying '2BHK in Bangalore' or 'PG under 8000'",
}: VoiceSearchButtonProps) {
  const { language } = useI18n()
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
    }
  }, [])

  const startListening = () => {
    setErrorMessage(null)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      setErrorMessage('Voice search is not supported by your current browser.')
      return
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = LANG_SPEECH_MAP[language] || 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
        setInterimText('')
      }

      recognition.onresult = (event: any) => {
        let finalScript = ''
        let interimScript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i]
          const transcriptText = result[0].transcript
          if (result.isFinal) {
            finalScript += transcriptText
          } else {
            interimScript += transcriptText
          }
        }

        if (interimScript) {
          setInterimText(interimScript)
          onTranscript(interimScript)
        }

        if (finalScript) {
          const cleaned = finalScript.trim().replace(/[.,!?]+$/, '')
          setInterimText('')
          setIsListening(false)
          onTranscript(cleaned)
          if (onSearchSubmit) {
            onSearchSubmit(cleaned)
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error)
        setIsListening(false)
        setInterimText('')
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access denied. Please enable mic permissions in your browser.')
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please try speaking again.')
        } else {
          setErrorMessage('Voice search error. Please try again.')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err)
      setIsListening(false)
      setErrorMessage('Failed to start microphone.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setInterimText('')
  }

  const toggleVoice = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleVoice}
        disabled={!isSupported}
        title={
          !isSupported
            ? 'Voice search is not supported on this browser'
            : isListening
            ? 'Listening... Click to stop voice search'
            : 'Click to search by voice'
        }
        className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
          isListening
            ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-500 animate-pulse shadow-md'
            : isSupported
            ? 'text-gray-500 hover:bg-gray-100 hover:text-brand-600 active:scale-95'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        {isListening ? (
          <Mic className="h-5 w-5 animate-bounce text-rose-600" />
        ) : isSupported ? (
          <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>

      {/* Listening Indicator Tooltip / Banner */}
      {isListening && (
        <div className="absolute top-11 right-0 z-50 flex w-72 flex-col rounded-xl border border-rose-200 bg-white p-3 shadow-xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600"></span>
            </span>
            <span>Listening hands-free...</span>
          </div>

          <p className="mt-1 text-xs text-gray-700 italic min-h-[20px] font-medium">
            {interimText ? `"${interimText}"` : placeholderHint}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            Speak property details, e.g. "Flats in Indore" or "2BHK PG"
          </p>
        </div>
      )}

      {/* Error Popup */}
      {errorMessage && (
        <div className="absolute top-11 right-0 z-50 w-64 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800 shadow-lg animate-fade-in">
          <div className="flex items-start justify-between gap-1">
            <p className="font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-amber-500 hover:text-amber-700 text-xs font-bold px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
