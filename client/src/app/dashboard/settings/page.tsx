"use client"
import React from 'react';

export default function AdminSettingsPage() {
    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Platform Settings</h2>
            {[
                { title: 'General Settings', items: ['Platform Name', 'Support Email', 'Default Language', 'Time Zone'] },
                { title: 'Feature Flags', items: ['AI Mentor Matching', 'Paid Sessions', 'Donation Module', 'Gamification System'] },
                { title: 'Payment Settings', items: ['Payment Gateway', 'Platform Commission (%)', 'Payout Schedule', 'Minimum Payout'] },
            ].map(({ title, items }) => (
                <div key={title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">{title}</h3>
                    <div className="space-y-3">
                        {items.map(item => (
                            <div key={item} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/30 last:border-0">
                                <span className="text-sm font-[500] text-slate-700 dark:text-slate-300">{item}</span>
                                <button className="text-xs text-indigo-600 dark:text-indigo-400 font-[600] hover:underline">Configure</button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
