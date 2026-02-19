
import React from 'react';
import { CATEGORIES } from '../constants';

interface CategoryBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <nav className="sticky top-16 z-40 w-full border-b border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-black/80 py-4 backdrop-blur-md transition-colors duration-300" aria-label="Categories">
      <div 
        className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 sm:px-6 no-scrollbar pb-1"
        role="group"
        aria-label="Filter by resource category"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            aria-pressed={selectedCategory === cat}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              selectedCategory === cat 
              ? 'bg-zinc-950 dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10' 
              : 'border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-500 dark:text-white/50 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryBar;
