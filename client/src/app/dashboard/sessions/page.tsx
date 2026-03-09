"use client"
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Play, Calendar, Clock, Timer, Star, Plus, Edit2, Trash2, Video, Loader2 } from 'lucide-react';
import { events as apiEvents } from '@/lib/api';

export default function SessionsPage() {
    const { user } = useAuth();
    const [tab, setTab] = useState('upcoming');
    const [sessions, setSessions] = useState<any[]>([]);
    const [myBookedSessions, setMyBookedSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newSlot, setNewSlot] = useState({ topic: '', date: '', time: '', duration: '60 min' });
    const [isGoogleAuthorized, setIsGoogleAuthorized] = useState((user as any)?.googleTokens?.access_token ? true : false);

    useEffect(() => {
        fetchSessions();
    }, [user]);

    const fetchSessions = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await apiEvents.listSessions();
            if ((user as any).role === 'alumni') {
                // Filter sessions where the current user is the organizer
                setSessions(data.filter((s: any) => s.organizer?._id === (user as any)._id || s.organizer === (user as any)._id));
            } else {
                // Filter sessions where the student has registered
                setMyBookedSessions(data.filter((s: any) => s.attendees.includes((user as any)._id)));
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorizeGoogle = () => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${baseUrl}/auth/google?userId=${(user as any)?._id || (user as any)?.id}`;
    };

    const handleSaveSlot = async () => {
        if (!newSlot.topic || !newSlot.date || !newSlot.time) return;

        setLoading(true);
        try {
            const sessionData = {
                title: newSlot.topic,
                topic: newSlot.topic,
                date: newSlot.date,
                time: newSlot.time,
                duration: newSlot.duration,
                type: 'session',
                description: `Mentoring session for ${newSlot.topic}`
            };

            await apiEvents.createSession(sessionData);
            setShowForm(false);
            setNewSlot({ topic: '', date: '', time: '', duration: '60 min' });
            fetchSessions(); // Refresh list
        } catch (err) {
            console.error('Failed to create session:', err);
            alert('Failed to create session. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isSessionActive = (sessionDate: string, sessionTime: string) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return sessionDate.includes(dateStr.split(',')[0]);
    };

    if (loading && sessions.length === 0 && myBookedSessions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (user?.role === 'alumni') {
        return (
            <div className="space-y-6 font-[Inter,sans-serif] animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Mentoring Sessions</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your upcoming mentoring schedule</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isGoogleAuthorized && (
                            <button onClick={handleAuthorizeGoogle} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-[700] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                                <Video className="w-4 h-4 text-red-500" /> Authorize Google Calendar
                            </button>
                        )}
                        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-xl animate-in zoom-in duration-300">
                        <h3 className="font-[700] text-slate-900 dark:text-white mb-5">Add Availability Slot</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Topic</label>
                                <input
                                    type="text"
                                    placeholder="e.g. System Design Review"
                                    value={newSlot.topic}
                                    onChange={(e) => setNewSlot({ ...newSlot, topic: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Date</label>
                                <input
                                    type="text"
                                    placeholder="Mar 15, 2026"
                                    value={newSlot.date}
                                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Time</label>
                                <input
                                    type="text"
                                    placeholder="5:00 PM"
                                    value={newSlot.time}
                                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                                <select
                                    value={newSlot.duration}
                                    onChange={(e) => setNewSlot({ ...newSlot, duration: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5"
                                >
                                    <option>30 min</option>
                                    <option>45 min</option>
                                    <option>60 min</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSaveSlot} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-[700] rounded-xl shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all">
                                Generate Google Meet & Save
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-slate-200 dark:border-slate-600 rounded-xl font-[600] text-slate-600 dark:text-slate-400">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/30">
                            <tr>
                                <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider">Student / Topic</th>
                                <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider">When</th>
                                <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider">Meet Link</th>
                                <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {sessions.map(s => (
                                <tr key={s.id} className="last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="font-[600] text-slate-900 dark:text-white">{s.student}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{s.topic}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-[500] text-slate-700 dark:text-slate-300">
                                        <div>{s.date}</div>
                                        <div className="text-slate-400 text-xs font-[600] mt-0.5">{s.time} ({s.duration})</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={s.meetLink} target="_blank" className="text-xs text-indigo-600 dark:text-indigo-400 font-[700] hover:underline flex items-center gap-1.5 ring-1 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md w-fit">
                                            <Video className="w-3 h-3" /> Meet Link
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit2 className="w-4 h-4 text-slate-400 hover:text-indigo-500" /></button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">My Sessions</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your mentoring sessions</p>
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['upcoming', 'completed'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {myBookedSessions.filter(s => s.status === tab).map(s => {
                    const isActive = isSessionActive(s.date, s.time);
                    return (
                        <div key={s.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4">
                                <img src={s.img} alt={s.mentor} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-900/50" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-[700] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.topic}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">with {s.mentor}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-[700] flex-shrink-0 ${s.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                            {s.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5 font-[500]"><Calendar className="w-4 h-4 text-slate-400" /> {s.date}</span>
                                        <span className="flex items-center gap-1.5 font-[500]"><Clock className="w-4 h-4 text-slate-400" /> {s.time}</span>
                                        <span className="flex items-center gap-1.5 font-[500]"><Timer className="w-4 h-4 text-slate-400" /> {s.duration}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-[800] uppercase tracking-wider ${s.type === 'free' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                            {s.type === 'free' ? 'FREE' : 'PAID'}
                                        </span>
                                    </div>
                                    {s.rating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < s.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                                            ))}
                                            <span className="text-[10px] text-slate-400 ml-1 font-[600] uppercase">Feedback Provided</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {s.status === 'upcoming' && (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => isActive && window.open(s.meetLink, '_blank')}
                                        disabled={!isActive}
                                        className={`flex-1 py-3 text-sm font-[800] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:scale-[1.01] active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none'}`}
                                    >
                                        {isActive ? (
                                            <><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Join Live Session</>
                                        ) : (
                                            <>Active at {s.time}</>
                                        )}
                                    </button>
                                    <button className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-[700] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                        Details
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
