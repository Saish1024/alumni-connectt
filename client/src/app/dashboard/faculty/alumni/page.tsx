"use client"
import { useState, useEffect } from 'react';
import { users } from '@/lib/api';
import { Card } from '@/components/Card';
import { 
    Search, Filter, Mail, Linkedin, Phone, 
    ExternalLink, GraduationCap, Building2, MapPin,
    UserCheck, UserX, Clock, RefreshCw, Zap
} from 'lucide-react';

interface AlumniProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    company?: string;
    jobTitle?: string;
    industry?: string;
    linkedin?: string;
    phoneNumber?: string;
    batchYear?: string;
    isApproved: boolean;
}

export default function FacultyAlumniDirectory() {
    const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [search, setSearch] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');

    const fetchAlumni = async (silent = false) => {
        if (!silent) setLoading(true);
        else setIsRefreshing(true);
        
        try {
            const data = await users.list({ 
                role: 'alumni', 
                search: search || undefined,
                industry: filterIndustry || undefined
            });
            setAlumni(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch alumni:', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
        
        // Polling every 60 seconds for live feel
        const interval = setInterval(() => {
            fetchAlumni(true);
        }, 60000);

        return () => clearInterval(interval);
    }, [search, filterIndustry]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        Alumni Oversight
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">Live</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        Monitor professional profiles and contact details for all alumni.
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-xs">Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Sync Active</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, company, or skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={filterIndustry}
                        onChange={(e) => setFilterIndustry(e.target.value)}
                        className="px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none min-w-[180px] shadow-sm appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                    >
                        <option value="">All Industries</option>
                        <option value="Tech">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Product">Product Management</option>
                        <option value="Design">Design & Creative</option>
                    </select>
                    <button 
                        onClick={() => fetchAlumni()} 
                        disabled={isRefreshing}
                        className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-500 hover:border-indigo-500/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Alumni List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-72 rounded-[2rem] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 dark:from-slate-800/50 to-transparent" />
                        </div>
                    ))}
                </div>
            ) : alumni.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {alumni.map((person) => (
                        <Card key={person._id} className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-slate-200/60 dark:border-slate-800/60 overflow-hidden relative rounded-[2rem] p-0">
                            {/* Card Background Accent */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 group-hover:h-32 transition-all duration-500" />
                            
                            <div className="p-6 relative">
                                {/* Status Badge */}
                                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-2xl text-[9px] font-black uppercase tracking-[0.2em] ${
                                    person.isApproved 
                                        ? 'bg-emerald-500/10 text-emerald-600 border-l border-b border-emerald-500/20' 
                                        : 'bg-amber-500/10 text-amber-600 border-l border-b border-amber-500/20'
                                }`}>
                                    {person.isApproved ? 'Verified' : 'Pending'}
                                </div>

                                <div className="flex flex-col items-center text-center mt-4">
                                    <div className="relative mb-4">
                                        <div className="relative z-10">
                                            {person.profileImage ? (
                                                <img src={person.profileImage} alt={person.name} className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl font-black ring-4 ring-white dark:ring-slate-900 shadow-xl uppercase">
                                                    {person.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-lg z-20 group-hover:scale-110 transition-transform">
                                            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        </div>
                                    </div>

                                    <h3 className="font-[800] text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight text-lg">{person.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {person.jobTitle ? `${person.jobTitle} @ ${person.company}` : 'Professional Alumni'}
                                    </p>
                                </div>

                                {/* Stats Mini Grid */}
                                <div className="grid grid-cols-2 gap-2 mt-8">
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Batch</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{person.batchYear || 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Industry</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{person.industry || 'Tech'}</p>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-[11px] p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors group/link overflow-hidden">
                                        <span className="text-slate-400 font-bold flex items-center gap-1.5 flex-shrink-0 mr-4"><Mail className="w-3 h-3" /> EMAIL</span>
                                        <div className="flex-1 overflow-x-auto scrollbar-hide text-right">
                                            <span className="text-slate-700 dark:text-slate-300 font-black whitespace-nowrap select-all tracking-tight">{person.email}</span>
                                        </div>
                                    </div>
                                    {person.phoneNumber && (
                                        <div className="flex items-center justify-between text-[11px] p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors overflow-hidden">
                                            <span className="text-slate-400 font-bold flex items-center gap-1.5 flex-shrink-0 mr-4"><Phone className="w-3 h-3" /> PHONE</span>
                                            <div className="flex-1 overflow-x-auto scrollbar-hide text-right">
                                                <span className="text-slate-700 dark:text-slate-300 font-black whitespace-nowrap select-all tracking-tight">{person.phoneNumber}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center gap-2">
                                    {person.linkedin ? (
                                        <a 
                                            href={person.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0077b5] hover:bg-[#0077b5]/90 text-white text-[11px] font-black rounded-xl transition-all shadow-lg shadow-[#0077b5]/20 uppercase tracking-widest"
                                        >
                                            <Linkedin className="w-4 h-4" />
                                            Connect on LinkedIn
                                        </a>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-black rounded-xl uppercase tracking-widest cursor-not-allowed">
                                            No LinkedIn
                                        </div>
                                    )}
                                    <button className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all rounded-xl shadow-sm">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 animate-ping opacity-20" />
                        <UserX className="w-12 h-12 text-slate-300 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">No Alumni Reached Yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">
                        Try adjusting your filters or search terms. If alumni have registered, they will appear here once you hit refresh.
                    </p>
                    <button 
                        onClick={() => fetchAlumni()} 
                        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Try Refreshing Now
                    </button>
                </div>
            )}
        </div>
    );
}
