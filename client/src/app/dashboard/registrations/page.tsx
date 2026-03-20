"use client"
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Globe, Loader2 } from 'lucide-react';
import { users as apiUsers } from '@/lib/api';
import { toast } from 'sonner';

export default function RegistrationsPage() {
    const [regs, setRegs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const data = await apiUsers.pending();
            setRegs(data);
        } catch (err) {
            console.error('Failed to fetch registrations:', err);
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        try {
            await apiUsers.approve(id);
            toast.success(`${name} has been approved!`);
            setRegs(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Failed to approve user:', err);
            toast.error('Failed to approve user');
        }
    };

    const handleReject = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to reject and delete ${name}'s registration?`)) return;
        try {
            await apiUsers.delete(id);
            toast.success(`${name}'s registration has been rejected.`);
            setRegs(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Failed to reject user:', err);
            toast.error('Failed to reject user');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium">Fetching pending registrations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Pending Approvals</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Review and approve new student, alumni, and faculty registrations</p>
            </div>

            {regs.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-[500]">
                        <span className="font-[700]">{regs.length} registrations</span> are waiting for your approval.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {regs.map(r => (
                    <div key={r._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0 shadow-lg shadow-indigo-500/20">
                                {r.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="font-[700] text-slate-900 dark:text-white">{r.name}</div>
                                            <span className={`text-[10px] font-[800] px-2 py-0.5 rounded-full uppercase tracking-wider ${r.role === 'alumni' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : r.role === 'faculty' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                {r.role}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{r.email}</div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-[500]">Applied {new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                                    {r.company && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🏢 {r.company}</span>}
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🎓 {r.batchYear || 'N/A'}</span>
                                    {r.industry && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">📚 {r.industry}</span>}
                                    {r.linkedin && (
                                        <a href={r.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-[500] hover:bg-blue-100 transition-colors">
                                            <Globe className="w-3.5 h-3.5" /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                            <button
                                onClick={() => handleApprove(r._id, r.name)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-[700] rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                                <CheckCircle className="w-4 h-4" /> Approve User
                            </button>
                            <button
                                onClick={() => handleReject(r._id, r.name)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-[700] rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                        </div>
                    </div>
                ))}

                {regs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/10 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
                        </div>
                        <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-1">Clear!</h3>
                        <p className="text-slate-500 dark:text-slate-400">No new registrations pending approval.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

