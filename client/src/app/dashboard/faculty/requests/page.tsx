"use client"
import { useState, useEffect } from 'react';
import { faculty } from '@/lib/api';
import { 
    MessageSquare, Plus, Clock, CheckCircle, 
    Calendar, User, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await faculty.fetchSessionRequests();
            setRequests(data);
        } catch (err) {
            toast.error('Failed to load session requests');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || !description) return;

        setIsCreating(true);
        try {
            await faculty.createSessionRequest(topic, description);
            toast.success('Session request posted to alumni!');
            setShowModal(false);
            setTopic('');
            setDescription('');
            loadRequests();
        } catch (err) {
            toast.error('Failed to create request');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        Session Requests
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Request alumni to conduct sessions on specific topics</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-[600] transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-400">Loading your requests...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-500">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-[700] text-slate-900 dark:text-white mb-2">No active requests</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                        Request a session on any topic and talented alumni will volunteer to teach your students.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-indigo-600 dark:text-indigo-400 font-[600] hover:underline"
                    >
                        Create your first request now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <div key={req._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${
                                        req.status === 'pending' 
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    }`}>
                                        {req.status}
                                    </div>
                                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-[700] text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                                    {req.topic}
                                </h3>
                                <div className="space-y-3">
                                    {/* Faculty Requester */}
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-[700] text-xs">
                                                {req.faculty?.name?.charAt(0) || 'F'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-slate-400 uppercase font-[700]">Requested by</p>
                                                <p className="text-xs font-[600] text-slate-900 dark:text-white">{req.faculty?.name || 'Faculty'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {req.status === 'accepted' && req.acceptingAlumni && (
                                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-[700] text-xs shadow-sm">
                                                    {req.acceptingAlumni.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-indigo-400 dark:text-indigo-300 uppercase font-[700]">Accepted by</p>
                                                    <p className="text-xs font-[600] text-slate-900 dark:text-white">{req.acceptingAlumni.name}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-[700]">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Live on: {new Date(req.scheduledDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {req.status === 'pending' && (
                                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-[500] py-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Waiting for alumni interest...
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-2">Request a Session</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">Tell our alumni what your students want to learn.</p>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Topic Title</label>
                                    <input
                                        required
                                        value={topic}
                                        onChange={e => setTopic(e.target.value)}
                                        placeholder="e.g. Masterclass on System Design"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Detailed Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Briefly describe what students should expect..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-[600] rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isCreating}
                                        type="submit"
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-[600] rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                    >
                                        {isCreating ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Post Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
