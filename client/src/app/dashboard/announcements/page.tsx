"use client"
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AnnouncementsPage() {
    const [showForm, setShowForm] = useState(false);
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Platform Maintenance - Mar 10', content: 'The platform will undergo maintenance from 2AM to 4AM IST on March 10, 2026.', audience: 'All', date: 'Mar 3, 2026', priority: 'high' },
        { id: 2, title: 'New Feature: AI Mentor Matching v2.0', content: "We've upgraded our AI mentor matching algorithm! Expect better matches and faster recommendations.", audience: 'Students', date: 'Feb 28, 2026', priority: 'normal' },
        { id: 3, title: 'Hackathon 2026 Registration Open!', content: 'CodeSprint 2026 is now accepting team registrations. Form your teams and register before Mar 8.', audience: 'All', date: 'Feb 25, 2026', priority: 'normal' },
    ]);

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
                            <input placeholder="Announcement title..." className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                        </div>
                        <div>
                            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea rows={4} placeholder="Write your announcement..." className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
                                <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                                    <option>All Users</option>
                                    <option>Students Only</option>
                                    <option>Alumni Only</option>
                                    <option>Faculty Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                                <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                                    <option>Normal</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                            Publish Announcement
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map(a => (
                    <div key={a.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 border-l-4 ${a.priority === 'high' ? 'border-l-red-500' : 'border-l-indigo-500'} border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-[700] text-slate-900 dark:text-white">{a.title}</h3>
                            <div className="flex items-center gap-2">
                                {a.priority === 'high' && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-[700] rounded-full">🔴 High Priority</span>}
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-[600] rounded-full">{a.audience}</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.content}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-slate-400">Published: {a.date}</span>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="Delete">
                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
