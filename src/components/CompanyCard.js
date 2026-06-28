'use client';

import { useState } from 'react';

export default function CompanyCard({ company }) {
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);

  const logoUrls = company.logoUrls || [];
  const currentLogo = logoUrls[logoIndex];

  const handleLogoError = () => {
    if (logoIndex < logoUrls.length - 1) {
      setLogoIndex((prev) => prev + 1);
      setLogoLoading(true);
      return;
    }

    setLogoFailed(true);
    setLogoLoading(false);
  };

  const handleLogoLoad = () => {
    setLogoLoading(false);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => openInNewTab(company.url)}
      className="glass-card group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-3 shadow-inner">
            {logoLoading && !logoFailed && (
              <div className="absolute inset-3 animate-pulse rounded-xl bg-slate-200" />
            )}

            {logoFailed || !currentLogo ? (
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-sm">
                {company.initial}
              </div>
            ) : (
              <img
                src={currentLogo}
                alt={`${company.name} logo`}
                className={`max-h-full max-w-full object-contain transition-all duration-300 ${
                  logoLoading ? 'opacity-0' : 'opacity-100'
                } group-hover:scale-105`}
                onError={handleLogoError}
                onLoad={handleLogoLoad}
              />
            )}
          </div>

          <span className="rounded-full border border-slate-200 bg-white/80 p-2 text-slate-400 transition-all duration-300 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </span>
        </div>

        <h3 className="mb-1 line-clamp-2 text-left text-base font-semibold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-indigo-700">
          {company.name}
        </h3>

        <p className="mb-3 truncate text-left text-sm text-slate-500">
          {new URL(company.url).hostname.replace('www.', '')}
        </p>

        {company.category && (
          <span className="mb-4 inline-flex max-w-full self-start truncate rounded-full border border-indigo-100 bg-indigo-50/80 px-2.5 py-1 text-xs font-medium text-indigo-700">
            {company.category}
          </span>
        )}

        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors duration-300 group-hover:text-indigo-700">
          <span>Read engineering blog</span>
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );
}
