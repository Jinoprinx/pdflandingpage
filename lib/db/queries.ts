// Simple in-memory database for development
// Replace with better-sqlite3 or PostgreSQL for production

import type { Subscriber, EmailPreference, AnalyticsEvent } from './schema'
import crypto from 'crypto'

// In-memory storage
const subscribers: Map<string, Subscriber> = new Map()
const emailPreferences: Map<number, EmailPreference> = new Map()
const analyticsEvents: AnalyticsEvent[] = []
let nextId = 1

export function createSubscriber(data: {
    email: string
    name: string
    company?: string
    role?: string
    primary_interest?: string
    how_heard?: string
    pdf_choice: string
    source: string
}) {
    const confirmationToken = crypto.randomBytes(32).toString('hex')
    const preferenceToken = crypto.randomBytes(32).toString('hex')
    const now = new Date().toISOString()

    const subscriber: Subscriber = {
        id: nextId++,
        email: data.email,
        name: data.name,
        company: data.company,
        role: data.role,
        primary_interest: data.primary_interest,
        how_heard: data.how_heard,
        pdf_choice: data.pdf_choice,
        source: data.source,
        status: 'pending',
        confirmation_token: confirmationToken,
        preference_token: preferenceToken,
        created_at: now,
        updated_at: now,
    }

    subscribers.set(data.email, subscriber)

    return {
        id: subscriber.id,
        confirmationToken,
        preferenceToken,
    }
}

export function getSubscriberByEmail(email: string): Subscriber | null {
    return subscribers.get(email) || null
}

export function getSubscriberByConfirmationToken(token: string): Subscriber | null {
    for (const sub of subscribers.values()) {
        if (sub.confirmation_token === token) return sub
    }
    return null
}

export function getSubscriberByPreferenceToken(token: string): Subscriber | null {
    for (const sub of subscribers.values()) {
        if (sub.preference_token === token) return sub
    }
    return null
}

export function confirmSubscriber(token: string) {
    const subscriber = getSubscriberByConfirmationToken(token)
    if (subscriber) {
        subscriber.status = 'confirmed'
        subscriber.confirmed_at = new Date().toISOString()
        subscriber.updated_at = new Date().toISOString()
        subscribers.set(subscriber.email, subscriber)
        return { changes: 1 }
    }
    return { changes: 0 }
}

export function unsubscribeSubscriber(email: string) {
    const subscriber = subscribers.get(email)
    if (subscriber) {
        subscriber.status = 'unsubscribed'
        subscriber.updated_at = new Date().toISOString()
        subscribers.set(email, subscriber)
        return { changes: 1 }
    }
    return { changes: 0 }
}

export function createDefaultPreferences(subscriberId: number) {
    const preference: EmailPreference = {
        id: subscriberId,
        subscriber_id: subscriberId,
        topic_business_automation: true,
        topic_ai_trends: true,
        topic_ai_education: true,
        frequency: 'weekly',
        updated_at: new Date().toISOString(),
    }
    emailPreferences.set(subscriberId, preference)
    return { changes: 1 }
}

export function getPreferences(subscriberId: number): EmailPreference | null {
    return emailPreferences.get(subscriberId) || null
}

export function updatePreferences(
    subscriberId: number,
    preferences: {
        topic_business_automation?: boolean
        topic_ai_trends?: boolean
        topic_ai_education?: boolean
        frequency?: string
    }
) {
    const existing = emailPreferences.get(subscriberId)
    if (!existing) return { changes: 0 }

    if (preferences.topic_business_automation !== undefined) {
        existing.topic_business_automation = preferences.topic_business_automation
    }
    if (preferences.topic_ai_trends !== undefined) {
        existing.topic_ai_trends = preferences.topic_ai_trends
    }
    if (preferences.topic_ai_education !== undefined) {
        existing.topic_ai_education = preferences.topic_ai_education
    }
    if (preferences.frequency) {
        existing.frequency = preferences.frequency as 'daily' | 'weekly' | 'monthly'
    }

    existing.updated_at = new Date().toISOString()
    emailPreferences.set(subscriberId, existing)
    return { changes: 1 }
}

export function trackEvent(event: {
    event_type: string
    source: string
    variant?: string
    subscriber_email?: string
    metadata?: Record<string, any>
}) {
    const analyticsEvent: AnalyticsEvent = {
        id: analyticsEvents.length + 1,
        event_type: event.event_type,
        source: event.source,
        variant: event.variant,
        subscriber_email: event.subscriber_email,
        metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
        created_at: new Date().toISOString(),
    }

    analyticsEvents.push(analyticsEvent)
    return { changes: 1 }
}

export function getConversionStats() {
    const sourceStats = new Map<string, { views: number; submissions: number; conversions: number }>()

    for (const event of analyticsEvents) {
        if (!sourceStats.has(event.source)) {
            sourceStats.set(event.source, { views: 0, submissions: 0, conversions: 0 })
        }
        const stats = sourceStats.get(event.source)!

        if (event.event_type === 'form_view') stats.views++
        if (event.event_type === 'form_submit') stats.submissions++
        if (event.event_type === 'conversion') stats.conversions++
    }

    const bySource = Array.from(sourceStats.entries()).map(([source, stats]) => ({
        source,
        ...stats,
    }))

    const confirmedSubscribers = Array.from(subscribers.values()).filter(
        (s) => s.status === 'confirmed'
    )

    const subscribersBySource = new Map<string, number>()
    for (const sub of confirmedSubscribers) {
        subscribersBySource.set(sub.source, (subscribersBySource.get(sub.source) || 0) + 1)
    }

    return {
        bySource,
        totalSubscribers: confirmedSubscribers.length,
        subscribersBySource: Array.from(subscribersBySource.entries()).map(([source, count]) => ({
            source,
            count,
        })),
    }
}

export function getConfirmedSubscriberCount(): number {
    return Array.from(subscribers.values()).filter((s) => s.status === 'confirmed').length
}
