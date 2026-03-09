"use client"
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { users as usersApi } from '@/lib/api'
import {
    Users, ShieldCheck, AlertTriangle, CheckCircle,
    XCircle, Filter, MoreVertical, Loader2, Search,
    RefreshCw
} from 'lucide-react'

// Mock fallback
const mockPending = [
    { _id: '1', name: 'John Doe', batchYear: '2020', currentCompany: 'Google', currentPosition: 'SDE-2', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Jane Smith', batchYear: '2018', currentCompany: 'Meta', currentPosition: 'Product Analyst', createdAt: new Date().toISOString() },
]

export default function AdminPanelPage() {
    const [pending, setPending] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())

    const fetchPending = async () => {
        setLoading(true)
        try {
            const data = await usersApi.pending()
            setPending(data)
        } catch (err) {
            console.error('Failed to fetch pending users:', err)
            setPending([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPending() }, [])

    const handleApprove = async (id: string) => {
        setApprovingIds(prev => new Set([...prev, id]))
        try {
            await usersApi.approve(id)
            setPending(prev => prev.filter(p => p._id !== id))
        } catch (err) {
            console.error('Approval failed:', err)
            alert('Failed to approve user.')
        } finally {
            setApprovingIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to reject and delete this request?')) return;
        try {
            await usersApi.delete(id)
            setPending(prev => prev.filter(p => p._id !== id))
        } catch (err) {
            console.error('Deactivation failed:', err)
            alert('Failed to delete user request.')
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Control Panel</h1>
                    <p className="text-gray-400 mt-1">Manage users, approve accounts, and moderate platform content.</p>
                </div>
                <Button variant="outline" className="h-11 gap-2 border-gray-800" onClick={fetchPending}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </header>

            {/* Application Table */}
            <Card className="p-0 overflow-hidden border-gray-800 bg-secondary/10">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/20">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        Pending User Approvals
                        {pending.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold">
                                {pending.length} New
                            </span>
                        )}
                    </h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : pending.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50 text-[10px] uppercase font-bold text-gray-500 tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {pending.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs shadow-inner uppercase">
                                                    {item.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm block">{item.name}</span>
                                                    <span className="text-[10px] text-gray-500">{item.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.role === 'alumni' ? 'bg-purple-500/10 text-purple-500' :
                                                    item.role === 'faculty' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.role === 'student' ? (
                                                <div className="text-xs text-gray-400">Batch: {item.batchYear || 'N/A'}</div>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-medium">{item.jobTitle || item.department || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{item.company || item.institution || 'N/A'}</div>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="h-9 px-4 bg-green-600/10 text-green-500 border border-green-600/20 hover:bg-green-600 hover:text-white transition-all gap-2"
                                                    onClick={() => handleApprove(item._id)}
                                                    disabled={approvingIds.has(item._id)}
                                                >
                                                    {approvingIds.has(item._id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="h-9 w-9 p-0 bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="text-lg font-medium">No pending approvals</p>
                        <p className="text-sm mt-1">All user accounts have been verified.</p>
                    </div>
                )}

                <div className="p-4 bg-gray-900/30 border-t border-gray-800 flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold tracking-widest uppercase">
                        View Management Logs
                    </Button>
                </div>
            </Card>
        </div>
    )
}
