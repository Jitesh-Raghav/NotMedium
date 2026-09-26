'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import SearchBar from '@/components/SearchBar';
import AlphabetNav from '@/components/AlphabetNav';
import CategoryFilter from '@/components/CategoryFilter';
import CompanyCard from '@/components/CompanyCard';
import CompanyRow from '@/components/CompanyRow';
import Pagination from '@/components/Pagination';
import CommandPalette from '@/components/CommandPalette';
import SuggestionForm from '@/components/SuggestionForm';
import Footer from '@/components/Footer';
import { ArrowRight, GridIcon, ListIcon, XIcon } from '@/components/Icons';
import { parseCompaniesFromText, groupCompaniesByLetter, searchCompanies, getCompanyCategories } from '@/lib/parseCompanies';

const ITEMS_PER_PAGE = 24;

function ViewToggle({ view, onChange }) {
  const options = [
    { id: 'grid', label: 'Grid view', Icon: GridIcon },
    { id: 'list', label: 'List view', Icon: ListIcon },
  ];
  return (
    <div className="relative flex h-9 shrink-0 items-center rounded-full border border-line bg-elev/60 p-0.5">
      <span
        className={`absolute top-0.5 h-[30px] w-[30px] rounded-full bg-fg/[0.08] transition-transform duration-500 ease-out-expo ${
          view === 'list' ? 'translate-x-[30px]' : 'translate-x-0'
        }`}
      />
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          aria-label={label}
          aria-pressed={view === id}
          className={`relative grid h-[30px] w-[30px] place-items-center rounded-full transition-colors ${
            view === id ? 'text-fg' : 'text-subtle hover:text-muted'
          }`}
        >
          <Icon className="h-[15px] w-[15px]" />
        </button>
      ))}
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <button
      onClick={onClear}
      className="group inline-flex h-7 items-center gap-1.5 rounded-full border border-line pl-3 pr-2 text-[12px] text-fg transition-colors hover:border-subtle/60"
    >
      {label}
      <XIcon className="h-3 w-3 text-subtle transition-colors group-hover:text-fg" />
    </button>
  );
}

function SkeletonGrid() {
  return (
    <div className="hairline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex min-h-[196px] flex-col p-6" style={{ opacity: 1 - i * 0.06 }}>
          <div className="h-10 w-10 animate-pulse rounded-[10px] bg-line/70" />
          <div className="mt-auto space-y-2.5">
            <div className="h-4 w-2/3 animate-pulse rounded bg-line/70" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-line/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('grid');
  const [palette, setPalette] = useState({ open: false, query: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch('/links.txt');
        const text = await response.text();
        setCompanies(parseCompaniesFromText(text));
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCompanies();

    try {
      const stored = localStorage.getItem('nm-view');
      if (stored === 'list' || stored === 'grid') setView(stored);
    } catch {}
  }, []);

  const openPalette = useCallback((query = '') => setPalette({ open: true, query }), []);
  const closePalette = useCallback(() => setPalette((p) => ({ ...p, open: false })), []);
  const openForm = useCallback(() => setIsFormOpen(true), []);
  const closeForm = useCallback(() => setIsFormOpen(false), []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((p) => ({ open: !p.open, query: '' }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredCompanies = useMemo(() => {
    let filtered = searchCompanies(companies, searchTerm);
    if (selectedLetter) filtered = filtered.filter((c) => c.letter === selectedLetter);
    if (selectedCategory) filtered = filtered.filter((c) => c.category === selectedCategory);
    return filtered;
  }, [companies, searchTerm, selectedLetter, selectedCategory]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = useMemo(
    () => filteredCompanies.slice(pageStart, pageStart + ITEMS_PER_PAGE),
    [filteredCompanies, pageStart]
  );

  const categories = useMemo(() => getCompanyCategories(companies), [companies]);

  // Letter counts follow the active collection so the rail never offers dead ends.
  const companyCounts = useMemo(() => {
    const pool = selectedCategory ? companies.filter((c) => c.category === selectedCategory) : companies;
    const grouped = groupCompaniesByLetter(pool);
    return Object.fromEntries(Object.entries(grouped).map(([letter, list]) => [letter, list.length]));
  }, [companies, selectedCategory]);

  const letterCount = useMemo(() => {
    const grouped = groupCompaniesByLetter(companies);
    return Object.values(grouped).filter((list) => list.length > 0).length;
  }, [companies]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  };

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setSelectedLetter(null);
    setCurrentPage(1);
  }, []);

  const handleViewChange = (next) => {
    setView(next);
    try {
      localStorage.setItem('nm-view', next);
    } catch {}
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearAll = () => {
    setSearchTerm('');
    setSelectedLetter(null);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const hasFilters = Boolean(searchTerm || selectedLetter || selectedCategory);
  const listKey = `${view}-${currentPage}-${selectedCategory}-${selectedLetter}`;

  return (
    <div className="relative">
      <Nav onOpenSearch={() => openPalette('')} onSuggest={openForm} />

      <main>
        <Hero
          companies={companies}
          categoryCount={categories.length}
          letterCount={letterCount}
          onOpenSearch={openPalette}
        />

        <Collections
          categories={categories}
          companies={companies}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />

        <section id="index" className="relative pt-28 sm:pt-36">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">02 — The Index</p>
                <h2 className="mt-4 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.95] tracking-[-0.02em]">
                  Every blog, <span className="italic text-muted">A to Z.</span>
                </h2>
              </div>
              <p className="font-mono text-[12px] text-subtle">
                <span className="text-fg">{filteredCompanies.length}</span>
                {hasFilters ? ` of ${companies.length}` : ''} results
              </p>
            </div>
          </div>

          <div className="sticky top-14 z-30 border-y border-line bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
              <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 lg:flex-1">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    total={companies.length}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 sm:flex-none">
                    <SearchBar value={searchTerm} onChange={handleSearch} />
                  </div>
                  <ViewToggle view={view} onChange={handleViewChange} />
                </div>
              </div>
              <div className="border-t border-line py-1.5">
                <AlphabetNav
                  selectedLetter={selectedLetter}
                  onLetterSelect={handleLetterSelect}
                  companyCounts={companyCounts}
                />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className={`flex min-h-[3.5rem] flex-wrap items-center gap-2 py-4 transition-opacity ${hasFilters ? 'opacity-100' : 'opacity-0'}`}>
              {hasFilters && (
                <>
                  <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-subtle">Filtered by</span>
                  {searchTerm && <FilterChip label={`“${searchTerm}”`} onClear={() => handleSearch('')} />}
                  {selectedCategory && <FilterChip label={selectedCategory} onClear={() => handleCategorySelect(null)} />}
                  {selectedLetter && <FilterChip label={`Starts with ${selectedLetter}`} onClear={() => handleLetterSelect(null)} />}
                  <button onClick={clearAll} className="ml-1 text-[12px] text-subtle underline-offset-4 transition-colors hover:text-fg hover:underline">
                    Clear all
                  </button>
                </>
              )}
            </div>

            {isLoading ? (
              <SkeletonGrid />
            ) : filteredCompanies.length === 0 ? (
              <div className="ticks flex flex-col items-center border border-line px-6 py-24 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">No results</p>
                <h3 className="mt-5 font-serif text-[clamp(2rem,4vw,3rem)] leading-none tracking-tight">
                  Nothing here — <span className="italic text-muted">yet.</span>
                </h3>
                <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-muted">
                  {searchTerm
                    ? `We couldn’t find anything matching “${searchTerm}”. If it’s worth reading, it’s worth adding.`
                    : 'No blogs match this combination of filters.'}
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={openForm}
                    className="group inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-[13.5px] font-medium text-bg transition-opacity hover:opacity-90"
                  >
                    Suggest a blog
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex h-10 items-center rounded-full border border-line px-5 text-[13.5px] text-muted transition-colors hover:border-subtle/60 hover:text-fg"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : view === 'grid' ? (
              <div key={listKey} className="hairline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedCompanies.map((company, i) => (
                  <CompanyCard
                    key={`${company.name}-${company.url}`}
                    company={company}
                    index={i}
                    number={String(pageStart + i + 1).padStart(3, '0')}
                  />
                ))}
              </div>
            ) : (
              <ul key={listKey} className="border-t border-line">
                {paginatedCompanies.map((company, i) => (
                  <CompanyRow
                    key={`${company.name}-${company.url}`}
                    company={company}
                    index={i}
                    number={String(pageStart + i + 1).padStart(3, '0')}
                  />
                ))}
              </ul>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredCompanies.length}
            />
          </div>
        </section>

        <section className="mx-auto mt-36 max-w-[1280px] px-5 sm:px-8">
          <div className="ticks relative overflow-hidden border border-line px-6 py-20 text-center sm:px-12 sm:py-28">
            <div className="hero-glow pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <p className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">03 — Contribute</p>
            <h2 className="relative mx-auto mt-6 max-w-3xl font-serif text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.02em]">
              Missing a blog <span className="italic text-muted">you love?</span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-muted">
              The index grows one suggestion at a time. Send it over — every submission is read by a person.
            </p>
            <button
              onClick={openForm}
              className="group relative mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-fg px-6 text-[14px] font-medium text-bg transition-opacity hover:opacity-90"
            >
              Suggest a blog
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </section>
      </main>

      <Footer onSuggest={openForm} onOpenSearch={() => openPalette('')} />

      <CommandPalette
        isOpen={palette.open}
        initialQuery={palette.query}
        onClose={closePalette}
        companies={companies}
        categories={categories}
        onSelectCategory={handleCategorySelect}
        onSuggest={openForm}
      />
      <SuggestionForm isOpen={isFormOpen} onClose={closeForm} />
    </div>
  );
}
