import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const roleRoutes: Record<string, string> = {
  student: '/student',
  alumni: '/alumni',
  faculty: '/faculty',
  admin: '/admin',
};

export default function Login() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(roleRoutes[role] || '/student');
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-[500]">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/40">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-[800] text-white mb-1">
              {forgotMode ? 'Reset Password' : 'Welcome Back!'}
            </h1>
            <p className="text-white/60 text-sm">
              {forgotMode ? 'Enter your email to reset your password' : 'Sign in to your Alumni Connect account'}
            </p>
          </div>

          {forgotMode ? (
            forgotSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✉️</span>
                </div>
                <p className="text-white font-[600] mb-2">Reset link sent!</p>
                <p className="text-white/60 text-sm mb-6">Check your email for a password reset link.</p>
                <button onClick={() => { setForgotMode(false); setForgotSent(false); }} className="text-indigo-400 hover:text-indigo-300 text-sm font-[600] transition-colors">
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-sm font-[600] text-white/80 mb-2">Email Address</label>
                  <input
                    type="email" required
                    placeholder="you@university.edu"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all">
                  Send Reset Link
                </button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-white/60 hover:text-white text-sm transition-colors">
                  Back to Sign In
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-[600] text-white/80 mb-3">Sign in as</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'student', label: 'Student' },
                    { key: 'alumni', label: 'Alumni' },
                    { key: 'faculty', label: 'Faculty' },
                    { key: 'admin', label: 'Admin' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRole(key)}
                      className={`py-2 px-2 rounded-xl text-xs font-[600] transition-all border ${
                        role === key
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-[600] text-white/80 mb-2">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@university.edu"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-[600] text-white/80">Password</label>
                  <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-indigo-400 hover:text-indigo-300 font-[500] transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/40 font-[500]">OR</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Quick Demo Logins */}
              <div className="grid grid-cols-2 gap-2">
                {(['student', 'alumni', 'faculty', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => navigate(roleRoutes[r])}
                    className="py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-xs font-[600] rounded-xl transition-all capitalize">
                    Demo: {r}
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* Sign up link */}
          {!forgotMode && (
            <p className="text-center text-white/50 text-sm mt-6">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-indigo-400 hover:text-indigo-300 font-[600] transition-colors">
                Sign up for free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
