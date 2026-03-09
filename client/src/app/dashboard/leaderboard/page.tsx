"use client"
import { useState } from 'react';
import { Flame } from 'lucide-react';

const leaderboardData = [
    { rank: 1, name: 'Riya Kapoor', points: 4850, badges: 12, quizzes: 48, streak: 30, avatar: '🏆' },
    { rank: 2, name: 'Tanmay Shah', points: 4420, badges: 10, quizzes: 43, streak: 25, avatar: '🥈' },
    { rank: 3, name: 'You (Aditya)', points: 3980, badges: 8, quizzes: 39, streak: 18, avatar: '🥉', isYou: true },
    { rank: 4, name: 'Pooja Nair', points: 3650, badges: 7, quizzes: 35, streak: 15, avatar: '' },
    { rank: 5, name: 'Kartik Joshi', points: 3200, badges: 6, quizzes: 30, streak: 12, avatar: '' },
    { rank: 6, name: 'Shreya Iyer', points: 2980, badges: 5, quizzes: 28, streak: 10, avatar: '' },
    { rank: 7, name: 'Nikhil Rao', points: 2750, badges: 5, quizzes: 25, streak: 8, avatar: '' },
];

export default function LeaderboardPage() {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Leaderboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Compete with peers and earn rewards</p>
                </div>
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {(['weekly', 'monthly'] as const).map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${period === p ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-4">
                {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((user, i) => (
                    <div key={user.rank} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 text-center border-2 ${i === 1 ? 'border-amber-400 shadow-lg shadow-amber-400/20' : 'border-slate-200 dark:border-slate-700/50'} ${user.isYou ? 'ring-2 ring-indigo-500' : ''}`}>
                        <div className="text-3xl mb-2">{user.avatar || '👤'}</div>
                        <div className="font-[700] text-slate-900 dark:text-white text-sm mb-1">{user.isYou ? 'You' : user.name}</div>
                        <div className="text-indigo-600 dark:text-indigo-400 font-[800] text-lg">{user.points.toLocaleString()}</div>
                        <div className="text-xs text-slate-400 font-[500]">points</div>
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Flame className="w-3.5 h-3.5 text-orange-400" /> {user.streak} day streak
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Rank</th>
                                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Points</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Quizzes</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Badges</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((user, i) => (
                                <tr key={user.rank} className={`border-b border-slate-100 dark:border-slate-700/30 last:border-0 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/20 ${user.isYou ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-[800] text-sm ${user.rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                            {user.rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`font-[600] text-sm ${user.isYou ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {user.isYou ? 'You (Aditya)' : user.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-orange-400">
                                                    <Flame className="w-3 h-3" /> {user.streak}d streak
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-[700] text-slate-900 dark:text-white">{user.points.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-[500]">{user.quizzes}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {Array(Math.min(user.badges, 5)).fill(0).map((_, i) => (
                                                <span key={i} className="text-sm">🏅</span>
                                            ))}
                                            {user.badges > 5 && <span className="text-xs text-slate-400 font-[600]">+{user.badges - 5}</span>}
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
