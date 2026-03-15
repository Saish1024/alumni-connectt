"use client"
import { useState, useEffect } from 'react';
import { Search, Loader2, Award, Calendar, BarChart3, X, User } from 'lucide-react';
import { faculty as apiFaculty } from '@/lib/api';

export default function StudentPerformancePage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await apiFaculty.getStudentPerformance();
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
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                        <p className="text-sm font-medium text-slate-500">Retrieving academic records...</p>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="font-semibold">No students found</p>
                    <p className="text-sm mt-1">Approved students will appear here.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900 shadow-sm text-left">
                                    <th className="px-6 py-4 text-xs font-[800] text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-[800] text-slate-500 uppercase tracking-wider">Year</th>
                                    <th className="px-6 py-4 text-xs font-[800] text-slate-400 uppercase tracking-wider">Sessions</th>
                                    <th className="px-6 py-4 text-xs font-[800] text-slate-400 uppercase tracking-wider">Avg Score</th>
                                    <th className="px-6 py-4 text-xs font-[800] text-slate-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                                {filtered.map(s => (
                                    <tr 
                                        key={s._id} 
                                        onClick={() => setSelectedStudent(s)}
                                        className="group border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-[900] text-sm shadow-md group-hover:scale-105 transition-transform">
                                                        {s.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-[700] text-sm text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{s.name}</div>
                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[150px]">{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{s.batchYear || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-[800]">
                                                    {s.sessionsAttended}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-[800] text-slate-700 dark:text-slate-200">{s.avgQuizScore}%</div>
                                                <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${
                                                            s.avgQuizScore >= 75 ? 'bg-green-500' : s.avgQuizScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${s.avgQuizScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-[800] bg-green-100 dark:bg-green-900/20 text-green-600 uppercase tracking-tight">
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

            {/* Backdrop & Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedStudent(null)} />
                    
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                    {selectedStudent.name?.charAt(0)}
                                </div>
                                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white leading-tight">{selectedStudent.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{selectedStudent.email}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-[800] text-slate-500 uppercase tracking-widest">{selectedStudent.batchYear} Batch</span>
                                    <span className="px-2.5 py-1 bg-green-500/10 rounded-lg text-[10px] font-[800] text-green-500 uppercase tracking-widest">Active Status</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-blue-50/50 dark:bg-blue-900/5 rounded-3xl border border-blue-100/50 dark:border-blue-900/20">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-[800] uppercase tracking-widest">Sessions</span>
                                    </div>
                                    <div className="text-3xl font-[900] text-slate-900 dark:text-white leading-none">
                                        {selectedStudent.sessionsAttended}
                                    </div>
                                    <div className="mt-1 text-[9px] text-slate-400 font-medium">Completed Meetings</div>
                                </div>

                                <div className="p-5 bg-purple-50/50 dark:bg-purple-900/5 rounded-3xl border border-purple-100/50 dark:border-purple-900/20">
                                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                                        <Award className="w-4 h-4" />
                                        <span className="text-[10px] font-[800] uppercase tracking-widest">Avg Quiz</span>
                                    </div>
                                    <div className="text-3xl font-[900] text-slate-900 dark:text-white leading-none">
                                        {selectedStudent.avgQuizScore}%
                                    </div>
                                    <div className="mt-1 text-[9px] text-slate-400 font-medium">Academic Accuracy</div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-[800] text-slate-900 dark:text-white">Engagement Score</span>
                                    </div>
                                    <span className="text-xs font-[900] text-emerald-500">
                                        {Math.round((selectedStudent.avgQuizScore * 0.7) + (Math.min(30, selectedStudent.sessionsAttended * 10)))}/100
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000"
                                        style={{ width: `${Math.round((selectedStudent.avgQuizScore * 0.7) + (Math.min(30, selectedStudent.sessionsAttended * 10)))}%` }}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedStudent(null)}
                                className="w-full mt-8 py-4 bg-slate-950 dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white rounded-2xl font-[800] text-sm transition-all shadow-xl"
                            >
                                Close Records
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
