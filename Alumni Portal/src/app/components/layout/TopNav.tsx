import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../../context/AppContext';
import {
  Menu, Search, Bell, Sun, Moon, ChevronDown,
  Settings, LogOut, User, Zap, X,
} from 'lucide-react';

const notifications = [
  { id: 1, type: 'session', text: 'Priya Sharma confirmed your session for tomorrow', time: '2m ago', read: false },
  { id: 2, type: 'quiz', text: 'You earned the "Python Master" badge!', time: '1h ago', read: false },
  { id: 3, type: 'job', text: 'New internship at Google matches your profile', time: '3h ago', read: true },
  { id: 4, type: 'message', text: 'Rahul sent you a message', time: '5h ago', read: true },
  { id: 5, type: 'cert', text: 'Your certificate has been approved', time: '1d ago', read: true },
];

export function TopNav() {
  const { isDark, toggleTheme, user, role, sidebarOpen, setSidebarOpen, setIsLoggedIn, setRole } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleColors: Record<string, string> = {
    student: 'from-indigo-500 to-purple-600',
    alumni: 'from-violet-500 to-pink-600',
    faculty: 'from-blue-500 to-cyan-600',
    admin: 'from-orange-500 to-red-600',
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleRoleSwitch = (r: 'student' | 'alumni' | 'faculty' | 'admin') => {
    setRole(r);
    const paths: Record<string, string> = {
      student: '/dashboard/student',
      alumni: '/dashboard/alumni',
      faculty: '/dashboard/faculty',
      admin: '/dashboard/admin',
    };
    navigate(paths[r]);
    setShowProfile(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-4"
      style={{ paddingLeft: sidebarOpen ? 'calc(16rem + 1rem)' : '5rem' }}
    >
      {/* Menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search mentors, jobs, courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Points indicator */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">2,450 pts</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</span>
                <span className="text-xs text-indigo-500 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex gap-3 items-start ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 truncate">{user.name.split(' ')[0]}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className={`px-4 py-4 bg-gradient-to-r ${roleColors[role]} text-white`}>
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30" />
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs opacity-80 capitalize">{role} • {user.college}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  <User className="w-4 h-4" />
                  View Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
