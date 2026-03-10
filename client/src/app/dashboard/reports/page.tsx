"use client"
import { useState } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        'Date Range': '',
        'Report Type': '',
        'Department': '',
        'Year': ''
    });

    const reportOptions: Record<string, string[]> = {
        'Date Range': ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last Year', 'All Time'],
        'Report Type': ['Student Performance', 'Quiz Analytics', 'Mentoring Summary', 'Placement & Jobs', 'Community Engagement'],
        'Department': ['All Departments', 'Computer Science', 'Information Technology', 'Electronics & Comm.', 'Mechanical', 'Civil', 'Business Admin.'],
        'Year': ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni']
    };

    const handleDownload = async (type: string) => {
        try {
            setError(null);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('alumni_token');
            const res = await fetch(`${baseUrl}/reports/download/${type}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to generate report');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('alumni_token');
            const res = await fetch(`${baseUrl}/reports/custom`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to generate custom report');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `custom_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setDownloaded(true);
            setTimeout(() => setDownloaded(false), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Reports</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Download detailed analytics and performance reports</p>
                </div>
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {[
                    { title: 'Monthly Student Performance Report', type: 'student-performance', desc: 'Detailed performance analytics for all students', icon: '📊', date: 'Mar 2026', size: 'PDF' },
                    { title: 'Quiz Completion Report', type: 'quiz-analytics', desc: 'Topic-wise quiz attempt and pass rate analysis', icon: '📝', date: 'Mar 2026', size: 'PDF' },
                    { title: 'Mentoring Sessions Summary', type: 'mentoring-summary', desc: 'All mentoring sessions by student and alumni', icon: '🎯', date: 'Feb 2026', size: 'PDF' },
                    { title: 'Placement & Jobs Report', type: 'placement-jobs', desc: 'Job applications, referrals, and placements', icon: '💼', date: 'Feb 2026', size: 'PDF' },
                    { title: 'Community Engagement Report', type: 'community-engagement', desc: 'Posts, interactions, and event participation', icon: '🤝', date: 'Feb 2026', size: 'PDF' },
                ].map(r => (
                    <div key={r.title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">{r.icon}</div>
                            <div className="flex-1">
                                <h3 className="font-[700] text-slate-900 dark:text-white text-sm mb-1">{r.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{r.desc}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span>📅 {r.date}</span>
                                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-[800] text-slate-600 dark:text-slate-300 uppercase tracking-wider">{r.size}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(r.type)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex-shrink-0">
                                <Download className="w-3.5 h-3.5" /> Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-[700] text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-green-600" /> Custom Report Generator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(reportOptions).map(([field, opts]) => (
                        <div key={field}>
                            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">{field}</label>
                            <select
                                value={formData[field as keyof typeof formData]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                                className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all font-[500]">
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
                    disabled={generating || !formData['Report Type']}
                    className={`mt-6 flex items-center gap-2 px-6 py-3 font-[700] rounded-xl transition-all shadow-md ${downloaded ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-none' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed'}`}>
                    {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
                    ) : downloaded ? (
                        <><CheckCircle2 className="w-4 h-4" /> Report Downloaded!</>
                    ) : (
                        <><Download className="w-4 h-4" /> Generate & Download (PDF)</>
                    )}
                </button>
            </div>
        </div>
    );
}
