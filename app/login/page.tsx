'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const getRedirectUrl = () => {
        // Ensure we're running in the browser
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/auth/callback`;
        }
        return '';
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: getRedirectUrl(),
                },
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                router.push('/');
                router.refresh(); // Refresh server components to update auth state
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
            <Link href="/" className="fixed top-6 left-6 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>

            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-zinc-900 rounded-3xl mb-6 shadow-2xl border border-white/5">
                        <Zap className="h-10 w-10 text-white fill-current" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Welcome Back</h2>
                    <p className="text-zinc-500 font-medium">Enter the vault of resources</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <img src="https://www.google.com/favicon.ico" alt="" className="h-4 w-4" />
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                            <span className="bg-zinc-900/50 px-4 text-zinc-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all font-medium"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all font-medium"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                    Secured by NOMOREDMS Identity
                </div>
            </div>
        </div>
    );
}
