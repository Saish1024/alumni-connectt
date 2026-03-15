"use client"
import { useState, useEffect } from 'react';
import { Trophy, Clock, Users, ArrowRight, Zap, Search, Award, Plus, Loader2, X, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CompetitionsPage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [comps, setComps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        type: 'Hackathon',
        deadline: '',
        prizePool: '',
        registrationLink: '',
        tags: '',
        description: ''
    });

    const fetchComps = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('alumni_token');
            const res = await fetch(`${baseUrl}/competitions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setComps(data);
        } catch (err) {
            console.error('Failed to fetch competitions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComps();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('alumni_token');
            const res = await fetch(`${baseUrl}/competitions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                })
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ title: '', type: 'Hackathon', deadline: '', prizePool: '', registrationLink: '', tags: '', description: '' });
                fetchComps();
            }
        } catch (err) {
            console.error('Failed to create competition:', err);
        } finally {
            setSubmitting(false);
        }
    };

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
                    {user?.role === 'faculty' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-[800] text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 flex-shrink-0">
                            <Plus className="w-5 h-5" /> Add Hackathon
                        </button>
                    )}
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

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filtered.map(c => (
                        <div key={c._id || c.id} className="group bg-white dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                                <img src={c.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
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
                                            {c.tags?.map((t: string) => (
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
                                            <div className="text-sm font-[800] text-slate-900 dark:text-white">{c.prizePool || c.prize}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-[700] text-slate-400">Participants</div>
                                            <div className="text-sm font-[800] text-slate-900 dark:text-white">{c.participantsCount || c.teams} Teams</div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-700/50 mb-6" />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-[600] text-slate-500 dark:text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        {c.status === 'completed' ? 'Ended on' : 'Registration ends:'} <span className="text-slate-900 dark:text-white">{c.deadline}</span>
                                    </div>
                                    <a
                                        href={c.registrationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-[700] transition-all shadow-md ${c.status === 'completed' ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow-none pointer-events-none' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105'}`}>
                                        {c.status === 'completed' ? 'View Results' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-16 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-2">No Competitions Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">New hackathons and coding challenges will appear here soon.</p>
                </div>
            )}

            {/* Add Hackathon Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-[900] text-slate-900 dark:text-white">Add New Hackathon</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Hackathon Title</label>
                                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" placeholder="e.g. InnovateX 2026" />
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none">
                                        <option>Hackathon</option>
                                        <option>Competition</option>
                                        <option>Contest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Deadline</label>
                                    <input required value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" placeholder="e.g. Mar 25" />
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Prize Pool</label>
                                    <input value={formData.prizePool} onChange={e => setFormData({ ...formData, prizePool: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" placeholder="e.g. ₹1.5 Lakhs" />
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
                                    <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" placeholder="AI/ML, Web3, JS" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Registration Link (External)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input required value={formData.registrationLink} onChange={e => setFormData({ ...formData, registrationLink: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" placeholder="https://devpost.com/..." />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2">Brief Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" placeholder="Describe the hackathon goals..." />
                                </div>
                            </div>
                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white font-[800] rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">
                                {submitting ? <><Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> Posting...</> : 'Publish Competition'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
