'use client';

import { Wordmark } from './Logo';
import { ArrowUp } from './Icons';

export default function Footer({ onSuggest, onOpenSearch }) {
  const linkCls = 'text-[13.5px] text-muted transition-colors hover:text-fg text-left';

  return (
    <footer className="relative mt-36 overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-12 px-5 pb-12 pt-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Wordmark />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">
            A quiet corner of the internet for people who like reading how things are built.
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-subtle">Explore</p>
          <ul className="space-y-2.5">
            <li><a href="#index" className={linkCls}>The index</a></li>
            <li><a href="#collections" className={linkCls}>Collections</a></li>
            <li><button onClick={onOpenSearch} className={linkCls}>Search</button></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-subtle">Contribute</p>
          <ul className="space-y-2.5">
            <li><button onClick={onSuggest} className={linkCls}>Suggest a blog</button></li>
            <li><button onClick={onSuggest} className={linkCls}>Report a broken link</button></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 text-[12px] text-subtle sm:px-8">
        <p>
          © {new Date().getFullYear()} NotMedium · Built with care by Jitesh
        </p>
        <a href="#top" className="group inline-flex items-center gap-1.5 transition-colors hover:text-fg">
          Back to top
          <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="pointer-events-none select-none px-2" aria-hidden>
        <p className="wordmark-fade -mb-[0.2em] mt-6 whitespace-nowrap text-center font-serif text-[23vw] leading-[0.8] tracking-[-0.04em]">
          <span className="italic">Not</span>Medium
        </p>
      </div>
    </footer>
  );
}
