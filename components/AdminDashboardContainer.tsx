'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminDashboard from './AdminDashboard';
import { Creator, Resource, TrendingPrompt } from '@/types';

interface StatsProps {
    initialCreators: Creator[];
    initialResources: Resource[];
    initialPrompts: TrendingPrompt[];
}

export default function AdminDashboardContainer({ initialCreators, initialResources, initialPrompts }: StatsProps) {
    const [creators, setCreators] = useState<Creator[]>(initialCreators);
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [prompts, setPrompts] = useState<TrendingPrompt[]>(initialPrompts);

    const supabase = createClient();

    const handleUploadFile = async (file: File, bucket: 'avatars' | 'thumbnails') => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Check console for details.');
            return null;
        }
    };

    const handleAddResource = async (newR: Partial<Resource>) => {
        // Optimistic update
        const tempId = Math.random().toString(36).substr(2, 9);
        const resource: Resource = {
            id: tempId,
            creatorId: newR.creatorId || '',
            title: newR.title || 'Untitled',
            category: newR.category || 'AI Tools',
            tags: newR.tags || [],
            thumbnail: newR.thumbnail || 'https://picsum.photos/600/400',
            date: new Date().toISOString(),
            url: newR.url || '#',
            status: 'live',
            health: 'ok',
            description: newR.description,
            ...newR
        } as Resource;

        setResources(prev => [resource, ...prev]);

        // DB Insert
        const { data, error } = await supabase.from('resources').insert([{
            creator_id: resource.creatorId,
            title: resource.title,
            description: resource.description,
            category: resource.category,
            tags: resource.tags,
            thumbnail: resource.thumbnail,
            url: resource.url,
            status: resource.status,
            health: resource.health,
            date: resource.date
        }]).select().single();


        if (data) {
            // Replace temp ID with real ID
            setResources(prev => prev.map(r => r.id === tempId ? { ...r, id: data.id } : r));
        } else if (error) {
            console.error('Error adding resource:', error);
            // Revert
            setResources(prev => prev.filter(r => r.id !== tempId));
        }
    };

    const handleUpdateResource = async (id: string, updates: Partial<Resource>) => {
        setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail;
        if (updates.url !== undefined) dbUpdates.url = updates.url;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.health !== undefined) dbUpdates.health = updates.health;
        if (updates.isHidden !== undefined) dbUpdates.is_hidden = updates.isHidden;

        const { error } = await supabase.from('resources').update(dbUpdates).eq('id', id);
        if (error) console.error('Error updating resource:', error);
    };

    const handleDeleteResource = async (id: string) => {
        setResources(prev => prev.filter(r => r.id !== id));
        await supabase.from('resources').delete().eq('id', id);
    };

    const handleToggleResourceVisibility = async (id: string) => {
        const resource = resources.find(r => r.id === id);
        if (!resource) return;
        const newVal = !resource.isHidden;
        handleUpdateResource(id, { isHidden: newVal });
    };

    // Creators
    const handleAddCreator = async (newC: Partial<Creator>) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        const creator = { ...newC, id: tempId, followersCount: 0, socials: {}, isVerified: false, isHidden: false } as Creator;
        setCreators(prev => [creator, ...prev]);

        const { data } = await supabase.from('creators').insert([{
            slug: (newC.displayName || '').toLowerCase().replace(/\s+/g, '-'),
            username: newC.username,
            display_name: newC.displayName,
            niche: newC.niche,
            profile_pic: newC.profilePic,
            bio: newC.bio
        }]).select().single();

        if (data) {
            setCreators(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
        }
    };

    const handleUpdateCreator = async (id: string, updates: Partial<Creator>) => {
        setCreators(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        const dbUpdates: any = {};
        if (updates.username !== undefined) dbUpdates.username = updates.username;
        if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
        if (updates.niche !== undefined) dbUpdates.niche = updates.niche;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.profilePic !== undefined) dbUpdates.profile_pic = updates.profilePic;
        if (updates.isVerified !== undefined) dbUpdates.is_verified = updates.isVerified;
        if (updates.isHidden !== undefined) dbUpdates.is_hidden = updates.isHidden;
        if (updates.followersCount !== undefined) dbUpdates.followers_count = updates.followersCount;
        if (updates.socials !== undefined) dbUpdates.socials = updates.socials;

        await supabase.from('creators').update(dbUpdates).eq('id', id);
    };

    // Prompts
    const handleAddPrompt = async (newP: Partial<TrendingPrompt>) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        const prompt = { ...newP, id: tempId } as TrendingPrompt;
        setPrompts(prev => [prompt, ...prev]);

        const { data } = await supabase.from('trending_prompts').insert([newP]).select().single();
        if (data) {
            setPrompts(prev => prev.map(p => p.id === tempId ? { ...p, id: data.id } : p));
        }
    };

    const handleDeletePrompt = async (id: string) => {
        setPrompts(prev => prev.filter(p => p.id !== id));
        await supabase.from('trending_prompts').delete().eq('id', id);
    };

    return (
        <AdminDashboard
            creators={creators}
            resources={resources}
            trendingPrompts={prompts}
            onAddResource={handleAddResource}
            onAddCreator={handleAddCreator}
            onAddPrompt={handleAddPrompt}
            onDeleteResource={handleDeleteResource}
            onDeletePrompt={handleDeletePrompt}
            onToggleResourceVisibility={handleToggleResourceVisibility}
            onUpdateResource={handleUpdateResource}
            onUpdateCreator={handleUpdateCreator}
            onUploadFile={handleUploadFile}
        />
    );
}
