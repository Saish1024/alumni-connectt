"use client"
import { useRouter } from 'next/navigation';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, BarChart2, Award } from 'lucide-react';

const performanceData = [
    { month: 'Oct', avg: 72, top: 95, bottom: 45 },
    { month: 'Nov', avg: 75, top: 97, bottom: 48 },
    { month: 'Dec', avg: 78, top: 98, bottom: 52 },
    { month: 'Jan', avg: 80, top: 99, bottom: 55 },
    { month: 'Feb', avg: 82, top: 99, bottom: 58 },
    { month: 'Mar', avg: 85, top: 100, bottom: 60 },
];

const students = [
    { id: 1, name: 'Aditya Kumar', branch: 'CSE', year: '3rd', sessionsAttended: 12, quizzesTaken: 39, avgScore: 87, jobs: 2, progress: 85 },
    { id: 2, name: 'Riya Kapoor', branch: 'CSE', year: '3rd', sessionsAttended: 18, quizzesTaken: 48, avgScore: 94, jobs: 3, progress: 95 },
    { id: 3, name: 'Tanmay Shah', branch: 'ECE', year: '4th', sessionsAttended: 15, quizzesTaken: 43, avgScore: 89, jobs: 1, progress: 88 },
    { id: 4, name: 'Preethi R.', branch: 'IT', year: '4th', sessionsAttended: 9, quizzesTaken: 28, avgScore: 75, jobs: 1, progress: 72 },
    { id: 5, name: 'Karan Sharma', branch: 'CSE', year: '2nd', sessionsAttended: 6, quizzesTaken: 20, avgScore: 70, jobs: 0, progress: 60 },
    { id: 6, name: 'Anjali Mehta', branch: 'CS', year: '3rd', sessionsAttended: 14, quizzesTaken: 36, avgScore: 83, jobs: 2, progress: 80 },
];

export default function FacultyOverview() {
    const router = useRouter();

    return (
        <div className="space-y-6 font-[Inter,sans-serif] animate-in fade-in duration-500">
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
                        <h2 className="text-2xl font-[800]">Dr. Meena Krishnan</h2>
                        <p className="text-white/80 text-sm mt-1">Professor · Dept of Computer Science · IIT Delhi</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push('/dashboard/reports')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
                            Generate Report
                        </button>
                        <button onClick={() => router.push('/dashboard/certs')} className="px-5 py-2.5 bg-white text-green-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
                            5 Certs Pending
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Students', value: '248', change: '82% engaged', icon: Users, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Sessions This Month', value: '94', change: '15 pending', icon: BookOpen, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { label: 'Avg Quiz Score', value: '82%', change: '+4% vs last month', icon: BarChart2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                    { label: 'Certifications', value: '47', change: '5 pending approval', icon: Award, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
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

            {/* Performance Chart */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Student Performance Trends</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 6 months</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={performanceData}>
                        <defs>
                            <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        <Area key="avg" type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Score" />
                        <Line key="top" type="monotone" dataKey="top" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Top Score" />
                        <Line key="bottom" type="monotone" dataKey="bottom" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Bottom Score" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Top Students */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Top Performing Students</h3>
                    <button onClick={() => router.push('/dashboard/students')} className="text-sm text-green-600 dark:text-green-400 font-[600] hover:underline">View All</button>
                </div>
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
                            {students.slice(0, 5).map(s => (
                                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-[700] text-sm">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-[600] text-sm text-slate-900 dark:text-white">{s.name}</div>
                                                <div className="text-xs text-slate-400">{s.branch} · {s.year} Year</div>
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
            </div>
        </div>
    );
}
