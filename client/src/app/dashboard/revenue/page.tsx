"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';

const revenueData = [
    { month: 'Oct', revenue: 82000, users: 1200, sessions: 180 },
    { month: 'Nov', revenue: 98000, users: 1450, sessions: 210 },
    { month: 'Dec', revenue: 115000, users: 1680, sessions: 245 },
    { month: 'Jan', revenue: 145000, users: 1920, sessions: 290 },
    { month: 'Feb', revenue: 198000, users: 2240, sessions: 340 },
    { month: 'Mar', revenue: 250000, users: 2580, sessions: 398 },
];

export default function RevenueAnalyticsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Revenue Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Detailed revenue breakdown and projections</p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-[800] text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Monthly Revenue & Sessions
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="rev2Grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} dx={-10} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={10} />
                        <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(v: number, name: string) => [name === 'revenue' ? `₹${(v / 1000).toFixed(0)}K` : v, name === 'revenue' ? 'Total Revenue' : 'Mentoring Sessions']} />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fill="url(#rev2Grad)" name="revenue" />
                        <Area yAxisId="right" type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={3} fill="url(#sessGrad)" name="sessions" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
                {[
                    { label: 'Mentoring Sessions', amount: '₹1,82,000', share: '72.8%', icon: '🎓', color: 'from-indigo-500 to-purple-600' },
                    { label: 'Subscriptions', amount: '₹48,000', share: '19.2%', icon: '💎', color: 'from-blue-500 to-cyan-600' },
                    { label: 'Events & Webinars', amount: '₹20,000', share: '8%', icon: '🎪', color: 'from-green-500 to-emerald-600' },
                ].map(({ label, amount, share, icon, color }) => (
                    <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
                        <div className="text-2xl mb-3">{icon}</div>
                        <div className="text-2xl font-[900] mb-1">{amount}</div>
                        <div className="text-white/80 text-sm font-[600]">{label}</div>
                        <div className="mt-2 text-white/70 text-xs font-[500]">{share} of total revenue</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
