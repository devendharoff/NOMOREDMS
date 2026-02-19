
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import { SUGGESTIONS, TRENDING_TAGS, RECENT_SEARCHES_KEY } from '../constants';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    }
  }, [isOpen]);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const filtered = SUGGESTIONS.filter(s => 
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearchTrigger = (term: string) => {
    saveSearch(term);
    onSearch(term);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[110] bg-black p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500 fill-green-500" />
              <span className="text-sm font-black tracking-tighter text-white">SEARCH VAULT</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5">
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger(query)}
              placeholder="What are you building?"
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-lg font-bold text-white placeholder:text-zinc-600 focus:border-green-500 outline-none transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
            {/* Suggestions / Results */}
            {query && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  Suggestions
                </h3>
                <div className="space-y-2">
                  {filtered.length > 0 ? filtered.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchTrigger(s.label)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-white/5 active:bg-zinc-800 transition-colors"
                    >
                      <span className="text-sm font-bold text-zinc-300">{s.label}</span>
                      <ArrowRight className="h-4 w-4 text-zinc-600" />
                    </button>
                  )) : (
                    <div className="p-4 text-zinc-600 text-sm font-medium italic">No matches found for "{query}"</div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchTrigger(term)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-bold text-zinc-400 active:bg-zinc-800"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tags */}
            {!query && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Trending Tags
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSearchTrigger(tag)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 border border-white/5 active:bg-zinc-800 transition-colors"
                    >
                      <span className="text-sm font-bold text-green-500/80">{tag}</span>
                      <Sparkles className="h-3 w-3 text-zinc-700" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { Sparkles } from 'lucide-react';
export default MobileSearchOverlay;
