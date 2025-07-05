'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search companies..." }) {
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
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pl-14 pr-12 text-slate-800 placeholder-slate-500 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-lg shadow-modern hover:shadow-hover group-hover:border-slate-400"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-5">
          <svg
            className={`w-6 h-6 transition-colors duration-300 ${
              searchTerm ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'
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
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors duration-200 group"
          >
            <div className="p-1 rounded-full hover:bg-slate-100 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </button>
        )}
      </div>
      
      {/* Search hint */}
      {/* <div className="absolute top-full mt-2 left-0 right-0 py-3">
        <p className="text-slate-500 text-sm text-center">
          Try searching for "Google", "Netflix", "Meta" or any company name
        </p>
      </div> */}
    </div>
  );
} 