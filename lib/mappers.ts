import { Creator, Resource, TrendingPrompt } from '@/types';

export function mapCreator(dbCreator: any): Creator {
    return {
        id: dbCreator.id,
        slug: dbCreator.slug,
        username: dbCreator.username,
        displayName: dbCreator.display_name,
        bio: dbCreator.bio,
        profilePic: dbCreator.profile_pic,
        isVerified: dbCreator.is_verified,
        isHidden: dbCreator.is_hidden,
        niche: dbCreator.niche,
        followersCount: dbCreator.followers_count,
        socials: dbCreator.socials || {}, // Assuming JSON field matches structure or is empty
    };
}

export function mapResource(dbResource: any): Resource {
    return {
        id: dbResource.id,
        creatorId: dbResource.creator_id,
        title: dbResource.title,
        description: dbResource.description,
        category: dbResource.category,
        tags: dbResource.tags || [],
        thumbnail: dbResource.thumbnail,
        date: dbResource.created_at, // Mapping created_at to date
        url: dbResource.url,
        isHidden: dbResource.is_hidden,
        status: dbResource.status,
        health: dbResource.health,
    };
}

export function mapTrendingPrompt(dbPrompt: any): TrendingPrompt {
    return {
        id: dbPrompt.id,
        type: dbPrompt.type,
        title: dbPrompt.title,
        prompt: dbPrompt.prompt,
        thumbnail: dbPrompt.thumbnail,
        model: dbPrompt.model,
    };
}
