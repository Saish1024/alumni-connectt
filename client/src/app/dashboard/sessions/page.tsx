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
    const [availableSessions, setAvailableSessions] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newSlot, setNewSlot] = useState({ topic: '', date: '', time: '', duration: '60 min', paymentType: 'free' });
    const [isGoogleAuthorized, setIsGoogleAuthorized] = useState((user as any)?.googleTokens?.access_token ? true : false);

    // Rating State
    const [ratingModal, setRatingModal] = useState<{ open: boolean, sessionId: string, score: number, feedback: string }>({ open: false, sessionId: '', score: 5, feedback: '' });

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
                // 'upcoming' or 'pending' or 'completed'
                const mySessions = data.filter((s: any) => s.organizer?._id === (user as any)._id || s.organizer === (user as any)._id);
                setSessions(mySessions.filter((s: any) => s.status !== 'pending' && s.status !== 'rejected'));
                setPendingRequests(mySessions.filter((s: any) => s.status === 'pending'));
            } else {
                // Filter sessions where the student has registered
                setMyBookedSessions(data.filter((s: any) => s.attendees.some((a: any) => a._id === (user as any)._id || a === (user as any)._id)));
                // Available sessions are those with no attendees, not created by the current user, and status is NOT pending/rejected (though available slots won't be pending usually)
                setAvailableSessions(data.filter((s: any) => (s.attendees?.length || 0) === 0 && s.organizer?._id !== (user as any)._id && s.status === 'upcoming'));
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorizeGoogle = () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
                paymentType: newSlot.paymentType,
                type: 'session',
                description: `Mentoring session for ${newSlot.topic}`
            };

            await apiEvents.createSession(sessionData);
            setShowForm(false);
            setNewSlot({ topic: '', date: '', time: '', duration: '60 min', paymentType: 'free' });
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
        const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

        // Handle both old formats (Mar 15, 2026) and new formats (2026-03-15)
        if (sessionDate.includes('-')) {
            return sessionDate === todayStr;
        } else {
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return sessionDate.includes(dateStr.split(',')[0]);
        }
    };

    const handleBookSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to book this session?')) return;
        setLoading(true);
        try {
            await apiEvents.register(sessionId);
            alert('Session booked successfully! Check your upcoming tab.');
            fetchSessions();
        } catch (err: any) {
            console.error('Failed to book session:', err);
            alert(err.message || 'Failed to book session');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (id: string) => {
        if (!isGoogleAuthorized) {
            alert('Please authorize Google Calendar first to generate a Meet link.');
            handleAuthorizeGoogle();
            return;
        }
        setLoading(true);
        try {
            await apiEvents.acceptSession(id);
            alert('Session accepted! Google Meet link has been generated.');
            fetchSessions();
        } catch (err: any) {
            console.error('Failed to accept session:', err);
            alert(err.message || 'Failed to accept session');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSession = async (session: any) => {
        try {
            // Track attendance on backend
            await apiEvents.attend(session._id);
        } catch (err) {
            console.error('Failed to track attendance:', err);
        } finally {
            // Open the meet link regardless
            window.open(session.meetLink, '_blank');
        }
    };

    const handleSubmitRating = async () => {
        if (!ratingModal.sessionId) return;
        setLoading(true);
        try {
            await apiEvents.rate(ratingModal.sessionId, ratingModal.score, ratingModal.feedback);
            alert('Feedback submitted! Thank you.');
            setRatingModal({ open: false, sessionId: '', score: 5, feedback: '' });
            fetchSessions();
        } catch (err: any) {
            console.error('Failed to submit rating:', err);
            alert(err.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (id: string) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        setLoading(true);
        try {
            await apiEvents.rejectSession(id);
            alert('Session rejected.');
            fetchSessions();
        } catch (err: any) {
            console.error('Failed to reject session:', err);
            alert(err.message || 'Failed to reject session');
        } finally {
            setLoading(false);
        }
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
                        {!isGoogleAuthorized ? (
                            <button onClick={handleAuthorizeGoogle} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-[700] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                                <Video className="w-4 h-4 text-red-500" /> Authorize Google Calendar
                            </button>
                        ) : (
                            <button onClick={handleAuthorizeGoogle} className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-[700] rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all shadow-sm">
                                <Video className="w-4 h-4 text-green-500" /> Connected (Click to Reconnect)
                            </button>
                        )}
                        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit mb-6">
                    {['upcoming', 'requests', 'completed'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-50 dark:text-slate-400'}`}>
                            {t} {t === 'requests' && pendingRequests.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full animate-pulse">{pendingRequests.length}</span>
                            )}
                        </button>
                    ))}
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
                                    type="date"
                                    value={newSlot.date}
                                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Time</label>
                                <input
                                    type="time"
                                    value={newSlot.time}
                                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
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
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Payment Type</label>
                                <select
                                    value={newSlot.paymentType}
                                    onChange={(e) => setNewSlot({ ...newSlot, paymentType: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl px-4 py-2.5"
                                >
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
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
                                {tab !== 'requests' && <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider">Meet Link</th>}
                                <th className="px-6 py-4 text-xs font-[700] text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {(tab === 'requests' ? pendingRequests : sessions.filter(s => {
                                const isActive = isSessionActive(s.date, s.time);
                                return tab === 'upcoming' ? isActive || new Date(`${s.date} ${s.time}`) > new Date() : !isActive && new Date(`${s.date} ${s.time}`) < new Date();
                            })).map(s => (
                                <tr key={s._id} className="last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="font-[600] text-slate-900 dark:text-white">
                                            {s.attendees?.length > 0 ? (s.attendees[0].name || s.attendees[0]) : <span className="text-slate-400 italic">Available Slot</span>}
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{s.topic || s.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-[500] text-slate-700 dark:text-slate-300">
                                        <div>{new Date(s.date).toLocaleDateString() !== 'Invalid Date' && s.date.includes('-') ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : s.date}</div>
                                        <div className="text-slate-400 text-xs font-[600] mt-0.5">
                                            {s.time.includes(':') && s.time.length <= 5 ? new Date(`2000-01-01T${s.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : s.time} ({s.duration})
                                        </div>
                                    </td>
                                    {tab !== 'requests' && (
                                        <td className="px-6 py-4">
                                            {s.meetLink ? (
                                                <a href={s.meetLink} target="_blank" className="text-xs text-indigo-600 dark:text-indigo-400 font-[700] hover:underline flex items-center gap-1.5 ring-1 ring-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md w-fit">
                                                    <Video className="w-3 h-3" /> Meet Link
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Not generated</span>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-right">
                                        {tab === 'requests' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(s._id)}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-[700] rounded-lg hover:bg-indigo-700 transition-all shadow-sm">
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(s._id)}
                                                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-[700] rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Edit2 className="w-4 h-4 text-slate-400 hover:text-indigo-500" /></button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" /></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tab === 'requests' && pendingRequests.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No pending requests</td>
                                </tr>
                            )}
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
                    {['available', 'upcoming', 'pending', 'completed'].map(t => (
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
                {tab === 'available' ? availableSessions.map(s => (
                    <div key={s._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all group">
                        <div className="flex items-start gap-4">
                            {s.organizer?.profileImage ? (
                                <img src={s.organizer.profileImage} alt={s.organizer.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-900/50" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-xl flex-shrink-0">
                                    {s.organizer?.name?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-[700] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.topic}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">with {s.organizer?.name}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-[700] flex-shrink-0 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                        🗓️ Open Slot
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5 font-[500]"><Calendar className="w-4 h-4 text-slate-400" /> {s.date.includes('-') ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : s.date}</span>
                                    <span className="flex items-center gap-1.5 font-[500]"><Clock className="w-4 h-4 text-slate-400" /> {s.time.includes(':') && s.time.length <= 5 ? new Date(`2000-01-01T${s.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : s.time}</span>
                                    <span className="flex items-center gap-1.5 font-[500]"><Timer className="w-4 h-4 text-slate-400" /> {s.duration}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <button
                                onClick={() => handleBookSession(s._id)}
                                className="flex-1 py-3 text-sm font-[800] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:scale-[1.01] active:scale-95"
                            >
                                Book This Session
                            </button>
                        </div>
                    </div>
                )) : null}

                {tab !== 'available' && myBookedSessions.filter(s => {
                    const isActive = isSessionActive(s.date, s.time);
                    if (tab === 'pending') return s.status === 'pending';
                    if (tab === 'upcoming') return s.status === 'upcoming' && (isActive || new Date(`${s.date} ${s.time}`) > new Date());
                    if (tab === 'completed') return s.status === 'completed' || (!isActive && new Date(`${s.date} ${s.time}`) < new Date() && s.status === 'upcoming');
                    return false;
                }).map(s => {
                    const isActive = isSessionActive(s.date, s.time);
                    return (
                        <div key={s._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all group">
                            <div className="flex items-start gap-4">
                                {s.organizer?.profileImage ? (
                                    <img src={s.organizer.profileImage} alt={s.organizer.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-4 ring-slate-50 dark:ring-slate-900/50" />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-xl flex-shrink-0">
                                        {s.organizer?.name?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-[700] text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.topic}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">with {s.organizer?.name}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-[700] flex-shrink-0 ${s.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : tab === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                            {s.status === 'pending' ? '⏳ Pending' : tab === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5 font-[500]"><Calendar className="w-4 h-4 text-slate-400" /> {s.date.includes('-') ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : s.date}</span>
                                        <span className="flex items-center gap-1.5 font-[500]"><Clock className="w-4 h-4 text-slate-400" /> {s.time.includes(':') && s.time.length <= 5 ? new Date(`2000-01-01T${s.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : s.time}</span>
                                        <span className="flex items-center gap-1.5 font-[500]"><Timer className="w-4 h-4 text-slate-400" /> {s.duration}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-[800] uppercase tracking-wider ${s.paymentType === 'free' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                                            {s.paymentType === 'paid' ? 'PAID' : 'FREE'}
                                        </span>
                                    </div>
                                    {s.rating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            {Array(5).fill(0).map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < (s as any).rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                                            ))}
                                            <span className="text-[10px] text-slate-400 ml-1 font-[600] uppercase">Feedback Provided</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                {(tab as string) === 'completed' && (
                                    <div className="flex-1">
                                        {(s as any).ratings?.some((r: any) => r.studentId === (user as any)._id || r.studentId?._id === (user as any)._id) ? (
                                            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                                <div className="flex gap-1 mb-1">
                                                    {Array(5).fill(0).map((_, i) => {
                                                        const userRating = (s as any).ratings.find((r: any) => r.studentId === (user as any)._id || r.studentId?._id === (user as any)._id)?.score;
                                                        return <Star key={i} className={`w-3.5 h-3.5 ${i < userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />;
                                                    })}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-[700] uppercase tracking-tighter">Feedback Submitted</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setRatingModal({ open: true, sessionId: s._id, score: 5, feedback: '' })}
                                                className="w-full py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-600 text-sm font-[800] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Star className="w-4 h-4 text-amber-500" /> Give Feedback
                                            </button>
                                        )}
                                    </div>
                                )}
                                {(tab as string) === 'upcoming' && s.meetLink && (
                                    <button
                                        onClick={() => isActive && handleJoinSession(s)}
                                        disabled={!isActive}
                                        className={`flex-1 py-3 text-sm font-[800] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:scale-[1.01] active:scale-95' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none'}`}
                                    >
                                        {isActive ? (
                                            <><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Join Live Session</>
                                        ) : (
                                            <>Active at {s.time}</>
                                        )}
                                    </button>
                                )}
                                {tab !== 'completed' && (
                                    <button className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-[700] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                        Details
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rating Modal */}
            {
                ratingModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                                </div>
                                <h3 className="text-xl font-[800] text-slate-900 dark:text-white">Rate Your Session</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your feedback helps improve the mentoring quality</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setRatingModal({ ...ratingModal, score: num })}
                                            className="p-1 transition-transform active:scale-90"
                                        >
                                            <Star className={`w-10 h-10 ${num <= ratingModal.score ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-[700] text-slate-700 dark:text-slate-300">Detailed Feedback (Optional)</label>
                                    <textarea
                                        value={ratingModal.feedback}
                                        onChange={(e) => setRatingModal({ ...ratingModal, feedback: e.target.value })}
                                        placeholder="How was your session? What did you learn?"
                                        className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setRatingModal({ open: false, sessionId: '', score: 5, feedback: '' })}
                                        className="flex-1 py-3 text-sm font-[700] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitRating}
                                        className="flex-[2] py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-[800] shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
