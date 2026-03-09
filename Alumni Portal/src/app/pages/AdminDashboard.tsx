import { useState } from 'react';
import {
  LayoutDashboard, Users, UserCheck, DollarSign, Calendar,
  Megaphone, TrendingUp, Shield, Search, Plus, Check, X,
  Ban, Edit2, Trash2, BarChart2, Download, Globe,
  CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const navItems = [
  { icon: LayoutDashboard, label: 'Platform Overview', key: 'overview' },
  { icon: Users, label: 'User Management', key: 'users' },
  { icon: UserCheck, label: 'Registrations', key: 'registrations', badge: 8 },
  { icon: DollarSign, label: 'Payments', key: 'payments' },
  { icon: Calendar, label: 'Events', key: 'events' },
  { icon: TrendingUp, label: 'Revenue Analytics', key: 'revenue' },
  { icon: Megaphone, label: 'Announcements', key: 'announcements' },
  { icon: Shield, label: 'Settings', key: 'settings' },
];

const notifications = [
  { id: 1, text: '8 new alumni registrations await approval', time: '30 min ago', read: false },
  { id: 2, text: 'Revenue hit ₹2.5L this month! 🎉', time: '2 hrs ago', read: false },
  { id: 3, text: 'Payment dispute reported by user #1842', time: '4 hrs ago', read: false },
  { id: 4, text: 'System maintenance scheduled for Mar 10', time: '1 day ago', read: true },
];

const revenueData = [
  { month: 'Oct', revenue: 82000, users: 1200, sessions: 180 },
  { month: 'Nov', revenue: 98000, users: 1450, sessions: 210 },
  { month: 'Dec', revenue: 115000, users: 1680, sessions: 245 },
  { month: 'Jan', revenue: 145000, users: 1920, sessions: 290 },
  { month: 'Feb', revenue: 198000, users: 2240, sessions: 340 },
  { month: 'Mar', revenue: 250000, users: 2580, sessions: 398 },
];

const userGrowthData = [
  { month: 'Sep', students: 3200, alumni: 820, faculty: 95 },
  { month: 'Oct', students: 3850, alumni: 980, faculty: 102 },
  { month: 'Nov', students: 4200, alumni: 1120, faculty: 108 },
  { month: 'Dec', students: 4680, alumni: 1280, faculty: 115 },
  { month: 'Jan', students: 5100, alumni: 1480, faculty: 122 },
  { month: 'Feb', students: 5620, alumni: 1680, faculty: 130 },
  { month: 'Mar', students: 6200, alumni: 1920, faculty: 140 },
];

const roleDistribution = [
  { name: 'Students', value: 62, color: '#6366f1' },
  { name: 'Alumni', value: 19, color: '#8b5cf6' },
  { name: 'Faculty', value: 14, color: '#06b6d4' },
  { name: 'Admins', value: 5, color: '#10b981' },
];

const allUsers = [
  { id: 1, name: 'Aditya Kumar', email: 'aditya@iitd.ac.in', role: 'student', joined: 'Jan 15, 2026', status: 'active', institution: 'IIT Delhi' },
  { id: 2, name: 'Arjun Mehta', email: 'arjun@google.com', role: 'alumni', joined: 'Dec 1, 2025', status: 'active', institution: 'IIT Delhi (2019)' },
  { id: 3, name: 'Dr. Meena Krishnan', email: 'meena@iitd.ac.in', role: 'faculty', joined: 'Nov 20, 2025', status: 'active', institution: 'IIT Delhi' },
  { id: 4, name: 'Priya Sharma', email: 'priya@amazon.com', role: 'alumni', joined: 'Dec 15, 2025', status: 'active', institution: 'IIT Delhi (2019)' },
  { id: 5, name: 'Rohan Das', email: 'rohan@bits.edu', role: 'student', joined: 'Feb 1, 2026', status: 'suspended', institution: 'BITS Pilani' },
  { id: 6, name: 'Tanvi Shah', email: 'tanvi@nit.ac.in', role: 'student', joined: 'Jan 28, 2026', status: 'active', institution: 'NIT Trichy' },
  { id: 7, name: 'Vikram Patel', email: 'vikram@uber.com', role: 'alumni', joined: 'Nov 5, 2025', status: 'active', institution: 'IIT Bombay (2020)' },
];

const pendingRegistrations = [
  { id: 1, name: 'Kavya Nair', email: 'kavya@cognizant.com', company: 'Cognizant', college: 'NIT Trichy (2021)', applied: '2 hrs ago', linkedin: 'linkedin.com/in/kavyanair' },
  { id: 2, name: 'Sandeep Reddy', email: 'sandeep@deloitte.com', company: 'Deloitte', college: 'BITS Pilani (2020)', applied: '5 hrs ago', linkedin: 'linkedin.com/in/sandeepreddy' },
  { id: 3, name: 'Isha Verma', email: 'isha@tcs.com', company: 'TCS', college: 'IIT Madras (2022)', applied: '1 day ago', linkedin: 'linkedin.com/in/ishaverma' },
  { id: 4, name: 'Kunal Joshi', email: 'kunal@infosys.com', company: 'Infosys', college: 'IIT Kharagpur (2019)', applied: '1 day ago', linkedin: 'linkedin.com/in/kunaljoshi' },
  { id: 5, name: 'Meghna Das', email: 'meghna@microsoft.com', company: 'Microsoft', college: 'IIT Delhi (2021)', applied: '2 days ago', linkedin: 'linkedin.com/in/meghnadas' },
];

const payments = [
  { id: 1, user: 'Aditya Kumar', type: 'Mentoring Session', amount: 800, date: 'Mar 3', status: 'success', mentor: 'Arjun Mehta' },
  { id: 2, user: 'Riya Kapoor', type: 'Mentoring Session', amount: 1000, date: 'Mar 2', status: 'success', mentor: 'Priya Sharma' },
  { id: 3, user: 'Karan Sharma', type: 'Premium Subscription', amount: 999, date: 'Mar 1', status: 'success', mentor: '-' },
  { id: 4, user: 'Pooja Nair', type: 'Mentoring Session', amount: 600, date: 'Feb 28', status: 'failed', mentor: 'Vikram Patel' },
  { id: 5, user: 'Tanmay Shah', type: 'Donation', amount: 500, date: 'Feb 27', status: 'success', mentor: '-' },
  { id: 6, user: 'Shreya Iyer', type: 'Mentoring Session', amount: 800, date: 'Feb 25', status: 'refunded', mentor: 'Rahul Verma' },
];

// ===================== OVERVIEW =====================
function AdminOverview({ setSection }: { setSection: (s: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='15' cy='15' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-white/70 text-sm font-[500] mb-1">Admin Panel</div>
            <h2 className="text-2xl font-[800]">Platform Overview</h2>
            <p className="text-white/80 text-sm mt-1">Alumni Connect · All Systems Operational ✅</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSection('registrations')} className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-[600] hover:bg-white/30 transition-all">
              8 Pending Approvals
            </button>
            <button onClick={() => setSection('announcements')} className="px-5 py-2.5 bg-white text-orange-600 rounded-xl text-sm font-[700] hover:scale-105 transition-all shadow-lg">
              Post Announcement
            </button>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '8,260', change: '+340 this month', icon: Users, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Revenue (Mar)', value: '₹2.5L', change: '+26% vs Feb', icon: TrendingUp, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Sessions Done', value: '398', change: 'This month', icon: Calendar, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Pending Reviews', value: '8', change: 'Alumni approvals', icon: AlertCircle, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
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

      {/* Revenue & User Growth */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[700] text-slate-900 dark:text-white">Revenue Growth</h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full font-[500]">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {roleDistribution.map((entry, i) => <Cell key={`admin-role-${i}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {roleDistribution.map(r => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-[500]">{r.name}</span>
                </div>
                <span className="font-[700] text-slate-900 dark:text-white">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[700] text-slate-900 dark:text-white">User Growth by Role</h3>
          <button onClick={() => setSection('users')} className="text-sm text-orange-600 dark:text-orange-400 font-[600] hover:underline">View Users</button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" stackId="a" />
            <Bar dataKey="alumni" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Alumni" stackId="a" />
            <Bar dataKey="faculty" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Faculty" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ===================== USER MANAGEMENT =====================
function UserManagementSection() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(allUsers);

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">User Management</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage all platform users</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
        </div>
        <div className="flex gap-2">
          {['all', 'student', 'alumni', 'faculty'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-[600] capitalize transition-all ${roleFilter === r ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30">
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Role</th>
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Institution</th>
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Joined</th>
                <th className="text-left px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="text-right px-6 py-4 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[700] text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-[600] text-sm text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-[700] capitalize ${
                      u.role === 'student' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                      u.role === 'alumni' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                      u.role === 'faculty' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.institution}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{u.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-[700] ${u.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                        <Ban className={`w-4 h-4 ${u.status === 'active' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'}`} />
                      </button>
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

// ===================== REGISTRATIONS =====================
function RegistrationsSection() {
  const [regs, setRegs] = useState(pendingRegistrations);

  const approve = (id: number) => setRegs(prev => prev.filter(r => r.id !== id));
  const reject = (id: number) => setRegs(prev => prev.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Alumni Registrations</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Review and approve new alumni registrations</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/50 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p className="text-sm text-amber-700 dark:text-amber-300 font-[500]">
          <span className="font-[700]">{regs.length} alumni registrations</span> are waiting for your approval. Please review their profiles carefully.
        </p>
      </div>

      <div className="space-y-4">
        {regs.map(r => (
          <div key={r.id} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[800] text-lg flex-shrink-0">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-[700] text-slate-900 dark:text-white">{r.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{r.email}</div>
                  </div>
                  <span className="text-xs text-slate-400 font-[500]">Applied {r.applied}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🏢 {r.company}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg font-[500]">🎓 {r.college}</span>
                  <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-[500]">
                    <Globe className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approve(r.id)}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-[700] rounded-xl hover:bg-green-200 dark:hover:bg-green-900/30 transition-all">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => reject(r.id)}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm font-[700] rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all">
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button className="px-6 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                View Profile
              </button>
            </div>
          </div>
        ))}
        {regs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
            <p className="font-[600]">All registrations have been processed!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== PAYMENTS =====================
function PaymentsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Payment Tracking</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor all platform transactions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹2,50,000', icon: '💰', color: 'from-green-500 to-emerald-600' },
          { label: 'Successful', value: '389', icon: '✅', color: 'from-blue-500 to-cyan-600' },
          { label: 'Failed', value: '12', icon: '❌', color: 'from-red-500 to-rose-600' },
          { label: 'Refunded', value: '8', icon: '🔄', color: 'from-amber-500 to-orange-500' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg text-center`}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-[900]">{value}</div>
            <div className="text-white/80 text-xs font-[600]">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
          <h3 className="font-[700] text-slate-900 dark:text-white">Recent Transactions</h3>
          <button className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-[600] hover:underline">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-900/30">
                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Mentor</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-[700] text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-[700] text-xs">
                        {p.user.charAt(0)}
                      </div>
                      <span className="font-[600] text-sm text-slate-900 dark:text-white">{p.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">{p.type}</td>
                  <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{p.mentor}</td>
                  <td className="px-6 py-3 text-right font-[800] text-slate-900 dark:text-white">₹{p.amount}</td>
                  <td className="px-6 py-3 text-right text-sm text-slate-500 dark:text-slate-400">{p.date}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-[700] ${
                      p.status === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      p.status === 'failed' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                      'bg-amber-100 dark:bg-amber-900/20 text-amber-600'
                    }`}>
                      {p.status === 'success' ? '✅ Success' : p.status === 'failed' ? '❌ Failed' : '🔄 Refunded'}
                    </span>
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

// ===================== REVENUE ANALYTICS =====================
function RevenueAnalyticsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Revenue Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Detailed revenue breakdown and projections</p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
        <h3 className="font-[700] text-slate-900 dark:text-white mb-4">Monthly Revenue & Sessions</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="rev2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(v: number, name: string) => [name === 'revenue' ? `₹${(v/1000).toFixed(0)}K` : v, name === 'revenue' ? 'Revenue' : 'Sessions']} />
            <Area key="revenue" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#rev2Grad)" name="revenue" />
            <Area key="sessions" type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} fill="url(#sessGrad)" name="sessions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { label: 'Mentoring Sessions', amount: '₹1,82,000', share: '72.8%', icon: '🎓', color: 'from-indigo-500 to-purple-600' },
          { label: 'Subscriptions', amount: '₹48,000', share: '19.2%', icon: '💎', color: 'from-blue-500 to-cyan-600' },
          { label: 'Events & Webinars', amount: '₹20,000', share: '8%', icon: '🎪', color: 'from-green-500 to-emerald-600' },
        ].map(({ label, amount, share, icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="text-2xl mb-3">{icon}</div>
            <div className="text-2xl font-[900] mb-1">{amount}</div>
            <div className="text-white/80 text-sm font-[600]">{label}</div>
            <div className="mt-2 text-white/70 text-xs font-[500]">{share} of total revenue</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== ANNOUNCEMENTS =====================
function AnnouncementsSection() {
  const [showForm, setShowForm] = useState(false);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Platform Maintenance - Mar 10', content: 'The platform will undergo maintenance from 2AM to 4AM IST on March 10, 2026.', audience: 'All', date: 'Mar 3, 2026', priority: 'high' },
    { id: 2, title: 'New Feature: AI Mentor Matching v2.0', content: "We've upgraded our AI mentor matching algorithm! Expect better matches and faster recommendations.", audience: 'Students', date: 'Feb 28, 2026', priority: 'normal' },
    { id: 3, title: 'Hackathon 2026 Registration Open!', content: 'CodeSprint 2026 is now accepting team registrations. Form your teams and register before Mar 8.', audience: 'All', date: 'Feb 25, 2026', priority: 'normal' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-[800] text-slate-900 dark:text-white mb-1">Announcements</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Broadcast messages to platform users</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
          <h3 className="font-[700] text-slate-900 dark:text-white mb-5">New Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input placeholder="Announcement title..." className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea rows={4} placeholder="Write your announcement..." className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Target Audience</label>
                <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                  <option>All Users</option>
                  <option>Students Only</option>
                  <option>Alumni Only</option>
                  <option>Faculty Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                <select className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/30">
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
              Publish Announcement
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-[600] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className={`bg-white dark:bg-slate-800/50 rounded-2xl p-5 border-l-4 ${a.priority === 'high' ? 'border-l-red-500' : 'border-l-indigo-500'} border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-[700] text-slate-900 dark:text-white">{a.title}</h3>
              <div className="flex items-center gap-2">
                {a.priority === 'high' && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-[700] rounded-full">🔴 High Priority</span>}
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-[600] rounded-full">{a.audience}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{a.content}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">Published: {a.date}</span>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="Delete">
                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [section, setSection] = useState('overview');

  const sectionComponents: Record<string, React.ReactNode> = {
    overview: <AdminOverview setSection={setSection} />,
    users: <UserManagementSection />,
    registrations: <RegistrationsSection />,
    payments: <PaymentsSection />,
    revenue: <RevenueAnalyticsSection />,
    announcements: <AnnouncementsSection />,
    events: (
      <div className="space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Event Management</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: 'CodeSprint 2026 Hackathon', type: 'Hackathon', date: 'Mar 8-10', teams: 28, status: 'active' },
            { title: 'Alumni Reunion 2026', type: 'Event', date: 'Apr 15', attendees: 142, status: 'upcoming' },
            { title: 'Career Fair Spring 2026', type: 'Career Fair', date: 'Mar 25', attendees: 380, status: 'upcoming' },
            { title: 'ML Workshop Series', type: 'Workshop', date: 'Mar 12-14', attendees: 95, status: 'upcoming' },
          ].map((e, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-[700] text-slate-900 dark:text-white">{e.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-[700] ${e.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>{e.status}</span>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">{e.type} · 📅 {e.date}</div>
              <div className="text-sm font-[600] text-indigo-600 dark:text-indigo-400">
                👥 {e.type === 'Hackathon' ? `${e.teams} teams` : `${e.attendees} registered`}
              </div>
              <button className="mt-4 w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-[700] rounded-xl hover:scale-[1.02] transition-all shadow-md">
                Manage Event
              </button>
            </div>
          ))}
        </div>
      </div>
    ),
    settings: (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-2xl font-[800] text-slate-900 dark:text-white">Platform Settings</h2>
        {[
          { title: 'General Settings', items: ['Platform Name', 'Support Email', 'Default Language', 'Time Zone'] },
          { title: 'Feature Flags', items: ['AI Mentor Matching', 'Paid Sessions', 'Donation Module', 'Gamification System'] },
          { title: 'Payment Settings', items: ['Payment Gateway', 'Platform Commission (%)', 'Payout Schedule', 'Minimum Payout'] },
        ].map(({ title, items }) => (
          <div key={title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50">
            <h3 className="font-[700] text-slate-900 dark:text-white mb-4">{title}</h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/30 last:border-0">
                  <span className="text-sm font-[500] text-slate-700 dark:text-slate-300">{item}</span>
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 font-[600] hover:underline">Configure</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <DashboardLayout
      navItems={navItems.map(item => ({ ...item, badge: item.key === 'registrations' ? 8 : undefined }))}
      activeSection={section}
      onSectionChange={setSection}
      role="admin"
      userName="Admin Panel"
      userSubtitle="Super Administrator"
      notifications={notifications}
    >
      {sectionComponents[section] || sectionComponents.overview}
    </DashboardLayout>
  );
}
