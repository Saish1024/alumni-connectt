"use client"
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, IndianRupee, Loader2, BarChart3 } from 'lucide-react';
import { admin as apiAdmin } from '@/lib/api';

export default function RevenueAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiAdmin.getRevenueAnalytics();
                setData(res);
            } catch (err) {
                console.error('Failed to fetch revenue analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-[700] text-slate-900 dark:text-white">No Revenue Data Yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">Once payments are verified, revenue analytics will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Revenue Analytics</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Detailed revenue breakdown and projections</p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-[10px] uppercase font-[800] text-slate-400 tracking-wider">Total Revenue</span>
                    <div className="text-2xl font-[900] text-slate-900 dark:text-white">₹{data.totalRevenue.toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-[800] text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Monthly Revenue & Sessions
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} dx={-10} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} dx={10} />
                        <Tooltip 
                            contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                            formatter={(v: number, name: string) => [
                                name === 'revenue' ? `₹${v.toLocaleString()}` : v, 
                                name === 'revenue' ? 'Revenue' : 'Sessions'
                            ]} 
                        />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fill="url(#rev2Grad)" name="revenue" />
                        <Area yAxisId="right" type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={3} fill="url(#sessGrad)" name="sessions" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.categories.length > 0 ? data.categories.map((cat: any) => (
                    <div key={cat.label} className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-white shadow-lg`}>
                        <div className="text-2xl mb-3">{cat.icon}</div>
                        <div className="text-2xl font-[900] mb-1">₹{cat.amount.toLocaleString()}</div>
                        <div className="text-white/80 text-sm font-[600]">{cat.label}</div>
                        <div className="mt-2 text-white/70 text-xs font-[500]">{cat.share}% of total revenue</div>
                    </div>
                )) : (
                    <div className="md:col-span-3 text-center py-6 text-slate-400 italic">No category data available</div>
                )}
            </div>
        </div>
    );
}
