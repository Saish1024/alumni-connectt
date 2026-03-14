"use client";
import { useEffect, useState } from 'react';
import { X, Loader2, Plus, Briefcase, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { jobs as apiJobs } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyModal, setApplyModal] = useState<null | any>(null);
    const [postModal, setPostModal] = useState(false);
    const [applied, setApplied] = useState<string[]>([]);
    const [posting, setPosting] = useState(false);

    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        role: '',
        type: 'Full-time',
        salary: '',
        deadline: '',
        applicationLink: '',
        description: '',
        requirements: ''
    });

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

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        try {
            const requirementsArray = newJob.requirements.split(',').map(s => s.trim()).filter(s => s !== '');
            await apiJobs.create({
                ...newJob,
                role: newJob.title,
                requirements: requirementsArray
            });
            setPostModal(false);
            setNewJob({
                title: '', company: '', location: '', role: '', type: 'Full-time',
                salary: '', deadline: '', applicationLink: '', description: '', requirements: ''
            });
            fetchJobs();
        } catch (err) {
            console.error('Failed to create job:', err);
            alert('Failed to post job. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    const handleApply = async (job: any) => {
        if (job.applicationLink) {
            window.open(job.applicationLink, '_blank');
            return;
        }

        try {
            await apiJobs.apply(job._id);
            setApplied(prev => [...prev, job._id]);
            setApplyModal(null);
        } catch (err) {
            console.error('Failed to apply:', err);
            alert('Failed to apply. You might have already applied!');
        }
    };

    const isAuthorizedToPost = user?.role === 'alumni' || user?.role === 'admin';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Jobs & Referrals</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Exclusive opportunities shared by alumni mentors</p>
                </div>
                {isAuthorizedToPost && (
                    <button
                        onClick={() => setPostModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-[700] hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/25">
                        <Plus className="w-4 h-4" /> Post New Job
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {jobs.map(job => (
                    <div key={job._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-[800] text-slate-900 dark:text-white leading-tight mb-1">{job.role || job.title}</h3>
                                    <div className="text-indigo-600 dark:text-indigo-400 font-[700] text-sm">{job.company}</div>
                                </div>
                            </div>
                            <span className={`text-[10px] uppercase tracking-wider font-[800] px-2.5 py-1 rounded-lg border ${job.type === 'Internship' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                {job.type}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <MapPin className="w-3.5 h-3.5" /> {job.location}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <DollarSign className="w-3.5 h-3.5" /> {job.salary || 'Not specified'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="w-3.5 h-3.5" /> Deadline: {job.deadline || 'Ongoing'}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {(job.skills || job.requirements || []).map((s: string) => (
                                <span key={s} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-[600]">{s}</span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl mb-5 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                {job.postedBy?.profileImage ? (
                                    <img src={job.postedBy.profileImage} alt={job.postedBy.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-700" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                        {job.postedBy?.name?.charAt(0) || 'A'}
                                    </div>
                                )}
                                <div>
                                    <div className="text-[10px] text-slate-500 font-[500] uppercase tracking-tighter">Posted by</div>
                                    <div className="text-sm font-[700] text-slate-900 dark:text-white -mt-0.5">{job.postedBy?.name || 'Alumni'}</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (applied.includes(job._id)) return;
                                if (job.applicationLink) {
                                    window.open(job.applicationLink, '_blank');
                                } else {
                                    setApplyModal(job);
                                }
                            }}
                            className={`w-full py-3 text-sm font-[800] rounded-xl transition-all flex items-center justify-center gap-2 ${applied.includes(job._id) ? 'bg-green-100 dark:bg-green-900/20 text-green-600 cursor-default' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] shadow-lg shadow-indigo-500/20'}`}>
                            {applied.includes(job._id) ? '✅ Applied' : (
                                <>
                                    {job.applicationLink ? 'Apply via External Link' : 'Apply Now'}
                                    {job.applicationLink && <ExternalLink className="w-4 h-4" />}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Post Job Modal */}
            {postModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-2xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-[800] text-slate-900 dark:text-white">Post Opportunity</h3>
                            </div>
                            <button onClick={() => setPostModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateJob} className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Title</label>
                                    <input required value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="Software Engineer" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Company</label>
                                    <input required value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="Google" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Type</label>
                                    <select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Location</label>
                                    <input required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="Mumbai, Remote" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Salary Range</label>
                                    <input value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="10 - 15 LPA" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Deadline</label>
                                    <input value={newJob.deadline} onChange={e => setNewJob({ ...newJob, deadline: e.target.value })} type="date" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Application/Referral Link (Optional)</label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input value={newJob.applicationLink} onChange={e => setNewJob({ ...newJob, applicationLink: e.target.value })} placeholder="https://careers.google.com/..." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 ml-1 self-start">If provided, applicants will be redirected to this link.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-[700] text-slate-500 uppercase tracking-wider mb-2 ml-1">Requirements (comma separated)</label>
                                <input value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} placeholder="React, Node.js, Python" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500]" />
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2 ml-1">Description</label>
                                <textarea required rows={4} value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="Tell students more about the role..." className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-[500] resize-none" />
                            </div>

                            <button
                                disabled={posting}
                                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[800] rounded-2xl hover:scale-[1.01] transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-70 mt-4 flex items-center justify-center gap-2">
                                {posting ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Sharing Opportunity...</>
                                ) : 'Post Opportunity'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

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
                            onClick={() => handleApply(applyModal)}
                            className="w-full mt-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
                            Submit Application
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
