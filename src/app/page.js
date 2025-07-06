'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import AlphabetNav from '@/components/AlphabetNav';
import CompanyCard from '@/components/CompanyCard';
import SuggestionForm from '@/components/SuggestionForm';
import Pagination from '@/components/Pagination';
import { parseCompaniesFromText, groupCompaniesByLetter, searchCompanies } from '@/lib/parseCompanies';

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 20 companies per page

  // Load companies data
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/links.txt');
        const text = await response.text();
        const parsedCompanies = parseCompaniesFromText(text);
        setCompanies(parsedCompanies);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Memoized filtered companies based on search and letter filter
  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    
    // Apply search filter
    if (searchTerm) {
      filtered = searchCompanies(filtered, searchTerm);
    }
    
    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter(company => company.letter === selectedLetter);
    }
    
    return filtered;
  }, [companies, searchTerm, selectedLetter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  // Group companies by letter for navigation
  const groupedCompanies = useMemo(() => {
    return groupCompaniesByLetter(companies);
  }, [companies]);

  // Count companies per letter
  const companyCounts = useMemo(() => {
    const counts = {};
    Object.keys(groupedCompanies).forEach(letter => {
      counts[letter] = groupedCompanies[letter].length;
    });
    return counts;
  }, [groupedCompanies]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    if (term) {
      setSelectedLetter(null); // Clear letter filter when searching
    }
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm(''); // Clear search when selecting letter
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading engineering blogs...</p>
          <p className="text-slate-500 text-sm mt-2">Curating the best tech content for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Title Section */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Image
                src="/medium-logo.png"
                alt="Medium Logo"
                width={50}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-slate-800">
                <span className="font-md text-blue-500">Not</span>
                <span className="font-normal">Medium</span>
              </h1>
            </div>
            <p className="text-slate-600 text-lg font-medium mb-2">
              Discover engineering blogs from world's top companies
            </p>
            <div className="flex items-center justify-center gap-3 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{companies.length} companies</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>Updated regularly</span>
            </div>
          </div>
          
         
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

       {/* Search and Action Section */}
       <div className="flex flex-col lg:flex-row gap-6 items-center justify-between max-w-5xl mx-auto mb-6">
            <div className="flex-1 w-full lg:max-w-2xl">
              <SearchBar onSearch={handleSearch} />
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-3 hidden xl:flex lg:flex gradient-accent text-white rounded-xl hover:shadow-hover transition-all duration-300 font-semibold whitespace-nowrap group flex-shrink-0"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Suggest Company
              </span>
            </button>
          </div>
        {/* Alphabet Navigation */}
        {!searchTerm && (
          <div className="mb-12">
            <AlphabetNav
              selectedLetter={selectedLetter}
              onLetterSelect={handleLetterSelect}
              companyCounts={companyCounts}
            />
          </div>
        )}

        {/* Results Header */}
        <div className="mb-8">
          {searchTerm ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  Search results for "{searchTerm}"
                </h2>
                <p className="text-slate-500">{filteredCompanies.length} companies found</p>
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm bg-white rounded-lg border border-slate-300 hover:border-slate-400"
              >
                Clear search
              </button>
            </div>
          ) : selectedLetter ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                  Companies starting with "{selectedLetter}"
                </h2>
                <p className="text-slate-500">{filteredCompanies.length} companies</p>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm bg-white rounded-lg border border-slate-300 hover:border-slate-400"
              >
                Show all
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                All Companies
              </h2>
              <p className="text-slate-500">{filteredCompanies.length} engineering blogs to explore</p>
            </div>
          )}
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {paginatedCompanies.map((company, index) => (
                <CompanyCard key={`${company.name}-${index}`} company={company} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCompanies.length}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">No companies found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? `No companies match "${searchTerm}". Try a different search term or browse by category.`
                : selectedLetter
                ? `No companies found starting with "${selectedLetter}". Try selecting a different letter.`
                : 'No companies available at the moment.'
              }
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 gradient-accent text-white rounded-lg hover:shadow-hover transition-all duration-300 font-medium"
            >
              Suggest a Company
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-slate-600 mb-3 text-lg">
              Built with <span className="text-red-500">❤️</span> for the engineering community by Jitesh.
            </p>
            <p className="text-slate-500 text-sm">
              Found a broken link or want to add your company?{' '}
              <button
                onClick={() => setIsFormOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Let us know!
              </button>
            </p>
          </div>
        </div>
      </footer>

      {/* Suggestion Form Modal */}
      <SuggestionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
} 