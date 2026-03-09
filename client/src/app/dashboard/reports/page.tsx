"use client"
import { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [formData, setFormData] = useState({
        'Date Range': '',
        'Report Type': '',
        'Department': '',
        'Year': ''
    });

    const reportOptions: Record<string, string[]> = {
        'Date Range': ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last Year', 'All Time'],
        'Report Type': ['Student Performance', 'Quiz Analytics', 'Mentoring Summary', 'Certifications', 'Placement & Jobs', 'Community Engagement'],
        'Department': ['All Departments', 'Computer Science', 'Information Technology', 'Electronics & Comm.', 'Mechanical', 'Civil', 'Business Admin.'],
        'Year': ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni']
    };

    const handleGenerate = () => {
        setGenerating(true);
        setDownloaded(false);
        setTimeout(() => {
            setGenerating(false);
            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Reports</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Download detailed analytics and performance reports</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {[
                    { title: 'Monthly Student Performance Report', desc: 'Detailed performance analytics for all students', icon: '📊', date: 'Mar 2026', size: '2.4 MB' },
                    { title: 'Quiz Completion Report', desc: 'Topic-wise quiz attempt and pass rate analysis', icon: '📝', date: 'Mar 2026', size: '1.8 MB' },
                    { title: 'Mentoring Sessions Summary', desc: 'All mentoring sessions by student and alumni', icon: '🎯', date: 'Feb 2026', size: '3.1 MB' },
                    { title: 'Certification Status Report', desc: 'All pending and approved certifications', icon: '🏅', date: 'Mar 2026', size: '0.9 MB' },
                    { title: 'Placement & Jobs Report', desc: 'Job applications, referrals, and placements', icon: '💼', date: 'Feb 2026', size: '1.5 MB' },
                    { title: 'Community Engagement Report', desc: 'Posts, interactions, and event participation', icon: '🤝', date: 'Feb 2026', size: '2.2 MB' },
                ].map(r => (
                    <div key={r.title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">{r.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-[700] text-slate-900 dark:text-white text-sm mb-1">{r.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{r.desc}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span>📅 {r.date}</span>
                                    <span>📦 {r.size}</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex-shrink-0">
                                <Download className="w-3.5 h-3.5" /> Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Custom Report Generator</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(reportOptions).map(([field, opts]) => (
                        <div key={field}>
                            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">{field}</label>
                            <select
                                value={formData[field as keyof typeof formData]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all">
                                <option value="">Select {field}</option>
                                {opts.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className={`mt-6 flex items-center gap-2 px-6 py-3 font-[700] rounded-xl transition-all shadow-md ${downloaded ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-none' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed'}`}>
                    {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                    ) : downloaded ? (
                        <><CheckCircle2 className="w-4 h-4" /> Downloaded successfully!</>
                    ) : (
                        <><Download className="w-4 h-4" /> Generate & Download</>
                    )}
                </button>
            </div>
        </div>
    );
}
