
import React from 'react';

const ResourceCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-neutral-900/40 p-4 flex flex-col h-full animate-pulse">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-200 dark:bg-neutral-800" />
      <div className="mt-5 space-y-4 flex-1">
        <div className="h-6 w-3/4 rounded-lg bg-zinc-200 dark:bg-neutral-800" />
        <div className="h-px w-full bg-zinc-100 dark:bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-neutral-800" />
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-neutral-800" />
            <div className="h-2 w-12 rounded bg-zinc-200 dark:bg-neutral-800 opacity-50" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-md bg-zinc-200 dark:bg-neutral-800" />
          <div className="h-6 w-16 rounded-md bg-zinc-200 dark:bg-neutral-800" />
        </div>
        <div className="mt-auto pt-4">
          <div className="h-12 w-full rounded-xl bg-zinc-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export default ResourceCardSkeleton;
