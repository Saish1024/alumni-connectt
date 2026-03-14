"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { users as usersApi, upload } from '@/lib/api'
import {
    MapPin, Briefcase, GraduationCap, Linkedin, Edit3,
    Users, Mail, ExternalLink, BookOpen, Loader2, X, Check, Star, Link as LinkIcon, Activity
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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    const getInitials = (n: string) => (n || 'User').split(' ').map(i => i[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 font-[Inter,sans-serif] pb-20">
            {/* Profile Header Card */}
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
                {/* Banner */}
                <div className="h-48 md:h-64 bg-slate-900 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-slate-900 opacity-90" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="px-8 pb-10 -mt-24 md:-mt-32 relative z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto">
                            <div className="relative group flex-shrink-0">
                                <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500 blur-xl" />
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="relative w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] object-cover ring-[8px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
                                ) : (
                                    <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl md:text-7xl font-[800] text-white ring-[8px] ring-white dark:ring-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                        {getInitials(user.name)}
                                    </div>
                                )}
                                <label className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer border border-slate-100 dark:border-slate-700">
                                    {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} disabled={uploadingImage} />
                                </label>
                            </div>
                            
                            <div className="text-center md:text-left flex-1 pb-2">
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-2">
                                    {isEditing ? (
                                        <input 
                                            className="text-3xl md:text-4xl font-[900] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center md:text-left w-full md:w-auto text-slate-900 dark:text-white" 
                                            value={form.name} 
                                            onChange={e => setForm({ ...form, name: e.target.value })} 
                                            placeholder="Your Name"
                                        />
                                    ) : (
                                        <h1 className="text-3xl md:text-5xl font-[900] text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                                    )}
                                    
                                    {!isEditing && (
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-[800] uppercase tracking-widest ${user.role === 'alumni' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'}`}>
                                            {user.role}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row items-center gap-3 mt-3">
                                    {isEditing ? (
                                        <div className="flex flex-col md:flex-row gap-2 w-full">
                                            <input className="text-sm font-[600] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" value={form.currentPosition} onChange={e => setForm({ ...form, currentPosition: e.target.value })} placeholder="Job Title (e.g. Senior Engineer)" />
                                            <span className="hidden md:inline text-slate-400 font-bold self-center">@</span>
                                            <input className="text-sm font-[600] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 flex-1 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" value={form.currentCompany} onChange={e => setForm({ ...form, currentCompany: e.target.value })} placeholder="Company (e.g. Google)" />
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 dark:text-slate-400 font-[500] text-lg">
                                            {user.currentPosition || 'Professional'} {user.currentCompany ? <span className="text-indigo-600 dark:text-indigo-400 font-[700]">@ {user.currentCompany}</span> : ''}
                                        </p>
                                    )}

                                    {!isEditing && user.role === 'alumni' && (
                                        <>
                                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-xl border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-[800] text-amber-600 dark:text-amber-400">{user.averageRating?.toFixed(1) || '0.0'}</span>
                                                <span className="text-xs text-amber-600/60 dark:text-amber-400/60 font-[600]">({user.ratingCount || 0} reviews)</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Edit Buttons */}
                        <div className="flex gap-3 pb-2 w-full md:w-auto justify-center md:justify-start flex-shrink-0">
                            {isEditing ? (
                                <>
                                    <button className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-[700] text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex" onClick={() => setIsEditing(false)}>
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button className="flex-1 md:flex-none items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[800] text-sm hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 flex" onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button className="w-full md:w-auto items-center justify-center gap-2 px-8 py-3 bg-slate-900 border border-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-[800] text-sm hover:scale-105 transition-all shadow-xl flex" onClick={() => setIsEditing(true)}>
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-indigo-500">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest mb-1">Location</div>
                                {isEditing ? (
                                    <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                ) : (
                                    <div className="text-sm font-[700] text-slate-800 dark:text-white truncate">{user.location || 'Not set'}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-purple-500">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest mb-1">Batch Year</div>
                                {isEditing ? (
                                    <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500" value={form.batchYear} onChange={e => setForm({ ...form, batchYear: e.target.value })} />
                                ) : (
                                    <div className="text-sm font-[700] text-slate-800 dark:text-white">Class of {user.batchYear || 'N/A'}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-blue-500">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest mb-1">LinkedIn</div>
                                {isEditing ? (
                                    <input className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-none text-sm font-semibold dark:text-white focus:ring-2 focus:ring-indigo-500" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                                ) : (
                                    <div className="text-sm font-[700] text-slate-800 dark:text-white truncate">
                                        {user.linkedin ? <a href={user.linkedin} target="_blank" className="hover:text-blue-500 flex items-center gap-1">View Profile <ExternalLink className="w-3 h-3" /></a> : 'Not connected'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-emerald-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest mb-1">Contact Email</div>
                                <div className="text-sm font-[700] text-slate-800 dark:text-white truncate">{user.email}</div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About & Skills */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border shadow-xl transition-all ${isEditing ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl">
                                <BookOpen className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-[900] text-slate-900 dark:text-white">Professional Bio</h2>
                        </div>
                        {isEditing ? (
                            <textarea
                                rows={6}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-base font-[500] text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 leading-relaxed resize-none custom-scrollbar"
                                placeholder="Tell your story. What are you passionate about? What have you built?"
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                            />
                        ) : (
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-slate-600 dark:text-slate-400 leading-loose font-[500] text-lg">
                                    {user.bio || 'This user hasn\'t added a bio yet.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border shadow-xl transition-all ${isEditing ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl">
                                    <Star className="w-6 h-6 text-purple-500" />
                                </div>
                                <h2 className="text-2xl font-[900] text-slate-900 dark:text-white">Skills & Expertise</h2>
                            </div>
                        </div>

                        {isEditing ? (
                            <div>
                                <label className="block text-xs font-[800] text-slate-500 uppercase tracking-widest mb-3">Add skills separated by commas</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-[600] text-slate-900 dark:text-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="e.g. React, Node.js, System Design, Mentoring"
                                    value={form.skills}
                                    onChange={e => setForm({ ...form, skills: e.target.value })}
                                />
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs text-slate-400 font-[500] mr-2 self-center">Preview:</span>
                                    {form.skills.split(',').filter(s => s.trim() !== '').map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-[700] border border-purple-200 dark:border-purple-700/50">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {((user.skills && user.skills.length > 0) ? user.skills : ['Mentorship', 'Professional Growth']).map((skill: string) => (
                                    <span key={skill} className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 font-[700] tracking-wide hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-default shadow-sm hover:shadow-md">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-[900] text-slate-900 dark:text-white">Platform Activity</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { label: 'Network Connections', value: '284', icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
                                { label: 'Events Attended', value: '15', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                                { label: 'Job Applications', value: '4', icon: ExternalLink, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <span className="text-sm font-[700] text-slate-700 dark:text-slate-300">{stat.label}</span>
                                    </div>
                                    <span className="text-xl font-[900] text-slate-900 dark:text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-2xl rounded-full group-hover:bg-white/20 transition-all duration-700 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-[900] mb-3 flex items-center gap-2">
                                Mentorship Hub
                            </h3>
                            <p className="text-sm text-indigo-100 font-[500] leading-relaxed mb-8">
                                {user.role === 'alumni'
                                    ? 'Your expertise is in high demand. Check out new session requests from students.'
                                    : 'Connect with senior alumni for career guidance, mock interviews, and referrals.'}
                            </p>
                            <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-[900] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-900/50">
                                {user.role === 'alumni' ? 'View Dashboard' : 'Find a Mentor'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
