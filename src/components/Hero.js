'use client';

import { useMemo } from 'react';
import CompanyLogo from './CompanyLogo';
import { ArrowRight, SearchIcon } from './Icons';
import { FEATURED } from '@/lib/featured';

const SUGGESTIONS = ['Anthropic', 'Stripe', 'Netflix', 'Cloudflare'];

function MarqueeRow({ items, reverse = false, duration }) {
  return (
    <div className="group flex overflow-hidden mask-x">
      <div
        className={`marquee flex shrink-0 gap-3 pr-3 ${reverse ? 'marquee-reverse' : ''}`}
        style={{ '--duration': `${duration}s` }}
      >
        {[...items, ...items].map((company, i) => (
          <a
            key={`${company.name}-${i}`}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={i >= items.length ? -1 : 0}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-elev/50 py-1.5 pl-1.5 pr-4 text-[13px] text-muted backdrop-blur-sm transition-colors duration-300 hover:border-subtle/50 hover:text-fg [&_img]:grayscale [&_img]:transition-[filter] [&_img]:duration-300 hover:[&_img]:grayscale-0"
          >
            <CompanyLogo company={company} size="sm" className="!rounded-full !border-0 !bg-transparent" />
            {company.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ companies, categoryCount, letterCount, onOpenSearch }) {
  const [rowA, rowB] = useMemo(() => {
    const byName = new Map(companies.map((c) => [c.name, c]));
    const picked = FEATURED.slice(0, 32).map((name) => byName.get(name)).filter(Boolean);
    const pool = picked.length >= 16 ? picked : companies.slice(0, 32);
    const half = Math.ceil(pool.length / 2);
    return [pool.slice(0, half), pool.slice(half)];
  }, [companies]);

  const stats = [
    { value: companies.length || '—', label: 'Blogs indexed' },
    { value: categoryCount || '—', label: 'Collections' },
    { value: letterCount || '—', label: 'Letters, A to Z' },
    { value: '0', label: 'Algorithms' },
  ];

  return (
    <section id="top" className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="hero-grid pointer-events-none absolute inset-0 -top-px h-[720px]" aria-hidden />
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[640px]" aria-hidden />

      <div className="relative mx-auto max-w-[1280px] px-5 text-center sm:px-8">
        <a
          href="#index"
          className="reveal group mx-auto inline-flex items-center gap-2.5 rounded-full border border-line bg-elev/60 py-1 pl-1.5 pr-3 text-[12.5px] text-muted backdrop-blur transition-colors hover:border-subtle/60 hover:text-fg"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fg/[0.06] px-2 py-0.5 font-mono text-[11px] text-fg">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            {companies.length || '···'}
          </span>
          engineering blogs, hand-picked
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>

        <h1 className="mx-auto mt-8 max-w-5xl font-serif text-[clamp(3.1rem,10vw,8.25rem)] leading-[0.9] tracking-[-0.025em]">
          <span className="reveal-blur block text-fade" style={{ '--d': '80ms' }}>
            The engineering blogs
          </span>
          <span className="reveal-blur block italic text-fade-muted" style={{ '--d': '200ms' }}>
            worth your time.
          </span>
        </h1>

        <p
          className="reveal mx-auto mt-8 max-w-[34rem] text-balance text-[15.5px] leading-relaxed text-muted sm:text-[17px]"
          style={{ '--d': '340ms' }}
        >
          A hand-curated index of the writing that comes straight from the teams building the
          internet. No feed, no algorithm, no noise — just the source.
        </p>

        <div className="reveal mx-auto mt-10 max-w-[36rem]" style={{ '--d': '440ms' }}>
          <button
            onClick={() => onOpenSearch('')}
            className="group relative flex h-14 w-full items-center gap-3 rounded-2xl border border-line bg-elev/70 pl-5 pr-3 text-left shadow-[0_1px_0_0_rgb(var(--glow)/0.04)_inset,0_24px_48px_-24px_rgb(var(--shadow))] backdrop-blur-md transition-all duration-300 hover:border-subtle/50"
          >
            <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:linear-gradient(90deg,transparent,rgb(var(--accent)/0.5),transparent)_top/100%_1px_no-repeat]" />
            <SearchIcon className="h-[18px] w-[18px] text-muted transition-colors group-hover:text-fg" />
            <span className="flex-1 truncate text-[15px] text-subtle">
              Search {companies.length || ''} blogs, teams and topics…
            </span>
            <span className="flex items-center gap-1">
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </span>
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[12.5px] text-subtle">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.14em]">Try</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onOpenSearch(s)}
                className="rounded-full px-2.5 py-1 text-muted transition-colors hover:bg-line/60 hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {rowA.length > 0 && (
        <div className="reveal relative mt-20 space-y-3 sm:mt-24" style={{ '--d': '560ms' }}>
          <MarqueeRow items={rowA} duration={70} />
          <MarqueeRow items={rowB} duration={80} reverse />
        </div>
      )}

      <div className="relative mx-auto mt-20 max-w-[1280px] px-5 sm:mt-24 sm:px-8">
        <dl className="ticks grid grid-cols-2 border-y border-line md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal flex flex-col gap-1 px-5 py-7 sm:px-7 ${i % 2 === 1 ? 'border-l border-line' : ''} ${
                i >= 2 ? 'border-t border-line md:border-t-0' : ''
              } ${i === 2 ? 'md:border-l' : ''}`}
              style={{ '--d': `${620 + i * 60}ms` }}
            >
              <dt className="order-2 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{s.label}</dt>
              <dd className="order-1 font-serif text-[44px] leading-none tracking-tight text-fg sm:text-[52px]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
