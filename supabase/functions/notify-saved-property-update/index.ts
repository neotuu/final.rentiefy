import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  listing_id: string
  update_type: 'price_drop' | 'status_update'
  old_price?: number
  new_price?: number
  old_status?: string
  new_status?: string
  listing_title?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: NotificationPayload = await req.json()
    const { listing_id, update_type, old_price, new_price, old_status, new_status, listing_title } = body

    if (!listing_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: listing_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Query users who have saved this property
    const { data: savedRows, error: savedError } = await supabase
      .from('saved_properties')
      .select('user_id, created_at')
      .eq('listing_id', listing_id)

    if (savedError) {
      console.error('Error querying saved_properties:', savedError)
    }

    const userIds = savedRows ? savedRows.map((r: any) => r.user_id) : []

    // 2. Fetch user profile emails
    let emailRecipients: { user_id: string; email: string; name: string }[] = []
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds)

      if (profiles && profiles.length > 0) {
        emailRecipients = profiles
          .filter((p: any) => p.email)
          .map((p: any) => ({
            user_id: p.user_id,
            email: p.email,
            name: p.full_name || 'Valued Tenant',
          }))
      }
    }

    // 3. Construct notification details
    const isPriceDrop = update_type === 'price_drop' || (typeof old_price === 'number' && typeof new_price === 'number' && new_price < old_price)
    const priceDiff = (old_price && new_price) ? Math.max(0, old_price - new_price) : 0

    const formattedOldPrice = old_price ? `₹${old_price.toLocaleString('en-IN')}` : ''
    const formattedNewPrice = new_price ? `₹${new_price.toLocaleString('en-IN')}` : ''

    const emailSubject = isPriceDrop
      ? `🎉 Price Drop Alert: ${listing_title || 'Saved Property'} dropped to ${formattedNewPrice}/mo!`
      : `📢 Status Update: ${listing_title || 'Saved Property'} status updated to ${new_status || 'Updated'}`

    const emailBodyText = isPriceDrop
      ? `Great news! A property saved in your Rentiefy wishlist ("${listing_title || 'Property'}") has dropped in price by ₹${priceDiff.toLocaleString('en-IN')}/month.\n\nOriginal Rent: ${formattedOldPrice}/mo\nNew Rent: ${formattedNewPrice}/mo\n\nLog in to Rentiefy to contact the owner before it gets booked!`
      : `The property "${listing_title || 'Property'}" saved in your Rentiefy wishlist has updated its status${old_status ? ` from ${old_status}` : ''} to ${new_status || 'updated'}.\n\nLog in to Rentiefy to check the latest availability details.`

    // 4. Save in-app notification records for recipient users
    if (userIds.length > 0) {
      const notifications = userIds.map((uid) => ({
        user_id: uid,
        listing_id: listing_id,
        type: isPriceDrop ? 'price_drop' : 'status_update',
        title: isPriceDrop ? 'Price Drop Alert' : 'Property Status Update',
        message: emailBodyText,
        read: false,
        created_at: new Date().toISOString(),
      }))

      await supabase.from('user_notifications').insert(notifications).then(() => {}).catch(() => {})
    }

    // 5. Send out emails via Resend API if API key is set, or simulate dispatch
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    let emailsSent = 0

    if (resendApiKey && emailRecipients.length > 0) {
      for (const recipient of emailRecipients) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Rentiefy Alerts <alerts@rentiefy.com>',
              to: recipient.email,
              subject: emailSubject,
              html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Rentiefy Property Alert</h1>
                    <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Zero-Brokerage Rental Marketplace</p>
                  </div>
                  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 24px;">
                    <h3 style="color: #0f172a; margin-top: 0;">Hello ${recipient.name},</h3>
                    <p style="color: #334155; line-height: 1.6; font-size: 15px; white-space: pre-line;">${emailBodyText}</p>
                  </div>
                  <div style="text-align: center; margin-bottom: 24px;">
                    <a href="${Deno.env.get('SITE_URL') || 'https://rentiefy.com'}/listing/${listing_id}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: 600; text-decoration: none; border-radius: 8px;">View Property Listing</a>
                  </div>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                  <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 0;">
                    You received this email because you saved this listing on Rentiefy. Rentiefy © 2026. All rights reserved.
                  </p>
                </div>
              `,
            }),
          })
          if (res.ok) emailsSent++
        } catch (e) {
          console.error(`Failed to send email to ${recipient.email}:`, e)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        update_type,
        notified_users: userIds.length,
        emails_sent: emailsSent,
        subject: emailSubject,
        summary: emailBodyText,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Error in notify-saved-property-update function:', err)
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
