"use client"
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { events as eventsApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import {
    Calendar, MapPin, Clock, Users, Video, Plus,
    Search, Loader2, X, CheckCircle
} from 'lucide-react'

// Mock data fallback
const mockEvents = [
    {
        _id: '1',
        title: 'Alumni Tech Talk: AI & Future of Work',
        organizer: { name: 'Tech Committee' },
        date: 'March 15, 2026',
        time: '6:30 PM - 8:00 PM',
        location: 'Virtual (Zoom)',
        attendees: [],
        attendeeCount: 156,
        image: 'https://images.unsplash.com/photo-1591115765373-520b7a3f7294?w=800&q=80',
        type: 'Webinar'
    },
    {
        _id: '2',
        title: 'Annual Alumni Networking Gala',
        organizer: { name: 'Alumni Association' },
        date: 'April 02, 2026',
        time: '7:00 PM onwards',
        location: 'Grand Ballroom, Hilton',
        attendees: [],
        attendeeCount: 420,
        image: 'https://images.unsplash.com/photo-1511578334221-ec853f24090c?w=800&q=80',
        type: 'Meetup'
    },
    {
        _id: '3',
        title: 'UI/UX Workshop for Aspiring Designers',
        organizer: { name: 'Sarah Johnson (Class of 2019)' },
        date: 'March 20, 2026',
        time: '10:00 AM - 1:00 PM',
        location: 'Design Studio B-4',
        attendees: [],
        attendeeCount: 45,
        image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80',
        type: 'Workshop'
    }
]

export default function EventsPage() {
    const { user } = useAuth()
    const [allEvents, setAllEvents] = useState<any[]>([])
    const [filter, setFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [creating, setCreating] = useState(false)
    const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set())

    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'Webinar',
        image: ''
    })

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const data = await eventsApi.list()
            setAllEvents(data.length > 0 ? data : mockEvents)
        } catch {
            setAllEvents(mockEvents)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchEvents() }, [])

    const handleRegister = async (eventId: string) => {
        try {
            await eventsApi.register(eventId)
            setRegisteredIds(prev => new Set([...prev, eventId]))
        } catch (err) {
            // Already registered or error
            setRegisteredIds(prev => new Set([...prev, eventId]))
        }
    }

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)
        try {
            await eventsApi.create(form)
            setShowCreateModal(false)
            setForm({ title: '', description: '', date: '', time: '', location: '', type: 'Webinar', image: '' })
            fetchEvents()
        } catch {
            // Error handling
        } finally {
            setCreating(false)
        }
    }

    const filteredEvents = filter === 'All'
        ? allEvents
        : allEvents.filter(e => e.type === filter)

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Events & Webinars</h1>
                    <p className="text-gray-400 mt-1">Connect and learn from industry experts.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-800">My Registrations</Button>
                    {(user?.role === 'alumni' || user?.role === 'admin') && (
                        <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-4 h-4" /> Organize Event
                        </Button>
                    )}
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-800 gap-8 overflow-x-auto no-scrollbar">
                {['All', 'Webinar', 'Meetup', 'Workshop'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`pb-4 text-sm font-semibold transition-all whitespace-nowrap px-2 ${filter === t ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {t}s
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => {
                        const isRegistered = registeredIds.has(event._id)
                        return (
                            <Card key={event._id} className="p-0 overflow-hidden border-gray-800 bg-secondary/20 flex flex-col group h-full hover:border-primary/50 transition-all">
                                <div className="relative h-48">
                                    <img
                                        src={event.image || (event.type === 'Webinar' ? 'https://images.unsplash.com/photo-1591115765373-520b7a3f7294?w=800&q=80' : 'https://images.unsplash.com/photo-1511578334221-ec853f24090c?w=800&q=80')}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                        {event.type}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider mb-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {event.date}
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                                    <p className="text-xs text-gray-500 mb-6">By {event.organizer?.name || 'Community Member'}</p>

                                    <div className="space-y-3 mt-auto border-t border-gray-800 pt-6">
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            {(event.attendees?.length || 0) + (event.attendeeCount || 0)} Registered
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Button
                                            className={`w-full h-11 gap-2 ${isRegistered ? 'bg-green-600 hover:bg-green-500' : ''}`}
                                            disabled={isRegistered}
                                            onClick={() => handleRegister(event._id)}
                                        >
                                            {isRegistered ? <><CheckCircle className="w-4 h-4" /> Registered</> : 'Register Now'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Organize Event</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Event Title *</label>
                                <input required className="w-full h-11 bg-gray-900 border border-gray-700 rounded-xl px-4 text-sm text-white"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Date *</label>
                                    <input required type="date" className="w-full h-11 bg-gray-900 border border-gray-700 rounded-xl px-4 text-sm text-white"
                                        value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1.5 block">Time *</label>
                                    <input required placeholder="6:00 PM" className="w-full h-11 bg-gray-900 border border-gray-700 rounded-xl px-4 text-sm text-white"
                                        value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Location / Link *</label>
                                <input required className="w-full h-11 bg-gray-900 border border-gray-700 rounded-xl px-4 text-sm text-white"
                                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1.5 block">Type</label>
                                <select className="w-full h-11 bg-gray-900 border border-gray-700 rounded-xl px-4 text-sm text-white"
                                    value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option>Webinar</option>
                                    <option>Meetup</option>
                                    <option>Workshop</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button className="flex-1" disabled={creating}>
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}
