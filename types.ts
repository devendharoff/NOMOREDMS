
export interface Resource {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  thumbnail: string;
  date: string;
  url: string;
  isHidden?: boolean;
  status?: 'pending' | 'live' | 'broken';
  health?: 'ok' | 'error';
}

export interface Creator {
  id: string;
  slug: string;
  username: string;
  displayName: string;
  bio: string;
  profilePic: string;
  isVerified: boolean;
  isHidden?: boolean;
  niche?: string;
  followersCount: number;
  socials: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface TrendingPrompt {
  id: string;
  type: 'image' | 'video';
  title: string;
  prompt: string;
  thumbnail: string;
  model: string;
}
