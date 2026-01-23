import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
    addSubscriber,
    getSubscriberByEmail,
    createDefaultPreferences,
    trackEvent,
    updateSubscriber,
} from '@/lib/db/queries'
import { sendConfirmationEmail } from '@/lib/email/brevo'

const subscribeSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    name: z.string().min(2, 'Please enter your name'),
    company: z.string().optional(),
    role: z.string().optional(),
    primary_interest: z.string().optional(),
    how_heard: z.string().optional(),
    pdf_choice: z.string().min(1, 'Please select which PDF you want'),
    source: z.string().default('main_form'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = subscribeSchema.parse(body)

        // Check if email already exists
        const existing = await getSubscriberByEmail(validatedData.email)
        if (existing) {
            if (existing.status === 'confirmed') {
                return NextResponse.json(
                    { error: 'This email is already subscribed' },
                    { status: 400 }
                )
            }
            if (existing.status === 'pending') {
                // User exists but is not confirmed. Update their data and resend confirmation.
                await updateSubscriber(existing.email, {
                    name: validatedData.name,
                    company: validatedData.company,
                    role: validatedData.role,
                    primary_interest: validatedData.primary_interest,
                    how_heard: validatedData.how_heard,
                    pdf_choice: validatedData.pdf_choice,
                    source: validatedData.source,
                });

                await sendConfirmationEmail(
                    existing.email,
                    validatedData.name, // Use the new name
                    existing.confirmation_token
                )
                return NextResponse.json({
                    success: true,
                    message: 'Confirmation email resent. Please check your inbox.',
                })
            }
        }

        // Create subscriber
        const result = await addSubscriber(validatedData)

        if (!result) {
            return NextResponse.json(
                { error: 'This email is already subscribed' },
                { status: 400 }
            )
        }

        // Create default email preferences
        await createDefaultPreferences(result.id as number)

        // Send confirmation email via Mailgun
        const emailResult = await sendConfirmationEmail(
            validatedData.email,
            validatedData.name,
            result.confirmationToken
        )

        if (!emailResult.success) {
            console.error('Failed to send confirmation email:', emailResult.error)
            return NextResponse.json(
                { error: 'Failed to send confirmation email. Please try again.' },
                { status: 500 }
            )
        }

        // Track analytics event
        await trackEvent({
            event_type: 'form_submit',
            source: validatedData.source,
            subscriber_email: validatedData.email,
            metadata: {
                pdf_choice: validatedData.pdf_choice,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Please check your email to confirm your subscription.',
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Subscribe error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
