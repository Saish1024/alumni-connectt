import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Code2, Briefcase, Trophy, ChevronRight, Zap, Star, Play, Flame, Loader2, RefreshCw, Linkedin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users as apiUsers } from '@/lib/api';

export default function StudentOverview() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);
    const pollInterval = useRef<any>(null);

    const fetchData = async (isPoll = false) => {
        if (!isPoll) setLoading(true);
        else setIsSyncing(true);
        
        try {
            const data = await apiUsers.getStudentStats();
            setStats(data);
            setLastSynced(new Date());
        } catch (err) {
            console.error('Failed to fetch student stats:', err);
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchData();
        pollInterval.current = setInterval(() => fetchData(true), 30000);
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    const displayName = user?.name || 'User';
    const major = user?.major || 'Information Technology';
    const batchYear = user?.batchYear || '2024';

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Initializing your live dashboard...</p>
            </div>
        );
    }

    const { topStats, activityData, topicData, aiMentors, upcomingSessions } = stats || {
        topStats: { sessionsBooked: 0, monthlySessions: 0, quizzesTaken: 0, weeklyQuizzes: 0, jobsApplied: 0, interviewCount: 0, totalPoints: 0, streak: 0, rank: 0 },
        activityData: [],
        topicData: [],
        aiMentors: [],
        upcomingSessions: []
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Header with Live Status */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-[800] text-green-600 dark:text-green-400 uppercase tracking-wider">Live System</span>
                    </div>
                    <span className="text-[10px] font-[600] text-slate-400 uppercase tracking-wider h-fit mt-0.5">
                        Last synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
                {isSyncing && (
                   <div className="flex items-center gap-2 text-indigo-500 animate-in fade-in slide-in-from-right-2">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Syncing Live Data...</span>
                   </div>
                )}
            </div>

            {/* Welcome banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/80 text-sm font-[500] mb-1">Welcome back 👋</div>
                        <h2 className="text-3xl font-[800]">{displayName}</h2>
                        <p className="text-white/90 text-sm mt-1">
                            {major} · Batch {batchYear}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <Flame className="w-4 h-4 text-orange-300 animate-pulse" />
                            <span className="text-sm font-[600] text-orange-200">{topStats.streak}-day learning streak!</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/dashboard/mentors')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
                            Find Mentor
                        </button>
                        <button onClick={() => router.push('/dashboard/tests')} className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Sessions Booked', value: topStats.sessionsBooked, change: `+${topStats.monthlySessions} this month`, icon: Calendar, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Quizzes Taken', value: topStats.quizzesTaken, change: `+${topStats.weeklyQuizzes} this week`, icon: Code2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                    { label: 'Jobs Applied', value: topStats.jobsApplied, change: `${topStats.interviewCount} interviews`, icon: Briefcase, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { label: 'Total Points', value: topStats.totalPoints.toLocaleString(), change: `Rank #${topStats.rank}`, icon: Trophy, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                ].map(({ label, value, change, icon: Icon, color, bg }) => (
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

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Activity chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Weekly Activity</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full font-[500]">Last 7 Days</span>
                    </div>
                    {activityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-50 dark:opacity-20" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area key="score" type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#scoreGrad)" name="Avg Score %" />
                                <Area key="quizzes" type="monotone" dataKey="quizzes" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGrad)" name="Quizzes" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-slate-400 italic text-sm">No activity recorded this week</div>
                    )}
                </div>

                {/* Topic breakdown */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Topics Practiced</h3>
                    {topicData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                        {topicData.map((entry: any, i: number) => <Cell key={`student-topic-${i}`} fill={entry.color} stroke="transparent" />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {topicData.map((t: any) => (
                                    <div key={t.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                                            <span className="text-slate-600 dark:text-slate-400 font-[500] truncate w-24">{t.name}</span>
                                        </div>
                                        <span className="font-[700] text-slate-900 dark:text-white">{t.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[140px] flex items-center justify-center text-slate-400 italic text-sm">Take a quiz to see your focus</div>
                    )}
                </div>
            </div>

            {/* AI Mentor Recommendations */}
            {aiMentors.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-[700] text-slate-900 dark:text-white">Mentor Recommendations</h3>
                        </div>
                        <button onClick={() => router.push('/dashboard/mentors')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {aiMentors.map((m: any) => (
                            <div key={m.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        {m.img ? (
                                            <img src={m.img} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                {m.name.charAt(0)}
                                            </div>
                                        )}
                                        {m.available && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-[700] text-slate-900 dark:text-white text-sm">{m.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">{m.role}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {m.skills?.slice(0, 3).map((s: string) => (
                                        <span key={s} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-[500]">{s}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-[700]">
                                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating}
                                    </div>
                                    <span className={`text-xs font-[700] px-2 py-0.5 rounded-full ${m.free ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>
                                        {m.free ? 'Free' : `₹${m.price}`}
                                    </span>
                                </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => router.push('/dashboard/mentors')} className="flex-1 mt-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20 text-center">
                                            Book Session
                                        </button>
                                        {m.linkedin && (
                                            <a
                                                href={m.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:hover:text-white transition-all flex items-center justify-center group/ln"
                                                title="Connect on LinkedIn"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Sessions */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Upcoming Sessions</h3>
                </div>
                <div className="space-y-3">
                    {upcomingSessions.length > 0 ? (
                        upcomingSessions.map((s: any) => (
                            <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                {s.img ? (
                                    <img src={s.img} alt={s.mentor} className="w-10 h-10 rounded-xl object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                                        {s.mentor.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-[600] text-slate-900 dark:text-white text-sm truncate">{s.topic}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">with {s.mentor} · {s.date} at {s.time}</div>
                                </div>
                                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-105 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 flex-shrink-0">
                                    <Play className="w-3 h-3 fill-white" /> Join
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="h-20 flex items-center justify-center text-slate-400 italic text-sm">No upcoming sessions booked</div>
                    )}
                </div>
            </div>
        </div>
    );
}
