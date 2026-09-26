'use client';

import { useState } from 'react';

// Favicon with graceful fallback through each source, then to a monogram.
export default function CompanyLogo({ company, size = 'md', className = '' }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const urls = company.logoUrls || [];
  const src = urls[index];

  const box = {
    sm: 'h-6 w-6 rounded-md p-[3px]',
    md: 'h-10 w-10 rounded-[10px] p-2',
    lg: 'h-12 w-12 rounded-xl p-2.5',
  }[size];

  const handleError = () => {
    if (index < urls.length - 1) {
      setIndex((i) => i + 1);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-line bg-elev ${box} ${className}`}
    >
      {failed || !src ? (
        <span className="font-serif text-[1.1em] italic leading-none text-muted">{company.initial}</span>
      ) : (
        <>
          {!loaded && <span className="absolute inset-1.5 animate-pulse rounded bg-line" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`h-full w-full object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      )}
    </span>
  );
}
