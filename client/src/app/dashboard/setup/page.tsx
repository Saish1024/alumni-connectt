"use client"
import React, { useState, useEffect } from 'react';
import { Save, Clock, BookOpen, IndianRupee, CheckCircle2, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { alumni as apiAlumni } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const AVAILABLE_TOPICS = [
    'DSA & Algo',
    'System Design',
    'Web Development',
    'Mobile Development',
    'Cloud Computing',
    'AI / Machine Learning',
    'Cybersecurity',
    'Product Management',
    'Interview Prep',
    'Career Advice',
    'Resume Review',
    'Soft Skills'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MentoringSetupPage() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [form, setForm] = useState({
        sessionPrice: 0,
        resumeReviewPrice: 0,
        mentoringTopics: [] as string[],
        availability: {} as Record<string, string[]>
    });

    useEffect(() => {
        if (user) {
            setForm({
                sessionPrice: user.sessionPrice || 0,
                resumeReviewPrice: user.resumeReviewPrice || 0,
                mentoringTopics: user.mentoringTopics || [],
                availability: user.availability || {
                    'Monday': ['10:00 AM', '04:00 PM'],
                    'Tuesday': ['10:00 AM', '04:00 PM'],
                    'Wednesday': ['10:00 AM', '04:00 PM'],
                    'Thursday': ['10:00 AM', '04:00 PM'],
                    'Friday': ['10:00 AM', '04:00 PM'],
                    'Saturday': [],
                    'Sunday': []
                }
            });
            setLoading(false);
        }
    }, [user]);

    const handleTopicToggle = (topic: string) => {
        setForm(prev => ({
            ...prev,
            mentoringTopics: prev.mentoringTopics.includes(topic)
                ? prev.mentoringTopics.filter(t => t !== topic)
                : [...prev.mentoringTopics, topic]
        }));
    };

    const handleSlotAdd = (day: string) => {
        const slots = form.availability[day] || [];
        if (slots.length >= 5) return; // Limit slots
        setForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: [...slots, '10:00 AM']
            }
        }));
    };

    const handleSlotChange = (day: string, index: number, value: string) => {
        const slots = [...form.availability[day]];
        slots[index] = value;
        setForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: slots
            }
        }));
    };

    const handleSlotRemove = (day: string, index: number) => {
        const slots = [...form.availability[day]];
        slots.splice(index, 1);
        setForm(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [day]: slots
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await apiAlumni.updateMentoringSettings(form);
            if (setUser) {
                setUser({ ...user, ...res.user });
            }
            setMessage({ type: 'success', text: 'Mentoring settings saved successfully!' });
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error('Failed to save settings:', err);
            setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-[Inter,sans-serif] pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Mentoring Setup</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your expertise, pricing, and availability for students</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <span className="text-sm font-[600]">{message.text}</span>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Pricing & Expertise */}
                <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-lg font-[700] text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-indigo-500" /> Session Pricing
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Mentoring Session Fee (INR)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                    <input 
                                        type="number" 
                                        value={form.sessionPrice}
                                        onChange={e => setForm({ ...form, sessionPrice: parseInt(e.target.value) || 0 })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="0 for free"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1.5 ml-1 italic">Suggested: ₹200 - ₹1000 per hour</p>
                            </div>
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Resume Review Fee (INR)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                    <input 
                                        type="number" 
                                        value={form.resumeReviewPrice}
                                        onChange={e => setForm({ ...form, resumeReviewPrice: parseInt(e.target.value) || 0 })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="0 for free"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expertise */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-lg font-[700] text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-purple-500" /> Expertise Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TOPICS.map(topic => {
                                const isSelected = form.mentoringTopics.includes(topic);
                                return (
                                    <button
                                        key={topic}
                                        onClick={() => handleTopicToggle(topic)}
                                        className={`px-4 py-2 rounded-xl text-sm font-[600] border transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'}`}
                                    >
                                        {topic}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Availability */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <h3 className="text-lg font-[700] text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" /> Weekly Availability
                    </h3>
                    <div className="space-y-6">
                        {DAYS.map(day => {
                            const slots = form.availability[day] || [];
                            return (
                                <div key={day} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-[700] text-slate-700 dark:text-slate-200">{day}</span>
                                        <button 
                                            onClick={() => handleSlotAdd(day)}
                                            className="text-[10px] uppercase font-[800] text-indigo-500 hover:text-indigo-600 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-1 rounded-lg transition-all"
                                        >
                                            <Plus className="w-3 h-3" /> Add Slot
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {slots.length === 0 ? (
                                            <span className="text-xs text-slate-400 italic">Not available</span>
                                        ) : (
                                            slots.map((slot, index) => (
                                                <div key={index} className="flex items-center gap-1 group">
                                                    <input 
                                                        type="text" 
                                                        value={slot}
                                                        onChange={(e) => handleSlotChange(day, index, e.target.value)}
                                                        className="w-20 px-2 py-1 text-xs font-[600] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                                                    />
                                                    <button onClick={() => handleSlotRemove(day, index)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
