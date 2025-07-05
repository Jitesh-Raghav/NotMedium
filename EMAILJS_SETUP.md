# EmailJS Setup Guide

This guide will help you set up EmailJS to receive emails when users submit company suggestions.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. Connect your Gmail account (`jitesh.raghav.viragvigyan@gmail.com`)
5. Copy the **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use this template content:

```
Subject: New Company Suggestion - {{company_name}}

Hello,

A new company has been suggested for the NotMedium directory:

Company Name: {{company_name}}
Blog URL: {{blog_url}}
Submitter Email: {{submitter_email}}
Submission Date: {{submission_date}}

Please review and consider adding this company to the directory.

Best regards,
NotMedium Auto-notification
```

4. Save the template and copy the **Template ID**

## Step 4: Get Your Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section

## Step 5: Configure the Application

Create a `.env.local` file in your project root with these values:

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
```

**OR** update the values directly in `src/lib/emailConfig.js`:

```javascript
export const emailConfig = {
  publicKey: 'your_actual_public_key',
  serviceId: 'your_actual_service_id', 
  templateId: 'your_actual_template_id',
  targetEmail: 'jitesh.raghav.viragvigyan@gmail.com'
};
```

## Step 6: Test the Setup

1. Restart your development server: `npm run dev`
2. Go to your website and click "Suggest Company"
3. Fill out the form and submit
4. Check your email (`jitesh.raghav.viragvigyan@gmail.com`) for the notification

## Template Variables Available

The following variables are automatically populated in your email template:

- `{{company_name}}` - The company name from the form
- `{{blog_url}}` - The blog URL from the form
- `{{submitter_email}}` - The submitter's email (optional)
- `{{submission_date}}` - Date and time of submission
- `{{to_email}}` - Your email address

## Troubleshooting

**Email not received?**
- Check your spam folder
- Verify your EmailJS service is connected properly
- Make sure the template ID and service ID are correct
- Check the browser console for any error messages

**Configuration issues?**
- Make sure all IDs are correct (no extra spaces)
- Restart the development server after changing environment variables
- Verify your Gmail account is properly connected to EmailJS

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- 2 email services
- 2 email templates

This should be more than enough for company suggestions on your website.

---

Need help? Check the [EmailJS documentation](https://www.emailjs.com/docs/) or contact support. 