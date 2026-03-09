import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Calendar, Code2, Briefcase, FileText,
  Trophy, Award, MessageSquare, Bell, Star,
  BookOpen, Clock, TrendingUp, ArrowRight, Filter, Search,
  ChevronRight, Play, Check, X, Zap, Target, Download,
  Share2, Upload, Timer, BarChart2, Plus, Heart, Send,
  ThumbsUp, MessageCircle, Crown, Medal, Flame,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', key: 'overview' },
  { icon: Users, label: 'Find Mentors', key: 'mentors' },
  { icon: Calendar, label: 'My Sessions', key: 'sessions' },
  { icon: Code2, label: 'Quiz & Tests', key: 'quiz' },
  { icon: Briefcase, label: 'Jobs & Referrals', key: 'jobs', badge: 3 },
  { icon: FileText, label: 'Resume Review', key: 'resume', badge: 1 },
  { icon: Trophy, label: 'Leaderboard', key: 'leaderboard' },
  { icon: Award, label: 'Certificates', key: 'certificates' },
  { icon: MessageSquare, label: 'Community', key: 'community' },
];

const notifications = [
  { id: 1, text: 'Arjun Mehta accepted your mentoring request!', time: '2 min ago', read: false },
  { id: 2, text: 'New job referral posted by Priya Sharma at Google', time: '1 hr ago', read: false },
  { id: 3, text: 'Your quiz score: 92% in Python! 🎉', time: '3 hrs ago', read: true },
  { id: 4, text: 'Resume reviewed by Siddharth Nair', time: '1 day ago', read: true },
];

const activityData = [
  { day: 'Mon', sessions: 1, quizzes: 3, score: 78 },
  { day: 'Tue', sessions: 2, quizzes: 2, score: 82 },
  { day: 'Wed', sessions: 0, quizzes: 4, score: 88 },
  { day: 'Thu', sessions: 1, quizzes: 1, score: 75 },
  { day: 'Fri', sessions: 3, quizzes: 5, score: 92 },
  { day: 'Sat', sessions: 2, quizzes: 3, score: 85 },
  { day: 'Sun', sessions: 1, quizzes: 2, score: 89 },
];

const topicData = [
  { name: 'Python', value: 35, color: '#6366f1' },
  { name: 'DSA', value: 25, color: '#8b5cf6' },
  { name: 'JavaScript', value: 20, color: '#06b6d4' },
  { name: 'Java', value: 12, color: '#10b981' },
  { name: 'SQL', value: 8, color: '#f59e0b' },
];

const mentors = [
  { id: 1, name: 'Arjun Mehta', role: 'SDE @ Google', skills: ['React', 'Node.js', 'DSA'], rating: 4.9, sessions: 142, free: true, img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop', available: true },
  { id: 2, name: 'Priya Sharma', role: 'Senior SDE @ Amazon', skills: ['Python', 'ML', 'System Design'], rating: 4.8, sessions: 98, free: false, price: 500, img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop', available: true },
  { id: 3, name: 'Mei Lin', role: 'Data Scientist @ Microsoft', skills: ['Python', 'TensorFlow', 'SQL'], rating: 4.9, sessions: 76, free: false, price: 800, img: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?w=100&h=100&fit=crop', available: false },
  { id: 4, name: 'Rahul Verma', role: 'Fullstack Dev @ Flipkart', skills: ['JavaScript', 'React', 'AWS'], rating: 4.7, sessions: 54, free: true, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', available: true },
  { id: 5, name: 'Anjali Singh', role: 'PM @ Zomato', skills: ['Product', 'Analytics', 'Agile'], rating: 4.8, sessions: 89, free: false, price: 600, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', available: true },
  { id: 6, name: 'Vikram Patel', role: 'ML Engineer @ Uber', skills: ['PyTorch', 'Python', 'Statistics'], rating: 4.6, sessions: 43, free: true, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', available: true },
];

const sessions = [
  { id: 1, mentor: 'Arjun Mehta', topic: 'DSA & Competitive Programming', date: 'Mar 7, 2026', time: '4:00 PM', duration: '60 min', status: 'upcoming', type: 'free', img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop' },
  { id: 2, mentor: 'Priya Sharma', topic: 'Resume Review & Interview Prep', date: 'Mar 10, 2026', time: '6:30 PM', duration: '45 min', status: 'upcoming', type: 'paid', img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop' },
  { id: 3, mentor: 'Rahul Verma', topic: 'React & Frontend Best Practices', date: 'Feb 28, 2026', time: '5:00 PM', duration: '60 min', status: 'completed', type: 'free', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 5 },
  { id: 4, mentor: 'Anjali Singh', topic: 'Product Management Career Path', date: 'Feb 20, 2026', time: '7:00 PM', duration: '45 min', status: 'completed', type: 'paid', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', rating: 4 },
];

const jobs = [
  { id: 1, company: 'Google', role: 'Software Engineer Intern', location: 'Bangalore', type: 'Internship', skills: ['Python', 'Go', 'Distributed Systems'], referredBy: 'Arjun Mehta', deadline: 'Mar 15', salary: '₹80K/mo', isNew: true },
  { id: 2, company: 'Microsoft', role: 'SDE-1', location: 'Hyderabad', type: 'Full-time', skills: ['C#', '.NET', 'Azure'], referredBy: 'Mei Lin', deadline: 'Mar 20', salary: '₹28 LPA', isNew: true },
  { id: 3, company: 'Amazon', role: 'Data Science Intern', location: 'Remote', type: 'Internship', skills: ['Python', 'ML', 'SQL'], referredBy: 'Priya Sharma', deadline: 'Mar 25', salary: '₹60K/mo', isNew: false },
  { id: 4, company: 'Flipkart', role: 'Frontend Engineer', location: 'Bangalore', type: 'Full-time', skills: ['React', 'TypeScript', 'Node.js'], referredBy: 'Rahul Verma', deadline: 'Apr 1', salary: '₹18 LPA', isNew: false },
];

const leaderboardData = [
  { rank: 1, name: 'Riya Kapoor', points: 4850, badges: 12, quizzes: 48, streak: 30, avatar: '🏆' },
  { rank: 2, name: 'Tanmay Shah', points: 4420, badges: 10, quizzes: 43, streak: 25, avatar: '🥈' },
  { rank: 3, name: 'You (Aditya)', points: 3980, badges: 8, quizzes: 39, streak: 18, avatar: '🥉', isYou: true },
  { rank: 4, name: 'Pooja Nair', points: 3650, badges: 7, quizzes: 35, streak: 15, avatar: '' },
  { rank: 5, name: 'Kartik Joshi', points: 3200, badges: 6, quizzes: 30, streak: 12, avatar: '' },
  { rank: 6, name: 'Shreya Iyer', points: 2980, badges: 5, quizzes: 28, streak: 10, avatar: '' },
  { rank: 7, name: 'Nikhil Rao', points: 2750, badges: 5, quizzes: 25, streak: 8, avatar: '' },
];

const certificates = [
  { id: 1, title: 'Python Programming Mastery', issuer: 'Alumni Connect', date: 'Feb 2026', skills: ['Python', 'OOP', 'Data Structures'], color: 'from-blue-500 to-cyan-600' },
  { id: 2, title: 'Data Structures & Algorithms', issuer: 'Alumni Connect', date: 'Jan 2026', skills: ['Arrays', 'Trees', 'Dynamic Programming'], color: 'from-purple-500 to-violet-600' },
  { id: 3, title: 'React.js Development', issuer: 'Alumni Connect', date: 'Dec 2025', skills: ['React', 'Hooks', 'Context API'], color: 'from-green-500 to-emerald-600' },
];

const communityPosts = [
  { id: 1, author: 'Priya Sharma', role: 'SDE @ Amazon', time: '2 hrs ago', content: 'Just cracked Google L5! 🎉 Here are the resources I used for prep...', likes: 124, comments: 38, img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop', liked: false },
  { id: 2, author: 'Rahul Verma', role: 'Fullstack Dev @ Flipkart', time: '5 hrs ago', content: 'Top 5 React performance optimization tips every developer should know...', likes: 87, comments: 22, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', liked: true },
  { id: 3, author: 'Arjun Mehta', role: 'SDE @ Google', time: '1 day ago', content: 'Free webinar this weekend: System Design for FAANG interviews. Register now! 🚀', likes: 215, comments: 67, img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop', liked: false },
];

const quizTopics = ['Python', 'JavaScript', 'Java', 'C++', 'DSA', 'SQL', 'System Design', 'Machine Learning', 'Web Dev', 'React'];

const quizQuestions: Record<string, { q: string; options: string[]; correct: number }[]> = {
  default: [
    { q: 'What does DSA stand for?', options: ['Data Structure and Algorithm', 'Dynamic System Analysis', 'Data Science Application', 'Distributed System Architecture'], correct: 0 },
    { q: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1 },
    { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'], correct: 2 },
    { q: 'Which sorting algorithm has best average case O(n log n)?', options: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'], correct: 1 },
    { q: 'What is a Hash Table?', options: ['A sorted array', 'A key-value store', 'A linked list', 'A binary tree'], correct: 1 },
  ],
};

// ===================== OVERVIEW SECTION =====================
function OverviewSection({ setSection }: { setSection: (s: string) => void }) {
  const aiMentors = mentors.slice(0, 3);
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
            <h2 className="text-2xl font-[800]">Aditya Kumar</h2>
            <p className="text-white/80 text-sm mt-1">B.Tech CSE · 3rd Year · IIT Delhi</p>
            <div className="flex items-center gap-2 mt-3">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-[600] text-orange-200">18-day learning streak!</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSection('mentors')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
              Find Mentor
            </button>
            <button onClick={() => setSection('quiz')} className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Sessions Booked', value: '12', change: '+3 this month', icon: Calendar, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Quizzes Taken', value: '39', change: '+8 this week', icon: Code2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Jobs Applied', value: '7', change: '2 interviews', icon: Briefcase, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Total Points', value: '3,980', change: 'Rank #3', icon: Trophy, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
        ].map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-[800] text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-[500] mt-0.5">{label}</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-[600] mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[700] text-slate-900 dark:text-white">Weekly Activity</h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Area key="score" type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#scoreGrad)" name="Quiz Score" />
              <Area key="quizzes" type="monotone" dataKey="quizzes" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGrad)" name="Quizzes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Topic breakdown */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Topics Practiced</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {topicData.map((entry, i) => <Cell key={`student-topic-${i}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {topicData.map(t => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-[500]">{t.name}</span>
                </div>
                <span className="font-[700] text-slate-900 dark:text-white">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Mentor Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-[700] text-slate-900 dark:text-white">AI Mentor Recommendations</h3>
          </div>
          <button onClick={() => setSection('mentors')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {aiMentors.map(m => (
            <div key={m.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img src={m.img} alt={m.name} className="w-12 h-12 rounded-xl object-cover" />
                  {m.available && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" />}
                </div>
                <div>
                  <div className="font-[700] text-slate-900 dark:text-white text-sm">{m.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{m.role}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {m.skills.slice(0, 3).map(s => (
                  <span key={s} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-[500]">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-500 font-[700]">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating}
                </div>
                <span className={`text-xs font-[700] px-2 py-0.5 rounded-full ${m.free ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>
                  {m.free ? 'Free' : `₹${m.price}/hr`}
                </span>
              </div>
              <button className="w-full mt-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20">
                Book Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[700] text-slate-900 dark:text-white">Upcoming Sessions</h3>
          <button onClick={() => setSection('sessions')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {sessions.filter(s => s.status === 'upcoming').map(s => (
            <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <img src={s.img} alt={s.mentor} className="w-10 h-10 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-[600] text-slate-900 dark:text-white text-sm truncate">{s.topic}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">with {s.mentor} · {s.date} at {s.time}</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-105 transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 flex-shrink-0">
                <Play className="w-3 h-3 fill-white" /> Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== MENTORS SECTION =====================
function MentorsSection() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookModal, setBookModal] = useState<null | typeof mentors[0]>(null);
  const [bookingDone, setBookingDone] = useState(false);

  const filtered = mentors.filter(m => {
    if (filter === 'free' && !m.free) return false;
    if (filter === 'paid' && m.free) return false;
    if (filter === 'available' && !m.available) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Find Mentors</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Connect with alumni who can guide your career journey</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, or skill..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'free', 'paid', 'available'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-[600] capitalize transition-all ${filter === f ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => (
          <div key={m.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <img src={m.img} alt={m.name} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                {m.available && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full" />}
              </div>
              <div className="flex-1">
                <div className="font-[700] text-slate-900 dark:text-white">{m.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{m.role}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-[700] text-slate-800 dark:text-white">{m.rating}</span>
                  <span className="text-xs text-slate-400">({m.sessions} sessions)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {m.skills.map(s => (
                <span key={s} className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-[500]">{s}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-[700] ${m.available ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                {m.available ? '● Available' : '● Unavailable'}
              </span>
              <span className={`text-sm font-[700] px-3 py-1 rounded-full ${m.free ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>
                {m.free ? '🆓 Free' : `₹${m.price}/hr`}
              </span>
            </div>
            <button
              onClick={() => { setBookModal(m); setBookingDone(false); }}
              disabled={!m.available}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:scale-100">
              {m.available ? 'Book Session' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
            {bookingDone ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-2">Session Booked! 🎉</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">You'll receive a confirmation email and calendar invite shortly.</p>
                <button onClick={() => setBookModal(null)} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] hover:scale-[1.02] transition-all shadow-md">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-[800] text-slate-900 dark:text-white">Book Session</h3>
                  <button onClick={() => setBookModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-5">
                  <img src={bookModal.img} alt={bookModal.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="font-[700] text-slate-900 dark:text-white">{bookModal.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{bookModal.role}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
                    <input type="date" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Select Time</label>
                    <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                      {['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Topic / Goals</label>
                    <textarea
                      rows={3}
                      placeholder="What do you want to discuss?"
                      className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                    />
                  </div>
                  {!bookModal.free && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-700/50">
                      <span className="text-sm font-[600] text-purple-700 dark:text-purple-300">Session Fee</span>
                      <span className="font-[800] text-purple-700 dark:text-purple-300">₹{bookModal.price}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setBookingDone(true)}
                  className="w-full mt-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-indigo-500/20">
                  {bookModal.free ? 'Confirm Booking' : `Pay & Book — ₹${bookModal.price}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== SESSIONS SECTION =====================
function SessionsSection() {
  const [tab, setTab] = useState('upcoming');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">My Sessions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your mentoring sessions</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['upcoming', 'completed'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sessions.filter(s => s.status === tab).map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <img src={s.img} alt={s.mentor} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-[700] text-slate-900 dark:text-white">{s.topic}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">with {s.mentor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-[700] flex-shrink-0 ${s.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                    {s.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {s.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {s.time}</span>
                  <span className="flex items-center gap-1.5"><Timer className="w-4 h-4" /> {s.duration}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-[600] ${s.type === 'free' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'}`}>
                    {s.type === 'free' ? '🆓 Free' : '💎 Paid'}
                  </span>
                </div>
                {s.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < s.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">Your rating</span>
                  </div>
                )}
              </div>
            </div>
            {s.status === 'upcoming' && (
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 fill-white" /> Join Session
                </button>
                <button className="px-5 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  Reschedule
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== QUIZ SECTION =====================
function QuizSection() {
  const [phase, setPhase] = useState<'setup' | 'quiz' | 'results'>('setup');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQ, setNumQ] = useState(5);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showBadge, setShowBadge] = useState(false);

  const questions = quizQuestions.default.slice(0, numQ);

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

  const handleNext = (ans: number | null) => {
    const newAnswers = [...answers, ans !== undefined ? ans : selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (current + 1 >= questions.length) {
      setPhase('results');
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length;
      if (correct / questions.length >= 0.8) setShowBadge(true);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
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
      <div className="max-w-2xl mx-auto space-y-6">
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
    <div className="max-w-2xl mx-auto space-y-6">
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
        disabled={!topic}
        onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setPhase('quiz'); }}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[800] rounded-2xl shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-3 text-lg">
        <Zap className="w-6 h-6" /> Start Quiz
      </button>
    </div>
  );
}

// ===================== JOBS SECTION =====================
function JobsSection() {
  const [applyModal, setApplyModal] = useState<null | typeof jobs[0]>(null);
  const [applied, setApplied] = useState<number[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Jobs & Referrals</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Exclusive opportunities shared by alumni mentors</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {jobs.map(job => (
          <div key={job.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-6 border-2 ${job.isNew ? 'border-indigo-300 dark:border-indigo-600/50' : 'border-slate-200 dark:border-slate-700/50'} hover:shadow-xl hover:-translate-y-0.5 transition-all`}>
            {job.isNew && <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-[700] mb-3">🆕 New</div>}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-[800] text-slate-900 dark:text-white">{job.role}</h3>
                <div className="text-indigo-600 dark:text-indigo-400 font-[600] text-sm">{job.company}</div>
              </div>
              <span className={`text-xs font-[700] px-3 py-1 rounded-full ${job.type === 'Internship' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                {job.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.skills.map(s => (
                <span key={s} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full font-[500]">{s}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
              <span>⏰ Deadline: {job.deadline}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl mb-4">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-[500]">Referred by</span>
              <span className="text-xs font-[700] text-indigo-600 dark:text-indigo-400">{job.referredBy}</span>
            </div>
            <button
              onClick={() => { if (!applied.includes(job.id)) setApplyModal(job); }}
              className={`w-full py-2.5 text-sm font-[700] rounded-xl transition-all ${applied.includes(job.id) ? 'bg-green-100 dark:bg-green-900/20 text-green-600 cursor-default' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-[1.02] shadow-md shadow-indigo-500/20'}`}>
              {applied.includes(job.id) ? '✅ Applied' : 'Apply Now'}
            </button>
          </div>
        ))}
      </div>

      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[800] text-slate-900 dark:text-white">Apply to {applyModal.company}</h3>
              <button onClick={() => setApplyModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="font-[700] text-slate-900 dark:text-white">{applyModal.role}</div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400">{applyModal.company}</div>
              </div>
              <div>
                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Cover Letter (optional)</label>
                <textarea rows={4} placeholder="Why are you a great fit?" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-[500]">📄 Resume attached</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-[600]">✅ Ready</span>
              </div>
            </div>
            <button
              onClick={() => { setApplied(prev => [...prev, applyModal.id]); setApplyModal(null); }}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
              Submit Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== RESUME REVIEW SECTION =====================
function ResumeSection() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(true);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Resume Review</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Get expert feedback on your resume from alumni</p>
      </div>

      {/* Upload */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={() => { setDragging(false); setUploaded(true); }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="font-[600] text-slate-700 dark:text-slate-200 mb-1">Drop your resume here</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">or click to upload · PDF, DOCX (max 5MB)</p>
      </div>

      {/* Current Resume Status */}
      {uploaded && (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-[700] text-slate-900 dark:text-white">Current Reviews</h3>
          </div>
          {[
            { reviewer: 'Siddharth Nair', company: 'Microsoft', status: 'reviewed', feedback: 'Strong technical skills section. Add more quantified achievements. Remove the objective statement.', date: 'Feb 28, 2026', rating: 4, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
            { reviewer: 'Priya Sharma', company: 'Amazon', status: 'pending', date: 'Mar 3, 2026', img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=100&h=100&fit=crop' },
          ].map((r, i) => (
            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <div className="flex items-start gap-4">
                <img src={r.img} alt={r.reviewer} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-[700] text-slate-900 dark:text-white text-sm">{r.reviewer}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">@ {r.company}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-[700] ${r.status === 'reviewed' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                      {r.status === 'reviewed' ? '✅ Reviewed' : '⏳ Pending'}
                    </span>
                  </div>
                  {r.feedback && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-600/30 rounded-lg border border-slate-200 dark:border-slate-600/50">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">💬 "{r.feedback}"</p>
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-2">{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== LEADERBOARD SECTION =====================
function LeaderboardSection() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Leaderboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Compete with peers and earn rewards</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['weekly', 'monthly'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${period === p ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4">
        {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((user, i) => (
          <div key={user.rank} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 text-center border-2 ${i === 1 ? 'border-amber-400 shadow-lg shadow-amber-400/20' : 'border-slate-200 dark:border-slate-700/50'} ${user.isYou ? 'ring-2 ring-indigo-500' : ''}`}>
            <div className="text-3xl mb-2">{user.avatar || '👤'}</div>
            <div className="font-[700] text-slate-900 dark:text-white text-sm mb-1">{user.isYou ? 'You' : user.name}</div>
            <div className="text-indigo-600 dark:text-indigo-400 font-[800] text-lg">{user.points.toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-[500]">points</div>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> {user.streak} day streak
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Rank</th>
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Points</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Quizzes</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, i) => (
                <tr key={user.rank} className={`border-b border-slate-100 dark:border-slate-700/30 last:border-0 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/20 ${user.isYou ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                  <td className="px-6 py-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-[800] text-sm ${user.rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className={`font-[600] text-sm ${user.isYou ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                          {user.isYou ? 'You (Aditya)' : user.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-orange-400">
                          <Flame className="w-3 h-3" /> {user.streak}d streak
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-[700] text-slate-900 dark:text-white">{user.points.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-[500]">{user.quizzes}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {Array(Math.min(user.badges, 5)).fill(0).map((_, i) => (
                        <span key={i} className="text-sm">🏅</span>
                      ))}
                      {user.badges > 5 && <span className="text-xs text-slate-400 font-[600]">+{user.badges - 5}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===================== CERTIFICATES SECTION =====================
function CertificatesSection() {
  const [previewCert, setPreviewCert] = useState<null | typeof certificates[0]>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Certificates</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Your earned certifications and achievements</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className={`h-32 bg-gradient-to-br ${cert.color} p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
              <div className="relative">
                <Award className="w-10 h-10 text-white/80 mb-2" />
                <div className="text-white/60 text-xs font-[600] uppercase tracking-wider">Certificate of Completion</div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-[800] text-slate-900 dark:text-white mb-1">{cert.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{cert.issuer} · {cert.date}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.skills.map(s => (
                  <span key={s} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-[500]">{s}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPreviewCert(cert)} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                  View Certificate
                </button>
                <button className="p-2.5 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  <Share2 className="w-4 h-4 text-slate-500" />
                </button>
                <button className="p-2.5 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                  <Download className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden w-full max-w-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className={`bg-gradient-to-br ${previewCert.color} p-10 text-center relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="text-white/80 text-sm font-[600] uppercase tracking-widest mb-2">Certificate of Completion</div>
                <div className="text-white text-4xl font-[900] mb-1">Alumni Connect</div>
                <div className="text-white/60 text-sm mb-6">This is to certify that</div>
                <div className="text-white text-3xl font-[800] italic mb-4">Aditya Kumar</div>
                <div className="text-white/80 text-sm mb-2">has successfully completed</div>
                <div className="text-white text-2xl font-[800] mb-4">{previewCert.title}</div>
                <div className="text-white/60 text-sm">{previewCert.date}</div>
              </div>
            </div>
            <div className="p-6 flex gap-3">
              <button className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex-1 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button onClick={() => setPreviewCert(null)} className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== COMMUNITY SECTION =====================
function CommunitySection() {
  const [posts, setPosts] = useState(communityPosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Community</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Stay connected with the alumni community</p>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
        <textarea
          value={newPost} onChange={e => setNewPost(e.target.value)}
          rows={3}
          placeholder="Share an update, tip, or question..."
          className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none text-sm"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {['📷 Photo', '🔗 Link', '📊 Poll'].map(a => (
              <button key={a} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-500 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-[500]">{a}</button>
            ))}
          </div>
          <button
            onClick={() => {
              if (newPost.trim()) {
                setPosts(prev => [{ id: Date.now(), author: 'You (Aditya)', role: 'B.Tech CSE', time: 'Just now', content: newPost, likes: 0, comments: 0, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', liked: false }, ...prev]);
                setNewPost('');
              }
            }}
            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex items-center gap-2">
            <Send className="w-4 h-4" /> Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <img src={post.img} alt={post.author} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
              <div>
                <div className="font-[700] text-slate-900 dark:text-white text-sm">{post.author}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{post.role} · {post.time}</div>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-sm font-[600] transition-all hover:scale-105 ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-[600] text-slate-400 hover:text-indigo-500 transition-all">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-[600] text-slate-400 hover:text-blue-500 transition-all ml-auto">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== MAIN DASHBOARD =====================
export default function StudentDashboard() {
  const [section, setSection] = useState('overview');

  const sectionComponents: Record<string, React.ReactNode> = {
    overview: <OverviewSection setSection={setSection} />,
    mentors: <MentorsSection />,
    sessions: <SessionsSection />,
    quiz: <QuizSection />,
    jobs: <JobsSection />,
    resume: <ResumeSection />,
    leaderboard: <LeaderboardSection />,
    certificates: <CertificatesSection />,
    community: <CommunitySection />,
  };

  const navItemsWithBadges = navItems.map(item => ({
    ...item,
    badge: item.key === 'jobs' ? 3 : item.key === 'resume' ? 1 : undefined,
  }));

  return (
    <DashboardLayout
      navItems={navItemsWithBadges}
      activeSection={section}
      onSectionChange={setSection}
      role="student"
      userName="Aditya Kumar"
      userSubtitle="B.Tech CSE · 3rd Year"
      userAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      notifications={notifications}
    >
      {sectionComponents[section] || sectionComponents.overview}
    </DashboardLayout>
  );
}
