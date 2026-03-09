"use client"
import { useRouter } from 'next/navigation';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Code2, Briefcase, Trophy, ChevronRight, Zap, Star, Play, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock Data
const activityData = [
    { day: 'Mon', sessions: 1, quizzes: 3, score: 78 },
    { day: 'Tue', sessions: 2, quizzes: 2, score: 82 },
    { day: 'Wed', sessions: 0, quizzes: 4, score: 88 },
    { day: 'Thu', sessions: 1, quizzes: 1, score: 75 },
    { day: 'Fri', sessions: 3, quizzes: 5, score: 92 },
    { day: 'Sat', sessions: 2, quizzes: 3, score: 85 },
    { day: 'Sun', sessions: 1, quizzes: 2, score: 89 },
];

const topicData = [
    { name: 'Python', value: 35, color: '#6366f1' },
    { name: 'DSA', value: 25, color: '#8b5cf6' },
    { name: 'JavaScript', value: 20, color: '#06b6d4' },
    { name: 'Java', value: 12, color: '#10b981' },
    { name: 'SQL', value: 8, color: '#f59e0b' },
];

const aiMentors = [
    { id: 1, name: 'Arjun Mehta', role: 'SDE @ Google', skills: ['React', 'Node.js', 'DSA'], rating: 4.9, sessions: 142, free: true, img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop', available: true },
    { id: 2, name: 'Priya Sharma', role: 'Senior SDE @ Amazon', skills: ['Python', 'ML', 'System Design'], rating: 4.8, sessions: 98, free: false, price: 500, img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop', available: true },
    { id: 3, name: 'Mei Lin', role: 'Data Scientist @ Microsoft', skills: ['Python', 'TensorFlow', 'SQL'], rating: 4.9, sessions: 76, free: false, price: 800, img: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?w=100&h=100&fit=crop', available: false },
];

const sessions = [
    { id: 1, mentor: 'Arjun Mehta', topic: 'DSA & Competitive Programming', date: 'Mar 7, 2026', time: '4:00 PM', duration: '60 min', status: 'upcoming', type: 'free', img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop' },
    { id: 2, mentor: 'Priya Sharma', topic: 'Resume Review & Interview Prep', date: 'Mar 10, 2026', time: '6:30 PM', duration: '45 min', status: 'upcoming', type: 'paid', img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop' },
];

export default function StudentOverview() {
    const { user } = useAuth();
    const router = useRouter();

    const displayName = user?.name || 'User';
    const major = user?.major || 'Computer Science';
    const batchYear = user?.batchYear || '2024';
    const company = user?.company;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Welcome banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-white/80 text-sm font-[500] mb-1">Welcome back 👋</div>
                        <h2 className="text-3xl font-[800]">{displayName}</h2>
                        <p className="text-white/90 text-sm mt-1">
                            {user?.role === 'alumni'
                                ? `${user?.jobTitle || 'Alumni'} ${company ? `· ${company}` : ''} · Class of ${batchYear}`
                                : `${major} · Batch ${batchYear}`
                            }
                        </p>
                        {user?.role !== 'alumni' && (
                            <div className="flex items-center gap-2 mt-3">
                                <Flame className="w-4 h-4 text-orange-300" />
                                <span className="text-sm font-[600] text-orange-200">18-day learning streak!</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.push(user?.role === 'alumni' ? '/dashboard/mentorship-requests' : '/dashboard/mentors')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
                            {user?.role === 'alumni' ? 'View Requests' : 'Find Mentor'}
                        </button>
                        <button onClick={() => router.push(user?.role === 'alumni' ? '/dashboard/jobs' : '/dashboard/tests')} className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
                            {user?.role === 'alumni' ? 'Post Job' : 'Start Quiz'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Sessions Booked', value: '12', change: '+3 this month', icon: Calendar, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    { label: 'Quizzes Taken', value: '39', change: '+8 this week', icon: Code2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                    { label: 'Jobs Applied', value: '7', change: '2 interviews', icon: Briefcase, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
                    { label: 'Total Points', value: '3,980', change: 'Rank #3', icon: Trophy, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
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
                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-full font-[500]">This Week</span>
                    </div>
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
                            <Area key="score" type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#scoreGrad)" name="Quiz Score" />
                            <Area key="quizzes" type="monotone" dataKey="quizzes" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGrad)" name="Quizzes" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Topic breakdown */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Topics Practiced</h3>
                    <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                            <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                                {topicData.map((entry, i) => <Cell key={`student-topic-${i}`} fill={entry.color} stroke="transparent" />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {topicData.map(t => (
                            <div key={t.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                                    <span className="text-slate-600 dark:text-slate-400 font-[500]">{t.name}</span>
                                </div>
                                <span className="font-[700] text-slate-900 dark:text-white">{t.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Mentor Recommendations */}
            {user?.role !== 'alumni' && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-[700] text-slate-900 dark:text-white">AI Mentor Recommendations</h3>
                        </div>
                        <button onClick={() => router.push('/dashboard/mentors')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {aiMentors.map(m => (
                            <div key={m.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <img src={m.img} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                                        {m.available && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="font-[700] text-slate-900 dark:text-white text-sm">{m.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{m.role}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {m.skills.slice(0, 3).map(s => (
                                        <span key={s} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-[500]">{s}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-[700]">
                                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating}
                                    </div>
                                    <span className={`text-xs font-[700] px-2 py-0.5 rounded-full ${m.free ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>
                                        {m.free ? 'Free' : `₹${m.price}/hr`}
                                    </span>
                                </div>
                                <button className="w-full mt-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20">
                                    Book Session
                                </button>
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
                    {sessions.filter(s => s.status === 'upcoming').map(s => (
                        <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <img src={s.img} alt={s.mentor} className="w-10 h-10 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="font-[600] text-slate-900 dark:text-white text-sm truncate">{s.topic}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">with {s.mentor} · {s.date} at {s.time}</div>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-105 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 flex-shrink-0">
                                <Play className="w-3 h-3 fill-white" /> Join
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
