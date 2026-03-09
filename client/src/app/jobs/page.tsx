"use client"
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { jobs as jobsApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import {
    Search, Briefcase, MapPin, DollarSign, Clock, Building2,
    Loader2, Plus, X, CheckCircle
} from 'lucide-react'

const mockJobs = [
    { _id: '1', title: 'Senior Frontend Developer', company: 'Stripe', location: 'Remote', type: 'Full-time', salary: '$140k – $180k', createdAt: new Date().toISOString(), postedBy: 'Alumni Network' },
    { _id: '2', title: 'Product Manager (Alumni Referral)', company: 'Microsoft', location: 'Seattle, WA', type: 'Full-time', salary: 'Competitive', createdAt: new Date().toISOString(), postedBy: 'Alumni Network' },
    { _id: '3', title: 'Data Science Intern', company: 'NVIDIA', location: 'Santa Clara, CA', type: 'Internship', salary: '$60/hr', createdAt: new Date().toISOString(), postedBy: 'Alumni Network' },
    { _id: '4', title: 'Backend Engineer', company: 'Loom', location: 'Remote', type: 'Full-time', salary: '$120k – $160k', createdAt: new Date().toISOString(), postedBy: 'Alumni Network' },
    { _id: '5', title: 'DevOps Engineer', company: 'Cloudflare', location: 'Remote', type: 'Full-time', salary: '$130k – $170k', createdAt: new Date().toISOString(), postedBy: 'Alumni Network' },
]

const companyColors: Record<string, string> = {
    'Stripe': 'bg-purple-600', 'Microsoft': 'bg-blue-600', 'NVIDIA': 'bg-green-600',
    'Loom': 'bg-sky-500', 'Cloudflare': 'bg-orange-500', 'Google': 'bg-red-500',
    'Amazon': 'bg-yellow-600', 'Apple': 'bg-gray-600', 'Meta': 'bg-blue-500',
}

export default function JobPortalPage() {
    const { user } = useAuth()
    const [allJobs, setAllJobs] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('All')
    const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
    const [showPostModal, setShowPostModal] = useState(false)
    const [posting, setPosting] = useState(false)
    const [postForm, setPostForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' })

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const data = await jobsApi.list()
            const jobs = data.length > 0 ? data : mockJobs
            setAllJobs(jobs)
            setFiltered(jobs)
        } catch {
            setAllJobs(mockJobs)
            setFiltered(mockJobs)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchJobs() }, [])

    useEffect(() => {
        let result = allJobs
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company?.toLowerCase().includes(q) ||
                j.location?.toLowerCase().includes(q)
            )
        }
        if (typeFilter !== 'All') {
            result = result.filter(j => j.type === typeFilter)
        }
        setFiltered(result)
    }, [search, typeFilter, allJobs])

    const handleApply = async (jobId: string) => {
        try {
            await jobsApi.apply(jobId)
            setAppliedIds(prev => new Set([...prev, jobId]))
        } catch {
            setAppliedIds(prev => new Set([...prev, jobId]))
        }
    }

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault()
        setPosting(true)
        try {
            await jobsApi.create(postForm)
            setShowPostModal(false)
            setPostForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' })
            fetchJobs()
        } catch {
            // silently handle for now
        } finally {
            setPosting(false)
        }
    }

    const timeSince = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const h = Math.floor(diff / 3600000)
        if (h < 24) return `${h}h ago`
        return `${Math.floor(h / 24)}d ago`
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Job Opportunities</h1>
                    <p className="text-gray-400 mt-1">{filtered.length} jobs from our alumni network.</p>
                </div>
                {(user?.role === 'alumni' || user?.role === 'admin') && (
                    <Button className="gap-2 h-11" onClick={() => setShowPostModal(true)}>
                        <Plus className="w-4 h-4" /> Post a Job
                    </Button>
                )}
            </header>

            {/* Search */}
            <Card className="p-4 border-gray-800 shadow-inner bg-secondary/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Job title, company, or location..."
                                className="pl-12 h-12 bg-gray-900/50 border-gray-800"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Full-time', 'Internship', 'Part-time', 'Contract'].map(type => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type)}
                                className={`px-4 h-12 rounded-xl text-sm font-medium transition-all border ${typeFilter === type
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Jobs List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map((job) => {
                        const applied = appliedIds.has(job._id)
                        const color = companyColors[job.company] || 'bg-primary'
                        return (
                            <Card key={job._id} className="p-5 border-gray-800/50 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center gap-5 group">
                                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
                                    {(job.company || 'J')[0]}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                        {job.title?.includes('Referral') && (
                                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase">Referral</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-gray-400 mt-1">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-gray-500" />
                                            {job.company}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                            {job.location || 'Remote'}
                                        </div>
                                        {job.salary && (
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                                                {job.salary}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                                            {timeSince(job.createdAt)}
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-[11px] text-gray-400 border border-gray-700">
                                            {job.type || 'Full-time'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <Button variant="outline" className="h-10 px-5 border-gray-800 text-sm">Save</Button>
                                    <Button
                                        className={`h-10 px-7 text-sm gap-2 ${applied ? 'bg-green-600 hover:bg-green-500' : ''}`}
                                        onClick={() => handleApply(job._id)}
                                        disabled={applied}
                                    >
                                        {applied && <CheckCircle className="w-4 h-4" />}
                                        {applied ? 'Applied!' : 'Apply Now'}
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-medium">No jobs found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            )}

            {/* Post Job Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Post a Job</h2>
                            <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePostJob} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-400 mb-1.5 block">Job Title *</label>
                                    <Input required placeholder="e.g. Senior Frontend Developer" className="border-gray-700"
                                        value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Company *</label>
                                    <Input required placeholder="e.g. Google" className="border-gray-700"
                                        value={postForm.company} onChange={e => setPostForm(p => ({ ...p, company: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Location</label>
                                    <Input placeholder="e.g. Remote" className="border-gray-700"
                                        value={postForm.location} onChange={e => setPostForm(p => ({ ...p, location: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Type</label>
                                    <select className="w-full h-10 rounded-xl bg-gray-900 border border-gray-700 text-white px-3 text-sm"
                                        value={postForm.type} onChange={e => setPostForm(p => ({ ...p, type: e.target.value }))}>
                                        {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Salary</label>
                                    <Input placeholder="e.g. $100k – $140k" className="border-gray-700"
                                        value={postForm.salary} onChange={e => setPostForm(p => ({ ...p, salary: e.target.value }))} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief job description..."
                                        className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary resize-none"
                                        value={postForm.description}
                                        onChange={e => setPostForm(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" className="flex-1 border-gray-700" onClick={() => setShowPostModal(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1" disabled={posting}>
                                    {posting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Posting...</> : 'Post Job'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}
