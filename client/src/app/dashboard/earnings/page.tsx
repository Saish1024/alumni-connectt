"use client"
import { useEffect, useState } from 'react';
import { IndianRupee, Wallet, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { alumni as apiAlumni } from '@/lib/api';
import { Button } from '@/components/Button';

export default function EarningsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [requestAmount, setRequestAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchData = async () => {
        try {
            const res = await apiAlumni.getEarnings();
            setData(res);
            setUpiId(user?.paymentInfo?.upiId || '');
        } catch (err) {
            console.error('Failed to fetch earnings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingSettings(true);
        try {
            await apiAlumni.updatePaymentSettings({ upiId });
            setMessage({ text: 'Payment settings updated!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Update failed', type: 'error' });
        } finally {
            setIsUpdatingSettings(false);
        }
    };

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestAmount || isNaN(Number(requestAmount))) return;
        
        setIsRequesting(true);
        try {
            await apiAlumni.requestPayout({ amount: Number(requestAmount) });
            setMessage({ text: 'Payout request submitted!', type: 'success' });
            setRequestAmount('');
            fetchData();
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (err: any) {
            setMessage({ text: err.message || 'Request failed', type: 'error' });
        } finally {
            setIsRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const { summary, earningsHistory, payoutHistory } = data || {
        summary: { totalEarned: 0, totalWithdrawn: 0, currentBalance: 0 },
        earningsHistory: [],
        payoutHistory: []
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Earnings & Payouts</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Track your revenue and manage your withdrawals</p>
                </div>
                {message.text && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-[600] flex items-center gap-2 ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[160px]">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-100 text-sm font-[500] mb-2">
                            <Wallet className="w-4 h-4" /> Available Balance
                        </div>
                        <div className="text-4xl font-[900]">₹{summary.currentBalance.toLocaleString()}</div>
                    </div>
                    <div className="text-indigo-200 text-xs font-[500]">Ready for withdrawal</div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm font-[500] mb-2 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" /> Total Earned
                        </div>
                        <div className="text-3xl font-[800] text-slate-900 dark:text-white">₹{summary.totalEarned.toLocaleString()}</div>
                    </div>
                    <div className="text-green-500 text-xs font-[600] flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> Liftetime revenue
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="text-slate-500 dark:text-slate-400 text-sm font-[500] mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Total Withdrawn
                        </div>
                        <div className="text-3xl font-[800] text-slate-900 dark:text-white">₹{summary.totalWithdrawn.toLocaleString()}</div>
                    </div>
                    <div className="text-indigo-500 text-xs font-[600]">Paid to your account</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content: Tables */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Earnings */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                            <h3 className="font-[800] text-slate-900 dark:text-white">Recent Earnings</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Session</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Student</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Date</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {earningsHistory.length > 0 ? earningsHistory.slice(0, 5).map((session: any) => (
                                        <tr key={session._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-[600] text-slate-900 dark:text-white">{session.title}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {session.attendees[0]?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-500">
                                                {new Date(session.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-[700] text-slate-900 dark:text-white text-right">
                                                <div className="flex flex-col items-end">
                                                    <span>₹{session.amount}</span>
                                                    <span className={`text-[9px] uppercase font-[800] px-1.5 py-0.5 rounded ${
                                                        session.studentPaymentStatus === 'received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {session.studentPaymentStatus === 'received' ? 'Verified' : 'Awaiting Admin Verification'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic text-sm">No paid sessions completed yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payout History */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                            <h3 className="font-[800] text-slate-900 dark:text-white">Payout History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Requested Date</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Method</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {payoutHistory.length > 0 ? payoutHistory.map((payout: any) => (
                                        <tr key={payout._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(payout.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-500">
                                                {payout.paymentMethod?.type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-[800] uppercase tracking-wider ${
                                                    payout.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    payout.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-[700] text-slate-900 dark:text-white text-right">
                                                ₹{payout.amount}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic text-sm">No payout requests yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Requests & Settings */}
                <div className="space-y-6">
                    {/* Request Payout */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h3 className="font-[800] text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <ArrowUpRight className="w-5 h-5 text-indigo-500" /> Withdraw Funds
                        </h3>
                        <form onSubmit={handleRequestPayout} className="space-y-4">
                            <div>
                                <label className="text-xs font-[600] text-slate-500 mb-1.5 block ml-1">Amount (Min ₹500)</label>
                                <input
                                    type="number"
                                    value={requestAmount}
                                    onChange={(e) => setRequestAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 outline-none font-[600] text-sm transition-all"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                                disabled={isRequesting || summary.currentBalance < 500}
                            >
                                {isRequesting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Payout"}
                            </Button>
                            {summary.currentBalance < 500 && (
                                <p className="text-[11px] text-amber-600 text-center font-[500]"> Minimum balance ₹500 required</p>
                            )}
                        </form>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h3 className="font-[800] text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-400" /> Payout Settings
                        </h3>
                        <form onSubmit={handleUpdateSettings} className="space-y-4">
                            <div>
                                <label className="text-xs font-[600] text-slate-500 mb-1.5 block ml-1">UPI ID (Preferred)</label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@okaxis"
                                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 outline-none font-[600] text-sm transition-all"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                variant="outline"
                                className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50"
                                disabled={isUpdatingSettings}
                            >
                                {isUpdatingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </form>
                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
                            <h4 className="text-[11px] font-[800] uppercase text-slate-400 mb-1">Security Tip</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Payouts are manually verified by admins for security. Ensure your UPI ID is correct to avoid delays.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
