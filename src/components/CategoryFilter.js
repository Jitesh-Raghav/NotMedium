'use client';

export default function CategoryFilter({ categories, selectedCategory, onCategorySelect }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section className="mb-8 animate-fade-up-delay">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">Explore</p>
          <h2 className="font-display text-lg font-semibold text-slate-900">Browse by category</h2>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => onCategorySelect(null)}
          className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'chip-active text-white'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/60'
          }`}
        >
          All categories
        </button>
        {categories.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => onCategorySelect(name)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              selectedCategory === name
                ? 'chip-active text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/60'
            }`}
          >
            {name}
            <span className={`ml-1.5 ${selectedCategory === name ? 'text-indigo-100' : 'text-slate-400'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
