"use client"
import { useEffect, useState, useRef } from 'react';
import { Flame, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { users as apiUsers } from '@/lib/api';

export default function LeaderboardPage() {
    const { user: currentUser } = useAuth();
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(new Date());
    const pollInterval = useRef<any>(null);

    const fetchLeaderboard = async (isPoll = false) => {
        if (!isPoll) setLoading(true);
        else setIsSyncing(true);

        try {
            const data = await apiUsers.getLeaderboard();
            setLeaderboard(data);
            setLastSynced(new Date());
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        pollInterval.current = setInterval(() => fetchLeaderboard(true), 30000);
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    if (loading && leaderboard.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Calculating rankings...</p>
            </div>
        );
    }

    // Podium calculation
    const podium = [
        leaderboard[1] || null, // 2nd
        leaderboard[0] || null, // 1st
        leaderboard[2] || null  // 3rd
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Header with Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Leaderboard</h2>
                        <div className="flex items-center gap-2 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-[800] text-green-600 dark:text-green-400 uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Compete with peers and earn rewards · Last synced: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-3">
                    {isSyncing && (
                       <div className="flex items-center gap-1.5 text-indigo-500 text-[10px] font-bold uppercase tracking-tight mr-2 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Syncing...
                       </div>
                    )}
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-fit">
                        {(['weekly', 'monthly'] as const).map(p => (
                            <button key={p} onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-[600] capitalize transition-all ${period === p ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top 3 podium */}
            {leaderboard.length >= 1 && (
                <div className="grid grid-cols-3 gap-4">
                    {podium.map((user, i) => {
                        if (!user) return <div key={i} className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-5 border border-dashed border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-slate-300">Wait...</div>;
                        const isYou = user.id === currentUser?._id;
                        const avatarColors = [
                            'from-slate-300 to-slate-400', // 2nd
                            'from-amber-300 to-amber-500', // 1st
                            'from-orange-300 to-orange-500' // 3rd
                        ];
                        const medals = ['🥈', '🏆', '🥉'];

                        return (
                            <div key={user.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 text-center border-2 transition-all hover:scale-[1.02] ${i === 1 ? 'border-amber-400 shadow-xl shadow-amber-400/10' : 'border-slate-200 dark:border-slate-700/50'} ${isYou ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                                <div className="relative mx-auto w-12 h-12 mb-3">
                                    {user.img ? (
                                        <img src={user.img} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md" alt={user.name} />
                                    ) : (
                                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${avatarColors[i]} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                                            {medals[i]}
                                        </div>
                                    )}
                                    <div className="absolute -top-1 -right-1 text-base">{medals[i]}</div>
                                </div>
                                <div className="font-[700] text-slate-900 dark:text-white text-xs mb-1 truncate">{isYou ? 'You' : user.name}</div>
                                <div className={`font-[800] ${i === 1 ? 'text-lg text-amber-600 dark:text-amber-400' : 'text-base text-indigo-600 dark:text-indigo-400'}`}>{user.points.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400 font-[500] uppercase tracking-tighter">pts</div>
                                <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-orange-500 font-bold">
                                    <Flame className="w-3 h-3 fill-orange-500" /> {user.streak}d
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full Leaderboard */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/90 dark:bg-slate-800 shadow-sm">
                                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rank</th>
                                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Points</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quizzes</th>
                                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Badges</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                            {leaderboard.map((user) => {
                                const isYou = user.id === currentUser?._id;
                                return (
                                    <tr key={user.id} className={`transition-all hover:bg-slate-50 dark:hover:bg-slate-700/20 ${isYou ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-[800] text-sm ${user.rank === 1 ? 'bg-amber-400 text-white' : user.rank === 2 ? 'bg-slate-300 text-white' : user.rank === 3 ? 'bg-orange-400 text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {user.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.img ? (
                                                    <img src={user.img} className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt={user.name} />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[700] text-sm shadow-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={`font-[600] text-sm ${isYou ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                                        {isYou ? 'You' : user.name}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold">
                                                        <Flame className="w-2.5 h-2.5 fill-orange-500" /> {user.streak}d streak
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-[800] text-slate-900 dark:text-white text-sm">{user.points.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-[500] tracking-tighter">points</div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-[700] text-sm">{user.quizzes}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {Array(Math.min(user.badges, 3)).fill(0).map((_, idx) => (
                                                    <span key={idx} className="text-sm">🏅</span>
                                                ))}
                                                {user.badges > 3 && <span className="text-[10px] text-indigo-500 font-bold ml-0.5">+{user.badges - 3}</span>}
                                                {user.badges === 0 && <span className="text-slate-300 text-xs">-</span>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {leaderboard.length === 0 && (
                    <div className="p-20 text-center text-slate-400 italic">No competitors yet. Be the first!</div>
                )}
            </div>
        </div>
    );
}
