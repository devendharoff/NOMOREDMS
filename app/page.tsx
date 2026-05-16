import { createClient } from '@/utils/supabase/server';
import HomeContent from '@/components/HomeContent';
import { MOCK_CREATORS, MOCK_RESOURCES } from '@/constants';
import { mapCreator, mapResource, mapTrendingPrompt } from '@/lib/mappers';

export const revalidate = 0; // Disable static optimization for now (dynamic data)

export default async function Home({ searchParams }: { searchParams: Promise<{ launch?: string }> }) {
    const supabase = await createClient();

    const { data: creatorsData } = await supabase.from('creators').select('*').order('followers_count', { ascending: false }).limit(40);
    const { data: resourcesData } = await supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(60);

    // Merge database items with mock items to ensure the site always looks populated
    const creatorsRaw = creatorsData || [];
    const resourcesRaw = resourcesData || [];

    const dbCreators = creatorsRaw.map(mapCreator);
    const dbResources = resourcesRaw.map(mapResource);

    // Combine them, avoiding duplicates by ID or slug
    const creators = [
        ...dbCreators, 
        ...MOCK_CREATORS.filter(mc => !dbCreators.find(c => c.slug === mc.slug || c.id === mc.id))
    ];
    
    const resources = [
        ...dbResources, 
        ...MOCK_RESOURCES.filter(mr => !dbResources.find(r => r.id === mr.id || r.url === mr.url))
    ];

    const params = await searchParams;

    return (
        <HomeContent
            initialCreators={creators}
            initialResources={resources}
            launchedByParams={params?.launch === 'true'}
        />
    );
}
