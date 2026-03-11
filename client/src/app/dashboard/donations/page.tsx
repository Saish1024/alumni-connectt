"use client"
import React, { useEffect, useState } from 'react';
import { Heart, X, IndianRupee, Loader2, Calendar, Users, TrendingUp } from 'lucide-react';
import { alumni as apiAlumni } from '@/lib/api';

export default function DonationsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'campaigns' | 'history'>('campaigns');
    const [donateModal, setDonateModal] = useState<any | null>(null);
    const [amount, setAmount] = useState('1000');
    const [transactionId, setTransactionId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [donationDone, setDonationDone] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cRez, hRez] = await Promise.all([
                apiAlumni.getDonationCampaigns(),
                apiAlumni.getMyDonations()
            ]);
            setCampaigns(cRez);
            setHistory(hRez);
        } catch (err) {
            console.error('Failed to fetch donation data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDonate = async () => {
        if (!amount || !transactionId) return alert('Please enter amount and transaction ID');
        setSubmitting(true);
        try {
            const isGeneral = donateModal === 'general';
            await apiAlumni.recordDonation({
                type: isGeneral ? 'general' : 'campaign',
                campaignId: isGeneral ? undefined : donateModal._id,
                amount: Number(amount),
                transactionId
            });
            setDonationDone(true);
            fetchData(); // Refresh history
        } catch (err) {
            console.error('Donation failed:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const totalGiven = history
        .filter(d => d.paymentStatus === 'verified')
        .reduce((sum, d) => sum + d.amount, 0);

    if (loading && campaigns.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Donations & Giving Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Contribute to campaigns and support the next generation</p>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {(['campaigns', 'history'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                            {t === 'campaigns' ? 'Donation Hub' : 'My Contributions'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Impact banner */}
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Heart className="w-64 h-64 -right-10 -bottom-10 absolute rotate-12" />
                </div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-white/70 text-sm font-[500] mb-1">Your Total Contribution (Verified)</p>
                        <div className="text-3xl font-[900]">₹{totalGiven.toLocaleString('en-IN')}</div>
                        <p className="text-white/80 text-sm mt-1">Across {history.length} attempts · Thank you for your impact! 🙏</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl">
                            💝
                        </div>
                    </div>
                </div>
            </div>

            {tab === 'campaigns' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* General Fund Card */}
                    <div className="bg-slate-900 dark:bg-indigo-950/40 rounded-3xl p-6 text-white shadow-xl lg:col-span-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                            <IndianRupee className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-white/10">
                                🏛️
                            </div>
                            <h3 className="text-xl font-[800] mb-2 leading-tight">General College Fund</h3>
                            <p className="text-white/60 text-xs mb-6 flex-grow">Provide unrestricted support for infrastructure, student welfare, and immediate campus needs.</p>
                            
                            <button 
                                onClick={() => { setDonateModal('general'); setDonationDone(false); setAmount('1000'); setTransactionId(''); }}
                                className="w-full py-3.5 bg-white text-slate-900 font-[800] text-sm rounded-2xl hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4 fill-slate-900" /> Donate to College
                            </button>
                        </div>
                    </div>

                    {campaigns.length > 0 ? campaigns.map(c => {
                        const pct = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100));
                        return (
                            <div key={c._id} className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                                <div className={`h-2 bg-gradient-to-r ${c.color || 'from-indigo-500 to-purple-600'}`} />
                                <div className="p-6">
                                    <div className="text-3xl mb-3">{c.icon || '🎓'}</div>
                                    <h3 className="font-[800] text-slate-900 dark:text-white mb-2 leading-tight">{c.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-2">{c.description}</p>
                                    
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-[700] text-slate-900 dark:text-white">₹{(c.raisedAmount / 1000).toLocaleString()}K raised</span>
                                        <span className="text-slate-500 dark:text-slate-400">of ₹{(c.goalAmount / 1000).toLocaleString()}K</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${c.color || 'from-indigo-500 to-purple-600'} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-5">
                                        <div className="flex items-center gap-1.5 font-[600]">
                                            <Users className="w-3.5 h-3.5" /> {c.donorsCount} Donors
                                        </div>
                                        <div className="flex items-center gap-1.5 font-[600]">
                                            <Calendar className="w-3.5 h-3.5" /> {new Date(c.endDate).toLocaleDateString()}
                                        </div>
                                        <span className={`font-[800] ${pct > 80 ? 'text-green-500' : 'text-indigo-500'}`}>{pct}%</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => { setDonateModal(c); setDonationDone(false); setAmount('1000'); setTransactionId(''); }}
                                        className={`w-full py-3 bg-gradient-to-r ${c.color || 'from-indigo-500 to-purple-600'} text-white text-sm font-[700] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2`}>
                                        <Heart className="w-4 h-4 fill-white" /> Contribute Now
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="md:col-span-2 lg:col-span-2 py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-[700] text-slate-900 dark:text-white">No Active Campaigns</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">Check back soon for upcoming donation drives and giveaways.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Contribution Ledger</h3>
                    </div>
                    {history.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-[600]">You haven't contributed yet</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Your verified donation history will appear here once processed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/30">
                            {history.map(d => (
                                <div key={d._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${d.type === 'general' ? 'from-slate-700 to-slate-900' : (d.campaignId?.color || 'from-pink-400 to-purple-600')} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                            <span className="text-lg">{d.type === 'general' ? '🏛️' : (d.campaignId?.icon || '💝')}</span>
                                        </div>
                                        <div>
                                            <div className="font-[700] text-slate-900 dark:text-white text-sm">{d.type === 'general' ? 'General College Fund' : (d.campaignId?.title || 'Unknown Campaign')}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-[700] mt-0.5">{new Date(d.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-[900] text-slate-900 dark:text-white text-base">₹{d.amount.toLocaleString('en-IN')}</div>
                                        <span className={`text-[10px] font-[800] uppercase tracking-widest ${
                                            d.paymentStatus === 'verified' ? 'text-green-500' : 
                                            d.paymentStatus === 'rejected' ? 'text-red-500' : 'text-amber-500'
                                        }`}>
                                            {d.paymentStatus === 'verified' ? 'verified' : 
                                             d.paymentStatus === 'rejected' ? 'rejected' : 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Donate Modal */}
            {donateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
                        {donationDone ? (
                            <div className="text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-10 h-10 text-green-500 fill-green-500" />
                                </div>
                                <h3 className="text-2xl font-[800] text-slate-900 dark:text-white mb-2">Contribution Recorded!</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto">Your donation of <span className="font-[700] text-slate-900 dark:text-white">₹{amount}</span> has been sent for verification. You'll see it in your history once confirmed.</p>
                                <button onClick={() => setDonateModal(null)} className="w-full py-3.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-[800] rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg">
                                    Continue
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-[900] text-slate-900 dark:text-white text-lg">Make a Contribution</h3>
                                    <button onClick={() => setDonateModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>

                                <div className={`p-5 bg-gradient-to-br ${donateModal === 'general' ? 'from-slate-700 to-slate-900' : (donateModal.color || 'from-indigo-500 to-purple-600')} rounded-2xl mb-6 text-white shadow-inner relative overflow-hidden`}>
                                    <Heart className="absolute -right-4 -bottom-4 w-20 h-20 opacity-20 rotate-12" />
                                    <div className="text-2xl mb-1">{donateModal === 'general' ? '🏛️' : (donateModal.icon || '🎓')}</div>
                                    <p className="font-[800] text-base leading-tight">{donateModal === 'general' ? 'General College Fund' : donateModal.title}</p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-[800] text-slate-400 uppercase tracking-widest mb-2">Select Amount</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['500', '1000', '2500', '5000'].map(a => (
                                                <button key={a} onClick={() => setAmount(a)}
                                                    className={`py-3 rounded-xl text-sm font-[800] transition-all border-2 ${amount === a ? `border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600` : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                                    ₹{a}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-[800] text-slate-400 uppercase tracking-widest">Custom Amount</label>
                                            <span className="text-xs font-[700] text-indigo-500">₹ INR</span>
                                        </div>
                                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-[700] rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-lg" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-[800] text-slate-400 uppercase tracking-widest mb-2">Transaction ID / Ref Number</label>
                                        <input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="e.g. UPI Ref, Bank Txn ID"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white font-[600] rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all text-sm" />
                                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Transferred to college UPI/Bank account? Enter ID here.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleDonate}
                                        disabled={submitting || !amount || !transactionId}
                                        className={`w-full mt-2 py-4 bg-gradient-to-r ${donateModal.color || 'from-indigo-500 to-purple-600'} text-white font-[800] rounded-2xl hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl flex items-center justify-center gap-2 text-base`}>
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Heart className="w-5 h-5 fill-white" /> Contribute ₹{amount}</>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
