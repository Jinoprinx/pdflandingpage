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

        // Find subscriber by token
        const subscriber = getSubscriberByConfirmationToken(token)

        if (!subscriber) {
            return NextResponse.json({ error: 'Invalid or expired confirmation token' }, { status: 404 })
        }

        if (subscriber.status === 'confirmed') {
            return NextResponse.json({
                success: true,
                message: 'Email already confirmed',
                alreadyConfirmed: true,
            })
        }

        // Confirm the subscriber
        confirmSubscriber(token)

        // Get preferences for Mailjet
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
