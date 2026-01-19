import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)

// Lazy load the client to prevent build-time errors if API keys are missing
const getMgClient = () => {
  const apiKey = process.env.MAILGUN_API_KEY || 'dummy_key_for_build'
  return mailgun.client({
    username: 'api',
    key: apiKey,
    url: process.env.MAILGUN_REGION === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net',
  })
}

const domain = process.env.MAILGUN_DOMAIN || ''
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'AI Mastery for Entrepreneurs'

export async function sendConfirmationEmail(
  to: string,
  name: string,
  confirmationToken: string
) {
  const confirmationUrl = `${appUrl}/confirm?token=${confirmationToken}`

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
        <p>Thanks for signing up for ${siteName}! We're excited to have you join our community of entrepreneurs mastering AI.</p>
        <p>To complete your subscription and receive your free AI playbooks, please confirm your email address by clicking the button below:</p>
        <div style="text-align: center;">
          <a href="${confirmationUrl}" class="button">Confirm Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <div class="footer">
          <p>If you didn't sign up for ${siteName}, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Hi ${name},

Thanks for signing up for ${siteName}! We're excited to have you join our community of entrepreneurs mastering AI.

To complete your subscription and receive your free AI playbooks, please confirm your email address by clicking this link:

${confirmationUrl}

This link will expire in 24 hours.

If you didn't sign up for ${siteName}, you can safely ignore this email.

© ${new Date().getFullYear()} ${siteName}. All rights reserved.
  `

  try {
    const result = await getMgClient().messages.create(domain, {
      from: `${siteName} <noreply@${domain}>`,
      to: [to],
      subject: `Please confirm your email address`,
      text: textContent,
      html: htmlContent,
    })
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error('Mailgun error:', error)
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
        <p>Your email is confirmed! Thank you for joining our community of forward-thinking entrepreneurs.</p>
        <p><strong>Here are your free AI playbooks:</strong></p>
        <div class="pdf-list">
          ${selectedPdfs.map(pdf => `<p>📄 <strong>${pdf}</strong></p>`).join('')}
          <div style="text-align: center; margin-top: 20px;">
            <a href="${appUrl}/downloads" class="button">Download Your Playbooks</a>
          </div>
        </div>
        <h3>What's Next?</h3>
        <ul>
          <li>Check your inbox weekly for actionable AI insights</li>
          <li>Get exclusive tips on automating your business</li>
          <li>Join our community of 1,000+ entrepreneurs</li>
        </ul>
        <p>Want to customize what you receive? <a href="${preferencesUrl}">Manage your email preferences</a></p>
        <div class="footer">
          <p>Questions? Just reply to this email - we read every message!</p>
          <p><a href="${preferencesUrl}">Manage Preferences</a> | <a href="${appUrl}">Visit Our Website</a></p>
          <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Hi ${name},

Your email is confirmed! Thank you for joining our community of forward-thinking entrepreneurs.

Here are your free AI playbooks:
${selectedPdfs.map(pdf => `- ${pdf}`).join('\n')}

Download them here: ${appUrl}/downloads

What's Next?
- Check your inbox weekly for actionable AI insights
- Get exclusive tips on automating your business
- Join our community of 1,000+ entrepreneurs

Want to customize what you receive? Manage your preferences: ${preferencesUrl}

Questions? Just reply to this email - we read every message!

© ${new Date().getFullYear()} ${siteName}. All rights reserved.
  `

  try {
    const result = await getMgClient().messages.create(domain, {
      from: `${siteName} <noreply@${domain}>`,
      to: [to],
      subject: `🎉 Your AI Playbooks Are Ready!`,
      text: textContent,
      html: htmlContent,
    })
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error('Mailgun error:', error)
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
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Email Preferences Updated</h2>
        </div>
        <p>Hi ${name},</p>
        <p>Your email preferences have been successfully updated. You'll start receiving emails based on your new preferences.</p>
        <p>Thanks for being part of our community!</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const result = await getMgClient().messages.create(domain, {
      from: `${siteName} <noreply@${domain}>`,
      to: [to],
      subject: `Email Preferences Updated`,
      html: htmlContent,
    })
    return { success: true, messageId: result.id }
  } catch (error) {
    console.error('Mailgun error:', error)
    return { success: false, error }
  }
}
