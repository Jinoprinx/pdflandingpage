# Environment Configuration Template
# Copy this file to .env.local and fill in your actual values

# ============================================
# BREVO CONFIGURATION (Transactional + Marketing)
# ============================================
# Get your API key from: https://app.brevo.com/settings/keys/api
BREVO_API_KEY=your_brevo_api_key
# Ensure you have a sender authenticated in Brevo that matches
# the domain of your NEXT_PUBLIC_APP_URL, or configure a specific sender email.

# ============================================
# APPLICATION CONFIGURATION
# ============================================
# URL where your app is hosted (use http://localhost:3000 for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Your site/brand name
NEXT_PUBLIC_SITE_NAME=AI Mastery for Entrepreneurs

# ============================================
# DATABASE CONFIGURATION
# ============================================
# Currently using in-memory storage for development
# For production, use PostgreSQL: postgresql://user:password@host:5432/database
DATABASE_URL=file:./data/subscribers.db

# ============================================
# ANALYTICS (Optional)
# ============================================
# PostHog configuration (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# ============================================
# FEATURE FLAGS
# ============================================
ENABLE_AB_TESTING=false
ENABLE_EXIT_INTENT=true
ENABLE_ANALYTICS_TRACKING=true
