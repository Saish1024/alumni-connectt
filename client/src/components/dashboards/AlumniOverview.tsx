"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Video, Star, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { alumni as apiAlumni } from '@/lib/api';

const topicColors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function AlumniOverview() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiAlumni.getStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch alumni stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const displayName = user?.name || 'Alumni Mentor';
    const roleStr = user?.jobTitle ? `${user.jobTitle} ${user.company ? `@ ${user.company}` : ''}` : 'Professional Mentor';
    const batchYear = user?.batchYear || '';
    const major = user?.major || user?.department || '';
    const institution = user?.institution || 'IIT Delhi';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    const { topStats, earningsData, topicData, upcomingSessions, pendingReviews } = stats || {
        topStats: { totalEarnings: 0, monthlyEarnings: 0, sessionsDone: 0, monthlySessions: 0, avgRating: 0, ratingCount: 0, studentsHelped: 0, collegesHelped: 0 },
        earningsData: [],
        topicData: [],
        upcomingSessions: [],
        pendingReviews: []
    };

    return (
        <div className="space-y-6 font-[Inter,sans-serif] animate-in fade-in duration-500">
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 text-white text-left">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
                        <h2 className="text-2xl font-[800]">{displayName}</h2>
                        <p className="text-white/80 text-sm mt-1">{roleStr} · {major} {batchYear} · {institution}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span className="text-sm font-[600] text-amber-200">{topStats.avgRating.toFixed(1)} Rating · {topStats.sessionsDone} Sessions Completed</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/dashboard/setup')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
                            Settings
                        </button>
                        <button onClick={() => router.push('/dashboard/reviews')} className="px-5 py-2.5 bg-white text-purple-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg min-w-[140px]">
                            {pendingReviews.length} Reviews Pending
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Earnings', value: `₹${topStats.totalEarnings.toLocaleString()}`, change: `+₹${topStats.monthlyEarnings.toLocaleString()} this month`, icon: DollarSign, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { label: 'Sessions Done', value: topStats.sessionsDone.toString(), change: `${topStats.monthlySessions} this month`, icon: Video, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Avg Rating', value: `${topStats.avgRating.toFixed(1)} ⭐`, change: `${topStats.ratingCount} reviews`, icon: Star, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                    { label: 'Students Helped', value: topStats.studentsHelped.toString(), change: `From ${topStats.collegesHelped} colleges`, icon: Users, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                ].map(({ label, value, change, icon: Icon, color, bg }: any) => (
                    <div key={label} className={`${bg} rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-[800] text-slate-900 dark:text-white">{value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-[500] mt-0.5">{label}</div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-[600] mt-1">{change}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Earnings Overview</h3>
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 7 months</span>
                    </div>
                    {earningsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`₹${v}`, 'Earnings']} />
                                <Area type="monotone" dataKey="earned" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#earnGrad)" name="Earnings (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm italic">No earnings data yet</div>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Sessions by Topic</h3>
                    {topicData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                        {topicData.map((_: any, i: number) => <Cell key={`alumni-topic-${i}`} fill={topicColors[i % topicColors.length]} stroke="transparent" />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-1.5 mt-2">
                                {topicData.map((t: any, i: number) => (
                                    <div key={t.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: topicColors[i % topicColors.length] }} />
                                            <span className="text-slate-600 dark:text-slate-400 font-[500] truncate max-w-[120px]">{t.name}</span>
                                        </div>
                                        <span className="font-[700] text-slate-900 dark:text-white">{t.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[210px] flex items-center justify-center text-slate-400 text-sm italic">No sessions completed</div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Upcoming Sessions</h3>
                    <button onClick={() => router.push('/dashboard/sessions')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                    {upcomingSessions.length > 0 ? upcomingSessions.map((s: any) => (
                        <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-[700] text-sm flex-shrink-0">
                                {s.student.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-[600] text-slate-900 dark:text-white text-sm truncate">{s.topic}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">with {s.student} · {s.date} at {s.time}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className={`text-[10px] font-[800] px-2 py-0.5 rounded-full uppercase tracking-wider ${s.type === 'free' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'}`}>
                                    {s.type === 'free' ? 'Free' : `₹${s.amount}`}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/20 rounded-xl text-slate-400 text-sm">No upcoming sessions scheduled</div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Pending Resume Reviews</h3>
                    <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-[700]">
                        {pendingReviews.length} pending
                    </span>
                </div>
                <div className="space-y-3">
                    {pendingReviews.length > 0 ? pendingReviews.map((r: any) => (
                        <div key={r.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm">
                                {r.student.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="font-[600] text-slate-900 dark:text-white text-sm">{r.student}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.college} · {r.request}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{r.time}</div>
                            </div>
                            <button onClick={() => router.push('/dashboard/reviews')} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-[800] rounded-xl hover:scale-105 transition-all shadow-md uppercase tracking-wider">
                                Review
                            </button>
                        </div>
                    )) : (
                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/20 rounded-xl text-slate-400 text-sm">No pending resume review requests</div>
                    )}
                </div>
            </div>
        </div>
    );
}
