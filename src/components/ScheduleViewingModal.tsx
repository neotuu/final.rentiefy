import React, { useState } from 'react'
import { Calendar, Clock, User, Phone, FileText, X, CheckCircle2, AlertCircle, CalendarPlus, Download, MessageSquare, Sparkles, MapPin } from 'lucide-react'
import { createViewingSchedule } from '../lib/api'
import type { ListingWithDetails, ViewingSchedule } from '../lib/types'
import { useAuth } from '../lib/auth'

interface ScheduleViewingModalProps {
  isOpen: boolean
  listing: ListingWithDetails
  onClose: () => void
  onSuccess?: (schedule: ViewingSchedule) => void
}

const DEFAULT_TIME_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
]

export default function ScheduleViewingModal({
  isOpen,
  listing,
  onClose,
  onSuccess,
}: ScheduleViewingModalProps) {
  const { user } = useAuth()

  // Calculate default date (tomorrow's date YYYY-MM-DD)
  const getTomorrowStr = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  const [date, setDate] = useState(getTomorrowStr())
  const [time, setTime] = useState('11:00 AM')
  const [customTime, setCustomTime] = useState('')
  const [useCustomTime, setUseCustomTime] = useState(false)
  const [userName, setUserName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '')
  const [userPhone, setUserPhone] = useState(user?.user_metadata?.phone || '')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedSchedule, setCompletedSchedule] = useState<ViewingSchedule | null>(null)

  if (!isOpen) return null

  const selectedTime = useCustomTime ? customTime : time

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('Please log in or sign up to schedule a property viewing.')
      return
    }

    if (!date) {
      setError('Please select a preferred date for viewing.')
      return
    }

    if (!selectedTime || selectedTime.trim().length === 0) {
      setError('Please select or specify a preferred time slot.')
      return
    }

    if (!userName.trim()) {
      setError('Please provide your name so the landlord knows who is visiting.')
      return
    }

    if (!userPhone.trim() || userPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createViewingSchedule({
        listing_id: listing.id,
        listing_title: listing.title,
        listing_address: `${listing.area}, ${listing.city}`,
        user_id: user.id,
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
        user_email: user.email,
        owner_id: listing.owner_id,
        owner_name: listing.owner?.full_name,
        preferred_date: date,
        preferred_time: selectedTime.trim(),
        notes: notes.trim() || undefined,
      })

      if (res.error) {
        setError(res.error)
      } else {
        setCompletedSchedule(res.schedule)
        if (onSuccess) onSuccess(res.schedule)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule viewing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    if (!completedSchedule) return '#'
    const title = encodeURIComponent(`Property Viewing: ${listing.title}`)
    const details = encodeURIComponent(
      `Viewing scheduled via Rentiefy\nProperty: ${listing.title}\nAddress: ${listing.area}, ${listing.city}\nTenant: ${completedSchedule.user_name} (${completedSchedule.user_phone})\nNotes: ${completedSchedule.notes || 'None'}`
    )
    const location = encodeURIComponent(`${listing.area}, ${listing.city}`)
    
    // Parse start date & time
    const dateParts = completedSchedule.preferred_date.split('-') // YYYY, MM, DD
    const startDateStr = dateParts.join('')
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDateStr}T050000Z/${startDateStr}T060000Z`
  }

  // Download iCal File
  const handleDownloadIcal = () => {
    if (!completedSchedule) return
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rentiefy//Property Viewing Schedule//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Property Viewing - ${listing.title}`,
      `DESCRIPTION:Rentiefy Property Visit\\nProperty: ${listing.title}\\nAddress: ${listing.area}\\, ${listing.city}\\nTenant: ${completedSchedule.user_name} (${completedSchedule.user_phone})`,
      `LOCATION:${listing.area}\\, ${listing.city}`,
      `DTSTART:${completedSchedule.preferred_date.replace(/-/g, '')}T100000Z`,
      `DTEND:${completedSchedule.preferred_date.replace(/-/g, '')}T110000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rentiefy-viewing-${listing.id}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Today's YYYY-MM-DD string for min attribute
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Schedule Property Viewing</h2>
              <p className="text-xs text-gray-500">Select date & time for visit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/60 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {completedSchedule ? (
            /* Confirmation Success State */
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" /> Viewing Request Submitted
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-900">Visit Scheduled!</h3>
                <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                  Your request has been saved and an instant notification message was sent to the landlord.
                </p>
              </div>

              {/* Visit Summary Card */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 text-left space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{listing.title}</p>
                    <p className="text-gray-500">{listing.area}, {listing.city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100/80">
                  <div>
                    <p className="text-gray-400 font-medium">Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(completedSchedule.preferred_date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Time Slot</p>
                    <p className="font-semibold text-gray-800">{completedSchedule.preferred_time}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-gray-600">
                  <span>Landlord Notification Status:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <MessageSquare className="h-3.5 w-3.5" /> In-App Message Sent
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleDownloadIcal}
                    className="btn-outline text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" /> Download .ics
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-secondary text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Booking Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Property Header Snippet */}
              <div className="rounded-xl bg-slate-50 p-3 border border-gray-100 flex items-center gap-3">
                <img
                  src={listing.media?.[0]?.media_url || 'https://images.pexels.com/photos/6585627/pexels-photo-6585627.jpeg'}
                  alt=""
                  className="h-12 w-16 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{listing.title}</p>
                  <p className="text-[11px] text-gray-500">{listing.area}, {listing.city}</p>
                  <p className="text-xs font-bold text-brand-600 mt-0.5">Rs. {listing.price_monthly.toLocaleString('en-IN')}/mo</p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-brand-600" /> Preferred Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input text-sm"
                  required
                />
              </div>

              {/* Time Slots */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand-600" /> Preferred Time Slot
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomTime(!useCustomTime)}
                    className="text-[11px] font-medium text-brand-600 hover:underline"
                  >
                    {useCustomTime ? 'Choose preset slots' : '+ Specify custom time'}
                  </button>
                </div>

                {!useCustomTime ? (
                  <div className="grid grid-cols-3 gap-2">
                    {DEFAULT_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`rounded-xl border py-2 px-2 text-xs font-medium transition ${
                          time === slot
                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-semibold shadow-2xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. 10:15 AM or 04:30 PM"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="input text-sm"
                  />
                )}
              </div>

              {/* User Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-brand-600" /> Your Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="input text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-brand-600" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-gray-400" /> Note to Landlord (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                  placeholder="e.g. I am looking to move in next month, visiting with my spouse."
                  className="input text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>Confirm & Notify Landlord</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
