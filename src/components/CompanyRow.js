'use client';

import CompanyLogo from './CompanyLogo';
import { ArrowUpRight } from './Icons';
import { getHostname } from '@/lib/useOverlay';

export default function CompanyRow({ company, number, index = 0 }) {
  return (
    <li className="stagger" style={{ '--i': index }}>
      <a
        href={company.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-4 pr-2 transition-colors duration-300 hover:bg-elev/50 sm:grid-cols-[3rem_minmax(0,1.2fr)_minmax(0,1fr)_2rem] sm:pl-2 lg:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,14rem)_2rem]"
      >
        <span className="font-mono text-[11px] text-subtle transition-colors group-hover:text-accent">{number}</span>

        <span className="flex min-w-0 items-center gap-3.5">
          <CompanyLogo
            company={company}
            size="sm"
            className="!h-7 !w-7 !rounded-lg [&_img]:grayscale-[0.35] group-hover:[&_img]:grayscale-0"
          />
          <span className="truncate text-[15.5px] font-medium tracking-[-0.01em] text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
            {company.name}
          </span>
        </span>

        <span className="hidden truncate font-mono text-[12px] text-subtle transition-colors group-hover:text-muted sm:block">
          {getHostname(company.url)}
        </span>

        <span className="hidden truncate text-[13px] text-muted lg:block">{company.category}</span>

        <ArrowUpRight className="h-4 w-4 justify-self-end text-subtle transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </a>
    </li>
  );
}
