"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { users as usersApi, upload as apiUpload, alumni as alumniApi, faculty as facultyApi } from '@/lib/api'
import {
    MapPin, Briefcase, GraduationCap, Linkedin, Edit3, Camera,
    Users, Mail, ExternalLink, BookOpen, Loader2, X, Check, Star, Network, Zap, Globe, Key
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const { user, setUser } = useAuth()
    const [stats, setStats] = useState<any>(null)
    const [statsLoading, setStatsLoading] = useState(false)

    // Form state
    const [form, setForm] = useState({
        name: '',
        bio: '',
        currentPosition: '',
        currentCompany: '',
        location: '',
        batchYear: '',
        linkedin: '',
        skills: '' 
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                bio: user.bio || '',
                currentPosition: user.currentPosition || '',
                currentCompany: user.currentCompany || '',
                location: user.location || '',
                batchYear: user.batchYear || '',
                linkedin: user.linkedin || '',
                skills: (user.skills || []).join(', ')
            })
            fetchStats()
        }
    }, [user, isEditing])

    const fetchStats = async () => {
        if (!user) return
        setStatsLoading(true)
        try {
            if (user.role === 'alumni') {
                const res = await alumniApi.getStats()
                setStats({
                    signals: res.topStats.studentsHelped,
                    events: res.topStats.sessionsDone,
                    impact: res.topStats.avgRating
                })
            } else if (user.role === 'faculty') {
                const res = await facultyApi.getStats()
                setStats({
                    signals: res.activeStudentsCount || 0,
                    events: res.sessionsThisMonthCount || 0,
                    impact: (res.avgQuizScore / 20) || 0 // Normalize to 5.0 scale
                })
            } else if (user.role === 'student') {
                const res = await usersApi.getStudentStats()
                setStats({
                    signals: res.topStats.quizzesTaken,
                    events: res.topStats.sessionsBooked,
                    impact: Math.min(5, (res.topStats.totalPoints / 1000) + 1) // Aesthetic impact score
                })
            }
        } catch (err) {
            console.error('Failed to fetch telemetry stats:', err)
        } finally {
            setStatsLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const skillsArray = form.skills.split(',').map(s => s.trim()).filter(s => s !== '')
            const payload = { ...form, skills: skillsArray }
            
            await usersApi.updateProfile(payload)
            if (user) {
                setUser({ ...user, ...payload } as any)
            }
            setIsEditing(false)
        } catch (err) {
            console.error('Failed to update profile:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const res = await apiUpload.image(file)
            if (user) {
                setUser({ ...user, profileImage: res.url })
            }
        } catch (err) {
            console.error('Upload failed:', err)
            alert('Failed to upload image.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = async () => {
        try {
            await usersApi.updateProfile({ profileImage: null })
            if (user) {
                setUser({ ...user, profileImage: undefined })
            }
        } catch (err) {
            console.error('Remove failed:', err)
            alert('Failed to remove image.')
        }
    }

    if (!user) {
        return (
            <div className="flex bg-slate-950 items-center justify-center min-h-[400px] rounded-[2rem]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    const getInitials = (n: string) => (n || 'User').split(' ').map(i => i[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-700 font-[Inter,sans-serif] pb-10 p-3 sm:p-5 bg-slate-950 min-h-screen rounded-[1.5rem] text-slate-200">
            {/* Header / Profile Core */}
            <div className="relative rounded-[1.5rem] overflow-hidden border border-slate-800 bg-slate-900/30 backdrop-blur-sm shadow-lg">
                {/* Slim Banner */}
                <div className="h-32 md:h-36 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-purple-950/50" />
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:16px_16px]" />
                </div>

                <div className="px-5 pb-6 -mt-12 md:-mt-14 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
                            <div className="relative flex-shrink-0 group">
                                <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur-md" />
                                <div className="relative bg-slate-950 p-1 rounded-full overflow-hidden">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-2 border-slate-900" />
                                    ) : (
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-900 flex items-center justify-center text-4xl font-[900] text-indigo-400 border-2 border-slate-900">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                                
                                <input 
                                    type="file" 
                                    id="profile-photo-input" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                />
                                
                                <button 
                                    onClick={() => document.getElementById('profile-photo-input')?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg transition-all scale-90 md:scale-100 hover:scale-110 active:scale-95 z-20 border-2 border-slate-950"
                                    title="Change Photo"
                                >
                                    <Camera className="w-4 h-4 md:w-5 h-5" />
                                </button>
                                
                                {user.profileImage && (
                                    <button 
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg transition-all scale-75 md:scale-90 hover:scale-100 active:scale-95 z-20 border-2 border-slate-950 opacity-0 group-hover:opacity-100"
                                        title="Remove Photo"
                                    >
                                        <X className="w-3 h-3 md:w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex-1 pb-1">
                                <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                                    {isEditing ? (
                                        <input 
                                            className="text-xl md:text-3xl font-[900] bg-slate-950/60 border border-slate-700 rounded-lg px-3 py-1 focus:ring-1 focus:ring-indigo-500 outline-none text-center md:text-left w-full md:w-auto" 
                                            value={form.name} 
                                            onChange={e => setForm({ ...form, name: e.target.value })} 
                                        />
                                    ) : (
                                        <h1 className="text-2xl md:text-4xl font-[900] text-white tracking-tight">{user.name}</h1>
                                    )}
                                    {!isEditing && (
                                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[9px] font-[800] uppercase tracking-widest">
                                            {user.role}
                                        </span>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                                        <input className="text-xs bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1 flex-1 outline-none" value={form.currentPosition} onChange={e => setForm({ ...form, currentPosition: e.target.value })} placeholder="Position" />
                                        <span className="hidden sm:inline text-slate-500 self-center">@</span>
                                        <input className="text-xs bg-slate-950/60 border border-slate-700 rounded-lg px-2 py-1 flex-1 outline-none" value={form.currentCompany} onChange={e => setForm({ ...form, currentCompany: e.target.value })} placeholder="Company" />
                                    </div>
                                ) : (
                                    <p className="text-slate-400 font-[500] text-sm md:text-base">
                                        {user.currentPosition || 'Professional'} {user.currentCompany ? <span className="text-indigo-400">@ {user.currentCompany}</span> : ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 justify-center md:justify-end pb-1">
                            {isEditing ? (
                                <>
                                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-[700] text-[10px] transition-all flex items-center gap-1.5" onClick={() => setIsEditing(false)}>
                                        <X className="w-3.5 h-3.5" /> Cancel
                                    </button>
                                    <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-[800] text-[10px] transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/10" onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-slate-800 rounded-lg font-[800] text-[10px] uppercase tracking-tighter transition-all flex items-center gap-1.5" onClick={() => setIsEditing(true)}>
                                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Compact Telemetry Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                        {[
                            { label: 'Location', value: form.location, icon: MapPin, key: 'location', display: user.location || 'Not set' },
                            { label: 'Timeline', value: form.batchYear, icon: Key, key: 'batchYear', display: `Class of ${user.batchYear || 'N/A'}` },
                            { label: 'Link', value: form.linkedin, icon: Linkedin, key: 'linkedin', display: user.linkedin ? 'Connected' : 'Not linked' },
                            { label: 'Contact', value: user.email, icon: Mail, readonly: true }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/40 flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 text-indigo-400 flex-shrink-0">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-[8px] text-slate-500 uppercase font-[900] tracking-tighter mb-0.5">{item.label}</div>
                                    {isEditing && !item.readonly ? (
                                        <input 
                                            className="w-full bg-transparent border-b border-slate-800 focus:border-indigo-500 outline-none text-[10px] font-semibold text-slate-200" 
                                            value={item.value} 
                                            onChange={e => setForm({ ...form, [item.key!]: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[10px] font-[700] text-slate-300 truncate">{item.display || item.value}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                    {/* Bio Matrix */}
                    <div className="bg-slate-900/30 rounded-[1.5rem] p-5 md:p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-base font-[900] text-white">Identity Log</h2>
                        </div>
                        {isEditing ? (
                            <textarea
                                rows={4}
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg p-3 text-xs font-[500] focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed text-slate-300"
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                                placeholder="Describe your telemetry data..."
                            />
                        ) : (
                            <p className="text-slate-400 leading-relaxed font-[500] text-xs md:text-sm">
                                {user.bio || 'Biography stream offline.'}
                            </p>
                        )}
                    </div>

                    {/* Skill Arrays */}
                    <div className="bg-slate-900/30 rounded-[1.5rem] p-5 md:p-6 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <h2 className="text-base font-[900] text-white">Capabilities</h2>
                        </div>
                        {isEditing ? (
                            <input
                                className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-[600] focus:border-purple-500 outline-none text-slate-200"
                                placeholder="e.g. Logic, Synthesis, Architecture"
                                value={form.skills}
                                onChange={e => setForm({ ...form, skills: e.target.value })}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {((user.skills && user.skills.length > 0) ? user.skills : ['Mentorship']).map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-slate-950/60 border border-slate-800 rounded text-[9px] font-[700] text-slate-400 uppercase tracking-tight">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Analytics Module */}
                    <div className="bg-slate-900/30 backdrop-blur-md rounded-[2rem] p-6 border border-slate-800/50 shadow-2xl shadow-indigo-500/5">
                        <h3 className="text-[10px] font-[900] text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> 
                            System Telemetry
                        </h3>
                        <div className="space-y-4">
                            {[
                                { 
                                    label: 'Signals', 
                                    value: statsLoading ? '...' : (stats?.signals ?? '0'), 
                                    icon: Users,
                                    color: 'indigo',
                                    glow: 'shadow-indigo-500/20',
                                    bg: 'bg-indigo-500/10',
                                    text: 'text-indigo-400'
                                },
                                { 
                                    label: 'Events', 
                                    value: statsLoading ? '...' : (stats?.events ?? '0'), 
                                    icon: Network,
                                    color: 'emerald',
                                    glow: 'shadow-emerald-500/20',
                                    bg: 'bg-emerald-500/10',
                                    text: 'text-emerald-400'
                                },
                                { 
                                    label: 'Impact', 
                                    value: statsLoading ? '...' : (stats?.impact ?? '0.0'), 
                                    icon: Star,
                                    color: 'amber',
                                    glow: 'shadow-amber-500/20',
                                    bg: 'bg-amber-500/10',
                                    text: 'text-amber-400',
                                    animate: 'animate-pulse'
                                }
                            ].map(stat => (
                                <div 
                                    key={stat.label} 
                                    className={`group flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:border-${stat.color}-500/50 hover:scale-[1.02] hover:shadow-xl ${stat.glow} transition-all duration-300 cursor-default`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${stat.bg} ${stat.text} rounded-xl flex items-center justify-center border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className={`w-5 h-5 ${stat.animate || ''}`} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                            <div className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Active Protocol</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-2xl font-[900] bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent group-hover:from-${stat.color}-400 group-hover:to-white transition-all`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Hub */}
                    <div className="bg-gradient-to-br from-indigo-950/50 to-slate-950 rounded-[1.5rem] p-5 border border-indigo-500/10">
                        <h4 className="font-[900] text-sm mb-1.5 text-indigo-100">Operation Center</h4>
                        <p className="text-[10px] text-slate-500 leading-normal mb-4 font-medium">Coordinate mentor connections and protocol optimizations.</p>
                        <Link href="/dashboard" className="block w-full">
                            <button className="w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-[9px] font-[900] uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/5">
                                Open Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
