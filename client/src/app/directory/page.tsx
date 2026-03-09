"use client"
import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { users as usersApi } from '@/lib/api'
import { Search, Filter, Linkedin, MapPin, GraduationCap, Loader2, Briefcase, Mail } from 'lucide-react'

// Fallback mock data (shown when API has no alumni yet)
const mockAlumni = [
    { _id: '1', name: 'Sarah Johnson', currentPosition: 'Senior Product Designer', currentCompany: 'Google', location: 'Mountain View, CA', batchYear: '2019', industry: 'Technology', skills: ['UI/UX', 'Figma', 'Product Strategy'] },
    { _id: '2', name: 'Michael Chen', currentPosition: 'Software Engineer', currentCompany: 'Amazon', location: 'Seattle, WA', batchYear: '2020', industry: 'E-commerce', skills: ['React', 'Node.js', 'AWS'] },
    { _id: '3', name: 'Elena Rodriguez', currentPosition: 'Investment Analyst', currentCompany: 'Goldman Sachs', location: 'New York, NY', batchYear: '2018', industry: 'Finance', skills: ['Financial Modeling', 'Python', 'Equity Research'] },
    { _id: '4', name: 'David Wilson', currentPosition: 'Marketing Manager', currentCompany: 'Tesla', location: 'Austin, TX', batchYear: '2017', industry: 'Automotive', skills: ['Growth Marketing', 'SEO', 'Brand Strategy'] },
    { _id: '5', name: 'Priya Patel', currentPosition: 'ML Engineer', currentCompany: 'OpenAI', location: 'San Francisco, CA', batchYear: '2021', industry: 'AI/ML', skills: ['Python', 'TensorFlow', 'LLMs'] },
    { _id: '6', name: 'James Liu', currentPosition: 'VP Engineering', currentCompany: 'Stripe', location: 'Remote', batchYear: '2015', industry: 'Fintech', skills: ['Leadership', 'System Design', 'Go'] },
]

const industries = ['All', 'Technology', 'Finance', 'E-commerce', 'AI/ML', 'Fintech', 'Healthcare', 'Automotive']

export default function DirectoryPage() {
    const [search, setSearch] = useState('')
    const [selectedIndustry, setSelectedIndustry] = useState('All')
    const [alumni, setAlumni] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)

    const fetchAlumni = useCallback(async () => {
        setLoading(true)
        try {
            const params: any = {}
            if (search.trim()) params.search = search.trim()
            if (selectedIndustry !== 'All') params.industry = selectedIndustry
            const data = await usersApi.list(params)
            setAlumni(data.length > 0 ? data : mockAlumni)
        } catch {
            setAlumni(mockAlumni)
        } finally {
            setLoading(false)
        }
    }, [search, selectedIndustry])

    useEffect(() => {
        fetchAlumni()
    }, [selectedIndustry])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchAlumni()
    }

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const gradients = [
        'from-violet-600/30 to-blue-600/30',
        'from-blue-600/30 to-cyan-600/30',
        'from-pink-600/30 to-rose-600/30',
        'from-amber-500/30 to-orange-500/30',
        'from-green-600/30 to-teal-600/30',
        'from-indigo-600/30 to-violet-600/30',
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold">Alumni Directory</h1>
                <p className="text-gray-400 mt-1">Discover and connect with {alumni.length}+ professionals from our network.</p>
            </header>

            {/* Search and Filters */}
            <div className="space-y-4">
                <form onSubmit={handleSearch}>
                    <Card className="p-4 border-gray-800 bg-secondary/20 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search by name, company, or skills..."
                                className="pl-12 h-12 bg-gray-900/50 border-gray-800"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                type="button"
                                variant="outline"
                                className={`flex-1 md:w-auto h-12 gap-2 text-sm font-medium border-gray-800 ${showFilters ? 'border-primary text-primary' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4" /> Filters
                            </Button>
                            <Button type="submit" className="flex-1 md:w-auto h-12">Search</Button>
                        </div>
                    </Card>
                </form>

                {/* Industry Filter Pills */}
                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        {industries.map(industry => (
                            <button
                                key={industry}
                                onClick={() => setSelectedIndustry(industry)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${selectedIndustry === industry
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-500">
                Showing <span className="text-white font-semibold">{alumni.length}</span> alumni
                {selectedIndustry !== 'All' && <span> in <span className="text-primary">{selectedIndustry}</span></span>}
            </div>

            {/* Alumni Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumni.map((person, idx) => (
                        <Card key={person._id} className="p-0 overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300 border-gray-800/50">
                            {/* Gradient Banner */}
                            <div className={`h-24 bg-gradient-to-br ${gradients[idx % gradients.length]} relative`}>
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,white,transparent)]" />
                            </div>

                            <div className="px-5 pb-6 -mt-10 flex-1 flex flex-col">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-gray-900 border-4 border-[#0d1117] flex items-center justify-center font-bold text-2xl text-primary shadow-xl mb-4">
                                    {getInitials(person.name)}
                                </div>

                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{person.name}</h3>
                                <p className="text-sm text-gray-400 font-medium line-clamp-1">
                                    {person.currentPosition || 'Alumni'} {person.currentCompany ? `@ ${person.currentCompany}` : ''}
                                </p>

                                <div className="mt-4 space-y-2">
                                    {person.location && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span className="truncate">{person.location}</span>
                                        </div>
                                    )}
                                    {person.batchYear && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                                            Class of {person.batchYear}
                                        </div>
                                    )}
                                    {person.industry && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                                            {person.industry}
                                        </div>
                                    )}
                                </div>

                                {(person.skills?.length > 0) && (
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {(person.skills || []).slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-[10px] text-gray-400">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto pt-5 flex gap-2">
                                    <Button className="flex-1 h-9 text-xs">Connect</Button>
                                    <Button variant="outline" className="w-9 h-9 p-0 border-gray-800 shrink-0">
                                        <Mail className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
