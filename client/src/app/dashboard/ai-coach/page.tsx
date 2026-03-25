"use client";

import { useState, useRef, useEffect } from 'react';
import { ai } from '@/lib/api';
import { 
    Send, Bot, User, Loader2, Sparkles, 
    MessageSquare, RefreshCcw, Quote, ChevronRight
} from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AICoachPage() {
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'assistant', 
            content: "Hello! I'm your AI Placement Coach powered by Grok AI. I can help you with mock interviews, career advice, or specific questions about your industry. What's on your mind today?" 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await ai.chat(newMessages);
            if (response.error) throw new Error(response.error);
            setMessages([...newMessages, { role: 'assistant', content: response.content }]);
        } catch (err: any) {
            setMessages([...newMessages, { 
                role: 'assistant', 
                content: "I'm sorry, I encountered an error connecting to the AI service. Please make sure your API key is correctly configured in the backend environment." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedTopics = [
        "How do I explain a gap in my resume?",
        "Mock interview for a React Developer role",
        "Tips for answering 'What are your weaknesses?'",
        "Best way to negotiate salary as a fresher"
    ];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            AI Placement Coach
                            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                                AI POWERED
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Available 24/7 for your career preparation</p>
                    </div>
                </div>
                <button 
                    onClick={() => setMessages([messages[0]])}
                    className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    title="Clear Chat"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {messages.map((msg, i) => (
                        <div 
                            key={i} 
                            className={`flex items-start gap-4 transition-all duration-300 ${msg.role === 'user' ? 'flex-row-reverse animate-in slide-in-from-right-4' : 'animate-in slide-in-from-left-4'}`}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                                ${msg.role === 'user' 
                                    ? 'bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 text-indigo-600' 
                                    : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800 text-indigo-500'}
                            `}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`
                                max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <Bot className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-700/50">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 relative z-10 backdrop-blur-md">
                    {messages.length === 1 && (
                        <div className="mb-4">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2 px-2">Common Topics</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedTopics.map((topic, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setInput(topic)}
                                        className="text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all flex items-center gap-2 group"
                                    >
                                        {topic}
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask the AI Placement Coach..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm min-h-[56px] max-h-32 resize-none placeholder:text-slate-400"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`
                                absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all
                                ${!input.trim() || isLoading 
                                    ? 'text-slate-300' 
                                    : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95'}
                            `}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        AI Powered by Groq
                    </div>
                </div>
            </div>
        </div>
    );
}
