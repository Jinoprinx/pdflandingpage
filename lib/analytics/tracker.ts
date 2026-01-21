export const Analytics = {
    trackEvent: async (event: {
        event_type: 'form_view' | 'form_submit' | 'conversion'
        source: string
        variant?: string
        subscriber_email?: string
        metadata?: Record<string, unknown>
    }) => {
        try {
            if (typeof window === 'undefined') return

            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            })
        } catch (error) {
            console.error('Analytics track error:', error)
        }
    },

    trackFormView: (source: string, variant?: string) => {
        Analytics.trackEvent({
            event_type: 'form_view',
            source,
            variant,
        })
    },

    trackFormSubmit: (source: string, email: string, variant?: string, metadata?: Record<string, unknown>) => {
        Analytics.trackEvent({
            event_type: 'form_submit',
            source,
            variant,
            subscriber_email: email,
            metadata,
        })
    },
}
