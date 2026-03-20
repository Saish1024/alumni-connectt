import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { users as apiUsers, admin as apiAdmin } from '@/lib/api';



export default function AdminOverview() {
    const router = useRouter();
    const [stats, setStats] = useState({
        pendingCount: 0,
        totalUsers: 0,
        platformRevenue: 0,
        totalPayouts: 0,
        pendingInboundCount: 0,
        loading: true
    });
    const [chartsData, setChartsData] = useState<any>({
        revenueData: [],
        userGrowthData: [],
        roleDistribution: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pending, allUsers, financials, analytics] = await Promise.all([
                    apiUsers.pending(),
                    apiUsers.list(),
                    apiAdmin.getFinancials(),
                    apiAdmin.getDashboardAnalytics()
                ]);
                setStats({
                    pendingCount: pending.length,
                    totalUsers: allUsers.length,
                    platformRevenue: financials.platformRevenue,
                    totalPayouts: financials.totalPayouts,
                    pendingInboundCount: financials.pendingInboundCount,
                    loading: false
                });
                setChartsData(analytics);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6 font-[Inter,sans-serif] animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 rounded-2xl p-6 text-white">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/70 text-sm font-[500] mb-1">Admin Panel</div>
                        <h2 className="text-2xl font-[800]">Platform Overview</h2>
                        <p className="text-white/80 text-sm mt-1">Alumni Connect · All Systems Operational ✅</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/dashboard/registrations')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all flex items-center gap-2">
                            {stats.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.pendingCount} Pending Approvals
                        </button>
                        <button onClick={() => router.push('/dashboard/announcements')} className="px-5 py-2.5 bg-white text-orange-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
                            Post Announcement
                        </button>
                    </div>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats.loading ? '...' : stats.totalUsers.toLocaleString(), change: '+340 this month', icon: Users, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Total Revenue', value: stats.loading ? '...' : `₹${(stats.platformRevenue / 1000).toFixed(1)}K`, change: 'Verified payments', icon: TrendingUp, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { label: 'Pending Inbound', value: stats.loading ? '...' : stats.pendingInboundCount, change: 'Awaiting verification', icon: Calendar, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                    { label: 'Pending Approvals', value: stats.loading ? '...' : stats.pendingCount, change: 'User registrations', icon: AlertCircle, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
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

            {/* Revenue & User Growth */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Revenue Growth</h3>
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 6 months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartsData.revenueData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, 'Revenue']} />
                            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Role Distribution */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">User Distribution</h3>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie data={chartsData.roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                {chartsData.roleDistribution.map((entry: any, i: number) => <Cell key={`admin-role-${i}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {chartsData.roleDistribution.map((r: any) => (
                            <div key={r.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                                    <span className="text-slate-600 dark:text-slate-400 font-[500]">{r.name}</span>
                                </div>
                                <span className="font-[700] text-slate-900 dark:text-white">{r.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[700] text-slate-900 dark:text-white">User Growth by Role</h3>
                    <button onClick={() => router.push('/dashboard/users')} className="text-sm text-orange-600 dark:text-orange-400 font-[600] hover:underline">View Users</button>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartsData.userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Bar dataKey="student" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" stackId="a" />
                        <Bar dataKey="alumni" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Alumni" stackId="a" />
                        <Bar dataKey="faculty" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Faculty" stackId="a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
