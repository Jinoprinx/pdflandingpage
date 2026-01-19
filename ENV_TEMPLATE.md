# Environment Configuration Template
# Copy this file to .env.local and fill in your actual values

# ============================================
# MAILGUN CONFIGURATION (Transactional Emails)
# ============================================
# Get your API key from: https://app.mailgun.com/app/account/security/api_keys
MAILGUN_API_KEY=your_mailgun_api_key_here
# Your verified domain or sandbox domain
MAILGUN_DOMAIN=sandboxXXXX.mailgun.org
# Use 'us' for US region or 'eu' for EU region
MAILGUN_REGION=us

# ============================================
# MAILJET CONFIGURATION (Email Marketing)
# ============================================
# Get your API keys from: https://app.mailjet.com/account/api_keys
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here

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
