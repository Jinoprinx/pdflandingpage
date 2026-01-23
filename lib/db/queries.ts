import { getDatabase } from './client';
import type { Subscriber, EmailPreference, AnalyticsEvent, NewSubscriber } from './schema';
import crypto from 'crypto';

const db = getDatabase();

export function addSubscriber(subscriber: Omit<NewSubscriber, 'id' | 'status' | 'confirmation_token' | 'preference_token' | 'created_at' | 'updated_at'> & { confirmationToken?: string }) {
    const confirmationToken = subscriber.confirmationToken || crypto.randomBytes(32).toString('hex');
    const preferenceToken = crypto.randomBytes(32).toString('hex');

    const stmt = db.prepare(`
        INSERT INTO subscribers (email, name, company, role, primary_interest, how_heard, pdf_choice, source, confirmation_token, preference_token)
        VALUES (@email, @name, @company, @role, @primary_interest, @how_heard, @pdf_choice, @source, @confirmation_token, @preference_token)
        RETURNING id
    `);

    try {
        // Ensure all required parameters for the SQL query are present, even if null
        const params = {
            email: subscriber.email,
            name: subscriber.name,
            company: subscriber.company ?? null,
            role: subscriber.role ?? null,
            primary_interest: subscriber.primary_interest ?? null,
            how_heard: subscriber.how_heard ?? null,
            pdf_choice: subscriber.pdf_choice,
            source: subscriber.source,
            confirmation_token: confirmationToken,
            preference_token: preferenceToken,
        };

        const result = stmt.get(params) as { id: number } | undefined;
        if (result) {
            return {
                id: result.id,
                confirmationToken,
                preferenceToken,
            };
        }
        return null;
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return null; // Subscriber already exists
        }
        throw error;
    }
}

export function updateSubscriber(email: string, data: Partial<Omit<Subscriber, 'id' | 'email'>>) {
    const fields = Object.keys(data);
    if (fields.length === 0) {
        return { changes: 0 };
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = Object.values(data);

    const stmt = db.prepare(`UPDATE subscribers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE email = ?`);
    const result = stmt.run(...values, email);
    return { changes: result.changes };
}


export function getSubscriberByEmail(email: string): Subscriber | null {
    const stmt = db.prepare('SELECT * FROM subscribers WHERE email = ?');
    const subscriber = stmt.get(email);
    return (subscriber as Subscriber) || null;
}

export function getSubscriberByConfirmationToken(token: string): Subscriber | null {
    const stmt = db.prepare('SELECT * FROM subscribers WHERE confirmation_token = ?');
    const subscriber = stmt.get(token);
    return (subscriber as Subscriber) || null;
}

export function getSubscriberByPreferenceToken(token: string): Subscriber | null {
    const stmt = db.prepare('SELECT * FROM subscribers WHERE preference_token = ?');
    const subscriber = stmt.get(token);
    return (subscriber as Subscriber) || null;
}

export function confirmSubscriber(token: string) {
    const stmt = db.prepare(`
        UPDATE subscribers
        SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE confirmation_token = ? AND status = 'pending'
    `);
    const result = stmt.run(token);
    return { changes: result.changes };
}


export function unsubscribeSubscriber(email: string) {
    const stmt = db.prepare(`
        UPDATE subscribers
        SET status = 'unsubscribed', updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
    `);
    const result = stmt.run(email);
    return { changes: result.changes };
}

export function createDefaultPreferences(subscriberId: number) {
    const stmt = db.prepare(`
        INSERT INTO email_preferences (subscriber_id)
        VALUES (?)
    `);
    const result = stmt.run(subscriberId);
    return { changes: result.changes };
}

export function getPreferences(subscriberId: number): EmailPreference | null {
    const stmt = db.prepare('SELECT * FROM email_preferences WHERE subscriber_id = ?');
    const preferences = stmt.get(subscriberId);
    return (preferences as EmailPreference) || null;
}

export function updatePreferences(
    subscriberId: number,
    preferences: {
        topic_business_automation?: boolean;
        topic_ai_trends?: boolean;
        topic_ai_education?: boolean;
        frequency?: string;
    }
) {
    const setClauses = Object.keys(preferences).map(key => `${key} = ?`).join(', ');
    const values = Object.values(preferences);

    if (values.length === 0) {
        return { changes: 0 };
    }

    const stmt = db.prepare(`
        UPDATE email_preferences
        SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
        WHERE subscriber_id = ?
    `);
    const result = stmt.run(...values, subscriberId);
    return { changes: result.changes };
}

export function trackEvent(event: {
    event_type: string;
    source: string;
    variant?: string;
    subscriber_email?: string;
    metadata?: Record<string, unknown>;
}) {
    const stmt = db.prepare(`
        INSERT INTO analytics_events (event_type, source, variant, subscriber_email, metadata)
        VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
        event.event_type,
        event.source,
        event.variant,
        event.subscriber_email,
        event.metadata ? JSON.stringify(event.metadata) : null
    );
    return { changes: result.changes };
}

export function getConversionStats() {
    const bySourceQuery = `
        SELECT
            source,
            COUNT(CASE WHEN event_type = 'form_view' THEN 1 END) as views,
            COUNT(CASE WHEN event_type = 'form_submit' THEN 1 END) as submissions,
            COUNT(CASE WHEN event_type = 'conversion' THEN 1 END) as conversions
        FROM analytics_events
        GROUP BY source
    `;
    const bySource = db.prepare(bySourceQuery).all();

    const totalSubscribersQuery = `SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'`;
    const totalSubscribers = (db.prepare(totalSubscribersQuery).get() as { count: number }).count;

    const subscribersBySourceQuery = `
        SELECT source, COUNT(*) as count
        FROM subscribers
        WHERE status = 'confirmed'
        GROUP BY source
    `;
    const subscribersBySource = db.prepare(subscribersBySourceQuery).all();

    return {
        bySource,
        totalSubscribers,
        subscribersBySource,
    };
}


export function getConfirmedSubscriberCount(): number {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'");
    const result = stmt.get() as { count: number } | undefined;
    return result ? result.count : 0;
}
