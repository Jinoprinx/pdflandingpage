import { NextRequest, NextResponse } from 'next/server'
import {
    getSubscriberByConfirmationToken,
    confirmSubscriber,
    getPreferences,
    trackEvent,
} from '@/lib/db/queries'
import { sendWelcomeEmail, addContactToList } from '@/lib/email/brevo'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json({ error: 'Confirmation token is required' }, { status: 400 })
        }

        // Attempt to confirm the subscriber
        const confirmResult = confirmSubscriber(token)

        if (confirmResult.changes === 0) {
            // This could mean the token is invalid OR the subscriber is already confirmed.
            // For security and simplicity, we'll treat both as a generic "invalid token" error
            // to prevent leaking information about which tokens are valid.
            return NextResponse.json({ error: 'Invalid or expired confirmation token' }, { status: 404 })
        }

        // Confirmation was successful, now get the subscriber's details for follow-up actions
        const subscriber = getSubscriberByConfirmationToken(token)

        // This should always find a subscriber, but we check as a safeguard.
        if (!subscriber) {
            console.error('CRITICAL: Subscriber confirmed but could not be found with token:', token)
            return NextResponse.json({ error: 'An unexpected error occurred during confirmation.' }, { status: 500 })
        }

        // Get preferences
        const preferences = getPreferences(subscriber.id)

        // Add to Mailjet for marketing
        await addContactToList(subscriber.email, {
            name: subscriber.name,
            company: subscriber.company,
            role: subscriber.role,
            primary_interest: subscriber.primary_interest,
            source: subscriber.source,
            topic_business_automation: preferences?.topic_business_automation ?? true,
            topic_ai_trends: preferences?.topic_ai_trends ?? true,
            topic_ai_education: preferences?.topic_ai_education ?? true,
            frequency: preferences?.frequency ?? 'weekly',
        })

        // Send welcome email with download links via Mailgun
        await sendWelcomeEmail(
            subscriber.email,
            subscriber.name,
            subscriber.pdf_choice,
            subscriber.preference_token
        )

        // Track conversion
        trackEvent({
            event_type: 'conversion',
            source: subscriber.source,
            subscriber_email: subscriber.email,
            metadata: {
                pdf_choice: subscriber.pdf_choice,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Email confirmed successfully! Check your inbox for your playbooks.',
        })
    } catch (error) {
        console.error('Confirmation error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
