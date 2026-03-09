"use client"
import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Globe } from 'lucide-react';

const pendingRegistrations = [
    { id: 1, name: 'Kavya Nair', email: 'kavya@cognizant.com', company: 'Cognizant', college: 'NIT Trichy (2021)', applied: '2 hrs ago', linkedin: 'linkedin.com/in/kavyanair' },
    { id: 2, name: 'Sandeep Reddy', email: 'sandeep@deloitte.com', company: 'Deloitte', college: 'BITS Pilani (2020)', applied: '5 hrs ago', linkedin: 'linkedin.com/in/sandeepreddy' },
    { id: 3, name: 'Isha Verma', email: 'isha@tcs.com', company: 'TCS', college: 'IIT Madras (2022)', applied: '1 day ago', linkedin: 'linkedin.com/in/ishaverma' },
    { id: 4, name: 'Kunal Joshi', email: 'kunal@infosys.com', company: 'Infosys', college: 'IIT Kharagpur (2019)', applied: '1 day ago', linkedin: 'linkedin.com/in/kunaljoshi' },
    { id: 5, name: 'Meghna Das', email: 'meghna@microsoft.com', company: 'Microsoft', college: 'IIT Delhi (2021)', applied: '2 days ago', linkedin: 'linkedin.com/in/meghnadas' },
];

export default function RegistrationsPage() {
    const [regs, setRegs] = useState(pendingRegistrations);

    const approve = (id: number) => setRegs(prev => prev.filter(r => r.id !== id));
    const reject = (id: number) => setRegs(prev => prev.filter(r => r.id !== id));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Alumni Registrations</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Review and approve new alumni registrations</p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-300 font-[500]">
                    <span className="font-[700]">{regs.length} alumni registrations</span> are waiting for your approval. Please review their profiles carefully.
                </p>
            </div>

            <div className="space-y-4">
                {regs.map(r => (
                    <div key={r.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                                {r.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <div className="font-[700] text-slate-900 dark:text-white">{r.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{r.email}</div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-[500]">Applied {r.applied}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🏢 {r.company}</span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🎓 {r.college}</span>
                                    <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-[500]">
                                        <Globe className="w-3.5 h-3.5" /> LinkedIn
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => approve(r.id)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-[700] rounded-xl hover:bg-green-200 dark:hover:bg-green-900/30 transition-all">
                                <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button
                                onClick={() => reject(r.id)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-[700] rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all">
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
                {regs.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
                        <p className="font-[600]">All registrations have been processed!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
