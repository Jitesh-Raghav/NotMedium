// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Add an email service (Gmail recommended)
// 4. Create an email template
// 5. Get your Public Key, Service ID, and Template ID
// 6. Replace the values below

export const emailConfig = {
  // Replace with your EmailJS Public Key
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  
  // Replace with your EmailJS Service ID  
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  
  // Replace with your EmailJS Template ID
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  
  // Target email address
  targetEmail: 'jitesh.raghav.viragvigyan@gmail.com'
};

// Email template variables that will be sent:
// {{company_name}} - The company name from the form
// {{blog_url}} - The blog URL from the form  
// {{submitter_email}} - The submitter's email (optional)
// {{submission_date}} - Date when the form was submitted 