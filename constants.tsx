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
  },
  {
    id: 'c4',
    slug: 'vagera-tech',
    username: 'vagera_ai',
    displayName: 'Vagera Tech',
    bio: 'Automating everything from web scrapers to AI agents. Open sourcing my internal tools.',
    profilePic: 'https://picsum.photos/seed/vagera/200/200',
    isVerified: true,
    niche: 'Automation',
    isHidden: false,
    followersCount: 5600,
    socials: { github: '#', twitter: '#' }
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
    title: 'CodeFast: The AI-Driven Coding Assistant',
    description: 'An advanced VS Code extension that predicts your next 50 lines of code with 90% accuracy.',
    category: 'AI Tools',
    tags: ['#AI', '#Coding'],
    thumbnail: 'https://images.unsplash.com/photo-1627398240445-5643e2609c13?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 01, 2024',
    url: 'https://codefast.ai',
    status: 'live',
    health: 'ok'
  },
  {
    id: 'p2',
    creatorId: 'c3',
    title: 'Figma Auto-Layout Magic: 50+ Component Templates',
    description: 'Stop building from scratch. Use these pre-built, perfectly responsive components.',
    category: 'Design',
    tags: ['#Figma', '#Design'],
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 02, 2024',
    url: 'https://figma.com/community/file/xyz',
    status: 'live',
    health: 'ok'
  },
  {
    id: 'p3',
    creatorId: 'c4',
    title: 'Python Twitter Automator: 0 to 10k Followers',
    description: 'The exact script I used to automate my Twitter growth using Gemini Pro and Tweepy.',
    category: 'Automation',
    tags: ['#Python', '#Twitter'],
    thumbnail: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 03, 2024',
    url: 'https://github.com/vagera/twitter-bot',
    status: 'live',
    health: 'ok'
  },
  {
    id: 'p4',
    creatorId: 'c2',
    title: 'SaaS Font Kit 2024: Premium Typography Guide',
    description: 'A curated list of free and paid font pairings optimized for high-conversion SaaS landing pages.',
    category: 'Design',
    tags: ['#SaaS', '#Typography'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 04, 2024',
    url: 'https://google.com/fonts',
    status: 'live',
    health: 'ok'
  },
  {
    id: 'p5',
    creatorId: 'c3',
    title: 'Responsive Component Hack: Subgrid & Container Queries',
    description: 'The secret technique for building truly adaptive components without media query hell.',
    category: 'Design',
    tags: ['#CSS', '#Responsiveness'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 05, 2024',
    url: 'https://youtube.com/watch?v=123',
    status: 'pending',
    health: 'ok'
  },
  {
    id: 'p6',
    creatorId: 'c1',
    title: 'Full-Stack Next.js 15 Starter Kit',
    description: 'My personal boilerplate with Next.js 15, Turbopack, Supabase, Tailwind, and Stripe ready to go.',
    category: 'Coding',
    tags: ['#NextJS', '#Boilerplate'],
    thumbnail: 'https://images.unsplash.com/photo-1618477247222-ac60ceb0a416?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 10, 2024',
    url: 'https://github.com/devender/next-starter',
    status: 'live',
    health: 'ok'
  },
  {
    id: 'p7',
    creatorId: 'c4',
    title: 'Make.com Blueprints: 10 Automation Workflows',
    description: 'Pre-configured Make.com blueprints to automate your CRM, emails, and social media posting.',
    category: 'Automation',
    tags: ['#Make', '#NoCode'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    date: 'Dec 12, 2024',
    url: 'https://make.com/templates',
    status: 'live',
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
    model: 'Midjourney v6',
    likes: 124
  },
  {
    id: 'p2',
    type: 'video',
    title: 'Fluid Gold Macro',
    prompt: 'Macro video of liquid gold swirling with black ink, slow motion, crystalline structures forming, golden hour lighting, 4k, cinematic movement.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    model: 'Veo 3.1',
    likes: 89
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
