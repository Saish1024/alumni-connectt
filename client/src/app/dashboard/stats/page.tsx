"use client"
import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight, Activity, Globe, Star, Quote, Network, Users, Clock, Award, TrendingUp, Cpu, Shield } from 'lucide-react';
import { alumni as apiAlumni } from '@/lib/api';

export default function NetworkStatsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [legacy, setLegacy] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, legacyRes] = await Promise.all([
                    apiAlumni.getStats().catch(() => null),
                    apiAlumni.getLegacyStats().catch(() => null)
                ]);
                setStats(statsRes);
                setLegacy(legacyRes);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-slate-950 items-center justify-center min-h-[400px] rounded-[2.5rem]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const s = stats?.topStats || { studentsHelped: 0, sessionsDone: 0, avgRating: 0, collegesHelped: 0 };
    const l = legacy || { archetype: 'The Visionary', multiplier: { projectedValue: '$0', hoursInvested: 0 }, testimonials: [] };

    // Node data for network graph
    const nodes = [
        { id: 0, x: 50, y: 50, size: 28, color: '#8b5cf6', shadow: '0 0 40px #8b5cf6', z: 10, delay: 0 },
        { id: 1, x: 20, y: 30, size: 12, color: '#3b82f6', shadow: '0 0 20px #3b82f6', z: 5, delay: 0.2 },
        { id: 2, x: 80, y: 20, size: 16, color: '#ec4899', shadow: '0 0 25px #ec4899', z: 5, delay: 0.5 },
        { id: 3, x: 15, y: 70, size: 10, color: '#10b981', shadow: '0 0 15px #10b981', z: 5, delay: 0.8 },
        { id: 4, x: 85, y: 80, size: 14, color: '#6366f1', shadow: '0 0 20px #6366f1', z: 5, delay: 1.2 },
        { id: 5, x: 35, y: 15, size: 8, color: '#f59e0b', shadow: '0 0 10px #f59e0b', z: 5, delay: 1.5 },
        { id: 6, x: 65, y: 85, size: 10, color: '#06b6d4', shadow: '0 0 15px #06b6d4', z: 5, delay: 1.8 },
        { id: 7, x: 40, y: 80, size: 12, color: '#8b5cf6', shadow: '0 0 20px #8b5cf6', z: 5, delay: 2.1 },
        { id: 8, x: 70, y: 40, size: 8, color: '#ec4899', shadow: '0 0 10px #ec4899', z: 5, delay: 2.4 },
        { id: 9, x: 30, y: 55, size: 10, color: '#3b82f6', shadow: '0 0 15px #3b82f6', z: 5, delay: 2.7 },
        { id: 10, x: 90, y: 50, size: 8, color: '#10b981', shadow: '0 0 10px #10b981', z: 5, delay: 3.0 },
    ];

    const connections = [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 7], [0, 9],
        [1, 5], [2, 8], [4, 6], [2, 10], [9, 3], [7, 6]
    ];

    return (
        <div className="space-y-6 font-[Inter,sans-serif] pb-20 bg-slate-950 p-4 sm:p-8 rounded-[2.5rem] min-h-screen text-slate-200 animate-in fade-in duration-700">
            {/* Header: Network Overview */}
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 p-8 lg:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40" />
                
                {/* Network Visualization Background */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <svg className="w-full h-full absolute inset-0">
                        {connections.map(([a, b], i) => (
                            <line 
                                key={i}
                                x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
                                x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
                                stroke="rgba(139, 92, 246, 0.3)"
                                strokeWidth="1.5"
                                className="dash-line"
                            />
                        ))}
                    </svg>
                    {nodes.map(node => (
                        <div 
                            key={node.id}
                            className={`absolute rounded-full shadow-lg ${node.id === 0 ? 'bg-indigo-500 pulse-glow' : 'bg-slate-400'}`}
                            style={{
                                top: `${node.y}%`,
                                left: `${node.x}%`,
                                width: `${node.size}px`,
                                height: `${node.size}px`,
                                margin: `-${node.size/2}px 0 0 -${node.size/2}px`, // Center the node
                                boxShadow: node.shadow,
                                backgroundColor: node.color,
                                zIndex: node.z,
                                animation: `floatNode ${6 + (node.id % 4)}s infinite ease-in-out ${node.delay}s`
                            }}
                        >
                            <div className="absolute inset-0 bg-white/40 rounded-full blur-[2px]" />
                        </div>
                    ))}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-[800] uppercase tracking-widest mb-4">
                            <Network className="w-3.5 h-3.5" />
                            Network Impact Tracker
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-white tracking-tight mb-4">
                            The Butterfly <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Effect</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-[500] leading-relaxed">
                            Your mentorship creates ripples. Every session you lead expands your influence across the network, accelerating careers and defining the next generation of industry leaders.
                        </p>
                    </div>

                    {/* Network Stats Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full md:w-80 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-[700] text-slate-500 uppercase tracking-wider">Archetype</span>
                            <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-[10px] font-[800] uppercase tracking-widest border border-purple-500/20">{l.archetype}</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-3xl lg:text-4xl font-[900] text-white tracking-tight mb-1">{s.studentsHelped}</div>
                                <div className="text-xs font-[600] text-slate-500 uppercase tracking-wider">Nodes Activated (Students)</div>
                            </div>
                            <div className="h-px bg-slate-800 w-full" />
                            <div>
                                <div className="text-3xl lg:text-4xl font-[900] text-emerald-400 tracking-tight mb-1">{l.multiplier.projectedValue}</div>
                                <div className="text-xs font-[600] text-slate-500 uppercase tracking-wider">Projected Economic Ripple</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Metrics Overlay */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] p-6 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-[900] text-white mb-1">{s.sessionsDone}</div>
                    <div className="text-[10px] font-[700] text-slate-500 uppercase tracking-widest">Total Connections</div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] p-6 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-3xl font-[900] text-white mb-1">{l.multiplier.hoursInvested}h</div>
                    <div className="text-[10px] font-[700] text-slate-500 uppercase tracking-widest">Time Transmitted</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] p-6 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-3xl font-[900] text-white mb-1">{s.avgRating.toFixed(1)}</div>
                    <div className="text-[10px] font-[700] text-slate-500 uppercase tracking-widest">Impact Resonance</div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-[1.5rem] p-6 hover:bg-slate-800/80 transition-all duration-300 group shadow-lg">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-[900] text-white mb-1">{s.collegesHelped || 0}</div>
                    <div className="text-[10px] font-[700] text-slate-500 uppercase tracking-widest">Global Clusters Reached</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live Resonance Feed */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-xl font-[800] text-white">Live Resonance Feed</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-[800] uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Signal
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {l.testimonials && l.testimonials.length > 0 ? (
                            l.testimonials.map((t: any, i: number) => (
                                <div key={i} className="flex gap-4 p-5 bg-slate-800/30 rounded-[1.5rem] border border-slate-700/50 hover:bg-slate-800/80 transition-all hover:-translate-y-0.5 shadow-md">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                                        <Quote className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-[700] text-white">{t.studentName}</span>
                                                <span className="text-slate-600 hidden sm:inline">•</span>
                                                <span className="text-[10px] font-[800] uppercase tracking-widest text-indigo-400">{t.category}</span>
                                            </div>
                                            <div className="flex items-center mt-2 sm:mt-0">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < t.score ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm font-[500] text-slate-400 leading-relaxed italic">"{t.feedback}"</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                    <Activity className="w-8 h-8 text-slate-600" />
                                </div>
                                <h4 className="text-white font-[800] mb-2">No Active Resonance Signals</h4>
                                <p className="text-slate-500 font-[500] text-sm max-w-sm">Complete mentoring sessions and receive student feedback to activate nodes in your resonance feed.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Diagnostics / Milestones */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            <h3 className="text-xl font-[800] text-white">System Protocol</h3>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1">
                        {/* Level Progress */}
                        <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-[800] text-slate-400 uppercase tracking-widest">Network Authority</span>
                                <span className="text-sm font-[900] text-amber-400">Level 4</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-700">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 w-[80%] glow-bar" />
                            </div>
                            <div className="text-[10px] font-[600] text-slate-500 mt-2 text-right">800/1000 EXP to Level 5</div>
                        </div>

                        {/* Milestones */}
                        <div>
                            <h4 className="text-[10px] font-[800] text-slate-500 uppercase tracking-widest mb-4">Milestones Unlocked</h4>
                            <div className="space-y-3">
                                {[
                                    { name: 'First Connection', desc: 'Hosted 1 session', icon: Award, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                    { name: 'Ripple Maker', desc: 'Influenced 10 students', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                    { name: 'The Architect', desc: 'Maintained 5.0 rating', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' }
                                ].map((m, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/20 border border-slate-800 rounded-2xl hover:bg-slate-800/50 transition-colors">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                                            <m.icon className={`w-5 h-5 ${m.color}`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-[800] text-white">{m.name}</div>
                                            <div className="text-[10px] font-[600] text-slate-500">{m.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dash-line {
                    stroke-dasharray: 6;
                    animation: dashAnim 15s linear infinite;
                }
                @keyframes dashAnim {
                    to {
                        stroke-dashoffset: -100;
                    }
                }
                @keyframes floatNode {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-3px) translateX(3px); }
                    50% { transform: translateY(3px) translateX(0); }
                    75% { transform: translateY(0) translateX(-3px); }
                }
                .pulse-glow {
                    animation: mainPulse 3s infinite alternate;
                }
                @keyframes mainPulse {
                    from { box-shadow: 0 0 20px #8b5cf6, inset 0 0 10px rgba(255,255,255,0.5); }
                    to { box-shadow: 0 0 50px #c084fc, inset 0 0 20px rgba(255,255,255,0.8); }
                }
                .glow-bar {
                    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
                }
                
                /* Custom Scrollbar for feed */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(100, 116, 139, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(100, 116, 139, 0.5);
                }
            `}</style>
        </div>
    );
}
