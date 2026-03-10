"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { users as usersApi, upload } from '@/lib/api'
import {
    MapPin, Briefcase, GraduationCap, Linkedin, Edit3,
    Users, Mail, ExternalLink, BookOpen, Loader2, X, Check, Star
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
        skills: [] as string[]
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
                skills: user.skills || []
            })
        }
    }, [user])

    const handleSave = async () => {
        setSaving(true)
        try {
            const updatedUser = await usersApi.updateProfile(form)
            // Update the auth context with the new user data
            // Since we don't have a direct 'updateUser' in AuthContext, we might need to refresh or re-auth
            // For now, let's assume the API returns the full user object
            setIsEditing(false)
            window.location.reload() // Quick fix to refresh data from server
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
                // If we get an image URL back from the backend (Cloudinary or local)
                // Force AuthContext to refresh by simple reload (as used in handleSave)
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
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        )
    }

    const getInitials = (n: string) => n.split(' ').map(i => i[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            {/* Profile Header Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
                {/* Banner */}
                <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="px-8 pb-8 -mt-16 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="w-32 h-32 rounded-3xl object-cover shadow-xl border-8 border-white dark:border-slate-800" />
                                ) : (
                                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-[800] text-white border-8 border-white dark:border-slate-800 shadow-xl">
                                        {getInitials(user.name)}
                                    </div>
                                )}
                                <label className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} disabled={uploadingImage} />
                                </label>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-[800] text-slate-900 dark:text-white">{user.name}</h1>
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-[800] uppercase tracking-widest">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-slate-500 dark:text-slate-400 font-[500]">
                                        {user.currentPosition || 'Professional'} {user.currentCompany ? `@ ${user.currentCompany}` : ''}
                                    </p>
                                    {user.role === 'alumni' && (
                                        <>
                                            <span className="text-slate-300">|</span>
                                            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-800/50">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-sm font-[800] text-amber-600 dark:text-amber-400">{user.averageRating?.toFixed(1) || '0.0'}</span>
                                                <span className="text-[10px] text-amber-600/60 dark:text-amber-400/60 font-[600]">({user.ratingCount || 0} reviews)</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-2">
                            {isEditing ? (
                                <>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-[600] text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all" onClick={() => setIsEditing(false)}>
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[600] text-sm hover:scale-105 transition-all shadow-md" onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-[600] text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all" onClick={() => setIsEditing(true)}>
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest">Location</span>
                            {isEditing ? (
                                <input className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            ) : (
                                <p className="text-sm font-[600] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-indigo-500" /> {user.location || 'Not set'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest">Batch</span>
                            {isEditing ? (
                                <input className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" value={form.batchYear} onChange={e => setForm({ ...form, batchYear: e.target.value })} />
                            ) : (
                                <p className="text-sm font-[600] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <GraduationCap className="w-4 h-4 text-indigo-500" /> Class of {user.batchYear || 'N/A'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest">Company</span>
                            {isEditing ? (
                                <input className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" value={form.currentCompany} onChange={e => setForm({ ...form, currentCompany: e.target.value })} />
                            ) : (
                                <p className="text-sm font-[600] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Briefcase className="w-4 h-4 text-indigo-500" /> {user.currentCompany || 'Freelance'}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-[800] tracking-widest">Email</span>
                            <p className="text-sm font-[600] flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Mail className="w-4 h-4 text-indigo-500" /> {user.email}
                            </p>
                        </div>
                    </div >
                </div >
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About & Skills */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h2 className="text-xl font-[800] text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-indigo-500" /> About & Bio
                        </h2>
                        {isEditing ? (
                            <textarea
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
                                placeholder="Tell us about your professional journey..."
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                            />
                        ) : (
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-[500] text-sm md:text-base">
                                {user.bio || 'Please add a bio to help others in the network understand your background better.'}
                            </p>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-[800] text-slate-900 dark:text-white">Skills & Expertise</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {((user.skills && user.skills.length > 0) ? user.skills : ['Networking', 'Professional Growth', 'Mentorship']).map((skill: string) => (
                                <span key={skill} className="px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-sm text-indigo-600 dark:text-indigo-400 font-[700] tracking-wide hover:bg-indigo-100 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-lg font-[800] text-slate-900 dark:text-white mb-8">Platform Activity</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Network Connections', value: '284', icon: Users, color: 'text-violet-500' },
                                { label: 'Events Attended', value: '15', icon: GraduationCap, color: 'text-blue-500' },
                                { label: 'Job Applications', value: '4', icon: ExternalLink, color: 'text-emerald-500' },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-[600] text-slate-500 dark:text-slate-400">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        {stat.label}
                                    </div>
                                    <span className="text-lg font-[800] text-slate-900 dark:text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-3 rounded-xl border border-slate-200 dark:border-slate-600 border-dashed text-slate-600 dark:text-slate-400 text-xs font-[800] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                            View Full Activity
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20">
                        <h3 className="text-lg font-[800] mb-3 flex items-center gap-2">
                            Mentorship Hub
                        </h3>
                        <p className="text-xs text-white/80 font-[500] leading-relaxed mb-6">
                            {user.role === 'alumni'
                                ? 'You have 3 active mentorship requests waiting for response.'
                                : 'Connect with senior alumni for career guidance and referrals.'}
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-[800] text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                            {user.role === 'alumni' ? 'Manage Requests' : 'Find a Mentor'}
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}
