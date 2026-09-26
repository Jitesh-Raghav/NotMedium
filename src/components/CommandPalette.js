'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CompanyLogo from './CompanyLogo';
import { ArrowRight, CornerDownLeft, HashIcon, PlusIcon, SearchIcon } from './Icons';
import { getHostname, useOverlay } from '@/lib/useOverlay';

const MAX_RESULTS = 8;

function rank(companies, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const c of companies) {
    const name = c.name.toLowerCase();
    const host = getHostname(c.url).toLowerCase();
    let score = -1;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.split(/[\s.(-]+/).some((w) => w.startsWith(q))) score = 60;
    else if (name.includes(q)) score = 40;
    else if (host.includes(q)) score = 25;
    else if (c.category.toLowerCase().includes(q)) score = 10;
    if (score >= 0) scored.push([score, c]);
  }
  return scored.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name)).slice(0, MAX_RESULTS).map(([, c]) => c);
}

export default function CommandPalette({ isOpen, initialQuery = '', onClose, companies, categories, onSelectCategory, onSuggest }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useOverlay(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, initialQuery]);

  const items = useMemo(() => {
    if (query.trim()) {
      return rank(companies, query).map((c) => ({
        type: 'blog',
        key: `blog-${c.name}-${c.url}`,
        company: c,
        run: () => window.open(c.url, '_blank', 'noopener,noreferrer'),
      }));
    }
    return [
      ...categories.map((c) => ({
        type: 'category',
        key: `cat-${c.name}`,
        label: c.name,
        count: c.count,
        run: () => {
          onSelectCategory(c.name);
          onClose();
          requestAnimationFrame(() => document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' }));
        },
      })),
      {
        type: 'action',
        key: 'suggest',
        label: 'Suggest a blog',
        run: () => {
          onClose();
          onSuggest();
        },
      },
    ];
  }, [query, companies, categories, onSelectCategory, onClose, onSuggest]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!isOpen) return null;

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(items.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[active]?.run();
    }
  };

  let lastGroup = null;
  const groupLabel = { blog: 'Blogs', category: 'Collections', action: 'Actions' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="overlay-in absolute inset-0 bg-bg/60 backdrop-blur-md" onClick={onClose} />

      <div className="panel-in relative w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-elev/95 shadow-float backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search blogs, teams, domains…"
            aria-label="Search blogs"
            className="h-16 w-full bg-transparent text-[16px] text-fg placeholder:text-subtle focus:outline-none"
          />
          <button onClick={onClose} className="kbd shrink-0 !px-1.5 hover:text-fg" aria-label="Close search">
            esc
          </button>
        </div>

        <ul ref={listRef} className="max-h-[min(420px,55vh)] overflow-y-auto p-2">
          {items.length === 0 && (
            <li className="px-4 py-14 text-center">
              <p className="font-serif text-2xl italic text-muted">Nothing for “{query}”.</p>
              <button
                onClick={() => {
                  onClose();
                  onSuggest();
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg"
              >
                Know a great one? Suggest it <ArrowRight className="h-3 w-3" />
              </button>
            </li>
          )}

          {items.map((item, i) => {
            const header = item.type !== lastGroup ? groupLabel[item.type] : null;
            lastGroup = item.type;
            const isActive = i === active;

            return (
              <li key={item.key}>
                {header && (
                  <p className="px-3 pb-1.5 pt-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-subtle">{header}</p>
                )}
                <button
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => item.run()}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                    isActive ? 'bg-fg/[0.06] text-fg' : 'text-muted'
                  }`}
                >
                  {item.type === 'blog' && (
                    <>
                      <CompanyLogo company={item.company} size="sm" className="!h-8 !w-8 !rounded-lg !p-1.5" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] text-fg">{item.company.name}</span>
                        <span className="block truncate font-mono text-[11px] text-subtle">{getHostname(item.company.url)}</span>
                      </span>
                      <span className="hidden shrink-0 text-[12px] text-subtle sm:block">{item.company.category}</span>
                    </>
                  )}
                  {item.type === 'category' && (
                    <>
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-line text-subtle">
                        <HashIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 truncate text-[14.5px]">{item.label}</span>
                      <span className="font-mono text-[11px] text-subtle">{item.count}</span>
                    </>
                  )}
                  {item.type === 'action' && (
                    <>
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-line text-accent">
                        <PlusIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 truncate text-[14.5px]">{item.label}</span>
                    </>
                  )}
                  <CornerDownLeft className={`h-3.5 w-3.5 shrink-0 transition-opacity ${isActive ? 'text-muted opacity-100' : 'opacity-0'}`} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11.5px] text-subtle">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="kbd !h-5 !min-w-[1.25rem]">↑</span>
              <span className="kbd !h-5 !min-w-[1.25rem]">↓</span>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="kbd !h-5 !min-w-[1.25rem]">↵</span>
              open
            </span>
          </div>
          <span className="font-mono">{companies.length} indexed</span>
        </div>
      </div>
    </div>
  );
}
