'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/lib/emailConfig';

export default function SuggestionForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    blogUrl: '',
    submitterEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const templateParams = {
        company_name: formData.companyName,
        blog_url: formData.blogUrl,
        submitter_email: formData.submitterEmail || 'Not provided',
        submission_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        to_email: emailConfig.targetEmail,
      };

      const response = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      console.log('Email sent successfully:', response);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setFormData({
          companyName: '',
          blogUrl: '',
          submitterEmail: '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-slate-200/80 px-8 pb-6 pt-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Contribute</p>
              <h2 className="font-display text-2xl font-bold text-slate-900">Suggest a company</h2>
              <p className="mt-1 text-sm text-slate-500">Help us grow the directory with your favorite engineering blog.</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 py-8">
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
                <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Thank you!</h3>
              <p className="mt-2 text-slate-600">Your suggestion was sent successfully.</p>
              <p className="mt-1 text-sm text-slate-500">We&apos;ll review it and add the company soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="companyName" className="mb-2 block text-sm font-semibold text-slate-700">
                    Company name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="e.g., Acme Corp"
                  />
                </div>

                <div>
                  <label htmlFor="blogUrl" className="mb-2 block text-sm font-semibold text-slate-700">
                    Engineering blog URL *
                  </label>
                  <input
                    type="url"
                    id="blogUrl"
                    name="blogUrl"
                    value={formData.blogUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="https://engineering.company.com"
                  />
                </div>

                <div>
                  <label htmlFor="submitterEmail" className="mb-2 block text-sm font-semibold text-slate-700">
                    Your email (optional)
                  </label>
                  <input
                    type="email"
                    id="submitterEmail"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 transition-all focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="your@email.com"
                  />
                  <p className="mt-2 text-xs text-slate-500">We&apos;ll notify you when your suggestion is added.</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl px-5 py-3 font-semibold text-white gradient-accent shadow-hover transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </span>
                  ) : (
                    'Submit suggestion'
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
