import { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Award, BarChart2,
  Trophy, FileText, Download, TrendingUp, CheckCircle,
  XCircle, AlertCircle, Search,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', key: 'overview' },
  { icon: Users, label: 'Student Performance', key: 'students' },
  { icon: BookOpen, label: 'Mentoring Monitor', key: 'mentoring' },
  { icon: BarChart2, label: 'Quiz Analytics', key: 'quizanalytics' },
  { icon: Award, label: 'Certifications', key: 'certs' },
  { icon: Trophy, label: 'Competitions', key: 'competitions' },
  { icon: FileText, label: 'Reports', key: 'reports' },
];

const notifications = [
  { id: 1, text: '5 students pending certification approval', time: '1 hr ago', read: false },
  { id: 2, text: 'Hackathon submissions close in 2 days', time: '3 hrs ago', read: false },
  { id: 3, text: 'Monthly student performance report ready', time: '1 day ago', read: true },
];

const performanceData = [
  { month: 'Oct', avg: 72, top: 95, bottom: 45 },
  { month: 'Nov', avg: 75, top: 97, bottom: 48 },
  { month: 'Dec', avg: 78, top: 98, bottom: 52 },
  { month: 'Jan', avg: 80, top: 99, bottom: 55 },
  { month: 'Feb', avg: 82, top: 99, bottom: 58 },
  { month: 'Mar', avg: 85, top: 100, bottom: 60 },
];

const quizTopicData = [
  { topic: 'Python', attempts: 245, avgScore: 78, pass: 198 },
  { topic: 'DSA', attempts: 312, avgScore: 72, pass: 234 },
  { topic: 'JavaScript', attempts: 189, avgScore: 81, pass: 162 },
  { topic: 'SQL', attempts: 134, avgScore: 85, pass: 120 },
  { topic: 'System Design', attempts: 98, avgScore: 69, pass: 74 },
  { topic: 'Java', attempts: 156, avgScore: 74, pass: 128 },
];

const students = [
  { id: 1, name: 'Aditya Kumar', branch: 'CSE', year: '3rd', sessionsAttended: 12, quizzesTaken: 39, avgScore: 87, jobs: 2, progress: 85 },
  { id: 2, name: 'Riya Kapoor', branch: 'CSE', year: '3rd', sessionsAttended: 18, quizzesTaken: 48, avgScore: 94, jobs: 3, progress: 95 },
  { id: 3, name: 'Tanmay Shah', branch: 'ECE', year: '4th', sessionsAttended: 15, quizzesTaken: 43, avgScore: 89, jobs: 1, progress: 88 },
  { id: 4, name: 'Preethi R.', branch: 'IT', year: '4th', sessionsAttended: 9, quizzesTaken: 28, avgScore: 75, jobs: 1, progress: 72 },
  { id: 5, name: 'Karan Sharma', branch: 'CSE', year: '2nd', sessionsAttended: 6, quizzesTaken: 20, avgScore: 70, jobs: 0, progress: 60 },
  { id: 6, name: 'Anjali Mehta', branch: 'CS', year: '3rd', sessionsAttended: 14, quizzesTaken: 36, avgScore: 83, jobs: 2, progress: 80 },
];

// ===================== OVERVIEW =====================
function FacultyOverview({ setSection }: { setSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm font-[500] mb-1">Welcome back 👋</div>
            <h2 className="text-2xl font-[800]">Dr. Meena Krishnan</h2>
            <p className="text-white/80 text-sm mt-1">Professor · Dept of Computer Science · IIT Delhi</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSection('reports')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
              Generate Report
            </button>
            <button onClick={() => setSection('certs')} className="px-5 py-2.5 bg-white text-green-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
              5 Certs Pending
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Students', value: '248', change: '82% engaged', icon: Users, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Sessions This Month', value: '94', change: '15 pending', icon: BookOpen, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Avg Quiz Score', value: '82%', change: '+4% vs last month', icon: BarChart2, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Certifications', value: '47', change: '5 pending approval', icon: Award, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
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

      {/* Performance Chart */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[700] text-slate-900 dark:text-white">Student Performance Trends</h3>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Area key="avg" type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Score" />
            <Line key="top" type="monotone" dataKey="top" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Top Score" />
            <Line key="bottom" type="monotone" dataKey="bottom" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Bottom Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Students */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <h3 className="font-[700] text-slate-900 dark:text-white">Top Performing Students</h3>
          <button onClick={() => setSection('students')} className="text-sm text-green-600 dark:text-green-400 font-[600] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/30">
                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Sessions</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Avg Score</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map(s => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-[700] text-sm">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-[600] text-sm text-slate-900 dark:text-white">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.branch} · {s.year} Year</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-[600] text-slate-700 dark:text-slate-300">{s.sessionsAttended}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`text-sm font-[700] ${s.avgScore >= 85 ? 'text-green-600 dark:text-green-400' : s.avgScore >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{s.avgScore}%</span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs font-[700] text-slate-700 dark:text-slate-300 w-8">{s.progress}%</span>
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

// ===================== STUDENT PERFORMANCE =====================
function StudentPerformanceSection() {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Student Performance</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor individual student progress and analytics</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
            className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 w-64" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30">
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Student</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Sessions</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Quizzes</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Avg Score</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Jobs Applied</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-[700] text-sm">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-[600] text-slate-900 dark:text-white text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.branch} · {s.year} Year</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-[600] text-slate-700 dark:text-slate-300">{s.sessionsAttended}</td>
                  <td className="px-6 py-4 text-right font-[600] text-slate-700 dark:text-slate-300">{s.quizzesTaken}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-[800] ${s.avgScore >= 85 ? 'text-green-600 dark:text-green-400' : s.avgScore >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{s.avgScore}%</span>
                  </td>
                  <td className="px-6 py-4 text-right font-[600] text-slate-700 dark:text-slate-300">{s.jobs}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.progress >= 80 ? 'bg-green-500' : s.progress >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs font-[700] text-slate-700 dark:text-slate-300 w-8">{s.progress}%</span>
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

// ===================== QUIZ ANALYTICS =====================
function QuizAnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Quiz Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Performance breakdown by topic and difficulty</p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Attempts & Average Scores by Topic</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={quizTopicData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="topic" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Bar key="attempts" dataKey="attempts" fill="#6366f1" radius={[0, 6, 6, 0]} name="Attempts" />
            <Bar key="pass" dataKey="pass" fill="#10b981" radius={[0, 6, 6, 0]} name="Passed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizTopicData.map(t => {
          const passRate = Math.round((t.pass / t.attempts) * 100);
          return (
            <div key={t.topic} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-[700] text-slate-900 dark:text-white">{t.topic}</h4>
                <span className={`text-xs font-[700] px-2 py-1 rounded-full ${passRate >= 80 ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : passRate >= 60 ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                  {passRate}% pass
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  <div className="font-[800] text-slate-900 dark:text-white text-lg">{t.attempts}</div>
                  <div className="text-slate-400">attempts</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  <div className="font-[800] text-indigo-600 dark:text-indigo-400 text-lg">{t.avgScore}%</div>
                  <div className="text-slate-400">avg score</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2">
                  <div className="font-[800] text-green-600 dark:text-green-400 text-lg">{t.pass}</div>
                  <div className="text-slate-400">passed</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== CERTIFICATIONS =====================
function FacultyCertsSection() {
  const [certs, setCerts] = useState([
    { id: 1, student: 'Riya Kapoor', cert: 'Python Mastery', score: 92, date: 'Mar 1, 2026', status: 'pending' },
    { id: 2, student: 'Tanmay Shah', cert: 'System Design', score: 88, date: 'Mar 2, 2026', status: 'pending' },
    { id: 3, student: 'Aditya Kumar', cert: 'React Development', score: 95, date: 'Mar 3, 2026', status: 'pending' },
    { id: 4, student: 'Pooja Nair', cert: 'DSA Fundamentals', score: 90, date: 'Feb 25, 2026', status: 'approved' },
    { id: 5, student: 'Shreya Iyer', cert: 'Python Mastery', score: 64, date: 'Feb 22, 2026', status: 'rejected' },
  ]);

  const approve = (id: number) => setCerts(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  const reject = (id: number) => setCerts(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Certification Approvals</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Review and approve student certification requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', value: certs.filter(c => c.status === 'pending').length, color: 'from-amber-500 to-orange-500' },
          { label: 'Approved', value: certs.filter(c => c.status === 'approved').length, color: 'from-green-500 to-emerald-600' },
          { label: 'Rejected', value: certs.filter(c => c.status === 'rejected').length, color: 'from-red-500 to-rose-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white text-center shadow-lg`}>
            <div className="text-3xl font-[900]">{value}</div>
            <div className="text-white/80 text-sm font-[600]">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {certs.map(c => (
          <div key={c.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
              {c.student.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-[700] text-slate-900 dark:text-white">{c.student}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{c.cert} · Score: <span className={`font-[700] ${c.score >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{c.score}%</span></div>
              <div className="text-xs text-slate-400">{c.date}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {c.status === 'pending' ? (
                <>
                  <button onClick={() => approve(c.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-[700] rounded-xl hover:bg-green-200 transition-all">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => reject(c.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-[700] rounded-xl hover:bg-red-200 transition-all">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              ) : (
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[700] ${c.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                  {c.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {c.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== REPORTS =====================
function ReportsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Reports</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Download detailed analytics and performance reports</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {[
          { title: 'Monthly Student Performance Report', desc: 'Detailed performance analytics for all students', icon: '📊', date: 'Mar 2026', size: '2.4 MB' },
          { title: 'Quiz Completion Report', desc: 'Topic-wise quiz attempt and pass rate analysis', icon: '📝', date: 'Mar 2026', size: '1.8 MB' },
          { title: 'Mentoring Sessions Summary', desc: 'All mentoring sessions by student and alumni', icon: '🎯', date: 'Feb 2026', size: '3.1 MB' },
          { title: 'Certification Status Report', desc: 'All pending and approved certifications', icon: '🏅', date: 'Mar 2026', size: '0.9 MB' },
          { title: 'Placement & Jobs Report', desc: 'Job applications, referrals, and placements', icon: '💼', date: 'Feb 2026', size: '1.5 MB' },
          { title: 'Community Engagement Report', desc: 'Posts, interactions, and event participation', icon: '🤝', date: 'Feb 2026', size: '2.2 MB' },
        ].map(r => (
          <div key={r.title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{r.icon}</div>
              <div className="flex-1">
                <h3 className="font-[700] text-slate-900 dark:text-white text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{r.desc}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>📅 {r.date}</span>
                  <span>📦 {r.size}</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md flex-shrink-0">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Custom Report Generator</h3>
        <div className="grid grid-cols-2 gap-4">
          {['Date Range', 'Report Type', 'Department', 'Year'].map(f => (
            <div key={f}>
              <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">{f}</label>
              <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/30">
                <option>Select {f}</option>
              </select>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
          <Download className="w-4 h-4" /> Generate & Download
        </button>
      </div>
    </div>
  );
}

export default function FacultyDashboard() {
  const [section, setSection] = useState('overview');

  const sectionComponents: Record<string, React.ReactNode> = {
    overview: <FacultyOverview setSection={setSection} />,
    students: <StudentPerformanceSection />,
    quizanalytics: <QuizAnalyticsSection />,
    certs: <FacultyCertsSection />,
    reports: <ReportsSection />,
    mentoring: (
      <div className="space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Mentoring Monitor</h2>
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Active Sessions This Month</h3>
          <div className="space-y-3">
            {[
              { mentor: 'Arjun Mehta (Google)', student: 'Aditya Kumar', topic: 'DSA Prep', date: 'Mar 7', status: 'upcoming' },
              { mentor: 'Priya Sharma (Amazon)', student: 'Riya Kapoor', topic: 'Resume Review', date: 'Mar 8', status: 'upcoming' },
              { mentor: 'Rahul Verma (Flipkart)', student: 'Tanmay Shah', topic: 'React Dev', date: 'Mar 5', status: 'completed' },
              { mentor: 'Mei Lin (Microsoft)', student: 'Karan Sharma', topic: 'ML Basics', date: 'Mar 3', status: 'completed' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div className="flex-1">
                  <div className="font-[600] text-slate-900 dark:text-white text-sm">{s.topic}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{s.mentor} → {s.student} · {s.date}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-[700] ${s.status === 'upcoming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    competitions: (
      <div className="space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Competitions & Hackathons</h2>
        {[
          { title: 'CodeSprint 2026', type: 'Hackathon', teams: 28, status: 'ongoing', deadline: 'Mar 10' },
          { title: 'Web Dev Challenge', type: 'Competition', teams: 42, status: 'upcoming', deadline: 'Mar 20' },
          { title: 'ML Datathon', type: 'Hackathon', teams: 18, status: 'completed', deadline: 'Feb 28' },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4">
            <div className="text-3xl">{c.type === 'Hackathon' ? '⚡' : '🏆'}</div>
            <div className="flex-1">
              <h3 className="font-[700] text-slate-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{c.type} · {c.teams} teams · Deadline: {c.deadline}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-[700] ${c.status === 'ongoing' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : c.status === 'upcoming' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <DashboardLayout
      navItems={navItems.map(item => ({ ...item, badge: item.key === 'certs' ? 3 : undefined }))}
      activeSection={section}
      onSectionChange={setSection}
      role="faculty"
      userName="Dr. Meena Krishnan"
      userSubtitle="Prof · Computer Science"
      notifications={notifications}
    >
      {sectionComponents[section] || sectionComponents.overview}
    </DashboardLayout>
  );
}
