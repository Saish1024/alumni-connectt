"use client";

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { jobs as apiJobs } from '@/lib/api';

export default function JobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyModal, setApplyModal] = useState<null | any>(null);
    const [applied, setApplied] = useState<string[]>([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await apiJobs.list();
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId: string) => {
        try {
            await apiJobs.apply(jobId);
            setApplied(prev => [...prev, jobId]);
            setApplyModal(null);
        } catch (err) {
            console.error('Failed to apply:', err);
            alert('Failed to apply. You might have already applied!');
        }
    };

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
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Jobs & Referrals</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Exclusive opportunities shared by alumni mentors</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {jobs.map(job => (
                    <div key={job._id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-6 border-2 ${job.isNew ? 'border-indigo-300 dark:border-indigo-600/50' : 'border-slate-200 dark:border-slate-700/50'} hover:shadow-xl hover:-translate-y-0.5 transition-all`}>
                        {job.isNew && <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-[700] mb-3">🆕 New</div>}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-[800] text-slate-900 dark:text-white">{job.role || job.title}</h3>
                                <div className="text-indigo-600 dark:text-indigo-400 font-[600] text-sm">{job.company}</div>
                            </div>
                            <span className={`text-xs font-[700] px-3 py-1 rounded-full ${job.type === 'Internship' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                {job.type}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {(job.skills || job.requirements || []).map((s: string) => (
                                <span key={s} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full font-[500]">{s}</span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                            <span>📍 {job.location}</span>
                            <span>💰 {job.salary || 'Not specified'}</span>
                            <span>⏰ Deadline: {job.deadline || 'Ongoing'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl mb-4">
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-[500]">Posted by</span>
                            <span className="text-xs font-[700] text-indigo-600 dark:text-indigo-400">{job.postedBy?.name || 'Alumni'}</span>
                        </div>
                        <button
                            onClick={() => { if (!applied.includes(job._id)) setApplyModal(job); }}
                            className={`w-full py-2.5 text-sm font-[700] rounded-xl transition-all ${applied.includes(job._id) ? 'bg-green-100 dark:bg-green-900/20 text-green-600 cursor-default' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-[1.02] shadow-md shadow-indigo-500/20'}`}>
                            {applied.includes(job._id) ? '✅ Applied' : 'Apply Now'}
                        </button>
                    </div>
                ))}
            </div>

            {applyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-[800] text-slate-900 dark:text-white">Apply to {applyModal.company}</h3>
                            <button onClick={() => setApplyModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <div className="font-[700] text-slate-900 dark:text-white">{applyModal.role || applyModal.title}</div>
                                <div className="text-sm text-indigo-600 dark:text-indigo-400">{applyModal.company}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Cover Letter (optional)</label>
                                <textarea rows={4} placeholder="Why are you a great fit?" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" id="coverLetter" />
                            </div>
                        </div>
                        <button
                            onClick={() => handleApply(applyModal._id)}
                            className="w-full mt-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
                            Submit Application
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
