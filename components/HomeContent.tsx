'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from './Header';
import CategoryBar from './CategoryBar';
import ResourceCard from './ResourceCard';
import LinkGateModal from './LinkGateModal';
import AnoAI from './ui/animated-shader-background';
import MobileNav from './MobileNav';
import MobileSearchOverlay from './MobileSearchOverlay';
import ResourceCardSkeleton from './ui/ResourceCardSkeleton';
import GlassLoading from './ui/GlassLoading';

import { Zap, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { Resource, Creator, TrendingPrompt } from '@/types';

type SortOrder = 'newest' | 'oldest' | 'title-az' | 'title-za' | 'category';

interface HomeContentProps {
    initialCreators: Creator[];
    initialResources: Resource[];
    isLoggedIn: boolean;
}

export default function HomeContent({
    initialCreators,
    initialResources,
    isLoggedIn
}: HomeContentProps) {
    const router = useRouter();

    // State
    const [creators] = useState<Creator[]>(initialCreators);
    const [resources] = useState<Resource[]>(initialResources);

    const [selectedCreatorSlug, setSelectedCreatorSlug] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'limit' | 'report' | 'trending'>('limit');
    const [hasLaunched, setHasLaunched] = useState(false);

    // Theme state (local for now, ideally context)
    const [isDarkMode, setIsDarkMode] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Dark Mode Effect
    useEffect(() => {
        const saved = localStorage.getItem('nmd_theme');
        const initialMode = saved ? saved === 'dark' : true;
        setIsDarkMode(initialMode);
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
            localStorage.setItem('nmd_theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('nmd_theme', 'light');
        }
    }, [isDarkMode]);

    const bgOpacity = useTransform(scrollYProgress, [0, 0.4, 0.45], [1, 1, 0]);
    const mainBgColor = useTransform(scrollYProgress, [0.45, 0.5, 0.8], ["#09090b", "#ffffff", "#ffffff"]);
    const mainTextColor = useTransform(scrollYProgress, [0.45, 0.5, 0.8], ["#ffffff", "#09090b", "#09090b"]);

    const filteredResources = useMemo(() => {
        let list = [...resources].filter(r => !r.isHidden && r.status === 'live');

        if (selectedCategory !== 'All') list = list.filter(r => r.category === selectedCategory);
        if (selectedTag) list = list.filter(r => r.tags.includes(selectedTag));

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(r =>
                r.title.toLowerCase().includes(lower) ||
                r.tags.some(t => t.toLowerCase().includes(lower)) ||
                creators.find(c => c.id === r.creatorId)?.displayName.toLowerCase().includes(lower)
            );
        }

        list.sort((a, b) => {
            switch (sortOrder) {
                case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'title-az': return a.title.localeCompare(b.title);
                case 'title-za': return b.title.localeCompare(a.title);
                case 'category': return a.category.localeCompare(b.category);
                default: return 0;
            }
        });

        return list;
    }, [resources, selectedCategory, selectedTag, searchTerm, creators, sortOrder]);

    const handleLaunch = () => {
        setHasLaunched(true);
        setTimeout(() => {
            document.getElementById('app-interface')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleNavigateCreator = (slug: string) => {
        router.push(`/creator/${slug}`);
    };

    const handleShowModal = (mode: 'limit' | 'report' | 'trending' = 'limit') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    // Duplicated creators for marquee
    const duplicatedCreators = useMemo(() => {
        const visibleCreators = creators.filter(c => !c.isHidden);
        return [...visibleCreators, ...visibleCreators, ...visibleCreators];
    }, [creators]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white font-sans tracking-tight" ref={containerRef}>

            {isDarkMode && (
                <motion.div style={{ opacity: bgOpacity }} className="fixed inset-0 z-0" aria-hidden="true">
                    <AnoAI />
                </motion.div>
            )}

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header
                    onSearch={setSearchTerm}
                    onNavigateHome={() => router.push('/')}
                    onNavigateAdmin={() => router.push('/admin')}
                    onNavigateTrending={() => router.push('/trending')}
                    isLoggedIn={false} // TODO: Implement real auth
                    isDarkMode={isDarkMode}
                    toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                />

                <main id="main-content" className="flex-1 pb-24 md:pb-0 outline-none">
                    {!hasLaunched ? (
                        <div className="flex flex-col">
                            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-10 lg:mb-12 flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 backdrop-blur-md text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500 dark:text-white/60 shadow-sm"
                                >
                                    <Sparkles className="h-3.5 w-3.5 text-green-500" />
                                    The DM Era is Over
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                                    className="max-w-[90rem] mx-auto text-6xl sm:text-8xl lg:text-[11rem] font-black leading-[0.9] lg:leading-[0.85] tracking-tighter text-zinc-900 dark:text-white"
                                >
                                    STOP BEGGING <br />
                                    <span className="text-zinc-300 dark:text-zinc-800">FOR LINKS.</span>
                                </motion.h1>

                                <motion.p className="mt-12 max-w-xl text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm">
                                    "Check your DMs" is a conversion killer. <br className="hidden sm:block" /> Stop waiting. Start building.
                                </motion.p>

                                <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-12">
                                    <ChevronDown className="h-8 w-8 text-zinc-300 dark:text-zinc-800" />
                                </motion.div>
                            </section>

                            <section className="py-40 overflow-hidden bg-white dark:bg-zinc-950">
                                <div className="mx-auto w-full">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-500 text-center mb-16 px-6 italic">Instant Access to the 1%</h3>
                                    <div className="relative flex overflow-x-hidden">
                                        <div className="flex gap-12 animate-marquee whitespace-nowrap py-10">
                                            {duplicatedCreators.map((c, i) => (
                                                <motion.div
                                                    key={`${c.id}-${i}`}
                                                    whileHover={{ scale: 1.05, y: -5 }}
                                                    onClick={() => handleNavigateCreator(c.slug)}
                                                    className="flex-shrink-0 flex items-center gap-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 px-10 py-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-neutral-800 transition-all cursor-pointer group"
                                                >
                                                    <img src={c.profilePic} className="h-14 w-14 rounded-full grayscale group-hover:grayscale-0 transition-all border border-transparent group-hover:border-white/20" alt="" />
                                                    <span className="text-zinc-950 dark:text-white font-black uppercase tracking-tighter text-2xl group-hover:tracking-tight transition-all">{c.displayName}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <motion.section
                                style={{ backgroundColor: isDarkMode ? mainBgColor : '#ffffff' }}
                                className="h-screen relative flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
                            >
                                <motion.div style={{ color: isDarkMode ? mainTextColor : '#09090b' }} className="text-center space-y-8 z-10">
                                    <div className="flex justify-center">
                                        <div className="p-6 rounded-3xl bg-zinc-950 text-white shadow-2xl">
                                            <Zap className="h-16 w-16 fill-current" />
                                        </div>
                                    </div>
                                    <h2 className="text-5xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic">NO MORE DMs.</h2>
                                    <p className="max-w-2xl mx-auto text-lg sm:text-2xl font-bold opacity-50 px-6">Every tool, kit, and template. One URL.</p>
                                    <motion.button onClick={handleLaunch} className="mt-12 group relative inline-flex items-center gap-4 bg-zinc-950 text-white px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest shadow-2xl transition-all">
                                        Enter The Vault <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            </motion.section>
                        </div>
                    ) : (
                        <div id="app-interface" className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
                                <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                                <div className="mt-12 mb-8 flex items-center justify-between">
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Resource Vault</h2>
                                    <div className="h-px flex-1 mx-8 bg-zinc-100 dark:bg-zinc-800/50" />
                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Hub</span>
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pb-24">
                                    {filteredResources.map((resource) => (
                                        <ResourceCard
                                            key={resource.id}
                                            resource={resource}
                                            creator={creators.find(c => c.id === resource.creatorId)}
                                            onShowPaywall={handleShowModal}
                                            onNavigateCreator={handleNavigateCreator}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="hidden md:block border-t border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl py-20 text-center">
                    <Link href="/" className="mb-8 inline-flex items-center gap-3 group">
                        <Zap className="h-6 w-6 text-zinc-950 dark:text-white fill-current" />
                        <span className="text-xl font-black tracking-tighter uppercase">NOMOREDMS</span>
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">NOMOREDMS &copy; 2024</p>
                </footer>

                <MobileNav onOpenSearch={() => setIsMobileSearchOpen(true)} isLoggedIn={isLoggedIn} />
                <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} onSearch={setSearchTerm} />
                <LinkGateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} onLogin={() => { setIsModalOpen(false); router.push('/trending'); }} />
            </div>
        </div>
    );
}
