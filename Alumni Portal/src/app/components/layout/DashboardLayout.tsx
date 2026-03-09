import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function DashboardLayout() {
  const { isLoggedIn, role, setRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync role from URL
  useEffect(() => {
    if (location.pathname.includes('/dashboard/alumni')) setRole('alumni');
    else if (location.pathname.includes('/dashboard/faculty')) setRole('faculty');
    else if (location.pathname.includes('/dashboard/admin')) setRole('admin');
    else if (location.pathname.includes('/dashboard/student')) setRole('student');
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <TopNav />
      <main className="pt-16 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: 'var(--sidebar-width, 16rem)' }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
