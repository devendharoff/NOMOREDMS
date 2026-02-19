'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Creator, Resource } from '@/types';
import ProfileHero from '@/components/ProfileHero';
import ResourceCard from '@/components/ResourceCard';
import LinkGateModal from '@/components/LinkGateModal';
import MobileNav from '@/components/MobileNav';
import MobileSearchOverlay from '@/components/MobileSearchOverlay';
import Link from 'next/link';

interface CreatorProfileContentProps {
    creator: Creator;
    resources: Resource[];
    isLoggedIn: boolean;
}

export default function CreatorProfileContent({
    creator,
    resources,
    isLoggedIn
}: CreatorProfileContentProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'limit' | 'report' | 'trending'>('limit');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    const handleShowModal = (mode: 'limit' | 'report' | 'trending' = 'limit') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleNavigateCreator = (slug: string) => {
        if (slug !== creator.slug) {
            router.push(`/creator/${slug}`);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Link href="/" className="fixed top-6 left-6 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>

            <ProfileHero
                creator={creator}
                resources={resources}
                onShowPaywall={handleShowModal}
            />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pb-24">
                    {resources.map(r => (
                        <ResourceCard
                            key={r.id}
                            resource={r}
                            creator={creator}
                            onShowPaywall={handleShowModal}
                            onNavigateCreator={handleNavigateCreator}
                        />
                    ))}
                </div>
            </div>

            <MobileNav onOpenSearch={() => setIsMobileSearchOpen(true)} isLoggedIn={isLoggedIn} />
            <MobileSearchOverlay isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} onSearch={() => { }} /> {/* Implement search if needed */}
            <LinkGateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} onLogin={() => { setIsModalOpen(false); router.push('/trending'); }} />
        </div>
    );
}
