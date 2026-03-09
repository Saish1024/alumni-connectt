"use client"
import { useState } from 'react';
import { Trophy, Clock, Users, ArrowRight, Zap, Search, Award } from 'lucide-react';

export default function CompetitionsPage() {
    const [filter, setFilter] = useState('all');

    const comps = [
        {
            id: 1,
            title: 'Global CodeSprint 2026',
            type: 'Hackathon',
            status: 'ongoing',
            deadline: 'Mar 10',
            prize: '₹1.5 Lakhs',
            teams: 128,
            tags: ['AI/ML', 'Web3', 'Open Innovation'],
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'
        },
        {
            id: 2,
            title: 'Frontend Mastery Challenge',
            type: 'Competition',
            status: 'upcoming',
            deadline: 'Mar 25',
            prize: 'PPI by FlipKart',
            teams: 42,
            tags: ['React', 'CSS', 'UI/UX'],
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop'
        },
        {
            id: 3,
            title: 'Data Science Datathon',
            type: 'Hackathon',
            status: 'completed',
            deadline: 'Feb 28',
            prize: '₹50,000',
            teams: 85,
            tags: ['Python', 'Pandas', 'TensorFlow'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
        },
        {
            id: 4,
            title: 'System Design Interview Prep',
            type: 'Contest',
            status: 'upcoming',
            deadline: 'Apr 5',
            prize: 'Free Mentorship',
            teams: 120,
            tags: ['Architecture', 'Scalability'],
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop'
        }
    ];

    const filtered = filter === 'all' ? comps : comps.filter(c => c.status === filter);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Header section with gradient background */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-[700] uppercase tracking-wider mb-4">
                            <Zap className="w-3.5 h-3.5 text-amber-400" /> Unlock Your Potential
                        </div>
                        <h2 className="text-4xl font-[900] mb-2 tracking-tight">Competitions & Hackathons</h2>
                        <p className="text-white/80 text-sm max-w-xl font-[500] leading-relaxed">
                            Compete with peers, solve real-world industry problems, and win exciting cash prizes, hardware, and pre-placement interviews.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    {['all', 'ongoing', 'upcoming', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-[700] capitalize transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        placeholder="Search hackathons..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Competitions Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filtered.map(c => (
                    <div key={c.id} className="group bg-white dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
                        <div className="relative h-48 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                            <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                <span className={`px-3 py-1 text-xs font-[800] uppercase tracking-wider rounded-lg backdrop-blur-md border ${c.status === 'ongoing' ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                                        c.status === 'upcoming' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' :
                                            'bg-slate-500/20 text-slate-300 border-slate-400/30'
                                    }`}>
                                    {c.status}
                                </span>
                                <span className="px-3 py-1 text-xs font-[800] uppercase tracking-wider rounded-lg bg-black/40 text-white backdrop-blur-md border border-white/10">
                                    {c.type}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-[800] text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {c.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {c.tags.map(t => (
                                            <span key={t} className="text-[11px] font-[600] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-[700] text-slate-400">Prize Pool</div>
                                        <div className="text-sm font-[800] text-slate-900 dark:text-white">{c.prize}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-[700] text-slate-400">Participants</div>
                                        <div className="text-sm font-[800] text-slate-900 dark:text-white">{c.teams} Teams</div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-700/50 mb-6" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-[600] text-slate-500 dark:text-slate-400">
                                    <Clock className="w-4 h-4" />
                                    {c.status === 'completed' ? 'Ended on' : 'Registration ends:'} <span className="text-slate-900 dark:text-white">{c.deadline}</span>
                                </div>
                                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-[700] transition-all shadow-md ${c.status === 'completed' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow-none' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105'}`}>
                                    {c.status === 'completed' ? 'View Results' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
