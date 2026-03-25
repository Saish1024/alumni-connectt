"use client";

import { useState } from 'react';
import { ai } from '@/lib/api';
import { 
    Upload, FileText, CheckCircle, AlertCircle, 
    ArrowRight, Loader2, Sparkles, Target, 
    MessageSquare, ListChecks, Award
} from 'lucide-react';

export default function ResumeAIPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-indigo-500" />
                        AI Resume Analyzer
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                        Upload your resume and get instant feedback, a placement readiness score, and targeted suggestions to land your dream job.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-indigo-500" />
                            Upload Resume
                        </h2>
                        
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`
                                h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all
                                ${file ? 'border-green-500 bg-green-50/30 dark:bg-green-500/5' : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500 dark:group-hover:border-indigo-400'}
                            `}>
                                {file ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                                        <span className="text-sm font-medium text-slate-900 dark:text-white text-center line-clamp-1 px-4">
                                            {file.name}
                                        </span>
                                        <button className="mt-2 text-xs text-indigo-500 underline" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}>Change file</button>
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-10 h-10 text-slate-400 mb-2" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">PDF Resumes only</span>
                                        <span className="text-xs text-slate-400 mt-1">Click or drag to upload</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500" />
                                Target Job (Optional)
                            </h2>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here to see how well you match..."
                                className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all placeholder:text-slate-500"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                            className={`
                                w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${isAnalyzing || !file 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5'}
                            `}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing with Grok AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Analyze Resume
                                </>
                            )}
                        </button>

                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2 border border-red-100 dark:border-red-500/20">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <div>
                                    <p className="font-bold">Analysis failed</p>
                                    <p className="text-xs opacity-80">{error}. Please ensure the GROQ_API_KEY is correctly set in the backend.</p>
                                </div>
                            </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            {/* Score Card */}
                            <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Award className="w-48 h-48 rotate-12" />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="50%" cy="50%" r="48%"
                                                    className="stroke-white/20 fill-none"
                                                    strokeWidth="8"
                                                />
                                                <circle
                                                    cx="50%" cy="50%" r="48%"
                                                    className="stroke-white fill-none"
                                                    strokeWidth="8"
                                                    strokeDasharray="301.59"
                                                    strokeDashoffset={301.59 - (301.59 * result.placementReadinessScore) / 100}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="absolute text-3xl font-black">
                                                {result.placementReadinessScore}%
                                            </span>
                                        </div>
                                        <span className="mt-2 text-sm font-medium uppercase tracking-widest opacity-80">
                                            Readiness Score
                                        </span>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-2">Analysis Complete!</h3>
                                        <p className="text-indigo-100 text-lg leading-relaxed">
                                            {result.feedback}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Feedback Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <ListChecks className="w-5 h-5 text-indigo-500" />
                                        Key Suggestions
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.suggestions.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 group">
                                                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {i + 1}
                                                </div>
                                                <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-indigo-500" />
                                        Matching Insights
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                        {result.matchDetails}
                                    </p>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">Missing Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missingKeywords.map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded text-xs font-medium border border-red-100 dark:border-red-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">Key Strengths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.keyStrengths.map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs font-medium border border-green-100 dark:border-green-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setResult(null)}
                                className="w-full py-3 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
                            >
                                Start New Analysis <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                                <Loader2 className="w-10 h-10 text-indigo-500/30" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Boost Your Career?</h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                                Your detailed analysis will appear here. No data is stored permanently; analysis happens in real-time.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
