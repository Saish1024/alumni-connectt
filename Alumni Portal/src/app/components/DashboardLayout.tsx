import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  GraduationCap, Bell, Search, Sun, Moon, Menu, X, ChevronRight,
  LogOut, Settings, User, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: string;
  badge?: number;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (key: string) => void;
  role: string;
  userName: string;
  userAvatar?: string;
  userSubtitle?: string;
  children: React.ReactNode;
  notifications?: { id: number; text: string; time: string; read: boolean }[];
}

export default function DashboardLayout({
  navItems,
  activeSection,
  onSectionChange,
  role,
  userName,
  userAvatar,
  userSubtitle,
  children,
  notifications = [],
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleColors: Record<string, string> = {
    student: 'from-blue-500 to-cyan-600',
    alumni: 'from-purple-500 to-violet-600',
    faculty: 'from-green-500 to-emerald-600',
    admin: 'from-orange-500 to-red-600',
  };

  const gradientClass = roleColors[role] || 'from-indigo-500 to-purple-600';

  return (
    <div className={`${isDark ? 'dark' : ''} flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-[Inter,sans-serif]`}>
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col
        bg-slate-900 dark:bg-slate-950 border-r border-slate-700/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-700/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-[800] text-white text-sm">Alumni Connect</div>
            <div className={`text-xs font-[600] bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent capitalize`}>{role} Portal</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map(({ icon: Icon, label, key, badge }) => (
              <button
                key={key}
                onClick={() => { onSectionChange(key); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group
                  ${activeSection === key
                    ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }
                `}>
                <Icon className={`w-5 h-5 flex-shrink-0 ${activeSection === key ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="font-[500] text-sm flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-[700] ${activeSection === key ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {badge}
                  </span>
                )}
                {activeSection === key && <ChevronRight className="w-4 h-4 text-white/60" />}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 text-white font-[700] text-sm`}>
                {userName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-[600] text-white text-sm truncate">{userName}</div>
              <div className="text-xs text-slate-400 truncate capitalize">{userSubtitle || role}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 mt-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-sm font-[500]">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* TOP NAV */}
        <header className="flex-shrink-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-4 px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder="Search mentors, jobs, quizzes..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-[800] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-[700] text-slate-900 dark:text-white text-sm">Notifications</span>
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 font-[600] cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length ? notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center text-slate-400 text-sm">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-[700] text-sm`}>
                    {userName.charAt(0)}
                  </div>
                )}
                <span className="font-[600] text-slate-700 dark:text-slate-200 text-sm hidden sm:block">{userName}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="font-[700] text-slate-900 dark:text-white text-sm">{userName}</div>
                    <div className="text-xs text-slate-400 capitalize">{role}</div>
                  </div>
                  {[
                    { icon: User, label: 'Profile', action: () => onSectionChange('profile') },
                    { icon: Settings, label: 'Settings', action: () => onSectionChange('settings') },
                    { icon: LogOut, label: 'Sign Out', action: () => navigate('/') },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={() => { action(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                      <Icon className="w-4 h-4 text-slate-400" /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
