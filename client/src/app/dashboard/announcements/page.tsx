import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, AlertTriangle, Bell } from 'lucide-react';
import { announcements as apiAnnouncements } from '@/lib/api';

export default function AnnouncementsPage() {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [form, setForm] = useState({ title: '', content: '', priority: 'normal', audience: 'All' });

    const fetchAnnouncements = async () => {
        try {
            const data = await apiAnnouncements.list();
            setAnnouncements(data);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handlePublish = async () => {
        if (!form.title || !form.content) return alert('Please fill in title and message');
        setSubmitting(true);
        try {
            await apiAnnouncements.create(form);
            setShowForm(false);
            setForm({ title: '', content: '', priority: 'normal', audience: 'All' });
            fetchAnnouncements();
        } catch (err: any) {
            alert(err.message || 'Failed to publish');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await apiAnnouncements.delete(id);
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Announcements</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Broadcast messages to platform users</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                    <Plus className="w-4 h-4" /> New Announcement
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-5">New Announcement</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Title</label>
                            <input 
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                placeholder="Announcement title..." 
                                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea 
                                value={form.content}
                                onChange={e => setForm({...form, content: e.target.value})}
                                rows={4} 
                                placeholder="Write your announcement..." 
                                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
                                <select 
                                    value={form.audience}
                                    onChange={e => setForm({...form, audience: e.target.value})}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                                >
                                    <option value="All">All Users</option>
                                    <option value="Students">Students Only</option>
                                    <option value="Alumni">Alumni Only</option>
                                    <option value="Faculty">Faculty Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                                <select 
                                    value={form.priority}
                                    onChange={e => setForm({...form, priority: e.target.value})}
                                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={handlePublish}
                            disabled={submitting}
                            className="flex-1 py-3 flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Announcement'}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-[500]">No active announcements</p>
                    </div>
                ) : announcements.map(a => (
                    <div key={a._id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 border-l-4 ${a.priority === 'urgent' ? 'border-l-red-600' : a.priority === 'high' ? 'border-l-orange-500' : 'border-l-indigo-500'} border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-[700] text-slate-900 dark:text-white">{a.title}</h3>
                            <div className="flex items-center gap-2">
                                {a.priority !== 'normal' && (
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-[800] uppercase tracking-wider ${a.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                        {a.priority}
                                    </span>
                                )}
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-[600] rounded-full">{a.audience}</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.content}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-slate-400">Published: {new Date(a.createdAt).toLocaleDateString()}</span>
                            <button onClick={() => handleDelete(a._id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="Delete">
                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
