'use client';

import { useEffect } from 'react';

// Locks page scroll and closes on Escape while an overlay is open.
export function useOverlay(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);
}

export function getHostname(url) {
  try {
    const { hostname, pathname } = new URL(url);
    const path = pathname.replace(/\/$/, '');
    return hostname.replace(/^www\./, '') + (path.length > 1 ? path : '');
  } catch {
    return url;
  }
}
