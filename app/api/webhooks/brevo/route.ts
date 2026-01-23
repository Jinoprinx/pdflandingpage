import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeSubscriber, trackEvent } from '@/lib/db/queries'

// Brevo webhook payload type (simplified)
interface BrevoWebhookPayload {
    event: string
    email: string
    id: number
    date: string
    ts: number
    "message-id": string
    ts_event: number
    subject: string
    campaign_id?: number
    tags?: string[]
    reason?: string
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json() as BrevoWebhookPayload

        // Log the event
        console.log('Brevo Webhook Received:', payload.event, payload.email)

        // Handle specific events
        switch (payload.event) {
            case 'unsubscribed':
            case 'hard_bounce':
            case 'spam':
                // Unsubscribe the user in our DB
                await unsubscribeSubscriber(payload.email)
                console.log(`Unsubscribed user ${payload.email} due to ${payload.event}`)
                break

            case 'delivered':
            case 'opened':
            case 'click':
                // Track engagement (optional - could add to analytics)
                // For now, we just log it or could update a "last_active" field if we had one
                break
        }

        // Track as analytics event
        await trackEvent({
            event_type: 'email_event', // Need to ensure schema supports this or generic string
            source: 'brevo_webhook',
            subscriber_email: payload.email,
            metadata: {
                event: payload.event,
                campaign_id: payload.campaign_id,
                subject: payload.subject
            }
        })

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
