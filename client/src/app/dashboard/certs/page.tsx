"use client"
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function CertificationsPage() {
    const [certs, setCerts] = useState([
        { id: 1, student: 'Riya Kapoor', cert: 'Python Mastery', score: 92, date: 'Mar 1, 2026', status: 'pending' },
        { id: 2, student: 'Tanmay Shah', cert: 'System Design', score: 88, date: 'Mar 2, 2026', status: 'pending' },
        { id: 3, student: 'Aditya Kumar', cert: 'React Development', score: 95, date: 'Mar 3, 2026', status: 'pending' },
        { id: 4, student: 'Pooja Nair', cert: 'DSA Fundamentals', score: 90, date: 'Feb 25, 2026', status: 'approved' },
        { id: 5, student: 'Shreya Iyer', cert: 'Python Mastery', score: 64, date: 'Feb 22, 2026', status: 'rejected' },
    ]);

    const approve = (id: number) => setCerts(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    const reject = (id: number) => setCerts(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Certification Approvals</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Review and approve student certification requests</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Pending', value: certs.filter(c => c.status === 'pending').length, color: 'from-amber-500 to-orange-500' },
                    { label: 'Approved', value: certs.filter(c => c.status === 'approved').length, color: 'from-green-500 to-emerald-600' },
                    { label: 'Rejected', value: certs.filter(c => c.status === 'rejected').length, color: 'from-red-500 to-rose-600' },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white text-center shadow-lg`}>
                        <div className="text-3xl font-[900]">{value}</div>
                        <div className="text-white/80 text-sm font-[600]">{label}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {certs.map(c => (
                    <div key={c.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                            {c.student.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="font-[700] text-slate-900 dark:text-white">{c.student}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{c.cert} · Score: <span className={`font-[700] ${c.score >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{c.score}%</span></div>
                            <div className="text-xs text-slate-400">{c.date}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {c.status === 'pending' ? (
                                <>
                                    <button onClick={() => approve(c.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-[700] rounded-xl hover:bg-green-200 transition-all">
                                        <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button onClick={() => reject(c.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-[700] rounded-xl hover:bg-red-200 transition-all">
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                </>
                            ) : (
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[700] ${c.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                    {c.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    {c.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
