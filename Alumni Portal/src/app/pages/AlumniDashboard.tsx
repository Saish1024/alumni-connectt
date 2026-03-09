import { useState } from 'react';
import {
  LayoutDashboard, User, Calendar, DollarSign, FileText,
  Briefcase, Star, Award, Settings, BarChart2, Users,
  TrendingUp, Clock, Check, X, Plus, Toggle, Video,
  MessageSquare, Globe, Edit2, ChevronRight, Trash2, Pencil, Heart,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', key: 'overview' },
  { icon: User, label: 'My Profile', key: 'profile' },
  { icon: Calendar, label: 'Sessions', key: 'sessions' },
  { icon: DollarSign, label: 'Earnings', key: 'earnings' },
  { icon: FileText, label: 'Resume Reviews', key: 'reviews', badge: 3 },
  { icon: Briefcase, label: 'Post Jobs', key: 'jobs' },
  { icon: Video, label: 'Events & Webinars', key: 'events' },
  { icon: BarChart2, label: 'Stats & Reputation', key: 'stats' },
  { icon: Award, label: 'Certifications', key: 'certifications' },
  { icon: Heart, label: 'Donations', key: 'donations' },
  { icon: Settings, label: 'Mentoring Setup', key: 'setup' },
];

const notifications = [
  { id: 1, text: 'Aditya Kumar booked a DSA session with you', time: '5 min ago', read: false },
  { id: 2, text: 'New resume review request from Preethi R.', time: '1 hr ago', read: false },
  { id: 3, text: 'You earned ₹1,500 from 3 sessions this week', time: '2 hrs ago', read: false },
  { id: 4, text: 'Your webinar has 42 registrations!', time: '1 day ago', read: true },
];

const earningsData = [
  { month: 'Sep', earned: 4200, sessions: 7 },
  { month: 'Oct', earned: 6800, sessions: 12 },
  { month: 'Nov', earned: 5400, sessions: 9 },
  { month: 'Dec', earned: 8200, sessions: 14 },
  { month: 'Jan', earned: 9600, sessions: 16 },
  { month: 'Feb', earned: 11200, sessions: 19 },
  { month: 'Mar', earned: 7800, sessions: 13 },
];

const ratingData = [
  { skill: 'Communication', value: 96 },
  { skill: 'Technical Depth', value: 92 },
  { skill: 'Availability', value: 88 },
  { skill: 'Helpfulness', value: 98 },
  { skill: 'Overall', value: 94 },
];

const pendingReviews = [
  { id: 1, student: 'Aditya Kumar', college: 'IIT Delhi', year: '3rd Year', request: 'SDE Internship Resume', status: 'pending', time: '2 hrs ago' },
  { id: 2, student: 'Preethi R.', college: 'NIT Trichy', year: '4th Year', request: 'Google SWE Application', status: 'pending', time: '5 hrs ago' },
  { id: 3, student: 'Karan Sharma', college: 'BITS Pilani', year: '3rd Year', request: 'Data Science Internship', status: 'in_review', time: '1 day ago' },
  { id: 4, student: 'Sneha Patel', college: 'IIT Bombay', year: '4th Year', request: 'Product Manager Role', status: 'completed', time: '2 days ago' },
];

const upcomingSessions = [
  { id: 1, student: 'Aditya Kumar', topic: 'DSA Interview Prep', date: 'Mar 7', time: '4:00 PM', type: 'free', duration: '60 min' },
  { id: 2, student: 'Meera Singh', topic: 'System Design Basics', date: 'Mar 9', time: '7:00 PM', type: 'paid', amount: 800, duration: '60 min' },
  { id: 3, student: 'Rahul Das', topic: 'React Best Practices', date: 'Mar 11', time: '6:00 PM', type: 'paid', amount: 600, duration: '45 min' },
];

const topicColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
const topicData = [
  { name: 'DSA & Algo', value: 38 },
  { name: 'System Design', value: 24 },
  { name: 'Web Dev', value: 18 },
  { name: 'Interview Prep', value: 12 },
  { name: 'Career Advice', value: 8 },
];

// ===================== OVERVIEW SECTION =====================
function OverviewSection({ setSection }: { setSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
            <h2 className="text-2xl font-[800]">Arjun Mehta</h2>
            <p className="text-white/80 text-sm mt-1">SDE @ Google · B.Tech CS 2019 · IIT Delhi</p>
            <div className="flex items-center gap-2 mt-3">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-sm font-[600] text-amber-200">4.9 Rating · 142 Sessions Completed</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSection('setup')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
              Settings
            </button>
            <button onClick={() => setSection('reviews')} className="px-5 py-2.5 bg-white text-purple-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
              3 Reviews Pending
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earnings', value: '₹53,200', change: '+₹11.2K this month', icon: DollarSign, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Sessions Done', value: '142', change: '19 this month', icon: Video, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Avg Rating', value: '4.9 ⭐', change: '126 reviews', icon: Star, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Students Helped', value: '89', change: 'From 18 colleges', icon: Users, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
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

      {/* Earnings Chart + Topics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[700] text-slate-900 dark:text-white">Earnings Overview</h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`₹${v}`, 'Earnings']} />
              <Area type="monotone" dataKey="earned" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#earnGrad)" name="Earnings (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Sessions by Topic</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={topicData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {topicData.map((_, i) => <Cell key={`alumni-topic-${i}`} fill={topicColors[i % topicColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {topicData.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: topicColors[i] }} />
                  <span className="text-slate-600 dark:text-slate-400 font-[500]">{t.name}</span>
                </div>
                <span className="font-[700] text-slate-900 dark:text-white">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[700] text-slate-900 dark:text-white">Upcoming Sessions</h3>
          <button onClick={() => setSection('sessions')} className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] hover:underline">View All</button>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-[700] text-sm flex-shrink-0">
                {s.student.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-[600] text-slate-900 dark:text-white text-sm">{s.topic}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">with {s.student} · {s.date} at {s.time}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xs font-[700] px-2 py-1 rounded-full ${s.type === 'free' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'}`}>
                  {s.type === 'free' ? 'Free' : `₹${s.amount}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[700] text-slate-900 dark:text-white">Pending Resume Reviews</h3>
          <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-[700]">2 pending</span>
        </div>
        <div className="space-y-3">
          {pendingReviews.filter(r => r.status !== 'completed').slice(0, 2).map(r => (
            <div key={r.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[700] text-sm">
                {r.student.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-[600] text-slate-900 dark:text-white text-sm">{r.student}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{r.college} · {r.request}</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-[700] rounded-xl hover:scale-105 transition-all shadow-md">
                Review
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== SESSIONS SECTION =====================
type Session = {
  id: number;
  student: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  type: 'free' | 'paid';
  amount?: number;
  rating?: number;
};

const initialUpcomingSessions: Session[] = [
  { id: 1, student: 'Aditya Kumar', topic: 'DSA Interview Prep', date: 'Mar 7', time: '4:00 PM', type: 'free', duration: '60 min' },
  { id: 2, student: 'Meera Singh', topic: 'System Design Basics', date: 'Mar 9', time: '7:00 PM', type: 'paid', amount: 800, duration: '60 min' },
  { id: 3, student: 'Rahul Das', topic: 'React Best Practices', date: 'Mar 11', time: '6:00 PM', type: 'paid', amount: 600, duration: '45 min' },
];

const initialCompletedSessions: Session[] = [
  { id: 101, student: 'Neha Roy', topic: 'Resume & Interview Prep', date: 'Feb 26', time: '5:00 PM', duration: '45 min', type: 'paid', amount: 600, rating: 5 },
  { id: 102, student: 'Rohan Malhotra', topic: 'Competitive Programming', date: 'Feb 22', time: '7:00 PM', duration: '60 min', type: 'free', rating: 5 },
  { id: 103, student: 'Ananya Gupta', topic: 'System Design Interview', date: 'Feb 18', time: '4:00 PM', duration: '90 min', type: 'paid', amount: 1200, rating: 4 },
];

const emptySessionForm = { student: '', topic: '', date: '', time: '', duration: '60 min', type: 'free' as 'free' | 'paid', amount: '' };

function AlumniSessionsSection() {
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [upcoming, setUpcoming] = useState<Session[]>(initialUpcomingSessions);
  const [completed, setCompleted] = useState<Session[]>(initialCompletedSessions);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Session | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [form, setForm] = useState(emptySessionForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sessions = tab === 'upcoming' ? upcoming : completed;
  const setSessions = tab === 'upcoming' ? setUpcoming : setCompleted;

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptySessionForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (s: Session) => {
    setEditTarget(s);
    setForm({ student: s.student, topic: s.topic, date: s.date, time: s.time, duration: s.duration, type: s.type, amount: s.amount ? String(s.amount) : '' });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.student.trim()) e.student = 'Student name is required';
    if (!form.topic.trim()) e.topic = 'Topic is required';
    if (!form.date.trim()) e.date = 'Date is required';
    if (!form.time.trim()) e.time = 'Time is required';
    if (!form.duration.trim()) e.duration = 'Duration is required';
    if (form.type === 'paid' && (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)) e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const sessionData: Session = {
      id: editTarget ? editTarget.id : Date.now(),
      student: form.student.trim(),
      topic: form.topic.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      duration: form.duration.trim(),
      type: form.type,
      amount: form.type === 'paid' ? Number(form.amount) : undefined,
      rating: editTarget?.rating,
    };
    if (editTarget) {
      setSessions(prev => prev.map(s => s.id === editTarget.id ? sessionData : s));
    } else {
      setSessions(prev => [...prev, sessionData]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setDeleteConfirmId(null);
  };

  const inputCls = (field: string) =>
    `w-full border ${errors[field] ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Sessions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your mentoring sessions calendar</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['upcoming', 'completed'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
            <Plus className="w-4 h-4" /> Add Session
          </button>
        </div>
      </div>

      {/* Session List */}
      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-12 border border-dashed border-slate-300 dark:border-slate-600 text-center">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-[600]">No {tab} sessions</p>
          <p className="text-xs text-slate-400 mt-1">Click "Add Session" to schedule one</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                  {s.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-[700] text-slate-900 dark:text-white">{s.topic}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">with {s.student} · {s.date} at {s.time} · {s.duration}</div>
                  {s.rating != null && (
                    <div className="flex items-center gap-1 mt-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < s.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.type === 'paid' && s.amount && (
                    <div className="font-[800] text-green-600 dark:text-green-400 text-sm">₹{s.amount}</div>
                  )}
                  <span className={`text-xs font-[700] px-2.5 py-1 rounded-full ${s.type === 'free' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600'}`}>
                    {s.type === 'free' ? 'Free' : 'Paid'}
                  </span>
                  <button
                    onClick={() => openEdit(s)}
                    title="Edit session"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(s.id)}
                    title="Delete session"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {tab === 'upcoming' && (
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" /> Start Session
                  </button>
                </div>
              )}

              {/* Inline Delete Confirmation */}
              {deleteConfirmId === s.id && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/40 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm text-red-700 dark:text-red-400 font-[600]">Delete this session permanently?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-4 py-1.5 bg-red-500 text-white text-xs font-[700] rounded-lg hover:bg-red-600 transition-all">
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-4 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-[600] rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[800] text-slate-900 dark:text-white text-lg">
                {editTarget ? 'Edit Session' : 'Add New Session'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Student Name <span className="text-red-400">*</span></label>
                <input
                  value={form.student}
                  onChange={e => setForm(f => ({ ...f, student: e.target.value }))}
                  placeholder="e.g. Aditya Kumar"
                  className={inputCls('student')}
                />
                {errors.student && <p className="text-xs text-red-500 mt-1">{errors.student}</p>}
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Session Topic <span className="text-red-400">*</span></label>
                <input
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  placeholder="e.g. DSA Interview Prep"
                  className={inputCls('topic')}
                />
                {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic}</p>}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Date <span className="text-red-400">*</span></label>
                  <input
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    placeholder="e.g. Mar 15"
                    className={inputCls('date')}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Time <span className="text-red-400">*</span></label>
                  <input
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 5:00 PM"
                    className={inputCls('time')}
                  />
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Duration <span className="text-red-400">*</span></label>
                <select
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  className={inputCls('duration')}>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                  <option>90 min</option>
                  <option>120 min</option>
                </select>
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-2">Session Type</label>
                <div className="flex gap-3">
                  {(['free', 'paid'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t, amount: t === 'free' ? '' : f.amount }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-[700] border-2 transition-all capitalize ${form.type === t ? (t === 'free' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600' : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600') : 'border-slate-200 dark:border-slate-600 text-slate-500'}`}>
                      {t === 'free' ? '🆓 Free' : '💰 Paid'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount — shown only for paid */}
              {form.type === 'paid' && (
                <div>
                  <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹) <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="e.g. 800"
                    className={inputCls('amount')}
                  />
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {editTarget ? 'Save Changes' : 'Add Session'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== EARNINGS SECTION =====================
function EarningsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Earnings Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Track your income from mentoring sessions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Earned', value: '₹53,200', sub: 'All time', color: 'from-green-500 to-emerald-600' },
          { label: 'This Month', value: '₹11,200', sub: '+18% vs last', color: 'from-blue-500 to-cyan-600' },
          { label: 'Pending Payout', value: '₹4,800', sub: 'Clears Mar 10', color: 'from-amber-500 to-orange-500' },
          { label: 'Sessions (Mar)', value: '13', sub: '₹600 avg/session', color: 'from-purple-500 to-violet-600' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="text-white/70 text-xs font-[600] uppercase mb-2">{label}</div>
            <div className="text-2xl font-[900]">{value}</div>
            <div className="text-white/70 text-xs font-[500] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`₹${v}`, 'Earnings']} />
            <Bar dataKey="earned" fill="url(#earnBarGrad)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="earnBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white">Transaction History</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/30">
          {[
            { student: 'Aditya Kumar', session: 'DSA Interview Prep', date: 'Mar 3', amount: 800, status: 'paid' },
            { student: 'Meera Singh', session: 'System Design', date: 'Feb 28', amount: 1000, status: 'paid' },
            { student: 'Rahul Das', session: 'React Best Practices', date: 'Feb 25', amount: 600, status: 'paid' },
            { student: 'Tanvi Shah', session: 'Career Guidance', date: 'Feb 22', amount: 500, status: 'processing' },
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white font-[700] text-sm">
                  {t.student.charAt(0)}
                </div>
                <div>
                  <div className="font-[600] text-slate-900 dark:text-white text-sm">{t.student}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.session} · {t.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-[800] text-green-600 dark:text-green-400">+₹{t.amount}</div>
                <span className={`text-xs font-[600] ${t.status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>
                  {t.status === 'paid' ? '✅ Paid' : '⏳ Processing'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== RESUME REVIEWS SECTION =====================
function ReviewsSection() {
  const [selectedReview, setSelectedReview] = useState<null | typeof pendingReviews[0]>(null);
  const [feedback, setFeedback] = useState('');
  const [reviews, setReviews] = useState(pendingReviews);

  const submitReview = () => {
    if (selectedReview) {
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, status: 'completed' } : r));
      setSelectedReview(null);
      setFeedback('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Resume Reviews</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Review and provide feedback on student resumes</p>
      </div>

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 border-2 transition-all hover:shadow-md ${r.status === 'pending' ? 'border-amber-300 dark:border-amber-600/50' : r.status === 'in_review' ? 'border-blue-300 dark:border-blue-600/50' : 'border-green-300 dark:border-green-600/50'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                {r.student.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-[700] text-slate-900 dark:text-white">{r.student}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{r.college} · {r.year}</div>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-[600] mt-1">{r.request}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-[700] flex-shrink-0 ${r.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : r.status === 'in_review' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                      {r.status === 'pending' ? '⏳ Pending' : r.status === 'in_review' ? '👀 In Review' : '✅ Reviewed'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">Requested {r.time}</div>
              </div>
            </div>
            {r.status !== 'completed' && (
              <button
                onClick={() => setSelectedReview(r)}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                Review Resume
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-[800] text-slate-900 dark:text-white">Review: {selectedReview.student}</h3>
              <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-300 font-[600]">{selectedReview.request}</p>
              <p className="text-xs text-slate-400">{selectedReview.college} · {selectedReview.year}</p>
              <button className="mt-3 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-[600] rounded-xl hover:bg-indigo-200 transition-all">
                📄 View Resume PDF
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-center text-lg">
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-[700] text-slate-700 dark:text-slate-300 mb-2">Detailed Feedback</label>
                <textarea
                  value={feedback} onChange={e => setFeedback(e.target.value)}
                  rows={5}
                  placeholder="Provide specific, actionable feedback on their resume..."
                  className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none"
                />
              </div>
            </div>
            <button
              onClick={submitReview}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== POST JOBS SECTION =====================
function PostJobsSection() {
  const [showForm, setShowForm] = useState(false);
  const myJobs = [
    { id: 1, company: 'Google', role: 'SDE Intern (Summer 2026)', applications: 28, deadline: 'Mar 15', status: 'active', type: 'Internship' },
    { id: 2, company: 'Google', role: 'Full-time SDE-2', applications: 14, deadline: 'Apr 1', status: 'active', type: 'Full-time' },
    { id: 3, company: 'Google', role: 'ML Research Intern', applications: 9, deadline: 'Feb 28', status: 'closed', type: 'Internship' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Post Jobs & Referrals</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Share opportunities with students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
          <Plus className="w-4 h-4" /> Post Opportunity
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-5">New Opportunity</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Company', 'Role Title', 'Location', 'Salary / Stipend'].map(p => (
              <div key={p}>
                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">{p}</label>
                <input placeholder={p} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
            <textarea rows={4} placeholder="Describe the role, requirements, and how students should apply..." className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
              Post Opportunity
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {myJobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-[800] text-slate-900 dark:text-white">{job.role}</div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-[600]">{job.company}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-[700] ${job.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {job.status === 'active' ? '🟢 Active' : '🔴 Closed'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>📋 {job.type}</span>
              <span>👥 {job.applications} applicants</span>
              <span>⏰ Deadline: {job.deadline}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-[700] rounded-xl hover:bg-purple-200 transition-all">
                View Applications
              </button>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== STATS SECTION =====================
function StatsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Stats & Reputation</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Your performance and reputation on the platform</p>
      </div>

      {/* Reputation Score */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-white text-center">
        <div className="text-6xl font-[900] mb-2">94</div>
        <div className="text-white/70 text-sm font-[600] uppercase tracking-widest">Reputation Score</div>
        <div className="flex items-center justify-center gap-1 mt-3">
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-amber-300 text-amber-300" />
          ))}
          <span className="text-white ml-2 font-[700]">4.9 (126 reviews)</span>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-[700] text-slate-900 dark:text-white mb-5">Rating Breakdown</h3>
        <div className="space-y-4">
          {ratingData.map(({ skill, value }) => (
            <div key={skill} className="flex items-center gap-4">
              <div className="w-32 text-sm font-[600] text-slate-600 dark:text-slate-400">{skill}</div>
              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all" style={{ width: `${value}%` }} />
              </div>
              <div className="w-10 text-right text-sm font-[800] text-slate-900 dark:text-white">{value}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hours Mentored', value: '142', icon: '⏰' },
          { label: 'Students Placed', value: '23', icon: '🎓' },
          { label: 'Resumes Reviewed', value: '47', icon: '📄' },
          { label: 'Jobs Posted', value: '8', icon: '💼' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-[900] text-slate-900 dark:text-white">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-[500] mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== MENTORING SETUP =====================
function MentoringSetupSection() {
  const [isPaid, setIsPaid] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [hourlyRate, setHourlyRate] = useState('800');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Mentoring Setup</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your mentoring preferences and availability</p>
      </div>

      {[
        {
          title: 'Availability Status',
          desc: 'Toggle your availability for new sessions',
          content: (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-[600] text-slate-900 dark:text-white">Accept new sessions</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{isAvailable ? 'Students can book sessions with you' : 'You are not accepting new bookings'}</div>
              </div>
              <button onClick={() => setIsAvailable(!isAvailable)} className={`w-14 h-7 rounded-full transition-all relative ${isAvailable ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isAvailable ? 'left-7' : 'left-0.5'}`} />
              </button>
            </div>
          )
        },
        {
          title: 'Paid / Free Sessions',
          desc: 'Choose whether to charge for your sessions',
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-[600] text-slate-900 dark:text-white">Charge for sessions</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{isPaid ? 'Students pay before booking' : 'Sessions are free'}</div>
                </div>
                <button onClick={() => setIsPaid(!isPaid)} className={`w-14 h-7 rounded-full transition-all relative ${isPaid ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isPaid ? 'left-7' : 'left-0.5'}`} />
                </button>
              </div>
              {isPaid && (
                <div>
                  <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Hourly Rate (₹)</label>
                  <input value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} type="number"
                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                </div>
              )}
            </div>
          )
        },
        {
          title: 'Available Time Slots',
          desc: 'Set your weekly availability',
          content: (
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-28 text-sm font-[600] text-slate-700 dark:text-slate-300">{day}</div>
                  <select className="flex-1 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                    <option>Not Available</option>
                    <option>Morning (9AM - 12PM)</option>
                    <option>Afternoon (2PM - 6PM)</option>
                    <option>Evening (6PM - 10PM)</option>
                    <option>All Day</option>
                  </select>
                </div>
              ))}
            </div>
          )
        },
      ].map(({ title, desc, content }) => (
        <div key={title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">{desc}</p>
          {content}
        </div>
      ))}

      <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg">
        Save Settings
      </button>
    </div>
  );
}

// ===================== DONATIONS SECTION =====================
const alumniCampaigns = [
  { id: 1, title: 'Scholarship Fund for Meritorious Students', raised: 285000, goal: 500000, donors: 142, days: 15, icon: '🎓', color: 'from-blue-500 to-indigo-600' },
  { id: 2, title: 'New Computer Lab Equipment', raised: 148000, goal: 200000, donors: 89, days: 8, icon: '💻', color: 'from-purple-500 to-violet-600' },
  { id: 3, title: 'Alumni Reunion Event 2026', raised: 72000, goal: 100000, donors: 54, days: 22, icon: '🎉', color: 'from-pink-500 to-rose-600' },
  { id: 4, title: 'Women in Tech Bursary', raised: 56000, goal: 150000, donors: 38, days: 30, icon: '👩‍💻', color: 'from-violet-500 to-purple-600' },
];

const myDonationHistory = [
  { id: 1, campaign: 'Scholarship Fund', amount: 5000, date: 'Jan 2026', status: 'completed' },
  { id: 2, campaign: 'Computer Lab Equipment', amount: 2000, date: 'Dec 2025', status: 'completed' },
  { id: 3, campaign: 'Alumni Reunion Event 2026', amount: 1000, date: 'Nov 2025', status: 'completed' },
];

function AlumniDonationsSection() {
  const [donateModal, setDonateModal] = useState<null | typeof alumniCampaigns[0]>(null);
  const [amount, setAmount] = useState('1000');
  const [donationDone, setDonationDone] = useState(false);
  const [tab, setTab] = useState<'campaigns' | 'history'>('campaigns');

  const totalGiven = myDonationHistory.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Donations & Giving Back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Contribute to campaigns and support the next generation</p>
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['campaigns', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-[600] capitalize transition-all ${tab === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
              {t === 'campaigns' ? 'Active Campaigns' : 'My Contributions'}
            </button>
          ))}
        </div>
      </div>

      {/* Impact banner */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-[500] mb-1">Your Total Contribution</p>
            <div className="text-3xl font-[900]">₹{totalGiven.toLocaleString('en-IN')}</div>
            <p className="text-white/80 text-sm mt-1">Across {myDonationHistory.length} campaigns · Thank you for giving back! 🙏</p>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="w-10 h-10 text-pink-300 fill-pink-300" />
          </div>
        </div>
      </div>

      {tab === 'campaigns' ? (
        <div className="grid md:grid-cols-2 gap-5">
          {alumniCampaigns.map(c => {
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <div key={c.id} className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                <div className="p-6">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="font-[800] text-slate-900 dark:text-white mb-2">{c.title}</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-[700] text-slate-900 dark:text-white">₹{(c.raised / 1000).toFixed(0)}K raised</span>
                    <span className="text-slate-500 dark:text-slate-400">of ₹{(c.goal / 1000).toFixed(0)}K goal</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span>👥 {c.donors} donors</span>
                    <span>⏰ {c.days} days left</span>
                    <span className="font-[700] text-indigo-600 dark:text-indigo-400">{pct}%</span>
                  </div>
                  <button
                    onClick={() => { setDonateModal(c); setDonationDone(false); setAmount('1000'); }}
                    className={`w-full py-2.5 bg-gradient-to-r ${c.color} text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2`}>
                    <Heart className="w-4 h-4" /> Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="font-[700] text-slate-900 dark:text-white">My Donation History</h3>
          </div>
          {myDonationHistory.length === 0 ? (
            <div className="p-12 text-center">
              <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-[600]">No donations yet</p>
              <p className="text-xs text-slate-400 mt-1">Your contribution history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/30">
              {myDonationHistory.map(d => (
                <div key={d.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-md">
                      <Heart className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <div className="font-[600] text-slate-900 dark:text-white text-sm">{d.campaign}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{d.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-[800] text-purple-600 dark:text-purple-400">₹{d.amount.toLocaleString('en-IN')}</div>
                    <span className="text-xs font-[600] text-green-600 dark:text-green-400">✅ Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Donate Modal */}
      {donateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl">
            {donationDone ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-[800] text-slate-900 dark:text-white mb-2">Thank You for Giving Back!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Your donation of ₹{amount} to "{donateModal.title}" has been recorded. You're making a difference! 🙏</p>
                <button onClick={() => setDonateModal(null)} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-[800] text-slate-900 dark:text-white">Make a Donation</h3>
                  <button onClick={() => setDonateModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className={`p-4 bg-gradient-to-r ${donateModal.color} rounded-xl mb-5 text-white`}>
                  <div className="text-2xl mb-1">{donateModal.icon}</div>
                  <p className="font-[700] text-sm">{donateModal.title}</p>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {['500', '1000', '2500', '5000'].map(a => (
                    <button key={a} onClick={() => setAmount(a)}
                      className={`py-2.5 rounded-xl text-sm font-[700] transition-all ${amount === a ? `bg-gradient-to-r ${donateModal.color} text-white shadow-md` : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      ₹{a}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Custom Amount (₹)</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
                    className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/30" />
                </div>
                <button
                  onClick={() => setDonationDone(true)}
                  className={`w-full mt-5 py-3.5 bg-gradient-to-r ${donateModal.color} text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2`}>
                  <Heart className="w-4 h-4 fill-white" /> Donate ₹{amount}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== MAIN DASHBOARD =====================
export default function AlumniDashboard() {
  const [section, setSection] = useState('overview');

  const sectionComponents: Record<string, React.ReactNode> = {
    overview: <OverviewSection setSection={setSection} />,
    sessions: <AlumniSessionsSection />,
    earnings: <EarningsSection />,
    reviews: <ReviewsSection />,
    jobs: <PostJobsSection />,
    stats: <StatsSection />,
    donations: <AlumniDonationsSection />,
    setup: <MentoringSetupSection />,
    profile: (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">My Profile</h2>
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 text-center">
          <img src="https://images.unsplash.com/photo-1570215170761-f056128eda48?w=200&h=200&fit=crop" alt="Arjun" className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <h3 className="text-xl font-[800] text-slate-900 dark:text-white">Arjun Mehta</h3>
          <p className="text-purple-600 dark:text-purple-400 font-[600] text-sm">SDE @ Google · B.Tech CS 2019</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {Array(5).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">4.9</span>
          </div>
          <div className="mt-4">
            <a href="#" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-[600] hover:underline">
              <Globe className="w-4 h-4" /> linkedin.com/in/arjunmehta
            </a>
          </div>
          <button className="mt-5 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
            Edit Profile
          </button>
        </div>
      </div>
    ),
    events: (
      <div className="space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Events & Webinars</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: 'Cracking FAANG Interviews', date: 'Mar 15, 2026', time: '6:00 PM', registrations: 87, type: 'Webinar', status: 'upcoming' },
            { title: 'System Design Masterclass', date: 'Mar 22, 2026', time: '5:00 PM', registrations: 42, type: 'Workshop', status: 'upcoming' },
            { title: 'Resume Writing Workshop', date: 'Feb 10, 2026', time: '7:00 PM', registrations: 134, type: 'Workshop', status: 'completed' },
          ].map((e, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-[700] text-slate-900 dark:text-white">{e.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-[700] ${e.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>{e.status}</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{e.date} · {e.time} · {e.type}</div>
              <div className="text-sm font-[600] text-purple-600 dark:text-purple-400">👥 {e.registrations} registrations</div>
              {e.status === 'upcoming' && (
                <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">Manage Event</button>
              )}
            </div>
          ))}
          <button className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 min-h-32">
            <Plus className="w-8 h-8" />
            <span className="font-[600] text-sm">Create New Event</span>
          </button>
        </div>
      </div>
    ),
    certifications: (
      <div className="space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Certification Approvals</h2>
        <div className="space-y-4">
          {[
            { student: 'Riya Kapoor', cert: 'Python Mastery', score: 92, status: 'pending' },
            { student: 'Tanmay Shah', cert: 'System Design', score: 88, status: 'pending' },
            { student: 'Pooja Nair', cert: 'React Development', score: 95, status: 'approved' },
          ].map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                {c.student.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-[700] text-slate-900 dark:text-white">{c.student}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{c.cert} · Score: {c.score}%</div>
              </div>
              {c.status === 'pending' ? (
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-[700] rounded-xl hover:bg-green-200 transition-all">Approve</button>
                  <button className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-[700] rounded-xl hover:bg-red-200 transition-all">Reject</button>
                </div>
              ) : (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-[700] rounded-full">✅ Approved</span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <DashboardLayout
      navItems={navItems.map(item => ({ ...item, badge: item.key === 'reviews' ? 3 : undefined }))}
      activeSection={section}
      onSectionChange={setSection}
      role="alumni"
      userName="Arjun Mehta"
      userSubtitle="SDE @ Google"
      userAvatar="https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop"
      notifications={notifications}
    >
      {sectionComponents[section] || sectionComponents.overview}
    </DashboardLayout>
  );
}
