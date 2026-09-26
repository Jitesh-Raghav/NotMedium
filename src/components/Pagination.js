'use client';

import { ArrowLeft, ArrowRight } from './Icons';

const pad = (n) => String(n).padStart(2, '0');

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, '…', ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)];
  }
  return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
}

export default function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const navBtn =
    'grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:border-subtle/60 hover:text-fg disabled:pointer-events-none disabled:opacity-30';

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-col items-center justify-between gap-6 sm:flex-row">
      <p className="order-2 font-mono text-[11.5px] text-subtle sm:order-1">
        <span className="text-fg">{pad(startItem)}</span>–<span className="text-fg">{pad(endItem)}</span> of {totalItems}
      </p>

      <div className="order-1 flex items-center gap-3 sm:order-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page" className={navBtn}>
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center">
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === '…' ? (
              <span key={`gap-${i}`} className="w-7 text-center font-mono text-[12px] text-subtle">
                ···
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`relative h-10 min-w-[2.25rem] px-1.5 font-mono text-[12.5px] transition-colors duration-300 ${
                  page === currentPage ? 'text-fg' : 'text-subtle hover:text-fg'
                }`}
              >
                {pad(page)}
                <span
                  className={`absolute inset-x-2 bottom-1.5 h-px bg-accent transition-transform duration-500 ease-out-expo ${
                    page === currentPage ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            )
          )}
        </div>

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page" className={navBtn}>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="order-3 hidden font-mono text-[11.5px] text-subtle sm:block">
        Page <span className="text-fg">{pad(currentPage)}</span> / {pad(totalPages)}
      </p>
    </nav>
  );
}
