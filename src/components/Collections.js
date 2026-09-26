'use client';

import CompanyLogo from './CompanyLogo';
import { ArrowUpRight } from './Icons';
import { byFeatured } from '@/lib/featured';

const BLURBS = {
  'Tech & Engineering': 'The classics. Infrastructure, scale and craft from the companies that shaped the web.',
  'Indian Tech': 'How India’s fastest-growing teams build for a billion users.',
  'AI & Machine Learning': 'Research notes and engineering deep-dives from the frontier labs.',
  'Developer Tools & Cloud': 'Written by the people who make the tools you ship with.',
  'Fintech & Enterprise': 'Money, compliance and systems that are never allowed to go down.',
  'Mobility, Data & Research': 'Maps, marketplaces, and the data pipelines underneath them.',
};

const trackSpotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

export default function Collections({ categories, companies, selectedCategory, onSelect }) {
  if (!categories.length) return null;

  return (
    <section id="collections" className="mx-auto max-w-[1280px] px-5 pt-28 sm:px-8 sm:pt-36">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">01 — Collections</p>
          <h2 className="mt-4 font-serif text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.95] tracking-[-0.02em]">
            Start with a <span className="italic text-muted">shelf.</span>
          </h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">
          Six loose groupings to wander through when you don’t know what you’re looking for yet.
        </p>
      </div>

      <div className="hairline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ name, count }, i) => {
          const members = companies.filter((c) => c.category === name).sort(byFeatured).slice(0, 5);
          const active = selectedCategory === name;
          return (
            <button
              key={name}
              onMouseMove={trackSpotlight}
              onClick={() => {
                onSelect(active ? null : name);
                document.getElementById('index')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`spotlight group flex min-h-[260px] flex-col p-7 text-left transition-colors duration-300 sm:p-8 ${
                active ? 'bg-elev' : 'hover:bg-elev/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, '0')}</span>
                <ArrowUpRight
                  className={`h-4 w-4 transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent ${
                    active ? 'text-accent' : 'text-subtle'
                  }`}
                />
              </div>

              <h3 className="mt-10 font-serif text-[30px] leading-[1.05] tracking-[-0.01em] text-fg">{name}</h3>
              <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">{BLURBS[name] || ''}</p>

              <div className="mt-auto flex items-center justify-between pt-8">
                <div className="flex -space-x-1.5">
                  {members.map((c) => (
                    <CompanyLogo
                      key={c.name}
                      company={c}
                      size="sm"
                      className="!h-7 !w-7 !rounded-full !p-1 ring-2 ring-bg [&_img]:grayscale [&_img]:transition-[filter] [&_img]:duration-500 group-hover:[&_img]:grayscale-0"
                    />
                  ))}
                </div>
                <span className="font-mono text-[12px] text-subtle">
                  <span className="text-fg">{count}</span> blogs
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
