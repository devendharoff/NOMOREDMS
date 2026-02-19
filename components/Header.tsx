
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, User, Flame, Sun, Moon, Clock, TrendingUp, X } from 'lucide-react';
import { SUGGESTIONS, TRENDING_TAGS, RECENT_SEARCHES_KEY } from '../constants';

interface HeaderProps {
  onSearch: (term: string) => void;
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
  onNavigateTrending: () => void;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onNavigateHome, 
  onNavigateAdmin, 
  onNavigateTrending,
  isLoggedIn,
  isDarkMode,
  toggleDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const filteredSuggestions = SUGGESTIONS.filter(s => 
    s.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
      saveSearch(searchTerm);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (label: string) => {
    onSearch(label);
    saveSearch(label);
    setSearchTerm(''); 
    setShowSuggestions(false);
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 lg:gap-10">
          <button 
            className="flex items-center gap-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1" 
            onClick={onNavigateHome}
            aria-label="NOMOREDMS - Go to Home"
          >
            <Zap className="h-6 w-6 text-zinc-950 dark:text-white fill-current transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="text-xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase">NOMOREDMS</span>
          </button>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8" aria-label="Main Navigation">
            <button 
              onClick={onNavigateHome}
              className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1.5 py-1"
            >
              Feed
            </button>
            <button 
              onClick={onNavigateTrending}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1.5 py-1"
            >
              <Flame className="h-3.5 w-3.5 text-orange-500 group-hover:animate-pulse" aria-hidden="true" />
              Trending
            </button>
          </nav>
        </div>
        
        <div className="hidden md:block relative flex-1 max-w-md mx-6 lg:mx-10" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-zinc-500" aria-hidden="true" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search vault..." 
              aria-label="Search resources in the vault"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
              className="w-full rounded-full border border-zinc-200 dark:border-neutral-800 bg-zinc-50 dark:bg-neutral-900/50 py-2.5 pl-11 pr-5 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:border-zinc-400 dark:focus:border-white outline-none transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                id="search-suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                role="listbox"
                className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-zinc-100 dark:border-white/10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[60]"
              >
                {/* Case 1: Search term present */}
                {searchTerm && (
                  <div className="py-1">
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Suggestions</div>
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((s, i) => (
                        <button
                          key={i}
                          role="option"
                          onClick={() => handleSelectSuggestion(s.label)}
                          className="flex w-full items-center px-4 py-2.5 text-left text-sm text-zinc-600 dark:text-neutral-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none"
                        >
                          <Search className="mr-3 h-3.5 w-3.5 text-zinc-400" />
                          {s.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-zinc-500 italic">No exact matches found</div>
                    )}
                  </div>
                )}

                {/* Case 2: Empty search - Show Recent & Trending */}
                {!searchTerm && (
                  <>
                    {recentSearches.length > 0 && (
                      <div className="py-1 border-b border-zinc-100 dark:border-white/5">
                        <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                          <Clock className="h-3 w-3" /> Recent Searches
                        </div>
                        {recentSearches.map((term, i) => (
                          <div key={i} className="group flex items-center hover:bg-zinc-100 dark:hover:bg-white/5">
                            <button
                              onClick={() => handleSelectSuggestion(term)}
                              className="flex-1 px-4 py-2.5 text-left text-sm text-zinc-600 dark:text-neutral-400 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none"
                            >
                              {term}
                            </button>
                            <button 
                              onClick={(e) => removeRecentSearch(e, term)}
                              className="px-4 py-2.5 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="py-1">
                      <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" /> Trending Tags
                      </div>
                      <div className="px-4 py-2 flex flex-wrap gap-2">
                        {TRENDING_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleSelectSuggestion(tag)}
                            className="rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-500 dark:text-neutral-400 hover:border-green-500/50 hover:text-green-600 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full text-zinc-500 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-white/5 transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? <Sun className="h-4.5 w-4.5" aria-hidden="true" /> : <Moon className="h-4.5 w-4.5" aria-hidden="true" />}
          </button>
          
          <button 
            onClick={onNavigateAdmin}
            className="hidden lg:flex text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1.5"
          >
            Admin
          </button>
          
          <button 
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-950 dark:text-white transition-all hover:bg-zinc-50 dark:hover:bg-white/5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            aria-label={isLoggedIn ? 'Go to Profile' : 'Sign Up for an account'}
          >
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{isLoggedIn ? 'Profile' : 'Sign Up'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
