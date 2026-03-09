"use client"
import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { users as apiUsers } from '@/lib/api';

export default function StudentPerformancePage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await apiUsers.list({ role: 'student' });
                setStudents(data);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Student Performance</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor individual student progress and analytics · {students.length} enrolled</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                        className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 w-64" />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="font-semibold">No students found</p>
                    <p className="text-sm mt-1">Approved students will appear here.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30">
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 uppercase">Student</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 uppercase">Year / Batch</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 uppercase">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 uppercase">Joined</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s._id} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-[700] text-sm">
                                                    {s.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-[600] text-sm text-slate-900 dark:text-white">{s.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{s.batchYear || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{s.email}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-[700] bg-green-100 dark:bg-green-900/20 text-green-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
