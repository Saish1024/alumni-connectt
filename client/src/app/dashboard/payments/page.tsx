"use client"
import { useEffect, useState } from 'react';
import { Download, Loader2, CheckCircle2, XCircle, Clock, Search, Filter, Settings } from 'lucide-react';
import { admin as apiAdmin } from '@/lib/api';
import { Button } from '@/components/Button';

export default function PaymentsPage() {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [inbound, setInbound] = useState<any[]>([]);
    const [stats, setStats] = useState({ platformRevenue: 0, totalPayouts: 0, pendingPayoutsCount: 0, pendingInboundCount: 0 });
    const [config, setConfig] = useState<any>({ platformUpiId: 'admin-connect@upi' });
    const [newUpi, setNewUpi] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'inbound'>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const fetchData = async () => {
        try {
            const [payoutData, inboundData, financialData, configData] = await Promise.all([
                apiAdmin.getPayouts(),
                apiAdmin.getInboundPayments(),
                apiAdmin.getFinancials(),
                apiAdmin.getConfig()
            ]);
            setPayouts(payoutData);
            setInbound(inboundData);
            setStats(financialData);
            setConfig(configData);
            setNewUpi(configData.platformUpiId || 'admin-connect@upi');
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProcessPayout = async (id: string, status: string) => {
        setProcessingId(id);
        try {
            await apiAdmin.processPayout(id, status);
            fetchData();
        } catch (err) {
            console.error('Failed to process payout:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmInbound = async (id: string) => {
        setProcessingId(id);
        try {
            await apiAdmin.confirmStudentPayment(id);
            fetchData();
        } catch (err) {
            console.error('Failed to confirm inbound payment:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleUpdateConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingConfig(true);
        setUpdateSuccess(false);
        try {
            await apiAdmin.updateConfig('platformUpiId', newUpi);
            setConfig((prev: any) => ({ ...prev, platformUpiId: newUpi }));
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000); // Reset success state after 3s
            fetchData();
        } catch (err: any) {
            console.error('Failed to update config:', err);
            alert('Failed to update UPI ID: ' + (err.message || 'Unknown error'));
        } finally {
            setIsUpdatingConfig(false);
        }
    };

    const filteredPayouts = payouts.filter(p => {
        if (activeTab === 'inbound') return false;
        if (activeTab === 'pending' || activeTab === 'completed') return p.status === activeTab;
        return true;
    });

    const filteredInbound = inbound.filter(s => {
        if (activeTab !== 'inbound') return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Financial Operations</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Review alumni payout requests and track platform revenue</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Download className="w-4 h-4" /> Export Ledger
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Payouts', value: stats.pendingPayoutsCount.toString(), icon: <Clock className="w-5 h-5" />, color: 'from-amber-500 to-orange-600' },
                    { label: 'Pending Inbound', value: stats.pendingInboundCount.toString(), icon: <Search className="w-5 h-5" />, color: 'from-blue-500 to-indigo-600' },
                    { label: 'Total Payouts', value: `₹${stats.totalPayouts.toLocaleString()}`, icon: '💰', color: 'from-green-500 to-emerald-600' },
                    { label: 'Platform Revenue', value: `₹${stats.platformRevenue.toLocaleString()}`, icon: '🏦', color: 'from-indigo-500 to-violet-600' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/80 text-[10px] font-[800] uppercase tracking-wider">{label}</span>
                            <div className="text-xl">{icon}</div>
                        </div>
                        <div className="text-2xl font-[900]">{value}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Configuration Card */}
                <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm h-full">
                    <h3 className="font-[800] text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-500" /> Platform Payout Config
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">Set the UPI ID where students will send payments for sessions.</p>
                    
                    <form onSubmit={handleUpdateConfig} className="space-y-4">
                        <div>
                            <label className="text-xs font-[600] text-slate-500 mb-1.5 block ml-1">Platform UPI ID</label>
                            <input
                                type="text"
                                value={newUpi}
                                onChange={(e) => setNewUpi(e.target.value)}
                                placeholder="admin-connect@upi"
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 outline-none font-[600] text-sm transition-all"
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isUpdatingConfig || newUpi === (config.platformUpiId || 'admin-connect@upi')}
                            className={`w-full h-11 transition-all shadow-lg ${
                                updateSuccess 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none"
                            }`}
                        >
                            {isUpdatingConfig ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : updateSuccess ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> Saved Successfully
                                </div>
                            ) : (
                                "Save Configuration"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                        <h4 className="text-[10px] font-[800] uppercase text-indigo-600 dark:text-indigo-400 mb-2">Internal Note</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            This UPI ID is displayed to students during the booking flow for paid sessions. Transaction IDs are manually verified by you in the Financial Queue.
                        </p>
                    </div>
                </div>

                {/* Inbound & Payout Management */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-[800] text-slate-900 dark:text-white">Financial Queue</h3>
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                        {(['pending', 'completed', 'inbound'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-[700] transition-all capitalize ${
                                    activeTab === tab 
                                        ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab === 'inbound' ? 'Student Payments' : `${tab} Payouts`}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {activeTab === 'inbound' ? (
                         <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/20 shadow-sm">
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Student</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Alumni (Mentor)</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Transaction ID</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredInbound.length > 0 ? filteredInbound.map((session: any) => (
                                    <tr key={session._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-[700] text-slate-900 dark:text-white">{session.attendees?.[0]?.name}</div>
                                            <div className="text-[10px] text-slate-500">{session.attendees?.[0]?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-[600] text-slate-700 dark:text-slate-300">{session.organizer?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-[800] text-indigo-600 dark:text-indigo-400">
                                            ₹{session.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded w-fit">{session.transactionId || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {session.studentPaymentStatus === 'pending' ? (
                                                <button 
                                                    onClick={() => handleConfirmInbound(session._id)}
                                                    disabled={processingId === session._id}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-[700] rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === session._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Payment'}
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-[800] uppercase px-3 py-1 rounded-full bg-green-100 text-green-700">Received</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No inbound payments found</td></tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/20 shadow-sm">
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Alumni</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Method</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500">Date</th>
                                    <th className="px-6 py-3 text-[10px] font-[700] uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredPayouts.length > 0 ? filteredPayouts.map((payout: any) => (
                                    <tr key={payout._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-[800] text-xs">
                                                    {payout.alumni?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-[700] text-slate-900 dark:text-white">{payout.alumni?.name}</div>
                                                    <div className="text-[10px] text-slate-500">{payout.alumni?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-[800] text-slate-900 dark:text-white">
                                            ₹{payout.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-[700] text-slate-800 dark:text-slate-200">{payout.paymentMethod?.type}</div>
                                            {payout.paymentMethod?.type === 'UPI' ? (
                                                <div className="text-[10px] text-indigo-500 font-mono mt-0.5">{payout.paymentMethod?.details}</div>
                                            ) : (
                                                <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 space-y-1">
                                                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">Name:</span> <span className="font-bold text-slate-700 dark:text-slate-300">{payout.paymentMethod?.bankDetails?.accountHolder}</span></div>
                                                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">A/C:</span> <span className="font-bold text-slate-700 dark:text-slate-300">{payout.paymentMethod?.bankDetails?.accountNumber}</span></div>
                                                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">IFSC:</span> <span className="font-bold text-slate-700 dark:text-slate-300">{payout.paymentMethod?.bankDetails?.ifscCode}</span></div>
                                                    <div className="flex justify-between text-[9px]"><span className="text-slate-400">Bank:</span> <span className="font-bold text-slate-700 dark:text-slate-300">{payout.paymentMethod?.bankDetails?.bankName}</span></div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {new Date(payout.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payout.status === 'pending' ? (
                                                <div className="flex gap-2 justify-end">
                                                    <button 
                                                        onClick={() => handleProcessPayout(payout._id, 'completed')}
                                                        disabled={processingId === payout._id}
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                                                        title="Approve & Mark Paid"
                                                    >
                                                        {processingId === payout._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleProcessPayout(payout._id, 'rejected')}
                                                        disabled={processingId === payout._id}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                                        title="Reject Request"
                                                    >
                                                        {processingId === payout._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`text-[10px] font-[800] uppercase px-3 py-1 rounded-full ${
                                                    payout.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {payout.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Filter className="w-8 h-8 opacity-20" />
                                                <p className="text-sm italic">No {activeTab} payout requests found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
}
