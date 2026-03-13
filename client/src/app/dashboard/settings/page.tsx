"use client"
import React, { useEffect, useState } from 'react';
import { admin as apiAdmin } from '@/lib/api';
import { Loader2, Settings, Shield, Bell, CreditCard, Check, X, Edit2 } from 'lucide-react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<any>('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await apiAdmin.getConfig();
                setSettings(data);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!editingKey) return;
        setSaving(true);
        try {
            await apiAdmin.updateConfig(editingKey, editValue);
            setSettings(prev => ({ ...prev, [editingKey]: editValue }));
            setEditingKey(null);
        } catch (err: any) {
            alert(err.message || 'Failed to save setting');
        } finally {
            setSaving(false);
        }
    };

    const categories = [
        { 
            title: 'General Settings', 
            icon: Settings,
            items: [
                { label: 'Platform Name', key: 'platformName', type: 'text', default: 'Alumni Connect' },
                { label: 'Support Email', key: 'supportEmail', type: 'text', default: 'support@alumniconnect.com' },
                { label: 'Default Language', key: 'defaultLanguage', type: 'text', default: 'English' },
                { label: 'Time Zone', key: 'timeZone', type: 'text', default: 'IST (UTC+5:30)' },
            ] 
        },
        { 
            title: 'Feature Flags', 
            icon: Shield,
            items: [
                { label: 'AI Mentor Matching', key: 'featureAiMentorMatching', type: 'boolean', default: false },
                { label: 'Paid Sessions', key: 'featurePaidSessions', type: 'boolean', default: true },
                { label: 'Donation Module', key: 'featureDonationModule', type: 'boolean', default: false },
                { label: 'Gamification System', key: 'featureGamificationSystem', type: 'boolean', default: false },
            ] 
        },
        { 
            title: 'Payment Settings', 
            icon: CreditCard,
            items: [
                { label: 'Platform UPI ID', key: 'platformUpiId', type: 'text', default: 'admin-connect@upi' },
                { label: 'Platform Commission (%)', key: 'platformCommission', type: 'number', default: 10 },
                { label: 'Payout Schedule', key: 'payoutSchedule', type: 'text', default: 'Weekly' },
                { label: 'Minimum Payout (₹)', key: 'minimumPayout', type: 'number', default: 500 },
            ] 
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div className="mb-8">
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Platform Settings</h2>
                <p className="text-slate-500 text-sm">Manage global configuration and system parameters</p>
            </div>

            <div className="grid gap-6">
                {categories.map((cat) => (
                    <div key={cat.title} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3">
                            <cat.icon className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-[700] text-slate-900 dark:text-white">{cat.title}</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/30">
                            {cat.items.map(item => {
                                const currentValue = settings[item.key] !== undefined ? settings[item.key] : item.default;
                                const isEditing = editingKey === item.key;

                                return (
                                    <div key={item.key} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-700/10 transition-all">
                                        <div className="flex-1">
                                            <div className="text-sm font-[600] text-slate-700 dark:text-slate-300">{item.label}</div>
                                            {isEditing ? (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {item.type === 'boolean' ? (
                                                        <button 
                                                            onClick={() => setEditValue(!editValue)}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${editValue ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editValue ? 'left-7' : 'left-1'}`} />
                                                        </button>
                                                    ) : (
                                                        <input 
                                                            type={item.type}
                                                            value={editValue}
                                                            onChange={e => setEditValue(item.type === 'number' ? Number(e.target.value) : e.target.value)}
                                                            autoFocus
                                                            className="flex-1 max-w-xs text-sm border border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-slate-700 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                        />
                                                    )}
                                                    <button onClick={handleSave} disabled={saving} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => setEditingKey(null)} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {item.type === 'boolean' 
                                                        ? (currentValue ? 'Enabled' : 'Disabled') 
                                                        : (currentValue || (item.type === 'number' ? 0 : 'Not set'))}
                                                </div>
                                            )}
                                        </div>
                                        {!isEditing && (
                                            <button 
                                                onClick={() => {
                                                    setEditingKey(item.key);
                                                    setEditValue(currentValue);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-[600] px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
