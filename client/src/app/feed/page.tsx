"use client"
import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { posts as postsApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import {
    MessageSquare, Heart, Share2, MoreVertical,
    Image as ImageIcon, Link as LinkIcon, Send, Loader2
} from 'lucide-react'

// Mock fallback data
const mockPosts = [
    {
        _id: '1', author: { name: 'Sarah Johnson' }, role: 'Product Designer',
        content: "Excited to share that I'll be speaking at the upcoming Alumni Tech Talk about 'The Intersection of AI and UI Design'. Hope to see you all there! 🚀",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: [1, 2, 3], comments: [1, 2, 3, 4, 5],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
        _id: '2', author: { name: 'Michael Chen' }, role: 'Software Engineer @ Amazon',
        content: "We are currently hiring SDE-2s and SDE-3s in my team. If anyone from the batch of 2020-2022 is interested, please DM me for a referral. #Hiring #Referrals",
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        likes: [1, 2], comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
        _id: '3', author: { name: 'Elena Rodriguez' }, role: 'Analyst',
        content: "Quick tip for the students: Don't underestimate the power of networking on LinkedIn. Start connecting with alumni early! 💼",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: [1, 2, 3, 4, 5], comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    }
]

export default function FeedPage() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newPost, setNewPost] = useState('')
    const [posting, setPosting] = useState(false)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const data = await postsApi.list()
            setPosts(data.length > 0 ? data : mockPosts)
        } catch {
            setPosts(mockPosts)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPosts() }, [])

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPost.trim()) return

        setPosting(true)
        try {
            await postsApi.create(newPost)
            setNewPost('')
            fetchPosts()
        } catch {
            // error
        } finally {
            setPosting(false)
        }
    }

    const handleLike = async (postId: string) => {
        try {
            await postsApi.like(postId)
            setLikedIds(prev => {
                const updated = new Set(prev)
                if (updated.has(postId)) updated.delete(postId)
                else updated.add(postId)
                return updated
            })
        } catch {
            // toggle locally for demo
            setLikedIds(prev => {
                const updated = new Set(prev)
                if (updated.has(postId)) updated.delete(postId)
                else updated.add(postId)
                return updated
            })
        }
    }

    const timeSince = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const h = Math.floor(diff / 3600000)
        if (h < 1) return 'Just now'
        if (h < 24) return `${h}h ago`
        return `${Math.floor(h / 24)}d ago`
    }

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-4">
            <header>
                <h1 className="text-3xl font-bold">Community Feed</h1>
                <p className="text-gray-400 mt-1">Connect and share insights with your fellow alumni.</p>
            </header>

            {/* Create Post */}
            <Card className="p-6 border-gray-800 bg-secondary/30">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0">
                        {user ? getInitials(user.name) : 'ME'}
                    </div>
                    <form className="flex-1 space-y-4" onSubmit={handleCreatePost}>
                        <textarea
                            placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'Member'}?`}
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 resize-none min-h-[100px] text-lg"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                            <div className="flex gap-4 text-gray-500">
                                <button type="button" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                                    <ImageIcon className="w-4 h-4" /> Media
                                </button>
                                <button type="button" className="hover:text-primary transition-colors flex items-center gap-2 text-sm">
                                    <LinkIcon className="w-4 h-4" /> Link
                                </button>
                            </div>
                            <Button className="h-10 px-8" type="submit" disabled={!newPost.trim() || posting}>
                                {posting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                Post
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Posts */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => {
                        const isLiked = likedIds.has(post._id) || post.likes?.includes(user?._id)
                        return (
                            <Card key={post._id} className="p-6 border-gray-800 hover:border-gray-700/50 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                                            {getInitials(post.author?.name || 'User')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold flex items-center gap-2">
                                                {post.author?.name}
                                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                                <span className="text-xs text-gray-500 font-normal">{timeSince(post.createdAt)}</span>
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{post.role || (post.author?.role === 'alumni' ? 'Alumni' : 'Student')}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                    {post.image && (
                                        <div className="rounded-2xl overflow-hidden border border-gray-800">
                                            <img src={post.image} alt="Post media" className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800/50 flex items-center justify-between">
                                    <div className="flex gap-8">
                                        <button
                                            className={`flex items-center gap-2 text-sm transition-colors group ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                            onClick={() => handleLike(post._id)}
                                        >
                                            <Heart className={`w-5 h-5 group-hover:fill-red-500 ${isLiked ? 'fill-red-500' : ''}`} />
                                            {post.likes?.length || 0}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                                            <MessageSquare className="w-5 h-5 text-gray-500" />
                                            {post.comments?.length || 0}
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors">
                                        <Share2 className="w-5 h-5" />
                                        Share
                                    </button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
