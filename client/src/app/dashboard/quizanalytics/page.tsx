"use client"
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Info } from 'lucide-react';

export default function QuizAnalyticsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');
                const res = await fetch(`${baseUrl}/quizzes/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const analytics = await res.json();
                if (Array.isArray(analytics)) {
                    setData(analytics);
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Quiz Analytics</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Performance breakdown by topic and difficulty</p>
            </div>

            {data.length > 0 ? (
                <>
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                        <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Attempts & Average Scores by Topic</h3>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="topic" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Bar key="attempts" dataKey="attempts" fill="#6366f1" radius={[0, 6, 6, 0]} name="Attempts" />
                                <Bar key="pass" dataKey="pass" fill="#10b981" radius={[0, 6, 6, 0]} name="Passed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.map(t => {
                            const passRate = Math.round((t.pass / t.attempts) * 100);
                            return (
                                <div key={t.topic} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-[700] text-slate-900 dark:text-white">{t.topic}</h4>
                                        <span className={`text-xs font-[700] px-2 py-1 rounded-full ${passRate >= 80 ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : passRate >= 60 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                            {passRate}% pass
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                                            <div className="font-[800] text-slate-900 dark:text-white text-lg">{t.attempts}</div>
                                            <div className="text-slate-400">attempts</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                                            <div className="font-[800] text-indigo-600 dark:text-indigo-400 text-lg">{t.avgScore}%</div>
                                            <div className="text-slate-400">avg score</div>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                                            <div className="font-[800] text-green-600 dark:text-green-400 text-lg">{t.pass}</div>
                                            <div className="text-slate-400">passed</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-12 border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-[700] text-slate-900 dark:text-white mb-2">No Quiz Data Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Analytics will appear here once students start completing AI-generated quizzes from their dashboard.</p>
                </div>
            )}
        </div>
    );
}
