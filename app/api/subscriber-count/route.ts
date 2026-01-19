import { NextResponse } from 'next/server'
import { getConfirmedSubscriberCount } from '@/lib/db/queries'

export async function GET() {
    try {
        const count = getConfirmedSubscriberCount()

        return NextResponse.json({
            success: true,
            count,
            // Add some visual appeal by rounding to nearest 50 or 100 if desired
            displayCount: count > 100 ? Math.floor(count / 50) * 50 : count,
        })
    } catch (error) {
        console.error('Get subscriber count error:', error)
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        )
    }
}
