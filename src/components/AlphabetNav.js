'use client';

const LETTERS = ['#', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

export default function AlphabetNav({ selectedLetter, onLetterSelect, companyCounts }) {
  return (
    <div className="no-scrollbar -mx-5 flex items-center gap-0.5 overflow-x-auto px-5 sm:mx-0 sm:justify-between sm:px-0">
      {LETTERS.map((letter) => {
        const count = companyCounts?.[letter] || 0;
        const active = selectedLetter === letter;
        const available = count > 0;

        return (
          <button
            key={letter}
            onClick={() => available && onLetterSelect(active ? null : letter)}
            disabled={!available}
            aria-pressed={active}
            title={available ? `${count} blogs · ${letter}` : `No blogs · ${letter}`}
            className={`relative grid h-8 min-w-[1.9rem] shrink-0 place-items-center rounded-md font-mono text-[12px] transition-all duration-300 ${
              active
                ? 'bg-fg text-bg'
                : available
                ? 'text-muted hover:bg-line/50 hover:text-fg'
                : 'cursor-not-allowed text-subtle/40'
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
