'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, MoreVertical, Flag, Calendar, ShieldCheck, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Resource, Creator } from '../types';

interface ResourceCardProps {
  resource: Resource;
  creator?: Creator;
  onShowPaywall: (mode?: 'limit' | 'report') => void;
  onNavigateCreator?: (slug: string) => void;
  onTagClick?: (tag: string) => void;
}

const ResourceCard = memo(({
  resource,
  creator,
  onShowPaywall,
  onNavigateCreator,
  onTagClick
}: ResourceCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const checkAndIncrementClicks = () => {
    const today = new Date().toLocaleDateString();
    const lastDate = localStorage.getItem('nmd_last_click_date');
    let clicks = parseInt(localStorage.getItem('nmd_clicks') || '0', 10);

    if (lastDate !== today) {
      clicks = 0;
      localStorage.setItem('nmd_last_click_date', today);
    }

    if (clicks >= 3) {
      onShowPaywall('limit');
      return false;
    } else {
      localStorage.setItem('nmd_clicks', (clicks + 1).toString());
      return true;
    }
  };

  const handleGetLink = () => {
    if (checkAndIncrementClicks()) {
      window.open(resource.url, '_blank');
    }
  };

  const handleCopyLink = () => {
    if (checkAndIncrementClicks()) {
      navigator.clipboard.writeText(resource.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.article
      layout
      className="group relative overflow-hidden rounded-[1.5rem] border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-neutral-900/40 p-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-neutral-900/60 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col h-full backdrop-blur-sm"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-neutral-800 shadow-inner">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-200 dark:bg-neutral-800 animate-pulse" aria-hidden="true" />
        )}

        <motion.img
          src={resource.thumbnail}
          alt={`Thumbnail for ${resource.title}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/70 to-transparent opacity-60 transition-opacity group-hover:opacity-40" aria-hidden="true" />

        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            aria-label={`Options for ${resource.title}`}
            aria-haspopup="menu"
            aria-expanded={showMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 dark:bg-black/40 text-white/70 backdrop-blur-xl border border-white/5 transition-all hover:bg-black/80 hover:text-white active:scale-90 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                role="menu"
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-zinc-100 dark:border-white/10 bg-white dark:bg-neutral-950/90 backdrop-blur-2xl shadow-2xl z-50"
              >
                <button
                  role="menuitem"
                  onClick={(e) => { e.stopPropagation(); onShowPaywall('report'); setShowMenu(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs font-bold text-zinc-500 dark:text-neutral-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-950 dark:hover:text-white transition-colors focus:outline-none focus:bg-zinc-100 dark:focus:bg-white/10"
                >
                  <Flag className="h-4 w-4 text-zinc-500 dark:text-neutral-500" aria-hidden="true" /> Report Resource
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-tighter text-white/90">{resource.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 flex-1">
        <h3 className="line-clamp-2 text-lg font-black leading-[1.2] text-zinc-900 dark:text-white tracking-tight">{resource.title}</h3>

        {resource.description && (
          <div className="relative space-y-2">
            <p className={`text-sm font-medium leading-relaxed text-zinc-500 dark:text-neutral-400 transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
              {resource.description}
            </p>
            <button
              onClick={toggleExpand}
              className="group/readmore flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none"
            >
              {isExpanded ? (
                <>Read Less <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>Read More <ChevronDown className="h-3 w-3" /></>
              )}
            </button>
          </div>
        )}

        <div className="h-px w-full bg-gradient-to-r from-zinc-200 dark:from-white/10 via-zinc-100 dark:via-white/5 to-transparent" aria-hidden="true" />

        <div className="space-y-4">
          {creator && (
            <button
              onClick={() => onNavigateCreator?.(creator.slug)}
              aria-label={`View resources from ${creator.displayName}`}
              className="group/creator flex items-center gap-3 cursor-pointer p-2 -ml-2 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 text-left w-full"
            >
              <div className="relative">
                <img src={creator.profilePic} loading="lazy" className="h-10 w-10 rounded-full border border-zinc-200 dark:border-white/10 object-cover" alt="" />
                {creator.isVerified && <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5 shadow-lg border border-zinc-100"><ShieldCheck className="h-2.5 w-2.5 text-black" aria-hidden="true" /></div>}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-zinc-700 dark:text-neutral-200 group-hover/creator:text-zinc-950 dark:group-hover/creator:text-white">{creator.displayName}</span>
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500 dark:text-neutral-500">
                  <span className="font-bold">@{creator.username}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-neutral-700" aria-hidden="true" />
                  <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" aria-hidden="true" />{resource.date}</span>
                </div>
              </div>
            </button>
          )}

          <div className="flex flex-wrap gap-2" role="group" aria-label={`Tags for ${resource.title}`}>
            {resource.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
                aria-label={`Filter by tag: ${tag.replace('#', '')}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 transition-all hover:border-green-500/50 hover:bg-green-500/5 group/tag active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-white group-hover/tag:bg-green-500 transition-all" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 dark:text-white group-hover/tag:text-green-600 dark:group-hover/tag:text-green-500">{tag.replace('#', '')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleGetLink(); }}
            aria-label={`Unlock and open: ${resource.title}`}
            className="group/btn relative flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-xl bg-zinc-950 dark:bg-white py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white dark:text-black transition-all hover:bg-zinc-800 dark:hover:bg-neutral-100 active:scale-[0.97] shadow-xl shadow-black/5 dark:shadow-white/5 focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            <span className="relative z-10 flex items-center gap-2">Unlock Vault <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" /></span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
            aria-label={copied ? "Copied" : "Copy direct link"}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-neutral-400 hover:border-green-500 hover:text-green-600 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}, (prev, next) =>
  prev.resource.id === next.resource.id &&
  prev.creator?.id === next.creator?.id &&
  prev.resource.title === next.resource.title &&
  prev.resource.description === next.resource.description
);

export default ResourceCard;
