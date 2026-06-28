'use client';

export default function AlphabetNav({ selectedLetter, onLetterSelect, companyCounts }) {
  const firstLine = ['#', ...Array.from({ length: 14 }, (_, i) => String.fromCharCode(65 + i))];
  const secondLine = Array.from({ length: 12 }, (_, i) => String.fromCharCode(79 + i));

  const renderButtons = (letterArray) => {
    return letterArray.map((letter) => {
      const count = companyCounts?.[letter] || 0;
      const isSelected = selectedLetter === letter;
      const hasCompanies = count > 0;

      return (
        <button
          key={letter}
          onClick={() => hasCompanies && onLetterSelect(letter)}
          disabled={!hasCompanies}
          className={`relative min-w-[2.75rem] rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
            isSelected
              ? 'chip-active scale-105 text-white'
              : hasCompanies
              ? 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-700'
              : 'cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300'
          }`}
          title={hasCompanies ? `${count} companies starting with ${letter}` : `No companies starting with ${letter}`}
        >
          {letter}
          {hasCompanies && count <= 99 && (
            <span
              className={`absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {count}
            </span>
          )}
        </button>
      );
    });
  };

  return (
    <section className="glass-effect animate-fade-up-delay rounded-3xl border border-white/70 p-6 shadow-card">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">A to Z</p>
          <h2 className="font-display text-lg font-semibold text-slate-900">Filter by first letter</h2>
        </div>
        <button
          onClick={() => onLetterSelect(null)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            selectedLetter === null
              ? 'chip-active text-white'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70'
          }`}
        >
          Show all
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap justify-center gap-2">{renderButtons(firstLine)}</div>
        <div className="flex flex-wrap justify-center gap-2">{renderButtons(secondLine)}</div>
      </div>

      <p className="mt-5 text-center text-sm text-slate-500">
        Numbers and symbols are grouped under &quot;#&quot;
      </p>
    </section>
  );
}
