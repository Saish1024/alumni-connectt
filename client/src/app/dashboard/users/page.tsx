"use client"
import { useState, useEffect } from 'react';
import { Search, Ban, Loader2, RefreshCw, Pencil, X, Save, Shield, Key } from 'lucide-react';
import { users as apiUsers } from '@/lib/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';

export default function UserManagementPage() {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
        batchYear: '',
        company: '',
        jobTitle: '',
        industry: '',
        location: '',
        bio: '',
        linkedin: '',
        isApproved: true,
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
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

    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setEditData({
            name: user.name || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            role: user.role || 'student',
            password: '', 
            batchYear: user.batchYear || '',
            company: user.company || '',
            jobTitle: user.jobTitle || '',
            industry: user.industry || '',
            location: user.location || '',
            bio: user.bio || '',
            linkedin: user.linkedin || '',
            isApproved: user.isApproved ?? true,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        setUpdateLoading(true);
        try {
            const updatePayload: any = { ...editData };
            if (!updatePayload.password) delete updatePayload.password;

            await apiUsers.updateByAdmin(selectedUser._id, updatePayload);
            setIsEditModalOpen(false);
            fetchUsers();
            alert('User updated successfully!');
        } catch (err: any) {
            console.error('Failed to update user:', err);
            alert(err.message || 'Failed to update user.');
        } finally {
            setUpdateLoading(false);
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
                    {['all', 'student', 'alumni', 'faculty', 'admin'].map(r => (
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
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 shadow-sm dark:bg-slate-900">
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                    <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                    <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">No users found.</td>
                                    </tr>
                                ) : filtered.map(u => (
                                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-[700] text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                    {u.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-[600] text-sm text-slate-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${u.role === 'student' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                                                u.role === 'alumni' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                                                    u.role === 'faculty' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                                        'bg-orange-100 dark:bg-orange-900/20 text-orange-600 shadow-sm'
                                                }`}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-[500]">
                                            {u.role === 'alumni' ? `${u.company || 'N/A'} · ${u.batchYear || ''}` :
                                                u.role === 'student' ? u.batchYear || 'Current Student' :
                                                    u.department || 'Staff'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-[500]">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                    title="Edit User">
                                                    <Pencil className="w-4 h-4 text-indigo-400 hover:text-indigo-600" />
                                                </button>
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

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />

                    <div className="relative w-full max-w-lg animate-in zoom-in-95 fade-in duration-300">
                        <Card className="p-0 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-[800] text-slate-900 dark:text-white">Edit User Account</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Managing {selectedUser?.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {/* Account Basics */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Account Basics</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Full Name"
                                            value={editData.name}
                                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                                            placeholder="Sai Gosavi"
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={editData.email}
                                            onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            placeholder="saishgosavi10@gmail.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Phone Number"
                                            value={editData.phoneNumber}
                                            onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })}
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Account Role</label>
                                            <select
                                                value={editData.role}
                                                onChange={e => setEditData({ ...editData, role: e.target.value })}
                                                className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            >
                                                <option value="student">Student</option>
                                                <option value="alumni">Alumni</option>
                                                <option value="faculty">Faculty</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Info */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Academic & Professional</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Batch Year / Graduation"
                                            value={editData.batchYear}
                                            onChange={e => setEditData({ ...editData, batchYear: e.target.value })}
                                            placeholder="2024"
                                        />
                                        <Input
                                            label="Industry / Branch"
                                            value={editData.industry}
                                            onChange={e => setEditData({ ...editData, industry: e.target.value })}
                                            placeholder="Electronics & Computer Science"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Company / Institution"
                                            value={editData.company}
                                            onChange={e => setEditData({ ...editData, company: e.target.value })}
                                            placeholder="Google / KIT's College"
                                        />
                                        <Input
                                            label="Job Title"
                                            value={editData.jobTitle}
                                            onChange={e => setEditData({ ...editData, jobTitle: e.target.value })}
                                            placeholder="Software Engineer"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Location"
                                            value={editData.location}
                                            onChange={e => setEditData({ ...editData, location: e.target.value })}
                                            placeholder="Kolkata, India"
                                        />
                                        <Input
                                            label="LinkedIn URL"
                                            value={editData.linkedin}
                                            onChange={e => setEditData({ ...editData, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>

                                {/* Extra Details */}
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Additional Profile Info</h4>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Short Bio</label>
                                        <textarea
                                            value={editData.bio}
                                            onChange={e => setEditData({ ...editData, bio: e.target.value })}
                                            placeholder="Briefly describe the user's role and background..."
                                            className="w-full min-h-[100px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">Account Status</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">Only approved users can access full features</div>
                                        </div>
                                        <button 
                                            onClick={() => setEditData({ ...editData, isApproved: !editData.isApproved })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500/20 ${editData.isApproved ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editData.isApproved ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Password Reset */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 mb-3 ml-1">
                                        <Key className="w-3.5 h-3.5 text-amber-500" />
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reset Password</label>
                                    </div>
                                    <Input
                                        type="password"
                                        value={editData.password}
                                        onChange={e => setEditData({ ...editData, password: e.target.value })}
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 px-1 leading-relaxed italic">Changes to account credentials take effect immediately after saving.</p>
                                </div>
                            </div>

                            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdate} disabled={updateLoading} className="shadow-lg shadow-indigo-600/20 min-w-32">
                                    {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
