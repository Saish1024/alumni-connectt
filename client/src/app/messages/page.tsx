"use client"
import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { messages as messagesApi, users as usersApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import {
    Search, Send, Phone, Video, Info,
    MoreHorizontal, User, Loader2, ArrowLeft
} from 'lucide-react'

// Mock fallback contacts
const mockContacts = [
    { _id: '1', name: 'Sarah Johnson', lastMsg: 'I will see you at the tech talk!', timestamp: '10:30 AM', unread: 2, status: 'online' },
    { _id: '2', name: 'Michael Chen', lastMsg: 'Sent the referral link to your email.', timestamp: 'Yesterday', unread: 0, status: 'offline' },
    { _id: '3', name: 'Elena Rodriguez', lastMsg: 'Thanks for the feedback!', timestamp: 'Monday', unread: 0, status: 'away' },
]

export default function MessagesPage() {
    const { user } = useAuth()
    const [contacts, setContacts] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('')
    const [chatHistory, setChatHistory] = useState<any[]>([])
    const [msg, setMsg] = useState('')
    const [loadingContacts, setLoadingContacts] = useState(true)
    const [loadingChat, setLoadingChat] = useState(false)
    const [sending, setSending] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    const fetchContacts = async () => {
        setLoadingContacts(true)
        try {
            const data = await usersApi.list({ role: 'alumni' })
            setContacts(data.length > 0 ? data : mockContacts)
            if (data.length > 0 && !activeTab) setActiveTab(data[0]._id)
            else if (!activeTab) setActiveTab(mockContacts[0]._id)
        } catch {
            setContacts(mockContacts)
            setActiveTab(mockContacts[0]._id)
        } finally {
            setLoadingContacts(false)
        }
    }

    useEffect(() => { fetchContacts() }, [])

    useEffect(() => {
        if (activeTab) {
            const fetchChat = async () => {
                setLoadingChat(true)
                try {
                    const history = await messagesApi.getConversation(activeTab)
                    setChatHistory(history)
                } catch {
                    // fallback mock chat
                    setChatHistory([
                        { _id: 'm1', sender: activeTab, content: 'Hey! Are you coming to the Tech Talk later today?', createdAt: new Date(Date.now() - 3600000).toISOString() },
                        { _id: 'm2', sender: user?._id || 'me', content: 'Yes, definitely! I just saw the notification. See you there!', createdAt: new Date(Date.now() - 1800000).toISOString() }
                    ])
                } finally {
                    setLoadingChat(false)
                }
            }
            fetchChat()
        }
    }, [activeTab, user?._id])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!msg.trim() || sending || !activeTab) return

        setSending(true)
        const tempMsg = { _id: Date.now().toString(), sender: user?._id || 'me', content: msg, createdAt: new Date().toISOString() }
        setChatHistory(prev => [...prev, tempMsg])
        const sentContent = msg
        setMsg('')

        try {
            await messagesApi.send(activeTab, sentContent)
        } catch (err) {
            // failed silently in UI, msg already added for demo
        } finally {
            setSending(false)
        }
    }

    const activeContact = contacts.find(c => c._id === activeTab) || mockContacts.find(c => c._id === activeTab)
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in overflow-hidden">
            {/* Sidebar - Contacts */}
            <Card className="w-80 md:flex flex-col p-0 overflow-hidden border-gray-800 bg-secondary/10 hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <Input placeholder="Search messages..." className="pl-9 h-10 bg-gray-900/50 border-gray-800 text-xs" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingContacts ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                    ) : (
                        contacts.map((contact) => (
                            <button
                                key={contact._id}
                                onClick={() => setActiveTab(contact._id)}
                                className={`w-full p-4 flex gap-4 transition-all hover:bg-gray-800/40 text-left border-l-2 ${activeTab === contact._id ? 'bg-primary/5 border-primary' : 'border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400 shadow-inner">
                                        {getInitials(contact.name)}
                                    </div>
                                    {contact.status === 'online' && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#12161d]" />
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                                        <span className="text-[10px] text-gray-500 flex-shrink-0">{contact.timestamp || 'Now'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate line-clamp-1">{contact.lastMsg || 'No messages yet'}</p>
                                </div>
                                {contact.unread > 0 && (
                                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold self-center shadow-lg shadow-primary/20">
                                        {contact.unread}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col p-0 border-gray-800 bg-secondary/10 overflow-hidden shadow-2xl">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/20 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 md:hidden"><ArrowLeft className="w-4 h-4" /></Button>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                            {activeContact ? getInitials(activeContact.name) : '?'}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{activeContact?.name || 'Select a chat'}</h3>
                            <p className="text-[10px] text-green-500 font-medium">Active Now</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white hover:bg-gray-800"><Phone className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white hover:bg-gray-800"><Video className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 text-gray-400 hover:text-white hover:bg-gray-800/50"><MoreHorizontal className="w-4 h-4" /></Button>
                    </div>
                </div>

                {/* Messages Window */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {loadingChat ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : (
                        chatHistory.map((m) => {
                            const isMe = m.sender === (user?._id || 'me')
                            return (
                                <div key={m._id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border ${isMe ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-gray-800 border-gray-700 text-gray-400'
                                        }`}>
                                        {isMe ? getInitials(user?.name || 'Me') : getInitials(activeContact?.name || 'SJ')}
                                    </div>
                                    <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                                        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                                            ? 'bg-primary text-white rounded-tr-none'
                                            : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700/50'
                                            }`}>
                                            {m.content}
                                        </div>
                                        <span className="text-[10px] text-gray-500 mx-1 opacity-70">
                                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-6 border-t border-gray-800 bg-gray-900/40 backdrop-blur-md">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative group">
                            <Input
                                placeholder="Type a message..."
                                className="pr-12 h-14 bg-gray-900/80 border-gray-800 text-sm focus:border-primary/50 transition-all rounded-2xl"
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                            />
                            <button
                                type="submit"
                                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all p-2 rounded-xl scale-95 hover:scale-100 ${msg.trim() ? 'text-primary' : 'text-gray-600 pointer-events-none'
                                    }`}
                                disabled={!msg.trim() || sending}
                            >
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    )
}
