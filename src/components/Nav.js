'use client';

import { useEffect, useState } from 'react';
import { Wordmark } from './Logo';
import { MoonIcon, SearchIcon, SunIcon } from './Icons';

function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('nm-theme', next);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full text-muted transition-colors hover:bg-line/60 hover:text-fg"
    >
      <SunIcon
        className={`absolute h-[15px] w-[15px] transition-all duration-500 ease-out-expo ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
      />
      <MoonIcon
        className={`absolute h-[15px] w-[15px] transition-all duration-500 ease-out-expo ${
          theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
        }`}
      />
    </button>
  );
}

export default function Nav({ onOpenSearch, onSuggest }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'border-b border-line/80 bg-bg/70 backdrop-blur-xl backdrop-saturate-150' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="rounded-md" aria-label="NotMedium home">
          <Wordmark />
        </a>

        <div className="hidden items-center gap-7 text-[13px] text-muted md:flex">
          <a href="#index" className="transition-colors hover:text-fg">Index</a>
          <a href="#collections" className="transition-colors hover:text-fg">Collections</a>
          <button onClick={onSuggest} className="transition-colors hover:text-fg">Contribute</button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSearch}
            className="hidden h-8 items-center gap-2 rounded-full border border-line bg-elev/60 pl-3 pr-1.5 text-[13px] text-muted transition-colors hover:border-subtle/60 hover:text-fg sm:flex"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            <span className="pr-6">Search</span>
            <span className="kbd !h-5 !min-w-0 !rounded-full !px-1.5 !text-[10px]">⌘K</span>
          </button>
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-line/60 hover:text-fg sm:hidden"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={onSuggest}
            className="ml-1 hidden h-8 items-center rounded-full bg-fg px-3.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Suggest a blog
          </button>
        </div>
      </nav>
    </header>
  );
}
