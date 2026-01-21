import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
    getSubscriberByPreferenceToken,
    getPreferences,
    updatePreferences,
    unsubscribeSubscriber,
} from '@/lib/db/queries'
import { updateContactProperties, removeContactFromList, sendPreferenceUpdateEmail } from '@/lib/email/brevo'

const preferencesSchema = z.object({
    topic_business_automation: z.boolean().optional(),
    topic_ai_trends: z.boolean().optional(),
    topic_ai_education: z.boolean().optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    unsubscribe: z.boolean().optional(),
})

// GET preferences
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        const subscriber = getSubscriberByPreferenceToken(token)

        if (!subscriber) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }

        const prefs = getPreferences(subscriber.id)

        return NextResponse.json({
            success: true,
            subscriber: {
                email: subscriber.email,
                name: subscriber.name,
                status: subscriber.status,
            },
            preferences: prefs || {
                topic_business_automation: true,
                topic_ai_trends: true,
                topic_ai_education: true,
                frequency: 'weekly',
            },
        })
    } catch (error) {
        console.error('Get preferences error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}

// POST/UPDATE preferences
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, ...preferences } = body

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 })
        }

        const validatedPrefs = preferencesSchema.parse(preferences)
        const subscriber = getSubscriberByPreferenceToken(token)

        if (!subscriber) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }

        // Handle unsubscribe
        if (validatedPrefs.unsubscribe) {
            unsubscribeSubscriber(subscriber.email)
            await removeContactFromList(subscriber.email)
            return NextResponse.json({
                success: true,
                message: 'You have been unsubscribed successfully.',
            })
        }

        // Update preferences in database
        updatePreferences(subscriber.id, validatedPrefs)

        // Update Mailjet contact properties
        await updateContactProperties(subscriber.email, {
            topic_business_automation: validatedPrefs.topic_business_automation,
            topic_ai_trends: validatedPrefs.topic_ai_trends,
            topic_ai_education: validatedPrefs.topic_ai_education,
            frequency: validatedPrefs.frequency,
        })

        // Send confirmation email
        await sendPreferenceUpdateEmail(subscriber.email, subscriber.name)

        return NextResponse.json({
            success: true,
            message: 'Your preferences have been updated successfully.',
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Update preferences error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
