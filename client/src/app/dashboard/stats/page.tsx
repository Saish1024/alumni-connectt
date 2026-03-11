"use client"
import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Newspaper, Shield, Loader2, ArrowRight, Activity, Globe } from 'lucide-react';
import { alumni as apiAlumni } from '@/lib/api';

export default function StatsReputationPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchLegacy = async () => {
            try {
                const legacyData = await apiAlumni.getLegacyStats();
                setData(legacyData);
            } catch (err) {
                console.error('Failed to fetch legacy stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLegacy();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const { archetype, multiplier, headlines, synthData } = data || {
        archetype: 'The Visionary',
        multiplier: { studentsHelped: 0, projectedValue: '$0', hoursInvested: 0 },
        headlines: [],
        synthData: { pulseRate: 60, color: '#8b5cf6' }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-[Inter,sans-serif] pb-20">
            {/* Holographic Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white border border-white/5 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/30 blur-[100px] rounded-full animate-pulse" />
                
                <div className="relative flex flex-col lg:flex-row items-center gap-10">
                    {/* The Impact Synth (Bio-Mechanical Organism) */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <div 
                            className="absolute inset-0 rounded-full blur-[40px] opacity-40 animate-pulse"
                            style={{ backgroundColor: synthData.color }}
                        />
                        <div className="impact-synth-container">
                            <div className="synth-core" style={{ 
                                animationDuration: `${60 / synthData.pulseRate * 2}s`,
                                background: `radial-gradient(circle at 30% 30%, white 0%, ${synthData.color} 100%)`
                            }} />
                            <div className="synth-orbit synth-orbit-1" />
                            <div className="synth-orbit synth-orbit-2" />
                        </div>
                        <div className="absolute -bottom-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/10 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                            <span className="text-[10px] font-[800] uppercase tracking-widest">Reputation Synth Active</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/20 mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs font-[800] uppercase tracking-[0.2em]">Authentic Legacy Established</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-[900] leading-tight mb-4 tracking-tight">
                            {archetype}
                        </h1>
                        <p className="text-slate-400 max-w-xl text-lg font-[500]">
                            Your influence on the next generation has triggered a chain reaction. 
                            You are no longer just a mentor; you are the architect of future history.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Legacy Multiplier Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap className="w-32 h-32" />
                    </div>
                    <h3 className="text-xs font-[800] text-slate-400 uppercase tracking-widest mb-8">The Legacy Multiplier (ROI)</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="text-5xl font-[900] text-slate-900 dark:text-white mb-1">{multiplier.projectedValue}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-[600]">Projected Economic Impact Generated</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <div className="text-2xl font-[800] text-indigo-500">{multiplier.studentsHelped}</div>
                                <div className="text-[10px] uppercase font-[700] text-slate-400">Unique Lives Touched</div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <div className="text-2xl font-[800] text-purple-500">{multiplier.hoursInvested}h</div>
                                <div className="text-[10px] uppercase font-[700] text-slate-400">Total wisdom Transmitted</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                            "One hour of your time results in an average of $50,000 in long-term student salary growth."
                        </p>
                    </div>
                </div>

                {/* Chronicle of 2040 */}
                <div className="lg:col-span-2 bg-[#fdfaf6] dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-amber-900/10 dark:border-white/5 shadow-2xl flex flex-col">
                    <div className="px-8 py-6 bg-[#1a1a1a] text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Newspaper className="w-5 h-5 text-amber-400" />
                            <span className="font-[900] uppercase tracking-[0.2em] text-sm">Chronicle of 2040</span>
                        </div>
                        <span className="text-[10px] font-[700] p-1 border border-white/20 rounded">ISSUE #LEGACY-01</span>
                    </div>
                    
                    <div className="p-8 space-y-8 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
                        {headlines.map((h: any, i: number) => (
                            <div key={i} className="group cursor-default border-b border-amber-900/5 dark:border-white/5 pb-8 last:border-0">
                                <div className="flex items-baseline justify-between mb-2">
                                    <h4 className="text-2xl font-serif dark:font-[Inter] font-[900] text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-indigo-400 transition-colors">
                                        {h.title}
                                    </h1>
                                    <span className="text-sm font-[800] text-amber-600/50 dark:text-indigo-500/50 tabular-nums">{h.year}</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 font-serif dark:font-[Inter] text-lg leading-[1.6]">
                                    {h.content}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-6 bg-amber-50 dark:bg-white/5 flex items-center justify-center gap-4 text-xs font-[800] text-amber-900/60 dark:text-white/40 uppercase tracking-widest">
                        <span>Simulation Alpha V.2</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-900/20 animate-bounce" />
                        <span>Based on Real-Time Mentorship Data</span>
                    </div>
                </div>
            </div>

            {/* Sovereign Sigil / ID Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border border-white/10 shadow-2xl">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                
                <div className="relative w-48 h-48 group">
                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-xl opacity-20" />
                    <div className="relative w-full h-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center p-8">
                        <Shield className="w-full h-full text-indigo-400" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Globe className="w-10 h-10 text-white animate-spin-slow" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h3 className="text-3xl font-[900]">Your Sovereign Sigil</h3>
                    <p className="text-slate-400 text-sm max-w-lg">
                        This holographic identifier is mathematically generated from your session frequency, student success rate, and category depth. It is your permanent mark on the institution's history.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <button className="px-6 py-3 bg-white text-slate-950 font-[800] rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                            Download Hologram (3D Model) <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-6 py-3 bg-white/10 border border-white/10 text-white font-[800] rounded-2xl hover:bg-white/20 transition-all">
                            Share to LinkedIn
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .impact-synth-container {
                    position: relative;
                    width: 154px;
                    height: 154px;
                    perspective: 1000px;
                }
                .synth-core {
                    width: 100%;
                    height: 100%;
                    border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
                    animation: morph 8s ease-in-out infinite, pulse 2s ease-in-out infinite;
                    box-shadow: 0 0 50px rgba(139, 92, 246, 0.5);
                }
                .synth-orbit {
                    position: absolute;
                    top: -10%; left: -10%; right: -10%; bottom: -10%;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                .synth-orbit-1 { animation: rotate 10s linear infinite; }
                .synth-orbit-2 { animation: rotate 15s linear reverse infinite; border-style: dashed; opacity: 0.5; }

                @keyframes morph {
                    0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: scale(1); }
                    33% { border-radius: 73% 27% 59% 41% / 57% 59% 41% 43%; transform: scale(1.05) rotate(5deg); }
                    66% { border-radius: 37% 63% 31% 69% / 28% 25% 75% 72%; transform: scale(0.95) rotate(-5deg); }
                    100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: scale(1); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; filter: brightness(1); }
                    50% { opacity: 1; filter: brightness(1.3); }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: rotate 6s linear infinite;
                }
                .blink {
                    animation: pulse 1s ease-in-out infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
