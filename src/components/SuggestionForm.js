'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/lib/emailConfig';

export default function SuggestionForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    blogUrl: '',
    submitterEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare email template parameters
      const templateParams = {
        company_name: formData.companyName,
        blog_url: formData.blogUrl,
        submitter_email: formData.submitterEmail || 'Not provided',
        submission_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        to_email: emailConfig.targetEmail
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      console.log('Email sent successfully:', response);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          companyName: '',
          blogUrl: '',
          submitterEmail: ''
        });
        setIsSuccess(false);
        onClose();
      }, 3000);
      
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      setIsSubmitting(false);
      setError('Failed to send suggestion. Please try again or contact us directly.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Suggest a Company</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Thank you!</h3>
              <p className="text-slate-600 mb-2">Your suggestion has been sent successfully!</p>
              <p className="text-slate-500 text-sm">We'll review it and add the company soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-3">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g., Acme Corp"
                  />
                </div>

                <div>
                  <label htmlFor="blogUrl" className="block text-sm font-semibold text-slate-700 mb-3">
                    Engineering Blog URL *
                  </label>
                  <input
                    type="url"
                    id="blogUrl"
                    name="blogUrl"
                    value={formData.blogUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="https://engineering.company.com"
                  />
                </div>

                <div>
                  <label htmlFor="submitterEmail" className="block text-sm font-semibold text-slate-700 mb-3">
                    Your Email (optional)
                  </label>
                  <input
                    type="email"
                    id="submitterEmail"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    We'll notify you when your suggestion is added
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 gradient-accent text-white rounded-xl hover:shadow-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    'Submit Suggestion'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 