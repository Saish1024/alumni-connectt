"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Video, MapPin, Users, Clock, Check, Loader2 } from 'lucide-react';
import { events as apiEvents } from '@/lib/api';

export default function EventsPage() {
    const { user } = useAuth();
    const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [registered, setRegistered] = useState<string[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await apiEvents.list();
            // Filter only events of type 'event' (not sessions)
            setEvents(data.filter((e: any) => e.type !== 'session'));
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId: string) => {
        try {
            await apiEvents.register(eventId);
            setRegistered(prev => [...prev, eventId]);
        } catch (err) {
            console.error('Failed to register:', err);
            alert('Failed to register for event.');
        }
    };

    const filteredEvents = events.filter(e => {
        if (tab === 'upcoming') return new Date(e.date) >= new Date();
        return new Date(e.date) < new Date();
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-[700] uppercase tracking-widest backdrop-blur-md">
                            Exclusive Networking
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-[900] text-white tracking-tight mb-3">
                            Events & Masterclasses
                        </h2>
                        <p className="text-slate-300 text-sm lg:text-base font-[500] leading-relaxed">
                            Join exclusive live sessions, workshops, and networking meetups hosted by top alumni from FAANG and leading startups.
                        </p>
                    </div>
                    <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                        {(['upcoming', 'completed'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-[700] capitalize transition-all duration-300 ${tab === t ? 'bg-white text-slate-900 shadow-lg scale-100' : 'text-slate-300 hover:text-white hover:bg-white/10 scale-95'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {filteredEvents.map((e) => (
                    <div key={e._id} className="group relative bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-1 border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[22px] p-6 h-full flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                            <div>
                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${e.category === 'Webinar' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : e.category === 'Workshop' ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-fuchsia-500 to-pink-600'}`}>
                                            {e.category === 'Webinar' ? <Video className="w-6 h-6" /> : e.category === 'Workshop' ? <Calendar className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <span className="text-xs font-[800] tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-1 block">
                                                {e.category || 'General'}
                                            </span>
                                            <h3 className="text-xl font-[800] text-slate-900 dark:text-white leading-tight">
                                                {e.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-[800] border ${new Date(e.date) >= new Date() ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                                        {new Date(e.date) >= new Date() ? 'Upcoming' : 'Recorded'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-600 dark:text-slate-400 mb-6 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <span className="font-[600]">{new Date(e.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <span className="font-[600]">{e.time || 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                        </div>
                                        <span className="font-[600] truncate">{e.location || 'Online'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <span className="font-[600]">{e.attendees?.length || 0} Joined</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${e.organizer?.name || 'Mentor'}&backgroundColor=e2e8f0`} alt={e.organizer?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-[500]">Hosted by</p>
                                        <p className="text-sm font-[700] text-slate-900 dark:text-white">{e.organizer?.name || 'Alumni Mentor'}</p>
                                    </div>
                                </div>
                                {new Date(e.date) >= new Date() ? (
                                    <button
                                        onClick={() => handleRegister(e._id)}
                                        disabled={registered.includes(e._id) || e.attendees?.includes((user as any)?._id)}
                                        className={`px-6 py-2.5 text-sm font-[700] rounded-xl transition-all flex items-center justify-center gap-2 ${(registered.includes(e._id) || e.attendees?.includes((user as any)?._id)) ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 cursor-default' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-md hover:shadow-xl'}`}>
                                        {(registered.includes(e._id) || e.attendees?.includes((user as any)?._id)) ? <><Check className="w-4 h-4" /> Registered</> : 'Reserve Seat'}
                                    </button>
                                ) : (
                                    <button className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-sm font-[700] rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-2 shadow-sm">
                                        <Video className="w-4 h-4" /> Watch Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEvents.length === 0 && (
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                        </div>
                        <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-2">No {tab} events found</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-[500]">Check back later for new networking sessions and exclusive masterclasses.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
