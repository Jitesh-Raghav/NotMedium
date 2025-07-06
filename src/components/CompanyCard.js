'use client';

import { useState } from 'react';

export default function CompanyCard({ company }) {
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);

  const handleLogoError = () => {
    setLogoError(true);
    setLogoLoading(false);
  };

  const handleLogoLoad = () => {
    setLogoLoading(false);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={() => openInNewTab(company.url)}
      className="glass-card rounded-2xl cursor-pointer hover:border-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-hover group"
    >
      <div className="p-6 flex flex-col items-center text-center h-full">
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          {logoLoading && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-xl"></div>
          )}
          <img
            src={logoError ? company.fallbackLogo : company.logo}
            alt={`${company.name} logo`}
            className={`w-16 h-16 object-contain rounded-xl transition-all duration-300 ${
              logoLoading ? 'opacity-0' : 'opacity-100'
            } group-hover:scale-110`}
            onError={handleLogoError}
            onLoad={handleLogoLoad}
          />
        </div>
        
        <h3 className="font-bold text-slate-800 text-base mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
          {company.name}
        </h3>
        
        <div className="text-sm text-slate-500 mb-4 truncate w-full font-medium">
          {new URL(company.url).hostname.replace('www.', '')}
        </div>
        
        <div className="mt-auto flex items-center justify-center text-sm text-blue-600 group-hover:text-blue-700 font-semibold transition-all duration-300">
          <span>Visit Blog</span>
          <svg 
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
} 