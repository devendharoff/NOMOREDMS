'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  onOpenSearch?: () => void;
  isLoggedIn?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ onOpenSearch, isLoggedIn }) => {
  const pathname = usePathname();

  const navItems = [
    { id: 'home', icon: Zap, label: 'Feed', href: '/' },
    { id: 'trending', icon: Flame, label: 'Trending', href: '/trending' },
    { id: 'search', icon: Search, label: 'Search', action: onOpenSearch },
    { id: 'admin', icon: ShieldAlert, label: 'Admin', href: '/admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-2xl border-t border-zinc-100 dark:border-white/10 transition-colors duration-300" />

      <div className="relative flex items-center justify-around h-20 px-4 pb-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          if (item.action) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={item.action}
                className="relative flex flex-col items-center justify-center w-16 h-16 gap-1"
              >
                <Icon className="h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 transition-colors">
                  {item.label}
                </span>
              </motion.button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="relative flex flex-col items-center justify-center w-16 h-16 gap-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -top-1 w-8 h-1 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                />
              )}
              <Icon
                className={`h-5 w-5 transition-colors ${isActive ? 'text-green-600 dark:text-green-500' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
              />
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-zinc-950 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'
                }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;