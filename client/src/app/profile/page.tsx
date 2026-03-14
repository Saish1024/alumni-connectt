"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { users as usersApi, upload } from '@/lib/api'
import {
    MapPin, Briefcase, GraduationCap, Linkedin, Edit3,
    Users, Mail, ExternalLink, BookOpen, Loader2, X, Check, Star, Link as LinkIcon, Activity, Key, Globe, Network, Zap
} from 'lucide-react'

export default function ProfilePage() {
    const { user, login } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    // Form state
    const [form, setForm] = useState({
        name: '',
        bio: '',
        currentPosition: '',
        currentCompany: '',
        location: '',
        batchYear: '',
        linkedin: '',
        skills: '' // Handle as comma separated string in form, convert to array on save
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
        }
    }, [user, isEditing])

    const handleSave = async () => {
        setSaving(true)
        try {
            const requirementsArray = form.skills.split(',').map(s => s.trim()).filter(s => s !== '')
            const payload = { ...form, skills: requirementsArray }
            
            await usersApi.updateProfile(payload)
            setIsEditing(false)
            window.location.reload()
        } catch (err) {
            console.error('Failed to update profile:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        try {
            const res = await upload.image(file)
            if (res.url) {
                window.location.reload()
            }
        } catch (err) {
            console.error('Failed to upload image:', err)
            alert('Failed to upload image. Make sure Cloudinary is configured if running in production.')
        } finally {
            setUploadingImage(false)
        }
    }

    if (!user) {
        return (
            <div className="flex bg-slate-950 items-center justify-center min-h-[500px] rounded-[3rem]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        )
    }

    const getInitials = (n: string) => (n || 'User').split(' ').map(i => i[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-1000 font-[Inter,sans-serif] pb-20 p-4 lg:p-8 bg-slate-950 min-h-screen rounded-[3rem] text-slate-200">
            {/* Header / Identity Core */}
            <div className="relative rounded-[3rem] overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                {/* Immersive Banner */}
                <div className="h-64 md:h-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950" />
                    
                    {/* Animated Grid & Glows */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <div className="absolute top-1/2 left-1/4 w-[40rem] h-[20rem] bg-indigo-500/30 blur-[100px] rounded-[100%] -translate-y-1/2 -rotate-12 animate-pulse" />
                    <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-purple-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
                </div>

                <div className="px-8 pb-12 -mt-24 md:-mt-32 relative z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full md:w-auto">
                            
                            {/* Avatar Frame */}
                            <div className="relative group flex-shrink-0 z-20">
                                {/* Outer Glow Hexagon/Circle */}
                                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                                
                                <div className="relative bg-slate-950 p-1.5 rounded-full">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10" />
                                    ) : (
                                        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-6xl md:text-7xl font-[900] text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 border border-slate-700">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-4 right-4 md:bottom-6 md:right-6 p-3.5 bg-indigo-600 text-white rounded-full shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all cursor-pointer z-30 border-2 border-slate-950">
                                    {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} disabled={uploadingImage} />
                                </label>
                            </div>
                            
                            {/* Name & Title Identity */}
                            <div className="text-center md:text-left flex-1 pb-4">
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-4 mb-3">
                                    {isEditing ? (
                                        <input 
                                            className="text-3xl md:text-5xl font-[900] bg-slate-950/80 border border-indigo-500/50 rounded-2xl px-6 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-center md:text-left w-full md:w-auto text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                                            value={form.name} 
                                            onChange={e => setForm({ ...form, name: e.target.value })} 
                                            placeholder="Your Name"
                                        />
                                    ) : (
                                        <h1 className="text-4xl md:text-6xl font-[900] text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-slate-400 tracking-tight drop-shadow-sm">{user.name}</h1>
                                    )}
                                    
                                    {!isEditing && (
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-[900] uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.2)] border flex items-center gap-2 ${user.role === 'alumni' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${user.role === 'alumni' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                                            {user.role} Authorization
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                                    {isEditing ? (
                                        <div className="flex flex-col md:flex-row gap-4 w-full">
                                            <input className="text-sm font-[600] bg-slate-950/80 border border-slate-700/50 rounded-xl px-5 py-3 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white shadow-inner" value={form.currentPosition} onChange={e => setForm({ ...form, currentPosition: e.target.value })} placeholder="Job Title (e.g. Architect)" />
                                            <span className="hidden md:flex items-center justify-center text-slate-600 font-[900] text-xl">@</span>
                                            <input className="text-sm font-[600] bg-slate-950/80 border border-slate-700/50 rounded-xl px-5 py-3 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white shadow-inner" value={form.currentCompany} onChange={e => setForm({ ...form, currentCompany: e.target.value })} placeholder="Organization" />
                                        </div>
                                    ) : (
                                        <p className="text-slate-300 font-[600] text-xl flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                            <Briefcase className="w-5 h-5 text-indigo-400" />
                                            {user.currentPosition || 'Systems Professional'} 
                                            {user.currentCompany ? <span className="text-indigo-400">@ {user.currentCompany}</span> : ''}
                                        </p>
                                    )}

                                    {!isEditing && user.role === 'alumni' && (
                                        <>
                                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-700" />
                                            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-[900] text-amber-400">{user.averageRating?.toFixed(1) || '0.0'}</span>
                                                <span className="text-xs text-amber-500/70 font-[700] uppercase tracking-wider">({user.ratingCount || 0} signals)</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Control Actions */}
                        <div className="flex gap-4 pb-4 w-full md:w-auto justify-center md:justify-start flex-shrink-0 z-30">
                            {isEditing ? (
                                <>
                                    <button className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-4 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 text-white rounded-2xl font-[800] text-sm transition-all flex backdrop-blur-md" onClick={() => setIsEditing(false)}>
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button className="flex-1 md:flex-none items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-2xl font-[900] text-sm transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] flex" onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        Initialize Changes
                                    </button>
                                </>
                            ) : (
                                <button className="w-full md:w-auto items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-indigo-500 text-white rounded-2xl font-[800] text-sm transition-all backdrop-blur-md flex shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]" onClick={() => setIsEditing(true)}>
                                    <Edit3 className="w-4 h-4 text-indigo-400" /> Modify Interface
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Telemetry Node Info Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 relative">
                        {/* Connecting lines for aesthetics hidden on mobile */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-y-1/2 z-0" />

                        <div className="relative z-10 flex gap-5 items-center bg-slate-950/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[10px] text-slate-500 uppercase font-[900] tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-indigo-500" /> Node Location
                                </div>
                                {isEditing ? (
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Coordinates" />
                                ) : (
                                    <div className="text-sm font-[800] text-slate-200 truncate">{user.location || 'Undisclosed Sector'}</div>
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-5 items-center bg-slate-950/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]">
                                <Key className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[10px] text-slate-500 uppercase font-[900] tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-purple-500" /> Initialization Year
                                </div>
                                {isEditing ? (
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none text-sm font-bold text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" value={form.batchYear} onChange={e => setForm({ ...form, batchYear: e.target.value })} placeholder="YYYY" />
                                ) : (
                                    <div className="text-sm font-[800] text-slate-200">Class of {user.batchYear || 'N/A'}</div>
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-5 items-center bg-slate-950/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
                                <Network className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[10px] text-slate-500 uppercase font-[900] tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" /> External Link
                                </div>
                                {isEditing ? (
                                    <input className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 outline-none text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://..." />
                                ) : (
                                    <div className="text-sm font-[800] text-slate-200 truncate">
                                        {user.linkedin ? <a href={user.linkedin} target="_blank" className="text-blue-400 hover:text-blue-300 flex items-center gap-1.5">Open Connection <ExternalLink className="w-3.5 h-3.5" /></a> : 'Link Not Found'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-5 items-center bg-slate-950/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[10px] text-slate-500 uppercase font-[900] tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> Direct Comms
                                </div>
                                <div className="text-sm font-[800] text-slate-200 truncate">{user.email}</div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >

            {/* Content Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Core Data */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bio Matrix */}
                    <div className={`bg-slate-900/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border transition-all duration-500 shadow-2xl relative overflow-hidden ${isEditing ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] bg-slate-900/80' : 'border-slate-800'}`}>
                        {/* Glowing orb background effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
                        
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
                                <BookOpen className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h2 className="text-3xl font-[900] text-white tracking-tight">System Bio</h2>
                        </div>
                        
                        <div className="relative z-10">
                            {isEditing ? (
                                <textarea
                                    rows={8}
                                    className="w-full bg-slate-950/80 border border-slate-700 rounded-[2rem] p-8 text-lg font-[500] text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-600 leading-loose resize-none custom-scrollbar shadow-inner"
                                    placeholder="Input your career trajectory, core focus areas, and primary directives here."
                                    value={form.bio}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                />
                            ) : (
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-slate-400 leading-[2] font-[500] text-lg md:text-xl">
                                        {user.bio || 'Data stream empty. Input biography to establish network presence.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skill Arrays */}
                    <div className={`bg-slate-900/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border transition-all duration-500 shadow-2xl relative overflow-hidden ${isEditing ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] bg-slate-900/80' : 'border-slate-800'}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
                        
                        <div className="flex items-center gap-5 mb-10 relative z-10">
                            <div className="p-4 bg-purple-500/10 rounded-[1.5rem] border border-purple-500/20 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]">
                                <Zap className="w-7 h-7 text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-[900] text-white tracking-tight">Capability Arrays</h2>
                        </div>

                        <div className="relative z-10">
                            {isEditing ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-[900] text-purple-400 uppercase tracking-[0.2em]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                            Input Modules (Comma Separated)
                                        </label>
                                        <input
                                            className="w-full bg-slate-950/80 border border-slate-700 rounded-[1.5rem] px-8 py-5 text-sm font-[600] text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                                            placeholder="e.g. Distributed Systems, Neural Nets, React"
                                            value={form.skills}
                                            onChange={e => setForm({ ...form, skills: e.target.value })}
                                        />
                                    </div>
                                    <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800">
                                        <div className="text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] mb-4">Module Preview</div>
                                        <div className="flex flex-wrap gap-3">
                                            {form.skills.split(',').filter(s => s.trim() !== '').map((skill, i) => (
                                                <span key={i} className="px-4 py-2 bg-purple-500/10 text-purple-300 rounded-xl text-xs font-[800] border border-purple-500/30 tracking-wide uppercase">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {form.skills.trim() === '' && <span className="text-sm font-[600] text-slate-600 italic">Awaiting input...</span>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {((user.skills && user.skills.length > 0) ? user.skills : ['Optimization', 'System Architecture']).map((skill: string) => (
                                        <span key={skill} className="px-6 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-slate-300 font-[800] tracking-wider uppercase hover:border-indigo-500 hover:bg-slate-900 transition-all cursor-default shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Auxiliary Telemetry */}
                <div className="space-y-8">
                    {/* Analytics Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-20" />
                        
                        <div className="flex items-center gap-4 mb-10">
                            <Activity className="w-6 h-6 text-emerald-400" />
                            <h3 className="text-xl font-[900] text-white tracking-wide">Network Telemetry</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { label: 'Node Connections', value: '284', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                                { label: 'Events Synthesized', value: '15', icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                                { label: 'External Pings', value: '4', icon: Network, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between p-5 bg-slate-950/50 rounded-[1.5rem] border border-slate-800 group hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.bg}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <span className="text-xs font-[800] uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</span>
                                    </div>
                                    <span className="text-2xl font-[900] text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mentorship Hub Control */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl border border-indigo-500/20 group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full group-hover:bg-indigo-400/30 transition-all duration-1000 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 blur-[100px] rounded-full group-hover:bg-purple-400/30 transition-all duration-1000 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-[10px] font-[900] uppercase tracking-widest mb-6">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    Active Hub
                                </div>
                                <h3 className="text-2xl font-[900] mb-4 tracking-tight">
                                    Mentorship Control
                                </h3>
                                <p className="text-indigo-200 font-[500] leading-relaxed text-sm md:text-base">
                                    {user.role === 'alumni'
                                        ? 'Incoming student transmission signals await your response. Access dashboard to process requests.'
                                        : 'Connect with senior architecture nodes for guidance and system optimization.'}
                                </p>
                            </div>
                            
                            <button className="w-full py-5 bg-white text-indigo-950 rounded-[1.5rem] font-[900] text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                {user.role === 'alumni' ? 'Access Requests' : 'Initiate Connect'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(79, 70, 229, 0.2);
                    border-radius: 20px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(79, 70, 229, 0.4);
                }
            `}</style>
        </div >
    )
}
