# AI Mastery Landing Page - Email Marketing System

This Next.js application is a comprehensive lead generation landing page with advanced email marketing features including double opt-in, segmentation, exit-intent popups, and preference management.

## 🚀 Features

### Email Collection
- **Double Opt-in**: GDPR/CAN-SPAM compliant email verification
- **Multiple Collection Points**: Main form, exit-intent popup, footer newsletter
- **Enhanced Data Collection**: Company, role, interests, and referral source
- **Social Proof**: Live subscriber count and testimonials

### Email Marketing
- **Transactional Emails** (Mailgun): Confirmation, welcome, preference updates
- **Marketing Campaigns** (Mailjet): Segmented contact lists and properties
- **Email Segmentation**: By interests, role, and engagement level
- **Preference Center**: User-controlled topic and frequency settings

### Analytics
- **Conversion Tracking**: Monitor performance by collection point
- **Source Attribution**: Track where subscribers come from
- **List Growth Monitoring**: Real-time subscriber counts

## 📋 Prerequisites

- Node.js 18+ and npm
- Mailgun account ([Sign up](https://www.mailgun.com/))
- Mailjet account ([Sign up](https://www.mailjet.com/))

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Mailgun Configuration (Transactional Emails)
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
MAILGUN_REGION=us
# Use 'eu' for EU region

# Mailjet Configuration (Email Marketing)
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Mastery for Entrepreneurs

# Feature Flags
ENABLE_EXIT_INTENT=true
ENABLE_ANALYTICS_TRACKING=true
```

### 3. Get Your API Keys

#### Mailgun Setup:
1. Sign up at [mailgun.com](https://www.mailgun.com/)
2. Verify your domain or use sandbox domain for testing
3. Get your API key from the dashboard
4. Configure DNS records (SPF, DKIM) for production

#### Mailjet Setup:
1. Sign up at [mailjet.com](https://www.mailjet.com/)
2. Go to Account Settings → API Keys
3. Create an API key pair
4. (Optional) Create contact lists in the Mailjet dashboard

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── subscribe/       # Initial subscription endpoint
│   │   ├── confirm/         # Email confirmation handler
│   │   ├── preferences/     # Preference management
│   │   ├── analytics/       # Analytics tracking
│   │   └── subscriber-count/ # Social proof counter
│   ├── confirm/             # Confirmation success page
│   ├── preferences/         # Email preference center
│   └── page.tsx             # Main landing page
├── components/
│   ├── email-capture-form.tsx    # Enhanced signup form
│   ├── exit-intent-popup.tsx     # Exit-intent modal
│   ├── newsletter-footer.tsx     # Footer newsletter
│   ├── social-proof-bar.tsx      # Stats and testimonials
│   └── ui/                       # UI components
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Database types
│   │   ├── client.ts        # Database client
│   │   └── queries.ts       # Database queries
│   └── email/
│       ├── mailgun.ts       # Transactional emails
│       └── mailjet.ts       # Marketing emails
└── .env.local               # Environment variables
```

## 🔑 Key Features Explained

### Double Opt-in Flow

1. User fills out form → stored as "pending" in database
2. Confirmation email sent via Mailgun
3. User clicks link → status changes to "confirmed"
4. Welcome email sent with playbook downloads
5. Contact added to Mailjet for marketing

### Email Segmentation

The system collects and segments by:
- **Interests**: Business Automation, AI Trends, AI Education
- **Role**: Founder, Entrepreneur, Developer, etc.
- **Source**: Main form, exit popup, footer, etc.

This data is synced to Mailjet contact properties for targeted campaigns.

### Exit-Intent Popup

- Triggers when mouse leaves viewport (heading to close tab)
- Shows only once per session (using sessionStorage)
- Smooth animations with Framer Motion
- Simplified 2-field form for quick conversion

### Analytics Tracking

Track events:
- `form_view`: When a form is displayed
- `form_submit`: When a form is submitted
- `conversion`: When email is confirmed

View stats at `/api/analytics`

## 🧪 Testing

### Test Double Opt-in Flow:

1. Fill out the main form on homepage
2. Check your email inbox for confirmation
3. Click the confirmation link
4. Verify redirect to success page
5. Check for welcome email with downloads

### Test Exit-Intent:

1. Load homepage
2. Move mouse toward browser address bar
3. Popup should appear
4. Dismiss and verify it doesn't show again

### Test Preferences:

1. Subscribe via any form
2. Check confirmation email for "Manage Preferences" link
3. Update topics and frequency
4. Verify changes saved

## 🚀 Production Deployment

Before deploying to production:

1. **Database**: Replace in-memory storage with PostgreSQL or better-sqlite3
2. **DNS Records**: Configure SPF, DKIM, CNAME for Mailgun domain
3. **Email Warmup**: Gradually increase sending volume if using new domain
4. **Environment Variables**: Set production URLs and API keys
5. **Testing**: Test email deliverability thoroughly

### Recommended Changes for Production:

```typescript
// lib/db/queries.ts - Replace with PostgreSQL
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

## 📊 Analytics Dashboard

Access conversion stats at:
```
GET /api/analytics
```

Returns:
- Conversion rates by source
- Total confirmed subscribers
- Subscribers by source

## 🛡️ Compliance

- **Double Opt-in**: Ensures explicit consent
- **Preference Center**: Easy unsubscribe and customization
- **Privacy**: No data shared with third parties
- **GDPR/CAN-SPAM**: Compliant email practices

## 📝 Customization

### Update Email Templates

Edit templates in `lib/email/mailgun.ts`:
- `sendConfirmationEmail()`: Confirmation email
- `sendWelcomeEmail()`: Welcome email with downloads
- `sendPreferenceUpdateEmail()`: Preference confirmation

### Modify Form Fields

Edit `components/email-capture-form.tsx` to add/remove fields.

### Change Social Proof Stats

Edit `components/social-proof-bar.tsx` to customize displayed metrics.

## 🆘 Troubleshooting

**Emails not sending:**
- Check API keys in `.env.local`
- Verify Mailgun domain is active
- Check spam folder
- Review Mailgun/Mailjet logs

**Database errors:**
- In-memory storage resets on server restart (expected)
- Consider PostgreSQL for persistence

**Exit popup not showing:**
- Clear browser sessionStorage
- Try in incognito mode

## 📚 Resources

- [Mailgun Documentation](https://documentation.mailgun.com/)
- [Mailjet Documentation](https://dev.mailjet.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Support

For issues or questions, check the implementation plan and task breakdown in the `.gemini` folder.

---

Built with ❤️ for entrepreneurs mastering AI
