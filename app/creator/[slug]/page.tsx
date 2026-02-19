import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import CreatorProfileContent from '@/components/CreatorProfileContent';
import { mapCreator, mapResource } from '@/lib/mappers';

export const revalidate = 0;

export default async function CreatorPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: creatorData, error } = await supabase
        .from('creators')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !creatorData) {
        notFound();
    }

    const { data: resourcesData } = await supabase
        .from('resources')
        .select('*')
        .eq('creator_id', creatorData.id)
        .eq('is_hidden', false)
        .eq('status', 'live');

    const creator = mapCreator(creatorData);
    const resources = (resourcesData || []).map(mapResource);

    return (
        <CreatorProfileContent creator={creator} resources={resources} isLoggedIn={!!user} />
    );
}

