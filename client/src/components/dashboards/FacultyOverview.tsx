"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, BarChart2, Loader2, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users as usersApi, quizzes as quizzesApi } from '@/lib/api';

export default function FacultyOverview() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [gaps, setGaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Main stats
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('alumni_token');
            const res = await fetch(`${baseUrl}/faculty/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!data.error) setStats(data);

            // Quiz Analytics
            const lbData = await quizzesApi.getLeaderboard();
            setLeaderboard(lbData);

            const gapData = await quizzesApi.getGaps();
            setGaps(gapData);

        } catch (err) {
            console.error('Failed to fetch faculty data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: 'Active Students', value: stats?.activeStudentsCount || '0', change: 'Live count', icon: Users, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
        { label: 'Sessions This Month', value: stats?.sessionsThisMonthCount || '0', change: 'Verified sessions', icon: BookOpen, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
        { label: 'Avg Quiz Score', value: `${stats?.avgQuizScore || 0}%`, change: 'Class average', icon: BarChart2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    ];

    return (
        <div className="space-y-6 font-[Inter,sans-serif] animate-in fade-in duration-500">
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
                        <h2 className="text-2xl font-[800]">{user?.name || 'Dr. Faculty'}</h2>
                        <p className="text-white/80 text-sm mt-1">{user?.jobTitle || 'Faculty Member'} · {user?.department || user?.institution || 'Alumni Connect'}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/dashboard/reports')} className="px-5 py-2.5 bg-white text-green-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map(({ label, value, change, icon: Icon, color, bg }) => (
                    <div key={label} className={`${bg} rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-[800] text-slate-900 dark:text-white">{value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-[500] mt-0.5">{label}</div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-[600] mt-1">{change}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Student Performance Trends</h3>
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 6 months</span>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trends || []}>
                                <defs>
                                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area key="avg" type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Score %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
                    <h3 className="text-lg font-[800] mb-2">Class Engagement</h3>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Students are showing consistent improvement in technical quizzes this month.</p>

                    <div className="space-y-4 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <div className="text-2xl font-[800] mb-1">{stats?.avgQuizScore || 0}%</div>
                            <div className="text-xs text-indigo-100 uppercase tracking-wider font-[700]">Avg Batch Performance</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <div className="text-2xl font-[800] mb-1">{stats?.activeStudentsCount || 0}</div>
                            <div className="text-xs text-indigo-100 uppercase tracking-wider font-[700]">Students Enrolled</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quiz Leaderboard */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Quiz Leaderboard</h3>
                        <Trophy className="w-4 h-4 text-amber-500" />
                    </div>
                    {leaderboard.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700/30">
                                        <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Rank</th>
                                        <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                                        <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Avg %</th>
                                        <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((s, idx) => (
                                        <tr key={s.email} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                            <td className="px-6 py-3 text-sm font-[700] text-slate-400">#{idx + 1}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-[600] text-sm text-slate-900 dark:text-white">{s.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="text-sm font-[700] text-green-600 dark:text-green-400">{s.avgPercentage}%</span>
                                            </td>
                                            <td className="px-6 py-3 text-right text-sm font-[800] text-indigo-600 dark:text-indigo-400">{s.totalScore}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm italic">No quiz data available yet.</div>
                    )}
                </div>

                {/* Performance Gaps */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-6">Critical Areas (Performance Gaps)</h3>
                    {gaps.length > 0 ? (
                        <div className="space-y-6">
                            {gaps.map((gap) => (
                                <div key={gap.topic}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-[600] text-slate-700 dark:text-slate-200">{gap.topic}</span>
                                        <span className="text-xs font-[700] text-red-500 dark:text-red-400">{gap.avgScore}% avg</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${gap.avgScore < 40 ? 'bg-red-500' : 'bg-amber-500'}`} 
                                            style={{ width: `${gap.avgScore}%` }} 
                                        />
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-400 font-[500] uppercase tracking-wider">
                                        Based on {gap.totalAttempts} recent attempts
                                    </div>
                                </div>
                            ))}
                            {gaps.length > 0 && gaps[0] && (
                                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                                    <p className="text-xs text-amber-700 dark:text-amber-400 font-[500] leading-relaxed">
                                        <span className="font-[700]">Insight:</span> Students are struggling most with <span className="font-[700]">{gaps[0].topic}</span>. Consider organizing a specialized mentoring session on this topic.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 text-sm italic py-12">Waiting for more quiz engagement to identify trends.</div>
                    )}
                </div>
            </div>

            {/* Top Students */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Engagement Overview</h3>
                    <button onClick={() => router.push('/dashboard/students')} className="text-sm text-green-600 dark:text-green-400 font-[600] hover:underline">View All Students</button>
                </div>
                {stats?.topStudents?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700/30">
                                    <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                                    <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Sessions</th>
                                    <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Avg Score</th>
                                    <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topStudents.map((s: any) => (
                                    <tr key={s.id} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-[700] text-sm">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-[600] text-sm text-slate-900 dark:text-white">{s.name}</div>
                                                    <div className="text-xs text-slate-400">{s.branch || 'CSE'} · {s.year || 'N/A'} Year</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm font-[600] text-slate-700 dark:text-slate-300">{s.sessionsAttended}</td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`text-sm font-[700] ${s.avgScore >= 85 ? 'text-green-600 dark:text-green-400' : s.avgScore >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{s.avgScore}%</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2 justify-end">
                                                <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${s.progress}%` }} />
                                                </div>
                                                <span className="text-xs font-[700] text-slate-700 dark:text-slate-300 w-8">{s.progress}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm italic">No student engagement data yet.</div>
                )}
            </div>
        </div>
    );
}
