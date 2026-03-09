"use client"
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Bell, Briefcase, Calendar, MessageSquare, Users, CheckCheck, X } from 'lucide-react'

const notifications = [
    { id: '1', type: 'connection', title: 'Sarah Johnson wants to connect', time: '2h ago', read: false, icon: Users, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' },
    { id: '2', type: 'job', title: 'New job posted by Michael Chen at Amazon', time: '5h ago', read: false, icon: Briefcase, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' },
    { id: '3', type: 'event', title: 'Alumni Tech Talk starts in 1 hour', time: '1h ago', read: true, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: '4', type: 'message', title: 'New message from Elena Rodriguez', time: '3h ago', read: true, icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: '5', type: 'connection', title: 'David Wilson accepted your connection request', time: '1d ago', read: true, icon: Users, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' },
]

export default function NotificationsPage() {
    const [items, setItems] = useState(notifications)

    const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })))
    const dismiss = (id: string) => setItems(prev => prev.filter(n => n.id !== id))

    const unread = items.filter(n => !n.read).length

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-gray-400 mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
                </div>
                <Button variant="outline" size="sm" onClick={markAllRead} className="border-gray-800 gap-2">
                    <CheckCheck className="w-4 h-4" /> Mark all read
                </Button>
            </header>

            <div className="space-y-3">
                {items.map(notif => (
                    <Card key={notif.id} className={`flex items-center gap-4 p-5 border-gray-800 transition-all ${!notif.read ? 'border-l-2 border-l-[#7C3AED]' : ''}`}>
                        <div className={`w-11 h-11 rounded-2xl ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                            <notif.icon className={`w-5 h-5 ${notif.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-400' : 'text-white font-medium'}`}>{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />}
                            <button onClick={() => dismiss(notif.id)} className="text-gray-600 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
