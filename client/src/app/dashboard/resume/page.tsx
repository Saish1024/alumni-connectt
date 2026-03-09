"use client"
import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function ResumeReviewPage() {
    const [dragging, setDragging] = useState(false);
    const [uploaded, setUploaded] = useState(true);

    return (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Resume Review</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Get expert feedback on your resume from alumni</p>
            </div>

            {/* Upload */}
            <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true); }}
                onClick={() => setUploaded(true)}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="font-[600] text-slate-700 dark:text-slate-200 mb-1">Drop your resume here</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">or click to upload · PDF, DOCX (max 5MB)</p>
            </div>

            {/* Current Resume Status */}
            {uploaded && (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-[700] text-slate-900 dark:text-white">Current Reviews</h3>
                    </div>
                    {[
                        { reviewer: 'Siddharth Nair', company: 'Microsoft', status: 'reviewed', feedback: 'Strong technical skills section. Add more quantified achievements. Remove the objective statement.', date: 'Feb 28, 2026', rating: 4, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
                        { reviewer: 'Priya Sharma', company: 'Amazon', status: 'pending', date: 'Mar 3, 2026', img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop' },
                    ].map((r, i) => (
                        <div key={i} className="p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="flex items-start gap-4">
                                <img src={r.img} alt={r.reviewer} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-[700] text-slate-900 dark:text-white text-sm">{r.reviewer}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">@ {r.company}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-[700] ${r.status === 'reviewed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                                            {r.status === 'reviewed' ? '✅ Reviewed' : '⏳ Pending'}
                                        </span>
                                    </div>
                                    {r.feedback && (
                                        <div className="mt-3 p-3 bg-white dark:bg-slate-600/30 rounded-lg border border-slate-200 dark:border-slate-600/50">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">💬 "{r.feedback}"</p>
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-400 mt-2">{r.date}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
