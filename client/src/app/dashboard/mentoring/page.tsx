"use client"
import { useEffect, useState } from 'react';
import { Video, Calendar, Clock, CheckCircle2, Users, Loader2, ExternalLink, Search } from 'lucide-react';
import { events as apiEvents } from '@/lib/api';

export default function FacultyMentoringPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('live');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await apiEvents.listSessions();
            setSessions(data);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const isSessionActive = (sessionDate: string, sessionTime: string) => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        if (sessionDate.includes('-')) {
            return sessionDate === todayStr;
        }
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return sessionDate.includes(dateStr.split(',')[0]);
    };

    const filteredSessions = sessions.filter(s => {
        const isActive = isSessionActive(s.date, s.time);

        // Tab filtering
        if (tab === 'live' && !isActive) return false;
        if (tab === 'upcoming' && (isActive || s.status === 'completed')) return false;
        if (tab === 'completed' && s.status !== 'completed' && (isActive || new Date(`${s.date} ${s.time}`) > new Date())) return false;

        // Search filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                s.topic?.toLowerCase().includes(query) ||
                s.organizer?.name?.toLowerCase().includes(query) ||
                s.attendees?.some((a: any) => (a.name || a).toLowerCase().includes(query))
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Mentoring Monitor</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Oversight and attendance tracking for all mentoring sessions</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search sessions, mentors..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
                    />
                </div>
            </div>

            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                {[
                    { id: 'live', label: 'Live Now', color: 'bg-red-500' },
                    { id: 'upcoming', label: 'Upcoming', color: 'bg-indigo-500' },
                    { id: 'completed', label: 'Completed', color: 'bg-green-500' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-[600] flex items-center gap-2 transition-all ${tab === t.id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                        {tab === t.id && <span className={`w-1.5 h-1.5 rounded-full ${t.color}`} />}
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredSessions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-12 border border-slate-200 dark:border-slate-700/50 text-center text-slate-400 italic">
                        No {tab} sessions found
                    </div>
                ) : (
                    filteredSessions.map(s => (
                        <div key={s._id} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:shadow-lg transition-all">
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-[700] text-slate-900 dark:text-white">{s.topic || s.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-[600] text-indigo-600 dark:text-indigo-400">{s.organizer?.name}</span>
                                                    <span className="text-slate-300">|</span>
                                                    <span className="text-sm text-slate-500">Mentor</span>
                                                </div>
                                            </div>
                                            {s.meetLink && tab === 'live' && (
                                                <a
                                                    href={s.meetLink}
                                                    target="_blank"
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-[700] hover:bg-red-100 transition-all border border-red-200 dark:border-red-800"
                                                >
                                                    <Video className="w-4 h-4" /> Join as Observer
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <div className={`flex items-center gap-2 text-xs font-[800] tracking-wider px-3 py-1.5 rounded-lg uppercase ${s.paymentType === 'free' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                                {s.paymentType === 'paid' ? 'Paid' : 'Free'}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                                                <Calendar className="w-4 h-4" /> {s.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg">
                                                <Clock className="w-4 h-4" /> {s.time} ({s.duration})
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-80 bg-slate-50 dark:bg-slate-900/20 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-[700] text-slate-900 dark:text-white flex items-center gap-2">
                                                <Users className="w-4 h-4 text-indigo-500" /> Attendance Tracking
                                            </h4>
                                            <span className="text-[10px] font-[800] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 px-2 py-0.5 rounded-full">
                                                {s.attendance?.length || 0} / {s.attendees?.length || 0}
                                            </span>
                                        </div>

                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            {s.attendees?.length === 0 ? (
                                                <p className="text-xs text-slate-400 italic">No students registered yet</p>
                                            ) : (
                                                s.attendees.map((attendee: any) => {
                                                    const attended = s.attendance?.find((a: any) => a.studentId?._id === attendee._id || a.studentId === attendee._id);
                                                    return (
                                                        <div key={attendee._id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                                    {attendee.name?.charAt(0)}
                                                                </div>
                                                                <span className="text-xs font-[600] text-slate-700 dark:text-slate-300 truncate w-32">
                                                                    {attendee.name}
                                                                </span>
                                                            </div>
                                                            {attended ? (
                                                                <div className="flex flex-col items-end">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                                    <span className="text-[8px] text-slate-400">{new Date(attended.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600" title="Not Joined" />
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
