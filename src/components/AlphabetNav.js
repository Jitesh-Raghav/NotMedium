'use client';

export default function AlphabetNav({ selectedLetter, onLetterSelect, companyCounts }) {
  const letters = ['#', ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i))];
  
  // Split letters into two lines
  const firstLine = ['#', ...Array.from({length: 14}, (_, i) => String.fromCharCode(65 + i))]; // #, A-N
  const secondLine = Array.from({length: 12}, (_, i) => String.fromCharCode(79 + i)); // O-Z

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
          className={`relative px-4 py-3 rounded-xl font-semibold transition-all duration-300 min-w-[3rem] group ${
            isSelected
              ? 'gradient-accent text-white shadow-hover scale-105'
              : hasCompanies
              ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-800 border border-slate-300 hover:border-slate-400 hover:scale-105 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
          title={hasCompanies ? `${count} companies starting with ${letter}` : `No companies starting with ${letter}`}
        >
          <span className="relative z-10">{letter}</span>
          {hasCompanies && (
            <span 
              className={`absolute -top-2 -right-2 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold transition-all duration-300 ${
                isSelected 
                  ? 'bg-blue-300 text-blue-900' 
                  : 'bg-blue-500 text-white group-hover:bg-blue-400'
              }`}
            >
              {count > 99 ? '99+' : count}
            </span>
          )}
          {!hasCompanies && (
            <div className="absolute inset-0 rounded-xl bg-slate-200/50 flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </div>
          )}
        </button>
      );
    });
  };

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-modern border border-slate-200">
      <div className="space-y-4">
        {/* All button */}
        <div className="flex justify-center">
          <button
            onClick={() => onLetterSelect(null)}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedLetter === null
                ? 'gradient-accent text-white shadow-hover scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-800 border border-slate-300 hover:border-slate-400 shadow-sm'
            }`}
          >
            All Companies
          </button>
        </div>
        
        {/* First line: #, A-N */}
        <div className="flex flex-wrap justify-center gap-3">
          {renderButtons(firstLine)}
        </div>
        
        {/* Second line: O-Z */}
        <div className="flex flex-wrap justify-center gap-3">
          {renderButtons(secondLine)}
        </div>
      </div>
      
      {/* Navigation hint */}
      <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm">
          Click any letter to filter companies • Numbers and symbols are grouped in &quot;#&quot;
        </p>
      </div>
    </div>
  );
} 