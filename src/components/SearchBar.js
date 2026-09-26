'use client';

import { useEffect, useRef } from 'react';
import { SearchIcon, XIcon } from './Icons';

export default function SearchBar({ value, onChange, placeholder = 'Filter the index…' }) {
  const inputRef = useRef(null);

  // "/" jumps straight to the filter, like most developer tools.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="group relative flex h-9 w-full items-center rounded-full border border-line bg-elev/60 transition-colors focus-within:border-subtle/70 sm:w-64">
      <SearchIcon className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-subtle transition-colors group-focus-within:text-fg" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onChange('');
            e.currentTarget.blur();
          }
        }}
        placeholder={placeholder}
        aria-label="Filter blogs"
        className="h-full w-full rounded-full bg-transparent pl-8 pr-10 text-[13px] text-fg placeholder:text-subtle focus:outline-none"
      />
      {value ? (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Clear filter"
          className="absolute right-1.5 grid h-6 w-6 place-items-center rounded-full text-subtle transition-colors hover:bg-line hover:text-fg"
        >
          <XIcon className="h-3 w-3" />
        </button>
      ) : (
        <span className="kbd pointer-events-none absolute right-2 !h-5 !min-w-[1.25rem] !text-[10px]">/</span>
      )}
    </div>
  );
}
