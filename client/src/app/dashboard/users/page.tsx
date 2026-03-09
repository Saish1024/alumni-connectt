"use client"
import { useState, useEffect } from 'react';
import { Search, Ban, Loader2, RefreshCw } from 'lucide-react';
import { users as apiUsers } from '@/lib/api';

export default function UserManagementPage() {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch approved users with the current role filter
            const params: any = {};
            if (roleFilter !== 'all') params.role = roleFilter;
            const data = await apiUsers.list(params);
            setAllUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when filter changes
    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const filtered = allUsers.filter(u => {
        if (search && !u.name?.toLowerCase().includes(search.toLowerCase()) &&
            !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}?`)) return;
        try {
            await apiUsers.delete(id);
            setAllUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert('Failed to delete user.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">User Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">All approved platform users · {allUsers.length} total</p>
                </div>
                <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-[600] rounded-xl hover:border-indigo-300 transition-all">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div className="flex gap-2">
                    {['all', 'student', 'alumni', 'faculty'].map(r => (
                        <button key={r} onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-[600] capitalize transition-all ${roleFilter === r ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30">
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Details</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Joined</th>
                                    <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">No users found.</td>
                                    </tr>
                                ) : filtered.map(u => (
                                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[700] text-sm">
                                                    {u.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-[600] text-sm text-slate-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-[700] capitalize ${u.role === 'student' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                                                u.role === 'alumni' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                                                    u.role === 'faculty' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                                        'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                                                }`}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {u.role === 'alumni' ? `${u.company || 'N/A'} · ${u.batchYear || ''}` :
                                                u.role === 'student' ? u.batchYear || 'Current Student' :
                                                    u.department || 'Faculty'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <button
                                                    onClick={() => handleDelete(u._id, u.name)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Remove User">
                                                    <Ban className="w-4 h-4 text-red-400 hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
