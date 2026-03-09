"use client"
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuth } from '@/context/AuthContext'
import { User, Lock, Bell, Shield, LogOut, Save } from 'lucide-react'

export default function SettingsPage() {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Nav */}
                <Card className="border-gray-800 p-3 h-fit">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}>
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                        <button onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left mt-4">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </nav>
                </Card>

                {/* Content Panel */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && (
                        <Card className="border-gray-800 space-y-6">
                            <h2 className="text-xl font-bold">Profile Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-gray-400 mb-2">Profile Photo</p>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-2xl font-bold">
                                            {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                                        </div>
                                        <Button variant="outline" size="sm" className="border-gray-700">Change Photo</Button>
                                    </div>
                                </div>
                                <Input label="Full Name" defaultValue={user?.name || 'John Doe'} />
                                <Input label="Email" type="email" defaultValue={user?.email || 'john@example.com'} />
                                <Input label="Batch Year" defaultValue={(user as any)?.batchYear || '2019'} />
                                <Input label="Location" defaultValue={(user as any)?.location || 'Mumbai, India'} />
                                <Input label="Company" defaultValue={(user as any)?.company || 'Google'} />
                                <Input label="Job Title" defaultValue={(user as any)?.jobTitle || 'SDE-2'} />
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Bio</label>
                                    <textarea className="w-full h-28 rounded-xl border border-gray-700 bg-[#1E293B]/50 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                                        placeholder="Tell us about yourself..." />
                                </div>
                                <Input label="LinkedIn URL" defaultValue={(user as any)?.linkedin || ''} placeholder="https://linkedin.com/in/..." />
                                <div className="sm:col-span-2 flex justify-end">
                                    <Button className="gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="border-gray-800 space-y-6">
                            <h2 className="text-xl font-bold">Security</h2>
                            <div className="space-y-5">
                                <Input label="Current Password" type="password" placeholder="••••••••" />
                                <Input label="New Password" type="password" placeholder="••••••••" />
                                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                                <Button className="gap-2"><Save className="w-4 h-4" /> Update Password</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="border-gray-800 space-y-6">
                            <h2 className="text-xl font-bold">Notification Preferences</h2>
                            {[
                                { label: 'New connection requests', desc: 'When someone wants to connect with you' },
                                { label: 'Messages', desc: 'When you receive a direct message' },
                                { label: 'Job updates', desc: 'New jobs posted by alumni in your field' },
                                { label: 'Event reminders', desc: 'Reminders for events you registered for' },
                                { label: 'Platform announcements', desc: 'Important platform news and updates' },
                            ].map(item => (
                                <div key={item.label} className="flex items-start justify-between gap-4 py-4 border-b border-gray-800/50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                    <div className="relative w-11 h-6 flex-shrink-0 mt-1">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#7C3AED] cursor-pointer transition-colors" />
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                                    </div>
                                </div>
                            ))}
                        </Card>
                    )}

                    {activeTab === 'privacy' && (
                        <Card className="border-gray-800 space-y-6">
                            <h2 className="text-xl font-bold">Privacy Settings</h2>
                            {[
                                { label: 'Public Profile', desc: 'Allow your profile to be visible in the directory' },
                                { label: 'Show Email Address', desc: 'Let other members see your email' },
                                { label: 'Allow Mentorship Requests', desc: 'Allow students to send mentorship requests' },
                                { label: 'Show Online Status', desc: 'Let others see when you are online' },
                            ].map(item => (
                                <div key={item.label} className="flex items-start justify-between gap-4 py-4 border-b border-gray-800/50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                    <div className="relative w-11 h-6 flex-shrink-0 mt-1">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#7C3AED] cursor-pointer transition-colors" />
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
                                    </div>
                                </div>
                            ))}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
