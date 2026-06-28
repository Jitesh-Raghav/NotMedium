'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import AlphabetNav from '@/components/AlphabetNav';
import CompanyCard from '@/components/CompanyCard';
import SuggestionForm from '@/components/SuggestionForm';
import Pagination from '@/components/Pagination';
import CategoryFilter from '@/components/CategoryFilter';
import { parseCompaniesFromText, groupCompaniesByLetter, searchCompanies, getCompanyCategories } from '@/lib/parseCompanies';

function ResultsHeader({ searchTerm, selectedCategory, selectedLetter, filteredCount, onClearSearch, onClearCategory, onClearLetter }) {
  if (searchTerm) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Search</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Results for &quot;{searchTerm}&quot;
          </h2>
          <p className="mt-1 text-slate-500">{filteredCount} companies found</p>
        </div>
        <button
          onClick={onClearSearch}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Clear search
        </button>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Category</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">{selectedCategory}</h2>
          <p className="mt-1 text-slate-500">{filteredCount} companies in this category</p>
        </div>
        <button
          onClick={onClearCategory}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Show all
        </button>
      </div>
    );
  }

  if (selectedLetter) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Alphabet</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Starting with &quot;{selectedLetter}&quot;
          </h2>
          <p className="mt-1 text-slate-500">{filteredCount} companies found</p>
        </div>
        <button
          onClick={onClearLetter}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Show all
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Directory</p>
      <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">All engineering blogs</h2>
      <p className="mt-2 text-slate-500">{filteredCount} curated blogs ready to explore</p>
    </div>
  );
}

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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

  const filteredCompanies = useMemo(() => {
    let filtered = companies;

    if (searchTerm) {
      filtered = searchCompanies(filtered, searchTerm);
    }

    if (selectedLetter) {
      filtered = filtered.filter((company) => company.letter === selectedLetter);
    }

    if (selectedCategory) {
      filtered = filtered.filter((company) => company.category === selectedCategory);
    }

    return filtered;
  }, [companies, searchTerm, selectedLetter, selectedCategory]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  const groupedCompanies = useMemo(() => groupCompaniesByLetter(companies), [companies]);
  const categories = useMemo(() => getCompanyCategories(companies), [companies]);

  const companyCounts = useMemo(() => {
    const counts = {};
    Object.keys(groupedCompanies).forEach((letter) => {
      counts[letter] = groupedCompanies[letter].length;
    });
    return counts;
  }, [groupedCompanies]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (term) {
      setSelectedLetter(null);
      setSelectedCategory(null);
    }
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm('');
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSelectedLetter(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="page-bg flex min-h-screen items-center justify-center">
        <div className="animate-fade-up text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-500" />
          </div>
          <p className="font-display text-xl font-semibold text-slate-800">Loading engineering blogs</p>
          <p className="mt-2 text-sm text-slate-500">Curating the best technical content for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen">
      <header className="hero-glow relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-indigo-400 blur-3xl" />
          <div className="absolute right-[-5%] top-[10%] h-64 w-64 rounded-full bg-sky-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pb-14 lg:pt-14">
          <div className="animate-fade-up mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full stat-pill px-4 py-2 text-sm text-indigo-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Curated engineering blog directory
            </div>

            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-2 shadow-lg backdrop-blur-sm">
                <Image
                  src="/medium-logo.png"
                  alt="NotMedium logo"
                  width={56}
                  height={56}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <span className="text-sky-300">Not</span>Medium
              </h1>
            </div>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg">
              Discover engineering blogs from top tech companies, AI labs, Indian startups, and developer tools — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="stat-pill rounded-full px-4 py-2 text-sm font-medium text-white">
                {companies.length} companies
              </span>
              <span className="stat-pill rounded-full px-4 py-2 text-sm font-medium text-white">
                {categories.length} categories
              </span>
              <span className="stat-pill rounded-full px-4 py-2 text-sm font-medium text-white">
                Updated regularly
              </span>
            </div>
          </div>

          <div className="animate-fade-up-delay mx-auto mt-10 max-w-3xl">
            <SearchBar onSearch={handleSearch} />
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                </svg>
                Suggest a company
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {!searchTerm && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {!searchTerm && !selectedCategory && (
          <div className="mb-10 hidden lg:block">
            <AlphabetNav
              selectedLetter={selectedLetter}
              onLetterSelect={handleLetterSelect}
              companyCounts={companyCounts}
            />
          </div>
        )}

        <div className="section-divider mb-8" />

        <div className="mb-10 animate-fade-up">
          <ResultsHeader
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedLetter={selectedLetter}
            filteredCount={filteredCompanies.length}
            onClearSearch={() => setSearchTerm('')}
            onClearCategory={() => setSelectedCategory(null)}
            onClearLetter={() => setSelectedLetter(null)}
          />
        </div>

        {filteredCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedCompanies.map((company, index) => (
                <CompanyCard key={`${company.name}-${index}`} company={company} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCompanies.length}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 px-6 py-20 text-center shadow-card backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
              <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="font-display text-xl font-semibold text-slate-800">No companies found</h3>
            <p className="mx-auto mt-3 max-w-md text-slate-500">
              {searchTerm
                ? `No companies match "${searchTerm}". Try another search or browse by category.`
                : selectedLetter
                ? `No companies start with "${selectedLetter}". Try a different letter.`
                : 'No companies available at the moment.'}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-8 rounded-xl px-6 py-3 font-semibold text-white gradient-accent shadow-hover transition-all"
            >
              Suggest a company
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-display text-lg font-semibold text-slate-800">NotMedium</p>
              <p className="mt-1 text-sm text-slate-500">
                Built with care for the engineering community by Jitesh.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 transition-all hover:border-indigo-200 hover:bg-indigo-50"
            >
              Found a broken link? Let us know
            </button>
          </div>
        </div>
      </footer>

      <SuggestionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
