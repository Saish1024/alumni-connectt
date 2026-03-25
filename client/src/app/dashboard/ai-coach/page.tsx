"use client";

import { useState, useRef, useEffect } from 'react';
import { ai } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Send, Bot, User, Loader2, Sparkles, 
    RefreshCcw, ChevronRight, Zap, 
    MessageSquare, Quote, BrainCircuit,
    ShieldCheck, GraduationCap
} from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AICoachPage() {
    const [messages, setMessages] = useState<Message[]>([
        { 
            role: 'assistant', 
            content: "Hello! I'm your AI Placement Coach. I'm here to help you ace your interviews, polish your resume, and navigate your career path. What can we work on today?" 
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
                content: "I encountered an issue connecting to the engine. Please ensure your configuration is correct." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { icon: <Quote className="w-4 h-4" />, label: "Mock Interview", color: "indigo" },
        { icon: <ShieldCheck className="w-4 h-4" />, label: "Resume Review", color: "emerald" },
        { icon: <GraduationCap className="w-4 h-4" />, label: "Career Path", color: "amber" },
        { icon: <BrainCircuit className="w-4 h-4" />, label: "DS & Algo Tips", color: "violet" }
    ];

    return (
        <div className="max-w-full px-4 sm:px-10 h-[calc(100vh-6rem)] flex flex-col xl:flex-row gap-8 animate-in fade-in duration-1000">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[0%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col glass-card min-w-0 h-full relative z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-white/20 dark:border-slate-800 shadow-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="px-8 py-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/20 dark:bg-slate-900/20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                Placement Engine
                                <span className="text-[10px] font-black tracking-widest bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    LIVE
                                </span>
                            </h1>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-1">Ready for consultation</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMessages([messages[0]])}
                        className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-sm"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 flex flex-col scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse self-end w-full' : 'self-start w-full'}`}
                            >
                                <div className={`
                                    w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform duration-500 hover:rotate-6
                                    ${msg.role === 'user' 
                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-indigo-500'}
                                `}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className={`
                                    max-w-[75%] px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed relative
                                    ${msg.role === 'user' 
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10' 
                                        : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 rounded-tl-none border border-white/20 dark:border-slate-700/50 shadow-sm whitespace-pre-wrap'}
                                `}>
                                    {msg.content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={index} className="font-black text-slate-900 dark:text-white underline decoration-indigo-500/30 underline-offset-2">{part.slice(2, -2)}</strong>;
                                        }
                                        return part;
                                    })}
                                    {msg.role === 'assistant' && (
                                        <div className="absolute top-0 left-0 -translate-x-1 -translate-y-1 opacity-10">
                                            <Zap className="w-12 h-12 rotate-[-15deg] fill-current" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-indigo-500 animate-pulse" />
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-4 rounded-[2rem] rounded-tl-none border border-white/20 dark:border-slate-700/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white/20 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Consult the Placement Engine..."
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] px-8 py-5 pr-16 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-2xl min-h-[64px] max-h-40 resize-none placeholder:text-slate-400 font-medium text-base scrollbar-hide"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`
                                absolute right-3 top-1/2 -translate-y-1/2 p-4 rounded-[1.75rem] transition-all duration-300
                                ${!input.trim() || isLoading 
                                    ? 'text-slate-300' 
                                    : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95'}
                            `}
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-3 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                        <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                        Neural Intelligence Active
                        <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>

            {/* Sidebar info Area (XL Only) */}
            <div className="hidden xl:flex w-80 flex-col gap-6 relative z-10 h-full">
                {/* Coaching Modes Card - Now Internally Scrollable */}
                <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <MessageSquare className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="p-8 pb-4 relative z-10 shrink-0">
                        <h3 className="text-xl font-black italic tracking-tight">Coaching Modes</h3>
                        <p className="text-xs text-indigo-100/80 leading-relaxed font-bold mt-1 uppercase tracking-wider">Select a focus area</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
                        <div className="grid grid-cols-1 gap-3">
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setInput(action.label + " help")}
                                    className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all flex items-center gap-4 group text-left outline-none"
                                >
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {action.icon}
                                    </div>
                                    <span className="text-sm font-bold tracking-tight leading-none pt-0.5">{action.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Tips Card - Fixed at bottom */}
                <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 shrink-0">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500" />
                        Live Tips
                    </h3>
                    <div className="space-y-4">
                        {[
                            "Try asking for a mock technical interview for specific roles.",
                            "Ask the coach to analyze your weaknesses based on common questions.",
                            "Get tips on negotiating your first salary package.",
                            "Need coding advice? Ask for DS/Algo pattern explanations."
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="text-xs font-black text-slate-300 dark:text-slate-700 leading-none pt-1">0{i+1}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors cursor-default">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
