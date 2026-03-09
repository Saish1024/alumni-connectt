import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Zap, ArrowRight, Trophy, RotateCcw,
  ChevronLeft, ChevronRight, BookOpen, Target, BarChart3, Award,
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

type QuizState = 'setup' | 'quiz' | 'result' | 'review';

const topics = [
  { id: 'dsa', label: 'DSA', icon: '🔢', color: 'from-indigo-500 to-purple-600' },
  { id: 'python', label: 'Python', icon: '🐍', color: 'from-yellow-500 to-orange-600' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡', color: 'from-yellow-400 to-amber-500' },
  { id: 'java', label: 'Java', icon: '☕', color: 'from-red-500 to-orange-600' },
  { id: 'sql', label: 'SQL', icon: '🗄️', color: 'from-blue-500 to-cyan-600' },
  { id: 'os', label: 'OS Concepts', icon: '💻', color: 'from-violet-500 to-purple-600' },
  { id: 'networking', label: 'Networking', icon: '🌐', color: 'from-teal-500 to-emerald-600' },
  { id: 'ml', label: 'Machine Learning', icon: '🤖', color: 'from-pink-500 to-rose-600' },
];

const difficulties = [
  { id: 'easy', label: 'Easy', desc: 'Beginner friendly', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-300 dark:border-green-700' },
  { id: 'medium', label: 'Medium', desc: 'Intermediate level', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-700' },
  { id: 'hard', label: 'Hard', desc: 'Advanced challenges', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-700' },
];

const questionCounts = [5, 10, 15, 20];

const sampleQuestions = [
  {
    id: 1,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
    explanation: 'Binary search divides the search space in half at each step, resulting in O(log n) time complexity.',
  },
  {
    id: 2,
    question: 'Which data structure uses LIFO (Last In First Out) order?',
    options: ['Queue', 'Stack', 'Heap', 'Linked List'],
    correct: 1,
    explanation: 'A Stack follows LIFO order — the last element added is the first one to be removed.',
  },
  {
    id: 3,
    question: 'What is the worst-case time complexity of QuickSort?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correct: 1,
    explanation: 'QuickSort has O(n²) worst-case when the pivot is always the smallest or largest element.',
  },
  {
    id: 4,
    question: 'Which of these is NOT a stable sorting algorithm?',
    options: ['Merge Sort', 'Bubble Sort', 'Quick Sort', 'Insertion Sort'],
    correct: 2,
    explanation: 'Quick Sort is not stable by default. Merge Sort, Bubble Sort, and Insertion Sort are stable.',
  },
  {
    id: 5,
    question: 'What is the space complexity of recursive DFS on a tree with n nodes?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 1,
    explanation: 'Recursive DFS uses the call stack, which can grow up to O(n) in the worst case (skewed tree).',
  },
];

export default function Quiz() {
  const [state, setState] = useState<QuizState>('setup');
  const [topic, setTopic] = useState('dsa');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQ, setNumQ] = useState(5);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [reviewQ, setReviewQ] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  const questions = sampleQuestions.slice(0, numQ > sampleQuestions.length ? sampleQuestions.length : numQ);

  useEffect(() => {
    if (state !== 'quiz') return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, state]);

  const handleStart = () => {
    setState('quiz');
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setTimeLeft(30);
    setScore(0);
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected ?? -1];
    setAnswers(newAnswers);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setTimeLeft(30);
    } else {
      // Calculate score
      const correctCount = newAnswers.filter((a, i) => a === questions[i].correct).length;
      setScore(correctCount);
      setState('result');
      if (correctCount / questions.length >= 0.8) {
        setTimeout(() => setShowBadge(true), 800);
      }
    }
  };

  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const radialData = [{ value: scorePercent, fill: scorePercent >= 80 ? '#22c55e' : scorePercent >= 60 ? '#f59e0b' : '#ef4444' }];

  if (state === 'setup') {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Quiz & Tests</h1>
          </div>
          <p className="text-indigo-200">Challenge yourself, earn badges, and climb the leaderboard!</p>
        </div>

        {/* Topic Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Topic</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  topic === t.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-2xl block mb-2">{t.icon}</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Select Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  difficulty === d.id ? `${d.border} ${d.bg}` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <p className={`font-semibold ${d.color}`}>{d.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Number of Questions</h3>
          <div className="flex gap-3">
            {questionCounts.map(n => (
              <button
                key={n}
                onClick={() => setNumQ(n)}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                  numQ === n
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-indigo-500/30 hover:scale-[1.02]"
        >
          <Zap className="w-5 h-5" /> Start Quiz — {numQ} Questions • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </button>
      </div>
    );
  }

  if (state === 'quiz') {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
      <div className="max-w-2xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Question {current + 1} of {questions.length}
            </span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold ${
              timeLeft <= 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
              'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
            }`}>
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-medium uppercase tracking-wide">
              {topics.find(t => t.id === topic)?.icon} {topics.find(t => t.id === topic)?.label}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
              difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
              'bg-red-100 dark:bg-red-900/30 text-red-600'
            }`}>{difficulty}</div>
          </div>
          <h2 className="text-gray-900 dark:text-white mb-6 leading-relaxed">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style = 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
              if (selected !== null) {
                if (idx === q.correct) style = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                else if (idx === selected && selected !== q.correct) style = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                else style = 'border-gray-200 dark:border-gray-700 opacity-60';
              } else if (selected === idx) {
                style = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 border-current">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {selected !== null && idx === q.correct && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                  {selected !== null && idx === selected && selected !== q.correct && (
                    <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${
              selected === q.correct
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              <p className="font-medium mb-1">{selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            selected !== null
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow-lg'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          {current < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (state === 'result') {
    return (
      <div className="max-w-2xl">
        {/* Badge popup */}
        {showBadge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBadge(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4 animate-bounce-once">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Badge Earned!</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                {topics.find(t => t.id === topic)?.label} Expert
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Scored {scorePercent}% on {difficulty} difficulty!</p>
              <button onClick={() => setShowBadge(false)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90">
                Awesome! 🎉
              </button>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quiz Complete! 🎉</h2>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: '#f3f4f6' }} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 dark:fill-white text-3xl font-bold">
                {scorePercent}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{questions.length - score}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wrong</p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">+{score * 10}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Points Earned</p>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-700 dark:text-amber-400 font-medium">
              {scorePercent >= 80 ? '🏆 Excellent! You\'ve earned a badge!' :
               scorePercent >= 60 ? '👍 Good job! Keep practicing to earn badges.' :
               '📚 Keep learning! Review the answers below.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setState('review')}
            className="flex-1 py-3 rounded-xl border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Review Answers
          </button>
          <button
            onClick={() => setState('setup')}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Review State
  const rq = questions[reviewQ];
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Answer Review</h2>
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setReviewQ(i)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                i === reviewQ ? 'bg-indigo-500 text-white' :
                answers[i] === questions[i].correct ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                'bg-red-100 dark:bg-red-900/30 text-red-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            answers[reviewQ] === rq.correct
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
              : 'bg-red-100 dark:bg-red-900/30 text-red-600'
          }`}>
            {answers[reviewQ] === rq.correct ? '✅ Correct' : '❌ Incorrect'}
          </span>
        </div>
        <h3 className="text-gray-900 dark:text-white mb-5 leading-relaxed">{rq.question}</h3>
        <div className="space-y-3">
          {rq.options.map((opt, idx) => (
            <div key={idx} className={`px-4 py-3 rounded-xl border-2 flex items-center gap-3 ${
              idx === rq.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
              idx === answers[reviewQ] && answers[reviewQ] !== rq.correct ? 'border-red-400 bg-red-50 dark:bg-red-900/20 opacity-70' :
              'border-gray-200 dark:border-gray-700 opacity-50'
            }`}>
              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 border-current">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm flex-1">{opt}</span>
              {idx === rq.correct && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
          <p className="font-medium mb-1">💡 Explanation</p>
          <p>{rq.explanation}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setReviewQ(Math.max(0, reviewQ - 1))} disabled={reviewQ === 0}
          className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={() => reviewQ < questions.length - 1 ? setReviewQ(reviewQ + 1) : setState('result')}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          {reviewQ < questions.length - 1 ? <><span>Next</span> <ChevronRight className="w-4 h-4" /></> : <><span>Back to Results</span></>}
        </button>
      </div>
    </div>
  );
}
