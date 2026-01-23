export interface Subscriber {
  id: number
  email: string
  name: string
  company?: string
  role?: string
  primary_interest?: string
  how_heard?: string
  pdf_choice: string
  source: string // 'main_form', 'exit_popup', 'footer', 'lead_magnet', etc.
  status: 'pending' | 'confirmed' | 'unsubscribed'
  confirmation_token: string
  preference_token: string
  confirmed_at?: string
  created_at: string
  updated_at: string
}

export type NewSubscriber = Omit<Subscriber, 'id' | 'created_at' | 'updated_at' | 'confirmed_at'>;

export interface EmailPreference {
  id: number
  subscriber_id: number
  topic_business_automation: boolean
  topic_ai_trends: boolean
  topic_ai_education: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  updated_at: string
}

export interface AnalyticsEvent {
  id: number
  event_type: string // 'form_view', 'form_submit', 'confirmation', 'conversion'
  source: string
  variant?: string // for A/B testing
  subscriber_email?: string
  metadata?: string // JSON string
  created_at: string
}

export interface ABTestVariant {
  id: number
  test_name: string
  variant_name: string
  views: number
  conversions: number
  created_at: string
  updated_at: string
}

export const CREATE_SUBSCRIBERS_TABLE = `
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    role TEXT,
    primary_interest TEXT,
    how_heard TEXT,
    pdf_choice TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    confirmation_token TEXT UNIQUE NOT NULL,
    preference_token TEXT UNIQUE NOT NULL,
    confirmed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`

export const CREATE_EMAIL_PREFERENCES_TABLE = `
  CREATE TABLE IF NOT EXISTS email_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER NOT NULL,
    topic_business_automation BOOLEAN DEFAULT 1,
    topic_ai_trends BOOLEAN DEFAULT 1,
    topic_ai_education BOOLEAN DEFAULT 1,
    frequency TEXT NOT NULL DEFAULT 'weekly',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers (id)
  )
`

export const CREATE_ANALYTICS_EVENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    variant TEXT,
    subscriber_email TEXT,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`

export const CREATE_AB_TEST_VARIANTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ab_test_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_name, variant_name)
  )
`
