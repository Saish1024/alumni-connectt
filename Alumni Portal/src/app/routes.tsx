import { createBrowserRouter } from 'react-router';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  { path: '/student', Component: StudentDashboard },
  { path: '/alumni', Component: AlumniDashboard },
  { path: '/faculty', Component: FacultyDashboard },
  { path: '/admin', Component: AdminDashboard },
]);
