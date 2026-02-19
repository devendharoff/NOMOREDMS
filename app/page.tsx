import { createClient } from '@/utils/supabase/server';
import HomeContent from '@/components/HomeContent';
import { MOCK_CREATORS, MOCK_RESOURCES } from '@/constants';
import { mapCreator, mapResource, mapTrendingPrompt } from '@/lib/mappers';

export const revalidate = 0; // Disable static optimization for now (dynamic data)

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: creatorsData, error: cError } = await supabase.from('creators').select('*');
    const { data: resourcesData, error: rError } = await supabase.from('resources').select('*');
    const { data: promptsData, error: pError } = await supabase.from('trending_prompts').select('*');

    // Fallback to mocks if DB fails or is empty (safety net)
    const creatorsRaw = (creatorsData && creatorsData.length > 0) ? creatorsData : [];
    const resourcesRaw = (resourcesData && resourcesData.length > 0) ? resourcesData : [];
    const promptsRaw = (promptsData && promptsData.length > 0) ? promptsData : [];

    const creators = creatorsRaw.length > 0 ? creatorsRaw.map(mapCreator) : MOCK_CREATORS;
    const resources = resourcesRaw.length > 0 ? resourcesRaw.map(mapResource) : MOCK_RESOURCES;
    // Removed unused prompts mapping if HomeContent doesn't use it, but logic seems cleaner to map all if available.
    // However, prompts are unused in HomeContent now. So ignore.

    return (
        <HomeContent
            initialCreators={creators}
            initialResources={resources}
            isLoggedIn={!!user}
        />
    );
}
