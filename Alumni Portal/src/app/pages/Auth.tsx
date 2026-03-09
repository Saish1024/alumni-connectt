import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  GraduationCap, Mail, Lock, Eye, EyeOff, User, Building,
  ArrowRight, CheckCircle, Sun, Moon, ArrowLeft, Phone, Calendar,
  Briefcase,
} from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';
type Role = 'student' | 'alumni' | 'faculty' | 'admin';

const roleInfo = {
  student: {
    icon: '🎓',
    label: 'Student',
    desc: 'Access mentors, jobs & learning',
    color: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  alumni: {
    icon: '🏆',
    label: 'Alumni',
    desc: 'Mentor students & give back',
    color: 'from-violet-500 to-pink-600',
    border: 'border-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  faculty: {
    icon: '👨‍🏫',
    label: 'Faculty',
    desc: 'Monitor & guide students',
    color: 'from-blue-500 to-cyan-600',
    border: 'border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  admin: {
    icon: '⚙️',
    label: 'Admin',
    desc: 'Manage the platform',
    color: 'from-orange-500 to-red-600',
    border: 'border-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const { setIsLoggedIn, setRole, setUser } = useApp();
  const navigate = useNavigate();

  const avatarMap: Record<Role, string> = {
    student: 'https://images.unsplash.com/photo-1533142215-a17cdfb95243?w=150&h=150&fit=crop',
    alumni: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=150&h=150&fit=crop',
    faculty: 'https://images.unsplash.com/photo-1659353220597-71b8c6a56259?w=150&h=150&fit=crop',
    admin: 'https://images.unsplash.com/photo-1646602976052-394190101be0?w=150&h=150&fit=crop',
  };

  const nameMap: Record<Role, string> = {
    student: 'Arjun Mehta',
    alumni: 'Ankit Patel',
    faculty: 'Dr. Meera Nair',
    admin: 'Priya Sharma',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setRole(selectedRole);
    setUser({
      name: nameMap[selectedRole],
      email: email || `${selectedRole}@university.edu`,
      role: selectedRole,
      avatar: avatarMap[selectedRole],
      college: 'MIT College of Engineering',
      batch: selectedRole === 'student' ? '2024' : selectedRole === 'alumni' ? '2020' : undefined,
    });
    const dashPaths: Record<Role, string> = {
      student: '/dashboard/student',
      alumni: '/dashboard/alumni',
      faculty: '/dashboard/faculty',
      admin: '/dashboard/admin',
    };
    navigate(dashPaths[selectedRole]);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* Role selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Login as</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(roleInfo) as Role[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                selectedRole === r
                  ? `${roleInfo[r].border} ${roleInfo[r].bg}`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-xl">{roleInfo[r].icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{roleInfo[r].label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{roleInfo[r].desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <Link to="/forgot-password" className="text-xs text-indigo-500 hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-xl bg-gradient-to-r ${roleInfo[selectedRole].color} text-white font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
      >
        Login as {roleInfo[selectedRole].label} <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-indigo-500 font-medium hover:underline">Sign up free</Link>
      </p>
    </form>
  );
}

function SignupForm() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [college, setCollege] = useState('');
  const [batch, setBatch] = useState('');
  const [phone, setPhone] = useState('');
  const { setIsLoggedIn, setRole, setUser } = useApp();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setRole(selectedRole);
    setUser({
      name: name || 'New User',
      email: email,
      role: selectedRole,
      avatar: 'https://images.unsplash.com/photo-1533142215-a17cdfb95243?w=150&h=150&fit=crop',
      college: college || 'MIT College of Engineering',
      batch: batch,
    });
    const dashPaths: Record<Role, string> = {
      student: '/dashboard/student',
      alumni: '/dashboard/alumni',
      faculty: '/dashboard/faculty',
      admin: '/dashboard/admin',
    };
    navigate(dashPaths[selectedRole]);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(roleInfo) as Role[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    selectedRole === r
                      ? `${roleInfo[r].border} ${roleInfo[r].bg}`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{roleInfo[r].icon}</span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{roleInfo[r].label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{roleInfo[r].desc}</p>
                  {selectedRole === r && <CheckCircle className="w-5 h-5 text-indigo-500" />}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${roleInfo[selectedRole].color} text-white font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
          >
            Continue as {roleInfo[selectedRole].label} <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">College / Institution</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="Your institution"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
              </div>
            </div>
            {(selectedRole === 'student' || selectedRole === 'alumni') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {selectedRole === 'student' ? 'Graduation Year' : 'Passing Year'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={batch} onChange={e => setBatch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm">
                    <option value="">Select year</option>
                    {[2024, 2025, 2026, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" required
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" required className="mt-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              I agree to the{' '}
              <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>
            </p>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl bg-gradient-to-r ${roleInfo[selectedRole].color} text-white font-semibold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </>
      )}

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-500 font-medium hover:underline">Login here</Link>
      </p>
    </form>
  );
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return sent ? (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Check Your Email</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We've sent password reset instructions to {email}</p>
      <Link to="/login" className="text-indigo-500 font-medium hover:underline text-sm">Back to Login</Link>
    </div>
  ) : (
    <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your registered email" required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm" />
        </div>
      </div>
      <button type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-lg">
        Send Reset Link
      </button>
      <p className="text-center text-sm">
        <Link to="/login" className="text-indigo-500 hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </p>
    </form>
  );
}

const modeConfig = {
  login: { title: 'Welcome back!', subtitle: 'Sign in to your account to continue' },
  signup: { title: 'Join Alumni Connect', subtitle: 'Create your free account today' },
  forgot: { title: 'Forgot Password?', subtitle: 'No worries, we\'ll send reset instructions' },
};

export function Login() {
  return <AuthPage mode="login" />;
}
export function Signup() {
  return <AuthPage mode="signup" />;
}
export function ForgotPassword() {
  return <AuthPage mode="forgot" />;
}

function AuthPage({ mode }: { mode: AuthMode }) {
  const { isDark, toggleTheme } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Alumni Connect</p>
              <p className="text-xs text-gray-400">Platform</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{modeConfig[mode].title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{modeConfig[mode].subtitle}</p>

          {mode === 'login' && <LoginForm />}
          {mode === 'signup' && <SignupForm />}
          {mode === 'forgot' && <ForgotPasswordForm />}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
