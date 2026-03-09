"use client"
import { Download } from 'lucide-react';

const payments = [
    { id: 1, user: 'Aditya Kumar', type: 'Mentoring Session', amount: 800, date: 'Mar 3', status: 'success', mentor: 'Arjun Mehta' },
    { id: 2, user: 'Riya Kapoor', type: 'Mentoring Session', amount: 1000, date: 'Mar 2', status: 'success', mentor: 'Priya Sharma' },
    { id: 3, user: 'Karan Sharma', type: 'Premium Subscription', amount: 999, date: 'Mar 1', status: 'success', mentor: '-' },
    { id: 4, user: 'Pooja Nair', type: 'Mentoring Session', amount: 600, date: 'Feb 28', status: 'failed', mentor: 'Vikram Patel' },
    { id: 5, user: 'Tanmay Shah', type: 'Donation', amount: 500, date: 'Feb 27', status: 'success', mentor: '-' },
    { id: 6, user: 'Shreya Iyer', type: 'Mentoring Session', amount: 800, date: 'Feb 25', status: 'refunded', mentor: 'Rahul Verma' },
];

export default function PaymentsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Payment Tracking</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor all platform transactions</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: '₹2,50,000', icon: '💰', color: 'from-green-500 to-emerald-600' },
                    { label: 'Successful', value: '389', icon: '✅', color: 'from-blue-500 to-cyan-600' },
                    { label: 'Failed', value: '12', icon: '❌', color: 'from-red-500 to-rose-600' },
                    { label: 'Refunded', value: '8', icon: '🔄', color: 'from-amber-500 to-orange-500' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg text-center`}>
                        <div className="text-2xl mb-1">{icon}</div>
                        <div className="text-2xl font-[900]">{value}</div>
                        <div className="text-white/80 text-xs font-[600]">{label}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                    <h3 className="font-[700] text-slate-900 dark:text-white">Recent Transactions</h3>
                    <button className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-[600] hover:underline">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-900/30">
                                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">User</th>
                                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Type</th>
                                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Mentor</th>
                                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Date</th>
                                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[700] text-xs">
                                                {p.user.charAt(0)}
                                            </div>
                                            <span className="font-[600] text-sm text-slate-900 dark:text-white">{p.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">{p.type}</td>
                                    <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{p.mentor}</td>
                                    <td className="px-6 py-3 text-right font-[800] text-slate-900 dark:text-white">₹{p.amount}</td>
                                    <td className="px-6 py-3 text-right text-sm text-slate-500 dark:text-slate-400">{p.date}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-[700] ${p.status === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                                                p.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                                                    'bg-amber-100 dark:bg-amber-900/20 text-amber-600'
                                            }`}>
                                            {p.status === 'success' ? '✅ Success' : p.status === 'failed' ? '❌ Failed' : '🔄 Refunded'}
                                        </span>
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
