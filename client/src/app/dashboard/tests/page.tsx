"use client"
import { useState, useEffect } from 'react';
import { Timer, ArrowRight, Zap, Loader2 } from 'lucide-react';

const quizTopics = ['Python', 'JavaScript', 'Java', 'C++', 'DSA', 'SQL', 'System Design', 'Machine Learning', 'Web Dev', 'React'];

interface Question {
    q: string;
    options: string[];
    correct: number;
}

export default function TestsPage() {
    const [phase, setPhase] = useState<'setup' | 'quiz' | 'results'>('setup');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [numQ, setNumQ] = useState(5);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [showBadge, setShowBadge] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [generating, setGenerating] = useState(false);

    const startQuiz = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, difficulty, numQ })
            });
            const data = await res.json();
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
            } else {
                throw new Error("Failed to load questions");
            }
        } catch (error) {
            console.error("Quiz generation error:", error);
            // Fallback mock questions in case of error
            setQuestions(Array(numQ).fill(0).map((_, i) => ({
                q: `Sample ${topic} question ${i + 1}?`,
                options: ['A', 'B', 'C', 'D'],
                correct: 0
            })));
        } finally {
            setGenerating(false);
            setCurrent(0);
            setAnswers([]);
            setSelected(null);
            setPhase('quiz');
        }
    };

    useEffect(() => {
        if (phase !== 'quiz') return;
        setTimeLeft(30);
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    handleNext(null);
                    return 30;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [current, phase]);

    const handleNext = async (ans: number | null) => {
        const newAnswers = [...answers, ans !== undefined ? ans : selected];
        setAnswers(newAnswers);
        setSelected(null);

        if (current + 1 >= questions.length) {
            setPhase('results');
            const finalScore = newAnswers.filter((a, i) => a === questions[i].correct).length;
            if (finalScore / questions.length >= 0.8) setShowBadge(true);

            // Save result to database
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');

                await fetch(`${baseUrl}/quizzes/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        topic,
                        difficulty,
                        score: finalScore,
                        totalQuestions: questions.length,
                        answers: questions.map((q, idx) => ({
                            q: q.q,
                            selected: newAnswers[idx],
                            correct: q.correct
                        }))
                    })
                });
                console.log('Quiz attempt saved successfully');
            } catch (err) {
                console.error('Failed to save quiz attempt:', err);
            }
        } else {
            setCurrent(c => c + 1);
        }
    };

    const score = answers.filter((a, i) => a === questions[i]?.correct).length;
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

    if (phase === 'results') {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
                {showBadge && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-2xl shadow-amber-500/30">
                        <div className="text-5xl mb-3">🏆</div>
                        <h3 className="text-xl font-[800] mb-1">Achievement Unlocked!</h3>
                        <p className="text-white/80 text-sm">Quiz Master Badge Earned! Score: {pct}%</p>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 text-center">
                    <div className={`text-6xl font-[900] mb-2 ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</div>
                    <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">
                        {pct >= 80 ? '🎉 Excellent!' : pct >= 60 ? '👍 Good Job!' : '😅 Keep Practicing!'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">{score} out of {questions.length} correct answers</p>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Correct', value: score, color: 'text-green-600' },
                            { label: 'Wrong', value: questions.length - score, color: 'text-red-500' },
                            { label: 'Points Earned', value: score * 50, color: 'text-indigo-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                                <div className={`text-2xl font-[800] ${color}`}>{value}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-[500]">{label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setPhase('setup'); setCurrent(0); setAnswers([]); setShowBadge(false); }} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
                            Try Again
                        </button>
                    </div>
                </div>

                {/* Answer Review */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Answer Review</h3>
                    <div className="space-y-4">
                        {questions.map((q, i) => {
                            const userAns = answers[i];
                            const isCorrect = userAns === q.correct;
                            return (
                                <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-700/50' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-700/50'}`}>
                                    <p className="font-[600] text-slate-900 dark:text-white text-sm mb-2">{i + 1}. {q.q}</p>
                                    <p className="text-sm text-green-600 dark:text-green-400 font-[500]">✓ Correct: {q.options[q.correct]}</p>
                                    {!isCorrect && userAns !== null && <p className="text-sm text-red-500 font-[500]">✗ Your answer: {q.options[userAns!]}</p>}
                                    {userAns === null && <p className="text-sm text-amber-500 font-[500]">⏰ Time out</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'quiz') {
        const q = questions[current];
        const progress = ((current) / questions.length) * 100;
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
                {/* Header */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-[600] text-slate-500 dark:text-slate-400">Question {current + 1} of {questions.length}</span>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-[700] text-sm ${timeLeft <= 10 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'}`}>
                            <Timer className="w-4 h-4" /> {timeLeft}s
                        </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Question */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-[700] rounded-full uppercase">{topic}</span>
                        <span className={`px-3 py-1 text-xs font-[700] rounded-full uppercase ${difficulty === 'easy' ? 'bg-green-100 text-green-600' : difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>{difficulty}</span>
                    </div>
                    <h3 className="text-lg font-[700] text-slate-900 dark:text-white mb-6">{q.q}</h3>
                    <div className="space-y-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => setSelected(i)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-[500] text-sm ${selected === i ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-700/50 text-slate-700 dark:text-slate-200'}`}>
                                <span className={`inline-flex w-7 h-7 rounded-lg items-center justify-center text-xs font-[700] mr-3 ${selected === i ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handleNext(selected)}
                        className="w-full mt-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                        {current + 1 >= questions.length ? 'Submit Quiz' : 'Next Question'} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 font-[Inter,sans-serif]">
            <div>
                <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Quiz & Coding Tests</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Test your knowledge and earn points & badges</p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
                <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Select Topic</h3>
                <div className="grid grid-cols-5 gap-2">
                    {quizTopics.map(t => (
                        <button
                            key={t}
                            onClick={() => setTopic(t)}
                            className={`py-2 px-3 rounded-xl text-xs font-[600] transition-all ${topic === t ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
                    <h4 className="font-[700] text-slate-900 dark:text-white mb-3">Difficulty</h4>
                    <div className="flex flex-col gap-2">
                        {['easy', 'medium', 'hard'].map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`py-2.5 px-4 rounded-xl text-sm font-[600] capitalize transition-all ${difficulty === d ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                {d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
                    <h4 className="font-[700] text-slate-900 dark:text-white mb-3">Questions</h4>
                    <div className="flex flex-col gap-2">
                        {[5, 10, 15, 20].map(n => (
                            <button
                                key={n}
                                onClick={() => setNumQ(n)}
                                className={`py-2.5 px-4 rounded-xl text-sm font-[700] transition-all ${numQ === n ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                {n} Questions
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                disabled={!topic || generating}
                onClick={startQuiz}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[800] rounded-2xl shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-3 text-lg">
                {generating ? <><Loader2 className="w-6 h-6 animate-spin" /> Generating with AI...</> : <><Zap className="w-6 h-6" /> Start Quiz</>}
            </button>
        </div>
    );
}
