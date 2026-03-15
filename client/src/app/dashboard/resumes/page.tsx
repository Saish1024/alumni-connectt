"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { resumes as apiResumes, users as apiUsers } from '@/lib/api';
import {
    FileText, Upload, Clock, CheckCircle, ExternalLink, MessageSquare,
    User, Send, Loader2, AlertCircle, Search, Filter
} from 'lucide-react';

export default function ResumeReviewPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state (Student)
    const [selectedAlumni, setSelectedAlumni] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeName, setResumeName] = useState('');

    // Feedback state (Alumni)
    const [editingReview, setEditingReview] = useState<any | null>(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user?.role === 'alumni') {
                const data = await apiResumes.listForAlumni();
                setRequests(data);
            } else {
                const [reqData, mentorData] = await Promise.all([
                    apiResumes.listForStudent(),
                    apiUsers.list({ role: 'alumni' })
                ]);
                setRequests(reqData);
                setMentors(mentorData);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAlumni || !resumeUrl) return;

        setSubmitting(true);
        setError(null);
        try {
            await apiResumes.request({
                alumniId: selectedAlumni,
                resumeUrl,
                resumeName: resumeName || 'My Resume'
            });
            setResumeUrl('');
            setResumeName('');
            setSelectedAlumni('');
            await fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview || !feedback) return;

        setSubmitting(true);
        setError(null);
        try {
            await apiResumes.submitFeedback(editingReview._id, feedback);
            setEditingReview(null);
            setFeedback('');
            await fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-[500]">Loading resume reviews...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-[800] text-slate-900 dark:text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-500" />
                    Resume Review Portal
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {user?.role === 'alumni'
                        ? 'Help students succeed by providing valuable feedback on their resumes.'
                        : 'Get expert feedback on your resume from our network of successful alumni.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Form (Student) or Progress (Alumni) */}
                <div className="lg:col-span-1 space-y-6">
                    {user?.role !== 'alumni' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-[700] text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-indigo-500" />
                                Request New Review
                            </h3>
                            <form onSubmit={handleRequestReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-1.5">Select Mentor</label>
                                    <select
                                        value={selectedAlumni}
                                        onChange={e => setSelectedAlumni(e.target.value)}
                                        required
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    >
                                        <option value="">Choose an alumni...</option>
                                        {mentors.map(m => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.company || 'Alumni'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-1.5">Resume URL (e.g. Google Drive/Dropbox)</label>
                                    <input
                                        type="url"
                                        value={resumeUrl}
                                        onChange={e => setResumeUrl(e.target.value)}
                                        required
                                        placeholder="https://drive.google.com/..."
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-1.5">Resume Name</label>
                                    <input
                                        type="text"
                                        value={resumeName}
                                        onChange={e => setResumeName(e.target.value)}
                                        placeholder="Software Engineer Intern Resume"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Request'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Your Progress</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                                    <div className="text-2xl font-[800] text-indigo-600 dark:text-indigo-400">
                                        {requests.filter(r => r.status === 'reviewed').length}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-[600] uppercase tracking-wider">Resumes Reviewed</div>
                                </div>
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                                    <div className="text-2xl font-[800] text-amber-600 dark:text-amber-400">
                                        {requests.filter(r => r.status === 'pending').length}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-[600] uppercase tracking-wider">Pending Tasks</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: List of requests */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-[700] text-slate-900 dark:text-white">
                                {user?.role === 'alumni' ? 'Review Requests' : 'Your Review Requests'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-500 font-[600]">
                                    {requests.length} Total
                                </span>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                            {requests.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-[500]">No resume review requests yet.</p>
                                </div>
                            ) : (
                                requests.map(req => (
                                    <div key={req._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${req.status === 'reviewed'
                                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                                    : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'
                                                    }`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-[700] text-slate-900 dark:text-white">
                                                        {req.resumeName || 'Untitled Resume'}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                                        <User className="w-3.5 h-3.5" />
                                                        {user?.role === 'alumni' ? req.student?.name : `Reviewer: ${req.alumni?.name}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <span className={`text-[10px] font-[800] uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 ${req.status === 'reviewed'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                                                    }`}>
                                                    {req.status === 'reviewed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {req.status}
                                                </span>
                                                <div className="text-[10px] text-slate-400 font-[500]">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center gap-3">
                                            <a
                                                href={req.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-[700] flex items-center gap-2 transition-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" /> View Resume
                                            </a>

                                            {user?.role === 'alumni' && req.status === 'pending' && (
                                                <button
                                                    onClick={() => {
                                                        setEditingReview(req);
                                                        setFeedback('');
                                                    }}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-[700] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                                                >
                                                    Write Review
                                                </button>
                                            )}
                                        </div>

                                        {req.status === 'reviewed' && (
                                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2 mb-2 text-indigo-500">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="text-xs font-[700] uppercase tracking-wider">Expert Feedback</span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                                    "{req.feedback}"
                                                </p>
                                                {req.reviewedAt && (
                                                    <div className="text-[10px] text-slate-400 mt-3 text-right">
                                                        Reviewed on {new Date(req.reviewedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal/Overlay for writing review */}
            {editingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-white/10 relative">
                        <button
                            onClick={() => setEditingReview(null)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-2">Review Resume</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Reviewing <span className="font-[700] text-indigo-500">{editingReview.resumeName}</span> for <span className="font-[700] text-slate-900 dark:text-white">{editingReview.student?.name}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmitFeedback} className="space-y-6">
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Feedback & Suggestions</label>
                                <textarea
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    required
                                    rows={6}
                                    placeholder="Share your thoughts on the structure, content, and any missing skills..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingReview(null)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-[700] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Icon fallbacks
const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
