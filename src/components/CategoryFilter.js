'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function CategoryFilter({ categories, selectedCategory, onCategorySelect, total }) {
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  // Fade whichever edge still has tabs hidden behind it.
  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges, categories.length]);

  if (!categories.length) return null;

  const items = [{ name: null, label: 'All', count: total }, ...categories.map((c) => ({ ...c, label: c.name }))];
  const mask = `linear-gradient(to right, ${edges.left ? 'transparent' : '#000'}, #000 ${
    edges.left ? '40px' : '0px'
  }, #000 calc(100% - ${edges.right ? '56px' : '0px'}), ${edges.right ? 'transparent' : '#000'})`;

  return (
    <div
      ref={scrollerRef}
      onScroll={updateEdges}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0"
      role="tablist"
      aria-label="Collections"
    >
      {items.map(({ name, label, count }) => {
        const active = selectedCategory === name;
        return (
          <button
            key={label}
            role="tab"
            aria-selected={active}
            onClick={(e) => {
              onCategorySelect(name);
              e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] transition-all duration-300 ${
              active ? 'bg-fg text-bg' : 'text-muted hover:bg-line/50 hover:text-fg'
            }`}
          >
            {label}
            <span className={`font-mono text-[10.5px] ${active ? 'text-bg/60' : 'text-subtle'}`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
