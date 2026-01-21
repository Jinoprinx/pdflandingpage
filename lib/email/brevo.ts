import * as Brevo from '@getbrevo/brevo'

// Transactional Email API instance
const getTransactionalApi = () => {
  const apiInstance = new Brevo.TransactionalEmailsApi()
  apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || 'dummy_key_for_build')
  return apiInstance
}

// Contacts API instance
const getContactsApi = () => {
  const apiInstance = new Brevo.ContactsApi()
  apiInstance.setApiKey(Brevo.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY || 'dummy_key_for_build')
  return apiInstance
}

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AI Mastery for Entrepreneurs'
const sender = {
  email: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com',
  name: siteName
}

interface ContactProperties {
  name: string
  company?: string
  role?: string
  primary_interest?: string
  source: string
  topic_business_automation?: boolean
  topic_ai_trends?: boolean
  topic_ai_education?: boolean
  frequency?: string
}

// --- Transactional Emails ---

export async function sendConfirmationEmail(
  to: string,
  name: string,
  confirmationToken: string
) {
  const confirmationUrl = `${appUrl}/confirm?token=${confirmationToken}`

  // HTML content (adapted from previous template)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; }
        .button { display: inline-block; padding: 15px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Confirm Your Email Address</h1>
        </div>
        <p>Hi ${name},</p>
        <p>Thanks for signing up for ${siteName}! We're excited to have you join our community.</p>
        <p>To complete your subscription and receive your free AI playbooks, please confirm your email address:</p>
        <div style="text-align: center;">
          <a href="${confirmationUrl}" class="button">Confirm Email Address</a>
        </div>
        <p>Or copy this link: ${confirmationUrl}</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `

  const sendSmtpEmail = new Brevo.SendSmtpEmail()
  sendSmtpEmail.subject = "Please confirm your email address"
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = sender
  sendSmtpEmail.to = [{ email: to, name: name }]

  try {
    const result = await getTransactionalApi().sendTransacEmail(sendSmtpEmail)
    return { success: true, messageId: result.body.messageId }
  } catch (error) {
    console.error('Brevo error:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  pdfChoice: string,
  preferenceToken: string
) {
  const preferencesUrl = `${appUrl}/preferences?token=${preferenceToken}`
  const downloadUrl = `${appUrl}/downloads`

  const pdfLinks = {
    all: ['Business Automation Playbook', 'AI Trends Report 2024', 'AI Education Guide'],
    business: ['Business Automation Playbook'],
    trends: ['AI Trends Report 2024'],
    education: ['AI Education Guide'],
  }
  const selectedPdfs = pdfLinks[pdfChoice as keyof typeof pdfLinks] || pdfLinks.all

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; }
        .button { display: inline-block; padding: 15px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
        .pdf-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to ${siteName}!</h1>
        </div>
        <p>Hi ${name},</p>
        <p>Your email is confirmed! Here are your free AI playbooks:</p>
        <div class="pdf-list">
          ${selectedPdfs.map(pdf => `<p>📄 <strong>${pdf}</strong></p>`).join('')}
          <div style="text-align: center; margin-top: 20px;">
            <a href="${downloadUrl}" class="button">Download Your Playbooks</a>
          </div>
        </div>
        <div class="footer">
          <p><a href="${preferencesUrl}">Manage Preferences</a> | <a href="${appUrl}">Visit Our Website</a></p>
          <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `

  const sendSmtpEmail = new Brevo.SendSmtpEmail()
  sendSmtpEmail.subject = "🎉 Your AI Playbooks Are Ready!"
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = sender
  sendSmtpEmail.to = [{ email: to, name: name }]

  try {
    const result = await getTransactionalApi().sendTransacEmail(sendSmtpEmail)
    return { success: true, messageId: result.body.messageId }
  } catch (error) {
    console.error('Brevo error:', error)
    return { success: false, error }
  }
}

export async function sendPreferenceUpdateEmail(
  to: string,
  name: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <body>
      <h2>✅ Email Preferences Updated</h2>
      <p>Hi ${name},</p>
      <p>Your email preferences have been successfully updated.</p>
      <p>Thanks for being part of our community!</p>
    </body>
    </html>
    `

  const sendSmtpEmail = new Brevo.SendSmtpEmail()
  sendSmtpEmail.subject = "Email Preferences Updated"
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.sender = sender
  sendSmtpEmail.to = [{ email: to, name: name }]

  try {
    const result = await getTransactionalApi().sendTransacEmail(sendSmtpEmail)
    return { success: true, messageId: result.body.messageId }
  } catch (error) {
    console.error('Brevo error:', error)
    return { success: false, error }
  }
}

// --- Contacts / Marketing ---

export async function addContactToList(
  email: string,
  properties: ContactProperties
) {
  const createContact = new Brevo.CreateContact()
  createContact.email = email

  // Map properties to Brevo attributes (Need to be defined in Brevo dashboard as UPPERCASE usually)
  createContact.attributes = {
    NAME: properties.name,
    COMPANY: properties.company,
    ROLE: properties.role,
    PRIMARY_INTEREST: properties.primary_interest,
    SOURCE: properties.source,
    TOPIC_BUSINESS: properties.topic_business_automation,
    TOPIC_TRENDS: properties.topic_ai_trends,
    TOPIC_EDUCATION: properties.topic_ai_education,
    FREQUENCY: properties.frequency
  }

  createContact.updateEnabled = true // Update if exists

  try {
    const result = await getContactsApi().createContact(createContact)
    return { success: true, id: result.body.id }
  } catch (error) {
    console.error('Brevo contacts error:', error)
    return { success: false, error }
  }
}

export async function updateContactProperties(
  email: string,
  properties: Partial<ContactProperties>
) {
  const updateContact = new Brevo.UpdateContact()

  // Map properties to Brevo attributes
  const attributes: { [key: string]: unknown } = {}

  if (properties.name) attributes.NAME = properties.name
  if (properties.company) attributes.COMPANY = properties.company
  if (properties.role) attributes.ROLE = properties.role
  if (properties.primary_interest) attributes.PRIMARY_INTEREST = properties.primary_interest
  if (properties.source) attributes.SOURCE = properties.source
  if (properties.topic_business_automation !== undefined) attributes.TOPIC_BUSINESS = properties.topic_business_automation
  if (properties.topic_ai_trends !== undefined) attributes.TOPIC_TRENDS = properties.topic_ai_trends
  if (properties.topic_ai_education !== undefined) attributes.TOPIC_EDUCATION = properties.topic_ai_education
  if (properties.frequency) attributes.FREQUENCY = properties.frequency

  updateContact.attributes = attributes

  try {
    await getContactsApi().updateContact(email, updateContact)
    return { success: true }
  } catch (error) {
    console.error('Brevo contacts error:', error)
    return { success: false, error }
  }
}

export async function removeContactFromList(email: string) {
  const updateContact = new Brevo.UpdateContact()
  updateContact.emailBlacklisted = true // Unsubscribe from campaigns

  try {
    await getContactsApi().updateContact(email, updateContact)
    return { success: true }
  } catch (error) {
    console.error('Brevo contacts error:', error)
    return { success: false, error }
  }
}

export function determineContactLists(primaryInterest?: string): number[] {
  // In Brevo, lists are identified by ID (integer). 
  // You should create these lists in Brevo and map them here.
  // For now returning empty or a placeholder logic since IDs are unknown.
  // TODO: Update these IDs with actual Brevo List IDs
  const lists: number[] = [] // e.g. [2] for a main list

  return lists
}
