"use client"
import { useState, useEffect } from 'react';
import { alumni } from '@/lib/api';
import { 
    Zap, Calendar, User, Clock, 
    CheckCircle, Loader2, Sparkles, Filter, 
    ExternalLink, MapPin
} from 'lucide-react';
import { toast } from 'sonner';

export default function AlumniOpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState<string | null>(null);

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        try {
            const data = await alumni.getAvailableSessionRequests();
            setOpportunities(data);
        } catch (err) {
            toast.error('Failed to load opportunities');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (requestId: string) => {
        setIsAccepting(requestId);
        try {
            // In a real app, we might ask for a date, but for now we auto-schedule for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);

            await alumni.acceptSessionRequest(requestId, tomorrow.toISOString());
            toast.success('Awesome! Session scheduled. Check your calendar.');
            loadOpportunities();
        } catch (err) {
            toast.error('Failed to accept request');
        } finally {
            setIsAccepting(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-[800] text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-amber-500" />
                        Mentoring Opportunities
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Faculty specific requests for student sessions</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-slate-400">Looking for opportunities...</p>
                </div>
            ) : opportunities.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-[700] text-slate-900 dark:text-white mb-2">No pending requests</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Looks like you're all caught up! When faculty needs a mentor for a specific topic, it will appear right here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {opportunities.map((opp) => (
                        <div key={opp._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col sm:flex-row">
                            <div className="sm:w-32 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700/50">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-xl shadow-lg mb-2">
                                    {(opp.faculty?.name || 'F').charAt(0)}
                                </div>
                                <span className="text-[10px] uppercase font-[800] text-indigo-500 tracking-wider">Faculty</span>
                            </div>
                            
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 transition-colors">
                                            {opp.topic}
                                        </h3>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                            Requested by <span className="text-slate-600 dark:text-slate-200 font-[600]">{opp.faculty?.name || 'Unknown Faculty'}</span>
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(opp.createdAt).toLocaleDateString()}</span>
                                </div>
                                
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
                                    {opp.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 60 Min</span>
                                        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> +50 Reputation</span>
                                    </div>
                                    <button
                                        disabled={isAccepting === opp._id}
                                        onClick={() => handleAccept(opp._id)}
                                        className="w-full sm:w-auto sm:ml-auto px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-[700] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {isAccepting === opp._id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                I'm Interested <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
