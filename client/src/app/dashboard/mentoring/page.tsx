"use client"

export default function FacultyMentoringPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Mentoring Monitor</h2>
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Active Sessions This Month</h3>
                <div className="space-y-3">
                    {[
                        { mentor: 'Arjun Mehta (Google)', student: 'Aditya Kumar', topic: 'DSA Prep', date: 'Mar 7', status: 'upcoming' },
                        { mentor: 'Priya Sharma (Amazon)', student: 'Riya Kapoor', topic: 'Resume Review', date: 'Mar 8', status: 'upcoming' },
                        { mentor: 'Rahul Verma (Flipkart)', student: 'Tanmay Shah', topic: 'React Dev', date: 'Mar 5', status: 'completed' },
                        { mentor: 'Mei Lin (Microsoft)', student: 'Karan Sharma', topic: 'ML Basics', date: 'Mar 3', status: 'completed' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl hover:shadow-md transition-all">
                            <div className="flex-1">
                                <div className="font-[600] text-slate-900 dark:text-white text-sm">{s.topic}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{s.mentor} → {s.student} · {s.date}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-[700] ${s.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>
                                {s.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
