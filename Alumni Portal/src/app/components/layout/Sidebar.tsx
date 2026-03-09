import { Link, useLocation } from 'react-router';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Users, BookOpen, Briefcase, Trophy,
  Heart, Award, MessageCircle, Calendar, Settings,
  GraduationCap, BarChart3, ClipboardList, DollarSign,
  Zap, X, ChevronRight, Star, Globe, Bell,
} from 'lucide-react';

const studentNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/student' },
  { icon: Users, label: 'Find Mentors', path: '/dashboard/mentoring' },
  { icon: Calendar, label: 'Sessions', path: '/dashboard/sessions' },
  { icon: Zap, label: 'Quiz & Tests', path: '/dashboard/quiz' },
  { icon: Briefcase, label: 'Jobs & Internships', path: '/dashboard/jobs' },
  { icon: Trophy, label: 'Leaderboard', path: '/dashboard/leaderboard' },
  { icon: Award, label: 'Certificates', path: '/dashboard/certificates' },
  { icon: Heart, label: 'Donations', path: '/dashboard/donations' },
  { icon: MessageCircle, label: 'Community', path: '/dashboard/community' },
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const alumniNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/alumni' },
  { icon: Users, label: 'My Students', path: '/dashboard/students' },
  { icon: Calendar, label: 'Sessions', path: '/dashboard/sessions' },
  { icon: DollarSign, label: 'Earnings', path: '/dashboard/earnings' },
  { icon: Briefcase, label: 'Post Jobs', path: '/dashboard/jobs' },
  { icon: ClipboardList, label: 'Resume Reviews', path: '/dashboard/resumes' },
  { icon: Zap, label: 'Create Quiz', path: '/dashboard/quiz' },
  { icon: Globe, label: 'Events', path: '/dashboard/events' },
  { icon: Star, label: 'Reputation', path: '/dashboard/reputation' },
  { icon: Award, label: 'Certifications', path: '/dashboard/certificates' },
  { icon: Heart, label: 'Donations', path: '/dashboard/donations' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const facultyNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/faculty' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: Users, label: 'Students', path: '/dashboard/students' },
  { icon: Zap, label: 'Quiz Analytics', path: '/dashboard/quiz' },
  { icon: Award, label: 'Certifications', path: '/dashboard/certificates' },
  { icon: Trophy, label: 'Competitions', path: '/dashboard/competitions' },
  { icon: MessageCircle, label: 'Communication', path: '/dashboard/community' },
  { icon: ClipboardList, label: 'Reports', path: '/dashboard/reports' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const adminNav = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin' },
  { icon: Users, label: 'User Management', path: '/dashboard/users' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: DollarSign, label: 'Payments', path: '/dashboard/payments' },
  { icon: Heart, label: 'Donations', path: '/dashboard/donations' },
  { icon: Globe, label: 'Events', path: '/dashboard/events' },
  { icon: Trophy, label: 'Hackathons', path: '/dashboard/hackathons' },
  { icon: Award, label: 'Certifications', path: '/dashboard/certificates' },
  { icon: Bell, label: 'Announcements', path: '/dashboard/announcements' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

function getNavItems(role: string) {
  switch (role) {
    case 'alumni': return alumniNav;
    case 'faculty': return facultyNav;
    case 'admin': return adminNav;
    default: return studentNav;
  }
}

const roleColors: Record<string, string> = {
  student: 'from-indigo-500 to-purple-600',
  alumni: 'from-violet-500 to-pink-600',
  faculty: 'from-blue-500 to-cyan-600',
  admin: 'from-orange-500 to-red-600',
};

const roleBadgeColors: Record<string, string> = {
  student: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  alumni: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  faculty: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export function Sidebar() {
  const { role, user, sidebarOpen, setSidebarOpen, isDark } = useApp();
  const location = useLocation();
  const navItems = getNavItems(role);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        overflow-hidden
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate text-sm leading-tight">Alumni Connect</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Platform</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[role]}`}>
                  {role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 group
                  ${isActive
                    ? `bg-gradient-to-r ${roleColors[role]} text-white shadow-md`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`flex-shrink-0 ${sidebarOpen ? 'w-4 h-4' : 'w-5 h-5 mx-auto'}`} />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Switch role */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium uppercase tracking-wide">Switch View</p>
            <div className="grid grid-cols-2 gap-1">
              {(['student', 'alumni', 'faculty', 'admin'] as const).map(r => (
                <Link
                  key={r}
                  to={r === 'student' ? '/dashboard/student' : r === 'alumni' ? '/dashboard/alumni' : r === 'faculty' ? '/dashboard/faculty' : '/dashboard/admin'}
                  className={`px-2 py-1 rounded-lg text-xs font-medium text-center capitalize transition-all ${
                    role === r
                      ? `bg-gradient-to-r ${roleColors[r]} text-white`
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {r}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
