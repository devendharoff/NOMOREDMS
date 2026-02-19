'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  UserPlus,
  FilePlus,
  EyeOff,
  Eye,
  Search,
  Terminal,
  Activity,
  AlertCircle,
  CheckCircle,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Globe,
  X,
  Users,
  Check,
  Filter,
  BadgeCheck,
  Eraser,
  Save,
  Ban,
  MoreHorizontal,
  ChevronRight,
  Database,
  History,
  Archive,
  FileText,
  Sparkles,
  Video,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { Creator, Resource, TrendingPrompt } from '@/types';
import { NICHES, CATEGORIES } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  creators: Creator[];
  resources: Resource[];
  trendingPrompts?: TrendingPrompt[];
  onAddResource: (r: Partial<Resource>) => void;
  onAddCreator: (c: Partial<Creator>) => void;
  onAddPrompt?: (p: Partial<TrendingPrompt>) => void;
  onDeleteResource: (id: string) => void;
  onDeletePrompt?: (id: string) => void;
  onToggleResourceVisibility: (id: string) => void;
  onUpdateResource?: (id: string, updates: Partial<Resource>) => void;
  onUpdateCreator?: (id: string, updates: Partial<Creator>) => void;
  onUploadFile?: (file: File, bucket: 'avatars' | 'thumbnails') => Promise<string | null>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  creators,
  resources,
  trendingPrompts = [],
  onAddResource,
  onAddCreator,
  onAddPrompt,
  onDeleteResource,
  onDeletePrompt,
  onToggleResourceVisibility,
  onUpdateResource,
  onUpdateCreator,
  onUploadFile
}) => {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'staging' | 'rolodex' | 'fixer' | 'manual' | 'prompts'>('staging');
  const [editingItem, setEditingItem] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form States
  const [newManualResource, setNewManualResource] = useState<Partial<Resource>>({
    creatorId: '',
    title: '',
    description: '',
    url: '',
    category: 'AI Tools',
    tags: []
  });

  const [newCreator, setNewCreator] = useState({
    username: '',
    displayName: '',
    niche: 'Tech/AI',
    bio: '',
    profilePic: ''
  });

  const [newPrompt, setNewPrompt] = useState<Partial<TrendingPrompt>>({
    title: '',
    type: 'image',
    prompt: '',
    thumbnail: '',
    model: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') setIsAuthorized(true);
    else alert('ACCESS DENIED');
  };

  const processFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: 'avatars' | 'thumbnails', callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0] && onUploadFile) {
      const file = e.target.files[0];
      const url = await onUploadFile(file, bucket);
      if (url) callback(url);
    }
  };

  const handleApprove = (item: Resource) => {
    if (onUpdateResource) {
      onUpdateResource(item.id, { ...item, status: 'live', isHidden: false });
      setEditingItem(null);
    }
  };

  const handleReject = (id: string) => {
    onDeleteResource(id);
    setEditingItem(null);
  };

  const pendingResources = useMemo(() => resources.filter(r => r.status === 'pending'), [resources]);
  const liveResources = useMemo(() => resources.filter(r => r.status === 'live'), [resources]);
  const brokenCount = useMemo(() => resources.filter(r => r.health === 'error').length, [resources]);

  const filteredLive = useMemo(() => {
    if (!searchQuery) return liveResources;
    const lower = searchQuery.toLowerCase();
    return liveResources.filter(r =>
      r.title.toLowerCase().includes(lower) ||
      creators.find(c => c.id === r.creatorId)?.displayName.toLowerCase().includes(lower) ||
      creators.find(c => c.id === r.creatorId)?.username.toLowerCase().includes(lower)
    );
  }, [liveResources, searchQuery, creators]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 font-mono">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 rounded-[2.5rem] border border-white/10 bg-neutral-900 p-12 shadow-2xl">
          <div className="flex justify-center"><Terminal className="h-12 w-12 text-white" /></div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">ADMIN_LOGIN</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Secure Shell Access Required</p>
          </div>
          <input
            type="password"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full rounded-2xl border border-white/5 bg-black p-5 text-center text-3xl font-bold tracking-[0.5em] text-white focus:border-green-500 outline-none transition-all"
          />
          <button className="w-full rounded-2xl bg-white py-5 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-neutral-200 active:scale-95 transition-all">Connect Hub</button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 font-sans antialiased">
      {/* HUD Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Pending Queue', value: pendingResources.length, color: 'text-yellow-400', icon: Activity, bg: 'bg-yellow-400/5', border: 'border-yellow-400/10' },
          { label: 'Dead Links', value: brokenCount, color: 'text-red-500', icon: AlertCircle, bg: 'bg-red-500/5', border: 'border-red-500/10' },
          { label: 'Live Assets', value: liveResources.length, color: 'text-green-500', icon: CheckCircle, bg: 'bg-green-500/5', border: 'border-green-500/10' },
          { label: 'Viral Prompts', value: trendingPrompts.length, color: 'text-orange-400', icon: Sparkles, bg: 'bg-orange-400/5', border: 'border-orange-400/10' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-[1.5rem] border ${stat.border} ${stat.bg} p-6 backdrop-blur-md`}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className="text-[8px] font-black text-neutral-500 uppercase tracking-widest font-mono">NODE_{i + 1}</div>
            </div>
            <div className={`text-4xl font-black mb-1 tracking-tighter ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 font-mono">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module Switcher */}
      <div className="flex items-center gap-2 rounded-2xl bg-neutral-900 p-2 mb-12 w-fit border border-white/5 mx-auto overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('staging')} className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'staging' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-neutral-500 hover:text-white'}`}>Triage</button>
        <button onClick={() => setActiveTab('rolodex')} className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'rolodex' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-neutral-500 hover:text-white'}`}>Creators</button>
        <button onClick={() => setActiveTab('fixer')} className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'fixer' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-neutral-500 hover:text-white'}`}>Live Fixer</button>
        <button onClick={() => setActiveTab('prompts')} className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'prompts' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-neutral-500 hover:text-white'} flex items-center gap-2`}><Sparkles className="h-3 w-3" /> Prompt Forge</button>
        <button onClick={() => setActiveTab('manual')} className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-neutral-500 hover:text-white'}`}>Manual</button>
      </div>

      <AnimatePresence mode="wait">
        {/* Module: Prompts */}
        {activeTab === 'prompts' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-neutral-900/50 p-10 space-y-8 sticky top-32 shadow-3xl">
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-3"><Sparkles className="h-5 w-5 text-orange-400" /> Viral Injection</h3>
                  <p className="text-[10px] text-neutral-500 uppercase font-black">Feed the Trending Vault.</p>
                </div>

                <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/5">
                  <button onClick={() => setNewPrompt({ ...newPrompt, type: 'image' })} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${newPrompt.type === 'image' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}><ImageIcon className="h-3.5 w-3.5" /> Image</button>
                  <button onClick={() => setNewPrompt({ ...newPrompt, type: 'video' })} className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${newPrompt.type === 'video' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}><Video className="h-3.5 w-3.5" /> Video</button>
                </div>

                <form className="space-y-5" onSubmit={e => { e.preventDefault(); onAddPrompt?.(newPrompt); setNewPrompt({ title: '', type: 'image', prompt: '', thumbnail: '', model: '' }); }}>
                  <input value={newPrompt.title} onChange={e => setNewPrompt({ ...newPrompt, title: e.target.value })} placeholder="Creation Title..." className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all shadow-inner" required />
                  <textarea value={newPrompt.prompt} onChange={e => setNewPrompt({ ...newPrompt, prompt: e.target.value })} placeholder="Paste raw prompt code here..." className="w-full bg-black border border-white/5 rounded-2xl p-5 text-xs font-mono text-white focus:border-orange-500 outline-none transition-all h-32 shadow-inner" required />
                  <input value={newPrompt.thumbnail} onChange={e => setNewPrompt({ ...newPrompt, thumbnail: e.target.value })} placeholder="Media URL (Img/Vid Source)" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all shadow-inner" required />
                  <div className="flex items-center gap-2">
                    <label className="flex-none p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => processFileUpload(e, 'thumbnails', (url) => setNewPrompt({ ...newPrompt, thumbnail: url }))} />
                      <ImageIcon className="h-4 w-4 text-neutral-400" />
                    </label>
                    <p className="text-[10px] text-neutral-500 uppercase font-black tracking-wider">Or Upload File</p>
                  </div>
                  <input value={newPrompt.model} onChange={e => setNewPrompt({ ...newPrompt, model: e.target.value })} placeholder="Model (e.g. Midjourney v6)" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all shadow-inner" required />
                  <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4"><Send className="h-4 w-4" /> Deploy to Feed</button>
                </form>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-neutral-900/40 overflow-hidden shadow-2xl backdrop-blur-sm h-fit">
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-black/40">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Live Trending Prompts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500 font-black uppercase tracking-widest bg-black/20 font-mono">
                      <th className="px-10 py-5">Preview</th>
                      <th className="px-10 py-5">Descriptor</th>
                      <th className="px-10 py-5">Model/Type</th>
                      <th className="px-10 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {trendingPrompts.map(p => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6">
                          <img src={p.thumbnail} className="h-14 w-24 rounded-xl border border-white/10 object-cover shadow-2xl" alt="" />
                        </td>
                        <td className="px-10 py-6">
                          <div className="font-black text-white text-sm uppercase tracking-tight mb-1">{p.title}</div>
                          <div className="text-[10px] text-neutral-500 truncate max-w-[200px] italic">"{p.prompt}"</div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase text-neutral-400 block tracking-widest">{p.model}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${p.type === 'video' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                              {p.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => onDeletePrompt?.(p.id)} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                    {trendingPrompts.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Sparkles className="h-10 w-10 text-neutral-700 mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Viral vault is empty.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Module 1: Staging Area */}
        {activeTab === 'staging' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                Verify Scraped Data
                <span className="text-[10px] font-black text-neutral-500 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest font-mono">OPENCLAW_UPLINK</span>
              </h3>
            </div>

            <div className="rounded-[2rem] border border-white/5 bg-neutral-900/40 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500 font-black uppercase tracking-widest bg-black/40">
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Source</th>
                      <th className="px-8 py-5">Extracted Info</th>
                      <th className="px-8 py-5 text-right">Sanitize & Push</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingResources.map((item) => {
                      const creator = creators.find(c => c.id === item.creatorId);
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-tight">Pending</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <img src={creator?.profilePic} className="h-10 w-10 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all object-cover" alt="" />
                              <div className="font-bold text-white uppercase tracking-tight">@{creator?.username}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 max-w-[400px]">
                            <div className="text-neutral-200 font-bold truncate text-sm">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className={`h-1.5 w-1.5 rounded-full ${item.health === 'ok' ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px] ${item.health === 'ok' ? 'shadow-green-500/50' : 'shadow-red-500/50'}`} />
                              <span className="text-[10px] text-neutral-500 font-mono uppercase font-black">{item.url.substring(0, 30)}...</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => window.open(item.url, '_blank')} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all flex items-center gap-2 group/btn"><ExternalLink className="h-3.5 w-3.5" /> Test Link</button>
                              <button onClick={() => setEditingItem(item)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all flex items-center gap-2"><Edit2 className="h-3.5 w-3.5" /> Edit</button>
                              <button onClick={() => handleApprove(item)} className="px-6 py-2 rounded-xl bg-green-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"><Check className="h-4 w-4" /> Publish</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {pendingResources.length === 0 && (
                  <div className="py-32 text-center space-y-4">
                    <Archive className="h-12 w-12 text-neutral-700 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">All scraped assets processed.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Module 2: Rolodex */}
        {activeTab === 'rolodex' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div className="space-y-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-neutral-900/50 p-10 space-y-8 sticky top-32 shadow-3xl">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><UserPlus className="h-5 w-5 text-blue-400" /> New Profile</h3>
                  <p className="text-[10px] text-neutral-500 uppercase font-black">Register a new creator container.</p>
                </div>
                <form className="space-y-5" onSubmit={e => { e.preventDefault(); onAddCreator(newCreator); setNewCreator({ username: '', displayName: '', niche: 'Tech/AI', bio: '', profilePic: '' }); }}>
                  <input value={newCreator.displayName} onChange={e => setNewCreator({ ...newCreator, displayName: e.target.value })} placeholder="Display Name (e.g. Sarah UX)" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all shadow-inner" required />
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600 font-bold italic">@</span>
                    <input value={newCreator.username} onChange={e => setNewCreator({ ...newCreator, username: e.target.value })} placeholder="handle" className="w-full bg-black border border-white/5 rounded-2xl p-5 pl-10 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all shadow-inner" required />
                  </div>
                  <select value={newCreator.niche} onChange={e => setNewCreator({ ...newCreator, niche: e.target.value })} className="w-full bg-black border border-white/5 rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                    {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <input value={newCreator.profilePic} onChange={e => setNewCreator({ ...newCreator, profilePic: e.target.value })} placeholder="Profile Pic URL" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all shadow-inner" />
                  <div className="flex items-center gap-2">
                    <label className="flex-none p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => processFileUpload(e, 'avatars', (url) => setNewCreator({ ...newCreator, profilePic: url }))} />
                      <UserPlus className="h-4 w-4 text-neutral-400" />
                    </label>
                    <p className="text-[10px] text-neutral-500 uppercase font-black tracking-wider">Or Upload Avatar</p>
                  </div>
                  <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl">Create Profile</button>
                </form>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-neutral-900/40 overflow-hidden shadow-2xl backdrop-blur-sm h-fit">
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-black/40">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Global Creator Rolodex</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500 font-black uppercase tracking-widest bg-black/20 font-mono">
                      <th className="px-10 py-5">Uplink</th>
                      <th className="px-10 py-5">Niche</th>
                      <th className="px-10 py-5">Verification</th>
                      <th className="px-10 py-5 text-right">Visibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {creators.map(c => (
                      <tr key={c.id} className={`hover:bg-white/[0.02] transition-colors group ${c.isHidden ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <img src={c.profilePic} className="h-12 w-12 rounded-full border border-white/10 object-cover shadow-2xl" alt="" />
                            <div>
                              <div className="flex items-center gap-2 font-black text-white text-sm uppercase tracking-tight">
                                {c.displayName}
                                {c.isVerified && <BadgeCheck className="h-4 w-4 text-blue-400" />}
                              </div>
                              <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">@{c.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6"><span className="text-[10px] font-black uppercase text-neutral-500 border border-white/5 px-3 py-1 rounded bg-black/40">{c.niche}</span></td>
                        <td className="px-10 py-6">
                          <button
                            onClick={() => onUpdateCreator?.(c.id, { isVerified: !c.isVerified })}
                            className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${c.isVerified ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-neutral-700 text-neutral-500 bg-black/40'}`}
                          >
                            {c.isVerified ? 'Verified' : 'Unverified'}
                          </button>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button
                            onClick={() => onUpdateCreator?.(c.id, { isHidden: !c.isHidden })}
                            className={`p-3 rounded-xl transition-all ${c.isHidden ? 'text-red-500 bg-red-500/10' : 'text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10'}`}
                            title={c.isHidden ? "Unhide" : "Ghost Hide"}
                          >
                            {c.isHidden ? <Ban className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Module 3: Fixer */}
        {activeTab === 'fixer' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">Global Resource Fixer</h3>
              <div className="relative w-full md:w-[28rem]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-600" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by Handle, Title, or URL..."
                  className="w-full bg-neutral-900 border border-white/5 rounded-[1.5rem] py-4.5 pl-14 pr-6 text-xs font-black uppercase tracking-widest text-white focus:border-green-500 outline-none transition-all shadow-3xl"
                />
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-neutral-900/40 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500 font-black uppercase tracking-widest bg-black/40 font-mono">
                      <th className="px-10 py-5">Descriptor</th>
                      <th className="px-10 py-5">Owner</th>
                      <th className="px-10 py-5">Status</th>
                      <th className="px-10 py-5 text-right">Maintenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLive.map(r => (
                      <tr key={r.id} className={`hover:bg-white/[0.02] transition-colors group ${r.isHidden ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-10 py-7">
                          <div className="font-black text-white text-sm mb-1.5 uppercase tracking-tight">{r.title}</div>
                          <div className="text-[10px] text-neutral-500 font-mono truncate max-w-[300px] flex items-center gap-2">
                            <Globe className="h-3 w-3" /> {r.url}
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-3">
                            <img src={creators.find(c => c.id === r.creatorId)?.profilePic} className="h-8 w-8 rounded-full grayscale group-hover:grayscale-0 transition-all border border-white/10" alt="" />
                            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">@{creators.find(c => c.id === r.creatorId)?.username}</span>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${r.health === 'ok' ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shadow-[0_0_12px] ${r.health === 'ok' ? 'shadow-green-500/60' : 'shadow-red-500/60'}`} />
                            <span className="text-[9px] font-black uppercase font-mono text-neutral-500">{r.health === 'ok' ? 'Online' : 'Faulty'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setEditingItem(r)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all" title="Edit"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => onToggleResourceVisibility(r.id)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all" title="Ghost Hide">{r.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                            <button onClick={() => onDeleteResource(r.id)} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Wipe (Hard Delete)"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Module 4: Manual Entry */}
        {activeTab === 'manual' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-3xl mx-auto">
            <div className="rounded-[2.5rem] border border-white/10 bg-neutral-900/50 p-12 space-y-10 shadow-3xl">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center gap-4">
                  <FilePlus className="h-8 w-8 text-green-500" />
                  Manual Insertion
                </h3>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.3em]">Bypass scraper and inject asset directly</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Assign to Creator</label>
                  <select
                    value={newManualResource.creatorId}
                    onChange={e => setNewManualResource({ ...newManualResource, creatorId: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-green-500 outline-none appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="">Select Target Profile...</option>
                    {creators.map(c => <option key={c.id} value={c.id}>{c.displayName} (@{c.username})</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Asset Title</label>
                  <input
                    value={newManualResource.title}
                    onChange={e => setNewManualResource({ ...newManualResource, title: e.target.value })}
                    placeholder="E.g. The Ultimate Python Automation Script"
                    className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-green-500 outline-none shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Detailed Description</label>
                  <textarea
                    value={newManualResource.description}
                    onChange={e => setNewManualResource({ ...newManualResource, description: e.target.value })}
                    placeholder="Provide a concise but detailed summary of the resource..."
                    className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-green-500 outline-none shadow-inner h-24"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Destination URL</label>
                  <input
                    value={newManualResource.url}
                    onChange={e => setNewManualResource({ ...newManualResource, url: e.target.value })}
                    placeholder="https://notion.site/..."
                    className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-green-500 outline-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Category</label>
                    <select
                      value={newManualResource.category}
                      onChange={e => setNewManualResource({ ...newManualResource, category: e.target.value })}
                      className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-black uppercase tracking-widest text-white outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Tags (Comma Sep)</label>
                    <input
                      placeholder="AI, Code, Free"
                      onChange={e => setNewManualResource({ ...newManualResource, tags: e.target.value.split(',').map(t => t.trim()) })}
                      className="w-full bg-black border border-white/5 rounded-xl p-4 text-xs font-bold text-white focus:border-green-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => { onAddResource(newManualResource); setActiveTab('fixer'); }}
                  className="w-full bg-green-500 text-black py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-green-400 transition-all active:scale-95 shadow-2xl shadow-green-500/20 flex items-center justify-center gap-4"
                >
                  <Database className="h-5 w-5" /> Ingest & Publish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sanitize/Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setEditingItem(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-xl rounded-[3rem] border border-white/10 bg-neutral-900 p-12 shadow-3xl">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Asset Refinement</h3>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest font-mono">NODE_HASH: {editingItem.id}</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 transition-all"><X className="h-6 w-6" /></button>
              </div>

              <div className="space-y-8 overflow-y-auto no-scrollbar max-h-[70vh] px-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2">
                    <Eraser className="h-3 w-3" /> Sanitize Title
                  </label>
                  <textarea
                    value={editingItem.title}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-[1.5rem] p-6 text-sm font-bold text-white focus:border-green-500 outline-none transition-all h-24 shadow-inner"
                    placeholder="Remove scraper noise..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2">
                    <FileText className="h-3 w-3" /> Polish Description
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-[1.5rem] p-6 text-sm font-bold text-white focus:border-green-500 outline-none transition-all h-32 shadow-inner"
                    placeholder="Add a detailed description for the vault..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2">
                    <ImageIcon className="h-3 w-3" /> Thumbnail & Media
                  </label>
                  <div className="space-y-2">
                    <input
                      value={editingItem.thumbnail}
                      onChange={e => setEditingItem({ ...editingItem, thumbnail: e.target.value })}
                      className="w-full bg-black border border-white/5 rounded-2xl p-5 text-sm font-bold text-white focus:border-green-500 outline-none transition-all shadow-inner"
                      placeholder="Image URL"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex-none p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => processFileUpload(e, 'thumbnails', (url) => setEditingItem({ ...editingItem, thumbnail: url }))} />
                        <ImageIcon className="h-4 w-4 text-neutral-400" />
                      </label>
                      <p className="text-[10px] text-neutral-500 uppercase font-black tracking-wider">Upload New Thumbnail</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Destination URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      value={editingItem.url}
                      onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                      className="flex-1 bg-black border border-white/5 rounded-xl p-5 text-xs font-bold text-white focus:border-green-500 outline-none shadow-inner"
                    />
                    <button onClick={() => window.open(editingItem.url, '_blank')} className="px-6 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center"><ExternalLink className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 flex items-center gap-2">
                    <Filter className="h-3 w-3" /> Categorization & Tagging
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="bg-black border border-white/5 rounded-xl p-5 text-[10px] font-black uppercase tracking-widest text-white focus:border-green-500 outline-none appearance-none shadow-inner"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      value={editingItem.tags.join(', ')}
                      onChange={e => setEditingItem({ ...editingItem, tags: e.target.value.split(',').map(t => t.trim()) })}
                      placeholder="AI, Code, Free..."
                      className="w-full bg-black border border-white/5 rounded-xl p-5 text-xs font-bold text-white focus:border-green-500 outline-none shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-6 sticky bottom-0 bg-neutral-900 pb-2">
                  <button onClick={() => { handleReject(editingItem.id); }} className="flex items-center justify-center gap-3 py-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl group">
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-all" /> Reject & Purge
                  </button>
                  <button onClick={() => { handleApprove(editingItem); }} className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-green-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition-all shadow-2xl shadow-green-500/20 group">
                    <Save className="h-4 w-4 group-hover:scale-110 transition-all" /> Approve & Sync
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
