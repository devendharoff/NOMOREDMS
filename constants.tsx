import { Resource, Creator, TrendingPrompt } from './types';

export const RECENT_SEARCHES_KEY = 'nmd_recent_searches';

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'c1',
    slug: 'devender',
    username: 'devender',
    displayName: 'Devender AI',
    bio: 'Building the future of AI automation. Sharing my tech stack, prompts, and code templates.',
    profilePic: 'https://picsum.photos/seed/dev/200/200',
    isVerified: true,
    niche: 'Tech/AI',
    isHidden: false,
    followersCount: 14200,
    socials: { instagram: '#', twitter: '#', youtube: '#' }
  },
  {
    id: 'c2',
    slug: 'sarah-design',
    username: 'sarah_ux',
    displayName: 'Sarah Design',
    bio: 'Visual storyteller and UI/UX expert. I share Figma templates and design systems.',
    profilePic: 'https://picsum.photos/seed/sarah/200/200',
    isVerified: true,
    niche: 'Design',
    isHidden: false,
    followersCount: 8900,
    socials: { instagram: '#', twitter: '#' }
  },
  {
    id: 'c3',
    slug: 'design-daily',
    username: 'design_daily',
    displayName: 'Design Daily',
    bio: 'Your daily dose of design inspiration.',
    profilePic: 'https://picsum.photos/seed/daily/200/200',
    isVerified: false,
    niche: 'Design',
    isHidden: false,
    followersCount: 25000,
    socials: { instagram: '#' }
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    creatorId: 'c1',
    title: 'Cursor AI Setup: The Ultimate Productivity Config',
    description: 'A deep dive into the specific extensions, keybindings, and AI rules I use to write code 10x faster using Cursor and Sonnet 3.5.',
    category: 'AI Tools',
    tags: ['#AI', '#Productivity'],
    thumbnail: 'https://picsum.photos/seed/cursor/600/400',
    date: 'Oct 24, 2023',
    url: 'https://cursor.sh',
    isHidden: false,
    status: 'live',
    health: 'ok'
  },
  {
    id: '2',
    creatorId: 'c1',
    title: 'Gemini 2.5 API Masterclass: Advanced Prompting',
    description: 'Learn how to leverage the newest Gemini models for complex reasoning tasks.',
    category: 'Coding',
    tags: ['#AI', '#Python', '#API'],
    thumbnail: 'https://picsum.photos/seed/gemini/600/400',
    date: 'Nov 02, 2023',
    url: 'https://ai.google.dev',
    isHidden: false,
    status: 'live',
    health: 'ok'
  },
  // PENDING DATA FROM OPENCLAW BOT
  {
    id: 'p1',
    creatorId: 'c1',
    title: 'Check out this insane AI tool it helps you code faster than ever before guys you need this...',
    category: 'AI Tools',
    tags: [],
    thumbnail: 'https://picsum.photos/seed/p1/600/400',
    date: 'Dec 01, 2024',
    url: 'https://bit.ly/broken-example-404',
    status: 'pending',
    health: 'error'
  },
  {
    id: 'p2',
    creatorId: 'c3',
    title: 'Figma plugin for auto-layout you NEED it will save you 50 hours a week just use it',
    category: 'Design',
    tags: [],
    thumbnail: 'https://picsum.photos/seed/p2/600/400',
    date: 'Dec 02, 2024',
    url: 'https://gumroad.com/l/xyz',
    status: 'pending',
    health: 'ok'
  },
  {
    id: 'p3',
    creatorId: 'c1',
    title: 'How I automate my entire Twitter with Python scripts and Gemini AI this is crazy',
    category: 'Automation',
    tags: [],
    thumbnail: 'https://picsum.photos/seed/p3/600/400',
    date: 'Dec 03, 2024',
    url: 'https://github.com/example/bot',
    status: 'pending',
    health: 'ok'
  },
  {
    id: 'p4',
    creatorId: 'c2',
    title: 'My top 5 fonts for SaaS in 2024 that you haven\'t heard of yet subscribe for more',
    category: 'Design',
    tags: [],
    thumbnail: 'https://picsum.photos/seed/p4/600/400',
    date: 'Dec 04, 2024',
    url: 'https://google.com/fonts',
    status: 'pending',
    health: 'ok'
  },
  {
    id: 'p5',
    creatorId: 'c3',
    title: 'Secret Figma hack for responsive components that actually works unlike the rest',
    category: 'Design',
    tags: [],
    thumbnail: 'https://picsum.photos/seed/p5/600/400',
    date: 'Dec 05, 2024',
    url: 'https://youtube.com/watch?v=123',
    status: 'pending',
    health: 'ok'
  }
];


export const MOCK_TRENDING_PROMPTS: TrendingPrompt[] = [
  {
    id: 'p1',
    type: 'image',
    title: 'Cyberpunk Tokyo Rain',
    prompt: 'Cinematic wide shot of a neon-drenched Tokyo street at night, heavy rain, reflections on asphalt, hyper-detailed, 8k, shot on 35mm lens --ar 16:9 --v 6.0',
    thumbnail: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=800&auto=format&fit=crop',
    model: 'Midjourney v6'
  },
  {
    id: 'p2',
    type: 'video',
    title: 'Fluid Gold Macro',
    prompt: 'Macro video of liquid gold swirling with black ink, slow motion, crystalline structures forming, golden hour lighting, 4k, cinematic movement.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    model: 'Veo 3.1'
  }
];

export const SUGGESTIONS = [
  { label: 'AI Tools', category: 'AI Tools' },
  { label: 'AI Agents', category: 'AI Tools' },
  { label: 'Automation guides', category: 'Automation' },
  { label: 'Python Scripts', category: 'Coding' },
  { label: 'Figma Components', category: 'Design' }
];

export const TRENDING_TAGS = ['#AI', '#Productivity', '#Figma', '#Python', '#Automation', '#NoCode'];

export const CATEGORIES = ['All', 'AI Tools', 'Coding', 'Design', 'Automation'];
export const NICHES = ['Tech/AI', 'Design', 'Fashion', 'Lifestyle', 'Education', 'Other'];
