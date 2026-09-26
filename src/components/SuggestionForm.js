'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig } from '@/lib/emailConfig';
import { useOverlay } from '@/lib/useOverlay';
import { ArrowRight, XIcon } from './Icons';

const EMPTY = { companyName: '', blogUrl: '', submitterEmail: '' };

function Field({ id, label, hint, optional, ...props }) {
  return (
    <label htmlFor={id} className="group block">
      <span className="flex items-baseline justify-between">
        <span className="text-[13px] text-muted transition-colors group-focus-within:text-fg">{label}</span>
        {optional && <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Optional</span>}
      </span>
      <input
        id={id}
        name={id}
        {...props}
        className="mt-2 h-11 w-full rounded-xl border border-line bg-bg/60 px-3.5 text-[14.5px] text-fg placeholder:text-subtle transition-all duration-300 focus:border-subtle/80 focus:bg-bg focus:outline-none focus:ring-4 focus:ring-fg/[0.04]"
      />
      {hint && <span className="mt-2 block text-[12px] text-subtle">{hint}</span>}
    </label>
  );
}

export default function SuggestionForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useOverlay(isOpen, onClose);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams, emailConfig.publicKey);

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setFormData(EMPTY);
        setIsSuccess(false);
        onClose();
      }, 3200);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      setIsSubmitting(false);
      setError('That didn’t go through. Please try again in a moment.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="suggest-title">
      <div className="overlay-in absolute inset-0 bg-bg/60 backdrop-blur-md" onClick={onClose} />

      <div className="panel-in relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-3xl border border-line bg-elev shadow-float sm:rounded-3xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-subtle transition-colors hover:bg-line/60 hover:text-fg"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="px-8 py-16 text-center">
            <svg viewBox="0 0 52 52" className="mx-auto h-14 w-14 text-accent" aria-hidden>
              <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="151" strokeDashoffset="151" style={{ animation: 'draw 0.8s cubic-bezier(0.16,1,0.3,1) forwards' }} />
              <path d="M16 27l7 7 13-15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="36" strokeDashoffset="36" style={{ animation: 'draw 0.5s 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }} />
            </svg>
            <h3 className="mt-8 font-serif text-[34px] leading-none tracking-tight">
              Thank <span className="italic text-muted">you.</span>
            </h3>
            <p className="mx-auto mt-4 max-w-[18rem] text-[14px] leading-relaxed text-muted">
              Your suggestion is in. Every submission gets read by a human before it’s added.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-7 pb-7 pt-9 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Contribute</p>
            <h2 id="suggest-title" className="mt-3 font-serif text-[36px] leading-[1] tracking-[-0.015em]">
              Suggest a <span className="italic text-muted">blog.</span>
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              Know an engineering blog that deserves a spot? Or spotted a broken link? Tell us.
            </p>

            {error && (
              <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/[0.06] px-3.5 py-3 text-[13px] text-fg">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {error}
              </div>
            )}

            <div className="mt-8 space-y-5">
              <Field
                id="companyName"
                label="Company"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                autoComplete="organization"
                placeholder="Acme Inc."
              />
              <Field
                id="blogUrl"
                type="url"
                label="Engineering blog URL"
                value={formData.blogUrl}
                onChange={handleInputChange}
                required
                placeholder="https://engineering.acme.com"
              />
              <Field
                id="submitterEmail"
                type="email"
                label="Your email"
                optional
                value={formData.submitterEmail}
                onChange={handleInputChange}
                autoComplete="email"
                placeholder="you@domain.com"
                hint="We’ll let you know when it goes live."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-fg text-[14px] font-medium text-bg transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-bg/25 border-t-bg" />
                  Sending
                </>
              ) : (
                <>
                  Send suggestion
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
