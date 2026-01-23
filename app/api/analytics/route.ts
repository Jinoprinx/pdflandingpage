import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, getConversionStats } from '@/lib/db/queries'
import { z } from 'zod'

const trackEventSchema = z.object({
    event_type: z.enum(['form_view', 'form_submit', 'conversion']),
    source: z.string(),
    variant: z.string().optional(),
    subscriber_email: z.string().email().optional(),
    metadata: z.record(z.any()).optional(),
})

// Track analytics event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = trackEventSchema.parse(body)

        await trackEvent(validatedData)

        return NextResponse.json({ success: true })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Track event error:', error)
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        )
    }
}

// Get conversion statistics
export async function GET() {
    try {
        const stats = await getConversionStats()
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Get stats error:', error)
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        )
    }
}
