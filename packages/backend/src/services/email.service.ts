/**
 * Email service for sending transactional emails
 */
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'

// Interface for email options
interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
  text?: string
  attachments?: any[]
}

// Create nodemailer transporter
const createTransporter = () => {
  // Use environment variables for email configuration
  const host = process.env.EMAIL_HOST || 'smtp.example.com'
  const port = parseInt(process.env.EMAIL_PORT || '587')
  const user = process.env.EMAIL_USER || 'user@example.com'
  const pass = process.env.EMAIL_PASS || 'password'
  const secure = process.env.EMAIL_SECURE === 'true'

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })
}

// Read and compile email template
const getTemplate = (templateName: string) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`)
  
  // Create directory structure if it doesn't exist
  const ensureDirectoryExists = (directory: string) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  }
  
  // Check if template exists, if not create a basic one
  if (!fs.existsSync(templatePath)) {
    const emailTemplatesDir = path.join(__dirname, '../templates/emails')
    ensureDirectoryExists(emailTemplatesDir)
    
    // Basic template for development
    const basicTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gemstone System Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4a90e2; color: white; 
                   text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Gemstone System</h1>
          </div>
          
          <div class="content">
            {{{body}}}
          </div>
          
          <div class="footer">
            <p>&copy; {{year}} Gemstone System. All rights reserved.</p>
            <p>This email was sent to {{email}}</p>
          </div>
        </div>
      </body>
      </html>
    `
    
    fs.writeFileSync(templatePath, basicTemplate)
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8')
  return Handlebars.compile(template)
}

/**
 * Send an email
 * @param options Email options
 */
const sendEmail = async (options: EmailOptions) => {
  if (process.env.NODE_ENV === 'test') {
    // Don't send emails in test environment
    console.log('Email would be sent:', options)
    return true
  }

  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || 'Gemstone System <noreply@gemstonesystem.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    }
    
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send verification email
 * @param email Recipient email
 * @param token Verification token
 */
const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`
    
    // Get the current year for the footer
    const currentYear = new Date().getFullYear()
    
    // Compile the verification email template
    const template = getTemplate('verification')
    const html = template({
      verificationUrl,
      email,
      year: currentYear,
      body: `
        <h2>Please Verify Your Email</h2>
        <p>Thank you for registering with Gemstone System. To complete your registration, please verify your email by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `
    })
    
    // Plain text version
    const text = `
      Please Verify Your Email
      
      Thank you for registering with Gemstone System. To complete your registration, please verify your email by copying and pasting this link into your browser:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
    `
    
    return await sendEmail({
      to: email,
      subject: 'Verify Your Email - Gemstone System',
      html,
      text,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

/**
 * Send password reset email
 * @param email Recipient email
 * @param token Reset token
 */
const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`
    
    // Get the current year for the footer
    const currentYear = new Date().getFullYear()
    
    // Compile the password reset email template
    const template = getTemplate('password-reset')
    const html = template({
      resetUrl,
      email,
      year: currentYear,
      body: `
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
      `
    })
    
    // Plain text version
    const text = `
      Reset Your Password
      
      We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
      
      To reset your password, copy and paste this link into your browser:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
    `
    
    return await sendEmail({
      to: email,
      subject: 'Reset Your Password - Gemstone System',
      html,
      text,
    })
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

/**
 * Send welcome email after verification
 * @param email Recipient email
 * @param name User's name
 */
const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    
    // Get the current year for the footer
    const currentYear = new Date().getFullYear()
    
    // Compile the welcome email template
    const template = getTemplate('welcome')
    const html = template({
      name,
      dashboardUrl: `${frontendUrl}/dashboard`,
      email,
      year: currentYear,
      body: `
        <h2>Welcome to Gemstone System, ${name}!</h2>
        <p>Thank you for verifying your email address. Your account is now active and you can start using all the features of Gemstone System.</p>
        <p>Here are some things you can do to get started:</p>
        <ul>
          <li>Explore gemstone collections</li>
          <li>View marketplace listings</li>
          <li>Set up your profile</li>
        </ul>
        <p style="text-align: center;">
          <a href="${frontendUrl}/dashboard" class="button">Go to Dashboard</a>
        </p>
      `
    })
    
    // Plain text version
    const text = `
      Welcome to Gemstone System, ${name}!
      
      Thank you for verifying your email address. Your account is now active and you can start using all the features of Gemstone System.
      
      Here are some things you can do to get started:
      - Explore gemstone collections
      - View marketplace listings
      - Set up your profile
      
      Go to Dashboard: ${frontendUrl}/dashboard
    `
    
    return await sendEmail({
      to: email,
      subject: 'Welcome to Gemstone System!',
      html,
      text,
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}

// Export the email service functions
export const emailService = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
}
