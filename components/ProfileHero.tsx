'use client';

import React, { useState } from 'react';
import { CheckCircle, Instagram, Twitter, Youtube, Users, Layers, UserPlus, UserCheck } from 'lucide-react';
import { Creator, Resource } from '../types';

/**
 * Updated ProfileHeroProps to include resources and onShowPaywall
 * to fix the TypeScript error in App.tsx.
 */
interface ProfileHeroProps {
  creator: Creator;
  resources?: Resource[];
  onShowPaywall?: (mode?: 'limit' | 'report' | 'trending') => void;
}

const formatCount = (count: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(count);
};

const ProfileHero: React.FC<ProfileHeroProps> = ({ creator, resources = [], onShowPaywall }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:pt-16 pb-12 sm:px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-white/5 blur-[120px] pointer-events-none rounded-full" aria-hidden="true" />

      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-8 sm:gap-10 relative z-10">
        <div className="relative group shrink-0">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-white/10 opacity-30 group-hover:opacity-60 transition duration-700 blur"></div>
          <div className="relative h-28 w-28 sm:h-44 sm:w-44 rounded-full p-1.5 bg-black border border-white/10 overflow-hidden">
            <img
              src={creator.profilePic}
              alt={creator.displayName}
              className="h-full w-full rounded-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4 sm:space-y-6 pt-2">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center sm:justify-start">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-3xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">
                  {creator.displayName}
                </h1>
                {creator.isVerified && (
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 fill-white text-black" />
                )}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${isFollowing
                      ? 'bg-neutral-800 text-white border border-white/20'
                      : 'bg-white text-black shadow-white/10'
                    }`}
                >
                  {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => onShowPaywall?.('limit')}
                  className="rounded-full border border-white/10 bg-white/5 px-5 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-3">
              <p className="text-base sm:text-lg font-bold tracking-tight text-neutral-500">@{creator.username}</p>

              {creator.niche && (
                <div className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] bg-zinc-50 dark:bg-white/5 text-zinc-500 dark:text-neutral-400 border border-zinc-200 dark:border-white/10">
                  {creator.niche}
                </div>
              )}
            </div>
          </div>

          <p className="max-w-2xl text-balance text-sm sm:text-base font-medium leading-relaxed text-neutral-300 px-4 sm:px-0">
            {creator.bio}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-8 py-2">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 text-white">
                <Users className="h-4 w-4 text-neutral-400" />
                <span className="text-lg sm:text-xl font-black">{formatCount(creator.followersCount + (isFollowing ? 1 : 0))}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Followers</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 text-white">
                <Layers className="h-4 w-4 text-neutral-400" />
                <span className="text-lg sm:text-xl font-black">{resources.length}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Resources</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 sm:justify-start">
            <div className="flex items-center gap-5 text-neutral-500">
              {[
                { Icon: Instagram, link: creator.socials.instagram },
                { Icon: Twitter, link: creator.socials.twitter },
                { Icon: Youtube, link: creator.socials.youtube }
              ].map(({ Icon, link }, i) => (
                link && (
                  <a key={i} href={link} target="_blank" className="p-2 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-lg" rel="noreferrer">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">Social Link {i + 1}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;
