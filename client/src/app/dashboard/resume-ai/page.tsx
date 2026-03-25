"use client";

import { useState, useEffect } from 'react';
import { ai } from '@/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Upload, FileText, CheckCircle, AlertCircle, 
    ArrowRight, Loader2, Sparkles, Target, 
    Award, ListChecks, Zap, BarChart3, ChevronRight, X
} from 'lucide-react';

export default function ResumeAIPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        if (result?.placementReadinessScore) {
            const timer = setTimeout(() => {
                setAnimatedScore(result.placementReadinessScore);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setAnimatedScore(0);
        }
    }, [result]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a resume first.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription) {
            formData.append('jobDescription', jobDescription);
        }

        try {
            const data = await ai.analyzeResume(formData);
            if (data.error) throw new Error(data.error);
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze resume. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 min-h-screen">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 space-y-6">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">
                            <Zap className="w-2.5 h-2.5 fill-current" />
                            AI Powered Analysis
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Intelligence</span>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-bold">
                            Advanced algorithmic feedback for modern hiring.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Left Panel: Inputs */}
                    <div className="xl:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-slate-800 shadow-2xl p-8 space-y-8"
                        >
                            {/* Upload Area */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Source File</label>
                                <div className="group relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`
                                            relative h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-300 overflow-hidden
                                            ${file 
                                                ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-500/5' 
                                                : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-950/50'}
                                        `}
                                    >
                                        <AnimatePresence mode="wait">
                                            {file ? (
                                                <motion.div 
                                                    key="file"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-col items-center gap-4 text-center"
                                                >
                                                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                        <CheckCircle className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • PDF</p>
                                                    </div>
                                                    <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-widest">Replace File</button>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="no-file"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex flex-col items-center gap-4 text-center"
                                                >
                                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300">
                                                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-slate-700 dark:text-slate-300">Drop your resume here</p>
                                                        <p className="text-xs text-slate-400 font-medium">Click to browse or drag and drop<br/>PDF formats only</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        {/* Animated background decoration for group hover */}
                                        {!file && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Target Job */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Target Role (Optional)</label>
                                <div className="relative">
                                    <Target className="absolute top-4 left-4 w-5 h-5 text-slate-400" />
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the Job Description to check your matching compatibility..."
                                        className="w-full h-40 pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all placeholder:text-slate-400 font-medium text-sm leading-relaxed"
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file || isAnalyzing}
                                    className={`
                                        group w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden
                                        ${isAnalyzing || !file 
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30'}
                                    `}
                                >
                                    <AnimatePresence mode="wait">
                                        {isAnalyzing ? (
                                            <motion.div 
                                                key="loading" 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3"
                                            >
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Running Intelligence...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="ready"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3"
                                            >
                                                <Sparkles className="w-6 h-6 text-indigo-300 group-hover:scale-125 transition-transform" />
                                                <span>Analyze Resume</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    {/* Glossy overlay */}
                                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:left-[150%] transition-all duration-1000" />
                                </button>

                                {error && !result && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl flex items-start gap-3 border border-red-500/20"
                                    >
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span className="leading-relaxed">{error}</span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Panel: Results */}
                    <div className="xl:col-span-8 flex flex-col">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    {/* Top Score Banner */}
                                    <div className="relative group p-8 sm:p-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] text-white shadow-2xl overflow-hidden min-h-[300px] flex flex-col sm:flex-row items-center gap-12 sm:gap-16">
                                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                            <Award className="w-64 h-64 rotate-12" />
                                        </div>
                                        
                                        {/* Animated Circular Gauge */}
                                        <div className="relative flex-shrink-0">
                                            <div className="relative w-48 h-48 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="50%" cy="50%" r="42%"
                                                        className="stroke-white/10 fill-none"
                                                        strokeWidth="8"
                                                    />
                                                    <motion.circle
                                                        cx="50%" cy="50%" r="42%"
                                                        className="stroke-white fill-none"
                                                        strokeWidth="10"
                                                        strokeLinecap="round"
                                                        initial={{ strokeDasharray: "0, 1000" }}
                                                        animate={{ strokeDasharray: `${(animatedScore / 100) * 264}, 1000` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <motion.span 
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="text-6xl font-black tracking-tighter"
                                                    >
                                                        {animatedScore}
                                                    </motion.span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 -mt-1">Score</span>
                                                </div>
                                            </div>
                                            {/* Decorative particles */}
                                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 blur-xl rounded-full" />
                                            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-indigo-400/30 blur-2xl rounded-full" />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left space-y-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                                                <ListChecks className="w-3 h-3" />
                                                Report Generated
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl font-black leading-tight">Expert Analysis Overview</h2>
                                            <p className="text-indigo-100/90 text-lg font-medium leading-relaxed italic max-w-xl">
                                                "{result.feedback}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Detailed Insights Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                                                    <Zap className="w-5 h-5 fill-current" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Critical Suggestions</h3>
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                {result.suggestions.map((item: string, i: number) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="text-xs font-black text-slate-300 dark:text-slate-700 leading-none pt-1">0{i+1}</div>
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                    <BarChart3 className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Role Matching</h3>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">{result.matchDetails}</p>
                                            
                                            <div className="space-y-6 pt-2">
                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3">Target Skill Gaps</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.missingKeywords.map((tag: string, i: number) => (
                                                            <span key={i} className="px-3 py-1.5 bg-red-50/50 dark:bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold ring-1 ring-inset ring-red-500/10">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3">Key Strengths</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.keyStrengths.map((tag: string, i: number) => (
                                                            <span key={i} className="px-3 py-1.5 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold ring-1 ring-inset ring-emerald-500/10">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.button 
                                        whileHover={{ x: 5 }}
                                        onClick={() => setResult(null)}
                                        className="w-full py-6 flex items-center justify-center gap-2 group text-slate-400 hover:text-indigo-500 transition-colors font-bold text-sm tracking-widest uppercase"
                                    >
                                        Run New Intelligence Report <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
                                >
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-indigo-50 dark:bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center relative z-10">
                                            <FileText className="w-12 h-12 text-indigo-500/30" />
                                        </div>
                                        <div className="absolute top-0 right-0 -translate-y-2 translate-x-3 w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center animate-bounce duration-2000">
                                            <Sparkles className="w-5 h-5 text-violet-500" />
                                        </div>
                                    </div>
                                    <div className="max-w-md space-y-4">
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">Awaiting Analysis</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                                            Upload your resume on the left to activate the Intelligence Engine. All parsing happens locally in real-time.
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-slate-400" />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">Industry Matching</span>
                                        </div>
                                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">
                                            <Zap className="w-5 h-5 text-slate-400" />
                                            <span className="text-[10px] font-bold uppercase text-slate-500">Skill Profiling</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
