'use client';

import CompanyLogo from './CompanyLogo';
import { ArrowUpRight } from './Icons';
import { getHostname } from '@/lib/useOverlay';

const trackSpotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

export default function CompanyCard({ company, number, index = 0 }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={trackSpotlight}
      style={{ '--i': index }}
      className="stagger spotlight group relative flex min-h-[168px] flex-col p-5 sm:min-h-[196px] sm:p-6 transition-colors duration-300 hover:bg-elev/50"
    >
      <div className="flex items-start justify-between">
        <CompanyLogo
          company={company}
          className="transition-transform duration-500 ease-out-expo group-hover:scale-[1.06] [&_img]:grayscale-[0.35] [&_img]:transition-[filter] [&_img]:duration-500 group-hover:[&_img]:grayscale-0"
        />
        <span className="relative h-4 w-8 overflow-hidden text-right">
          <span className="absolute inset-0 font-mono text-[11px] leading-4 text-subtle transition-all duration-500 ease-out-expo group-hover:-translate-y-4 group-hover:opacity-0">
            {number}
          </span>
          <ArrowUpRight className="absolute right-0 top-0 h-4 w-4 translate-y-4 text-accent opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100" />
        </span>
      </div>

      <div className="mt-auto pt-6 sm:pt-8">
        <h3 className="truncate text-[17px] font-medium tracking-[-0.015em] text-fg">{company.name}</h3>
        <p className="mt-1 truncate font-mono text-[11.5px] text-subtle transition-colors duration-300 group-hover:text-muted">
          {getHostname(company.url)}
        </p>
        <div className="mt-5 flex items-center gap-2 text-[11.5px] text-subtle">
          <span className="h-px w-3 bg-line transition-all duration-500 ease-out-expo group-hover:w-6 group-hover:bg-accent" />
          <span className="truncate">{company.category}</span>
        </div>
      </div>
    </a>
  );
}
