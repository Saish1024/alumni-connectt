"use client"
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuth } from '@/context/AuthContext'
import { User, Lock, Bell, Shield, LogOut, Save, Camera, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
    const { user, logout, isLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('profile')
    const [mounted, setMounted] = useState(false)

    // Form states
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        setMounted(true)
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setBio((user as any).bio || '')
        }
    }, [user])

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User, color: 'text-indigo-500' },
        { id: 'security', label: 'Security', icon: Lock, color: 'text-blue-500' },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-purple-500' },
        { id: 'privacy', label: 'Privacy', icon: Shield, color: 'text-emerald-500' },
    ]

    if (!mounted || isLoading) return null

    const handleSignOut = () => {
        logout()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-[Inter,sans-serif]">
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-[800] text-slate-900 dark:text-white">Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-[500]">Manage your account preferences and profile</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Discard</Button>
                        <Button className="shadow-purple-500/20"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-[600] transition-all duration-300 ${activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                                            {tab.label}
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </button>
                                ))}
                                <div className="my-2 border-t border-slate-100 dark:border-slate-800 mx-4" />
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-[600] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </nav>
                        </Card>

                        {/* Help Desk box */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/20">
                            <h4 className="font-[700] mb-2">Need help?</h4>
                            <p className="text-white/80 text-xs mb-4 leading-relaxed">Check our documentation or contact support for any issues with your account.</p>
                            <Button size="sm" variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">Go to Support</Button>
                        </div>
                    </div>

                    {/* Content Panel */}
                    <div className="lg:col-span-8">
                        {activeTab === 'profile' && (
                            <Card className="border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-[800] text-slate-900 dark:text-white">Profile Information</h2>
                                    <span className="text-[10px] font-[800] uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">Public Profile</span>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-[800] text-white shadow-xl shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
                                                {name?.split(' ').map(n => n[0]).join('') || 'SG'}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-[700] text-slate-900 dark:text-white">Profile Photo</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 font-[500]">Up to 2MB. JPG, PNG or GIF.</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="h-9 px-4">Change Photo</Button>
                                                <Button variant="outline" size="sm" className="h-9 px-4 border-slate-200 dark:border-slate-700">Remove</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sai Gosavi" />
                                        <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sai@example.com" />
                                        <Input label="Batch Year" defaultValue={(user as any)?.batchYear || '2023'} placeholder="e.g. 2023" />
                                        <Input label="Location" defaultValue={(user as any)?.location || 'Mumbai, India'} placeholder="e.g. Bangalore, India" />
                                        <Input label="Company" defaultValue={(user as any)?.company || 'Google'} placeholder="e.g. Microsoft" />
                                        <Input label="Job Title" defaultValue={(user as any)?.jobTitle || 'Senior Engineer'} placeholder="e.g. SDE-2" />
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={e => setBio(e.target.value)}
                                                className="w-full h-32 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none font-[500]"
                                                placeholder="Tell us about your professional journey..."
                                            />
                                        </div>
                                        <Input label="LinkedIn URL" className="sm:col-span-2" defaultValue={(user as any)?.linkedin || ''} placeholder="https://linkedin.com/in/..." />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card className="border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-[800] text-slate-900 dark:text-white">Security Settings</h2>
                                <div className="space-y-6">
                                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-3xl">
                                        <h4 className="font-[700] text-amber-800 dark:text-amber-400 text-sm mb-1">Password Requirement</h4>
                                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-[500]">Use at least 8 characters with a mix of letters, numbers and symbols for better security.</p>
                                    </div>
                                    <Input label="Current Password" type="password" placeholder="••••••••" />
                                    <Input label="New Password" type="password" placeholder="••••••••" />
                                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                                    <div className="flex justify-end pt-4">
                                        <Button className="w-full sm:w-auto px-10">Update Password</Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card className="border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-[800] text-slate-900 dark:text-white">Notifications</h2>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[
                                        { label: 'Connection Requests', desc: 'When a student wants to connect for mentorship' },
                                        { label: 'New Messages', desc: 'Get notified when you receive a direct message' },
                                        { label: 'Job Alert', desc: 'Personalized job postings matching your preferences' },
                                        { label: 'Events & Sessions', desc: 'Reminders for your upcoming mentoring sessions' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between py-6 group">
                                            <div>
                                                <p className="font-[700] text-slate-900 dark:text-white text-sm">{item.label}</p>
                                                <p className="text-xs text-slate-400 mt-1 font-[500]">{item.desc}</p>
                                            </div>
                                            <div className="relative w-12 h-6 flex-shrink-0 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300" />
                                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'privacy' && (
                            <Card className="border-slate-200 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-[800] text-slate-900 dark:text-white">Privacy & Visibility</h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Visibility in Directory', desc: 'Show your profile to other alumni and students' },
                                        { label: 'Google Calendar Sync', desc: 'Allow us to check availability for sessions' },
                                        { label: 'Active Status', desc: 'Show when you are active on the platform' },
                                    ].map(item => (
                                        <div key={item.label} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                            <div>
                                                <p className="font-[700] text-slate-900 dark:text-white text-sm">{item.label}</p>
                                                <p className="text-xs text-slate-400 mt-1 font-[500]">{item.desc}</p>
                                            </div>
                                            <div className="relative w-12 h-6 flex-shrink-0 cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300" />
                                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
