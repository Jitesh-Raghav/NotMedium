'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search companies, categories, or domains...' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-sky-500/10 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="relative w-full rounded-2xl border border-slate-200/80 bg-white/95 py-4 pl-14 pr-12 text-base text-slate-800 shadow-card placeholder:text-slate-400 transition-all duration-300 focus:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        />

        <div className="absolute inset-y-0 left-0 flex items-center pl-5">
          <svg
            className={`h-5 w-5 transition-colors duration-300 ${
              searchTerm ? 'text-indigo-500' : 'text-slate-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors duration-200 hover:text-slate-700"
            aria-label="Clear search"
          >
            <span className="rounded-full p-1.5 transition-colors hover:bg-slate-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
