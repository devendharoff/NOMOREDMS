import { createClient } from '@/utils/supabase/server';
import TrendingLayout from '@/components/TrendingPage';
import { MOCK_TRENDING_PROMPTS } from '@/constants';
import Link from 'next/link';
import MobileNav from '@/components/MobileNav';

export const revalidate = 0;

export default async function TrendingPageRoot() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: prompts } = await supabase.from('trending_prompts').select('*');

    const finalPrompts = (prompts && prompts.length > 0) ? prompts : MOCK_TRENDING_PROMPTS;

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500/30">
            <Link href="/" className="fixed top-6 left-6 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>

            <TrendingLayout prompts={finalPrompts} />
            <MobileNav isLoggedIn={!!user} />
        </div>
    );
}
