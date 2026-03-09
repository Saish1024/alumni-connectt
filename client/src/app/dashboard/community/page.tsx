"use client"
import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Send, Image, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { posts as apiPosts } from '@/lib/api';

export default function CommunityPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await apiPosts.list();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!newPost.trim()) return;
        setSubmitting(true);
        try {
            const created = await apiPosts.create(newPost.trim());
            setPosts(prev => [created, ...prev]);
            setNewPost('');
        } catch (err) {
            console.error('Failed to create post:', err);
            alert('Failed to create post.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id: string) => {
        try {
            await apiPosts.like(id);
            setPosts(prev => prev.map(p => {
                if (p._id === id) {
                    const hasLiked = p.likes?.includes((user as any)?._id);
                    return {
                        ...p,
                        likes: hasLiked
                            ? p.likes.filter((lid: string) => lid !== (user as any)?._id)
                            : [...(p.likes || []), (user as any)?._id]
                    };
                }
                return p;
            }));
        } catch (err) {
            console.error('Failed to like post:', err);
        }
    };

    const getTimeSince = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const hrs = Math.floor(diff / 3600000);
        if (hrs < 1) return 'Just now';
        if (hrs < 24) return `${hrs} hrs ago`;
        return `${Math.floor(hrs / 24)} days ago`;
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Community &amp; Forums</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Discuss, ask questions, and network with peers and alumni</p>
            </div>

            {/* Create Post */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm flex-shrink-0 shadow-inner">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newPost} onChange={e => setNewPost(e.target.value)}
                            placeholder="Ask a question or share something with the community..."
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 placeholder:text-sm resize-none mb-3 pt-2 outline-none"
                            rows={2}
                        />
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                                <Image className="w-5 h-5" />
                            </button>
                            <button
                                disabled={!newPost.trim() || submitting}
                                onClick={handlePost}
                                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 shadow-md flex items-center gap-2">
                                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No posts yet</p>
                    <p className="text-sm">Be the first to share something!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => {
                        const hasLiked = post.likes?.includes((user as any)?._id);
                        return (
                            <div key={post._id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {post.author?.profileImage ? (
                                            <img src={post.author.profileImage} alt={post.author.name} className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-800" />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
                                                {post.author?.name?.charAt(0) || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-[700] text-slate-900 dark:text-white">{post.author?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                                {post.author?.role} · {getTimeSince(post.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-[600] transition-all ${hasLiked ? 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-pink-600' : ''}`} /> {post.likes?.length || 0}
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-[600] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                            <MessageSquare className="w-4 h-4" /> {post.comments?.length || 0}
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-[600] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
