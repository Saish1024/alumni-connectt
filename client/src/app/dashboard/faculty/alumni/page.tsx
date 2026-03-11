"use client"
import { useState, useEffect } from 'react';
import { users } from '@/lib/api';
import { Card } from '@/components/Card';
import { 
    Search, Filter, Mail, Linkedin, Phone, 
    ExternalLink, GraduationCap, Building2, MapPin,
    UserCheck, UserX, Clock
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
    const [search, setSearch] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');

    useEffect(() => {
        fetchAlumni();
    }, [search, filterIndustry]);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const data = await users.getUsers({ 
                role: 'alumni', 
                search: search || undefined,
                industry: filterIndustry || undefined
            });
            setAlumni(data);
        } catch (error) {
            console.error('Failed to fetch alumni:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[800] text-slate-900 dark:text-white">Alumni Oversight</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor professional profiles and contact details for all alumni.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, company, or skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                </div>
                <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-w-[160px]"
                >
                    <option value="">All Industries</option>
                    <option value="Tech">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                </select>
            </div>

            {/* Alumni List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : alumni.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumni.map((person) => (
                        <Card key={person._id} className="p-6 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 border-slate-200/60 dark:border-slate-800/60 overflow-hidden relative">
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                person.isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                                {person.isApproved ? 'Approved' : 'Pending'}
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative">
                                    {person.profileImage ? (
                                        <img src={person.profileImage} alt={person.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-900" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold ring-4 ring-slate-50 dark:ring-slate-900 uppercase">
                                            {person.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <GraduationCap className="w-3 h-3 text-indigo-500" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">{person.name}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {person.jobTitle ? `${person.jobTitle} @ ${person.company}` : 'Professional Alumni'}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium select-all">{person.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium select-all">{person.phoneNumber || 'Not saved'}</span>
                                </div>
                                {person.linkedin && (
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Linkedin className="w-3.5 h-3.5 text-indigo-500" />
                                            LinkedIn Profile
                                        </div>
                                        <a 
                                            href={person.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    Batch of {person.batchYear || 'N/A'}
                                </div>
                                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300">
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <UserX className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Alumni Found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
