"use client"
import { useState, useEffect } from 'react';
import { Search, Star, Check, X, Loader2 } from 'lucide-react';
import { users as apiUsers, events as apiEvents } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function MentorsPage() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [bookModal, setBookModal] = useState<null | any>(null);
    const [bookingDone, setBookingDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ date: '', time: '10:00 AM', topic: '', paymentType: 'free', amount: 0, transactionId: '' });
    const router = useRouter();

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await apiUsers.list({ role: 'alumni' });
                setMentors(data);
            } catch (err) {
                console.error('Failed to fetch mentors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const handleRequestSession = async () => {
        if (!form.date || !form.topic) return alert('Please fill in all fields');
        setSubmitting(true);
        try {
            await apiEvents.requestSession({
                mentorId: bookModal._id,
                date: form.date,
                time: form.time,
                topic: form.topic,
                duration: '60 min',
                paymentType: form.paymentType,
                amount: form.amount,
                transactionId: form.transactionId
            });
            setBookingDone(true);
        } catch (err: any) {
            console.error('Failed to request session:', err);
            alert(err.message || 'Failed to request session');
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = mentors.filter(m => {
        if (search && !m.name?.toLowerCase().includes(search.toLowerCase()) &&
            !m.jobTitle?.toLowerCase().includes(search.toLowerCase()) &&
            !m.company?.toLowerCase().includes(search.toLowerCase())) return false;
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
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Find Mentors</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Connect with alumni who can guide your career journey</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, company, or skill..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-lg font-semibold">No alumni mentors found</p>
                    <p className="text-sm mt-1">Alumni mentors will appear here once approved.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(m => (
                        <div key={m._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative">
                                    {m.profileImage ? (
                                        <img src={m.profileImage} alt={m.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-xl shadow-md">
                                            {m.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-[700] text-slate-900 dark:text-white">{m.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {m.jobTitle ? `${m.jobTitle}${m.company ? ` @ ${m.company}` : ''}` : 'Alumni'}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-[700] text-slate-800 dark:text-white">4.8</span>
                                        <span className="text-xs text-slate-400">(mentor)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {(m.skills || []).slice(0, 3).map((s: string) => (
                                    <span key={s} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-[500]">{s}</span>
                                ))}
                                {(!m.skills || m.skills.length === 0) && (
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2.5 py-1 rounded-full font-[500]">
                                        {m.industry || 'Technology'}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-[700] text-green-600 dark:text-green-400">● Available</span>
                                <span className={`text-sm font-[700] px-3 py-1 rounded-full ${m.sessionPrice > 0 ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>
                                    {m.sessionPrice > 0 ? `₹${m.sessionPrice}` : 'Free'}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setBookModal(m);
                                    setBookingDone(false);
                                    setForm({ date: '', time: '10:00 AM', topic: '', paymentType: m.sessionPrice > 0 ? 'paid' : 'free', amount: m.sessionPrice || 0, transactionId: '' });
                                }}
                                className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20">
                                Book Session
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {bookModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
                        {bookingDone ? (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-2">Session Requested! 🎉</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Your request has been sent to {bookModal.name}. Visit your Sessions page to track its status.</p>
                                <button onClick={() => { setBookModal(null); router.push('/dashboard/sessions'); }} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] hover:scale-[1.02] transition-all shadow-md">
                                    View Pending Requests
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-[800] text-slate-900 dark:text-white">Book Session with {bookModal.name}</h3>
                                    <button onClick={() => setBookModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-lg">
                                        {bookModal.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-[700] text-slate-900 dark:text-white">{bookModal.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{bookModal.jobTitle} {bookModal.company ? `@ ${bookModal.company}` : ''}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} id="sessionDate" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Select Time</label>
                                        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} id="sessionTime" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Topic / Goals</label>
                                        <textarea
                                            rows={2}
                                            id="sessionTopic"
                                            value={form.topic}
                                            onChange={e => setForm({ ...form, topic: e.target.value })}
                                            placeholder="What do you want to discuss?"
                                            className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                                        />
                                    </div>
                                    {form.paymentType === 'paid' && (
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 dark:text-slate-400 font-[600]">Session Fee</span>
                                                <span className="text-indigo-600 dark:text-indigo-400 font-[800]">₹{form.amount}</span>
                                            </div>
                                            <div className="pt-2 border-t border-indigo-100 dark:border-indigo-800/50">
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-[600] uppercase">Pay to Platform Owner (UPI)</p>
                                                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg text-sm font-[700] text-center text-slate-900 dark:text-white">
                                                    admin-connect@upi
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-[700] text-slate-400 uppercase mb-1.5 ml-1">Transaction ID / Reference</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter UPI Ref No."
                                                    value={form.transactionId}
                                                    onChange={e => setForm({ ...form, transactionId: e.target.value })}
                                                    className="w-full text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleRequestSession}
                                    disabled={submitting}
                                    className="w-full mt-5 py-3.5 flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:hover:scale-100">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Session'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
