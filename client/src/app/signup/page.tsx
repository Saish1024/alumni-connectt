"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, ArrowLeft, ArrowRight, Eye, EyeOff, Check, Users, BookOpen, Briefcase, Shield, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
    'Electronics and Computer Science',
    'Computer Engineering',
    'Information Technology',
    'Artificial Intelligence and Data Science',
    'Artificial Intelligence and Machine Learning',
    'Mechatronics'
];

const roles = [
    {
        key: 'student',
        label: 'Student',
        desc: 'Find mentors, apply to jobs, take quizzes',
        icon: BookOpen,
        color: 'from-blue-500 to-cyan-600',
    },
    {
        key: 'alumni',
        label: 'Alumni',
        desc: 'Mentor students, post jobs, earn money',
        icon: GraduationCap,
        color: 'from-purple-500 to-violet-600',
    },
    {
        key: 'faculty',
        label: 'Faculty',
        desc: 'Monitor progress, manage certifications',
        icon: Users,
        color: 'from-green-500 to-emerald-600',
    }
] as const;

const roleRoutes: Record<string, string> = {
    student: '/dashboard',
    alumni: '/dashboard',
    faculty: '/dashboard',
    admin: '/dashboard',
};

export default function SignupPage() {
    const router = useRouter();
    const { register, isLoading, error } = useAuth();
    const [step, setStep] = useState(1); // 1 = role selection, 2 = details, 3 = done
    const [selectedRole, setSelectedRole] = useState<'student' | 'alumni' | 'faculty' | 'admin' | ''>('');
    const [showPass, setShowPass] = useState(false);

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        institution: '', department: '', year: '', phoneNumber: '', linkedin: '', company: '', jobTitle: '', major: '',
        agree: false,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [yearSearch, setYearSearch] = useState('');
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const currentYear = new Date().getFullYear();
    const alumniYears = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (currentYear - i).toString());
    const filteredYears = alumniYears.filter(y => y.includes(yearSearch));

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.firstName.trim() || !form.lastName.trim()) errs.name = 'Full name is required';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
        if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        
        // Validation for different roles
        if (selectedRole === 'student' || selectedRole === 'alumni') {
            if (!form.year) errs.year = 'Year is required';
        }
        if (!form.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
        if (selectedRole === 'alumni') {
            if (!form.linkedin) errs.linkedin = 'LinkedIn link is required';
        }
        if (selectedRole === 'faculty') {
            if (!form.jobTitle) errs.jobTitle = 'Designation is required';
        }

        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !selectedRole) return;

        try {
            await register({
                name: `${form.firstName} ${form.lastName}`,
                email: form.email,
                password: form.password,
                role: selectedRole,
                batchYear: form.year,
                phoneNumber: form.phoneNumber,
                company: form.company,
                jobTitle: form.jobTitle,
                industry: form.institution,
                linkedin: form.linkedin,
            });
            // Registration succeeded — show "Verification Pending" screen.
            setStep(3);
        } catch {
            // Error handled by AuthContext
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen dark bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/40">
                            <AlertCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-[800] text-white mb-3">Verification Pending ⏳</h2>
                        <p className="text-white/60 mb-8">Your account has been created successfully! A request has been sent to the Admin to verify your profile. You will be able to log in once approved.</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg hover:scale-[1.02] transition-all">
                                Back to Login
                            </button>
                            <button onClick={() => router.push('/')} className="w-full py-3 text-white/50 hover:text-white text-sm transition-colors">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden font-[Inter,sans-serif]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

            <div className="w-full max-w-lg relative">
                <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm font-[500]">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/40">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-[800] text-white mb-1">Create Account</h1>
                        <p className="text-white/60 text-sm">
                            {step === 1 ? 'Choose your role to get started' : 'Fill in your details'}
                        </p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2].map(s => (
                            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-white/10'}`} />
                        ))}
                    </div>

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-white/60 text-sm text-center mb-6">I'm signing up as a...</p>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map(({ key, label, desc, icon: Icon, color }) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedRole(key)}
                                        className={`p-5 rounded-2xl border text-left transition-all ${selectedRole === key
                                            ? 'border-indigo-400/50 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                            }`}>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="font-[700] text-white text-sm mb-1">{label}</div>
                                        <div className="text-xs text-white/50 leading-snug">{desc}</div>
                                        {selectedRole === key && (
                                            <div className="mt-3 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={!selectedRole}
                                onClick={() => setStep(2)}
                                className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100 flex items-center justify-center gap-2">
                                Continue <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Details Form */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-[600] text-white/80 mb-2">First Name</label>
                                    <input
                                        required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                                        placeholder="John"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-white/80 mb-2">Last Name</label>
                                    <input
                                        required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                                        placeholder="Doe"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-[600] text-white/80 mb-2">Email Address</label>
                                <input
                                    type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@university.edu"
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                />
                                {validationErrors.email && <p className="text-xs text-red-400 mt-1 ml-1">{validationErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-[600] text-white/80 mb-2">Mobile Number</label>
                                <input
                                    type="tel" required value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                />
                                {validationErrors.phoneNumber && <p className="text-xs text-red-400 mt-1 ml-1">{validationErrors.phoneNumber}</p>}
                            </div>

                            {selectedRole === 'alumni' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-[600] text-white/80 mb-2">Company</label>
                                            <input
                                                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                                                placeholder="Google"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-[600] text-white/80 mb-2">Job Title</label>
                                            <input
                                                value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })}
                                                placeholder="Senior Engineer"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-[600] text-white/80 mb-2">LinkedIn Profile</label>
                                        <input
                                            required value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })}
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-[600] text-white/80 mb-2">
                                        {selectedRole === 'faculty' ? 'Department' : 'Major/Branch'}
                                    </label>
                                    <select
                                        required 
                                        value={form.institution} 
                                        onChange={e => setForm({ ...form, institution: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                    >
                                        <option value="" className="bg-slate-900">Select Department</option>
                                        {DEPARTMENTS.map(dept => (
                                            <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    {selectedRole === 'faculty' ? (
                                        <>
                                            <label className="block text-sm font-[600] text-white/80 mb-2">Designation</label>
                                            <input
                                                required value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })}
                                                placeholder="e.g. Professor"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <label className="block text-sm font-[600] text-white/80 mb-2">
                                                {selectedRole === 'alumni' ? 'Grad Year' : 'Current Year'}
                                            </label>
                                            {selectedRole === 'student' ? (
                                                <select
                                                    required 
                                                    value={form.year} 
                                                    onChange={e => setForm({ ...form, year: e.target.value })}
                                                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                                >
                                                    <option value="" className="bg-slate-900 border-none">Select</option>
                                                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                                                        <option key={y} value={y} className="bg-slate-900">{y}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="relative">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Search year..."
                                                            value={form.year || yearSearch}
                                                            onFocus={() => {
                                                                setShowYearDropdown(true);
                                                                if (form.year) {
                                                                    setYearSearch(form.year);
                                                                    setForm({ ...form, year: '' });
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                setYearSearch(e.target.value);
                                                                setShowYearDropdown(true);
                                                            }}
                                                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowYearDropdown(!showYearDropdown)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {showYearDropdown && (
                                                        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-slate-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl scrollbar-thin scrollbar-thumb-white/10">
                                                            {filteredYears.length > 0 ? (
                                                                filteredYears.map(y => (
                                                                    <button
                                                                        key={y}
                                                                        type="button"
                                                                        className="w-full px-4 py-3 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-none"
                                                                        onClick={() => {
                                                                            setForm({ ...form, year: y });
                                                                            setYearSearch(y);
                                                                            setShowYearDropdown(false);
                                                                        }}
                                                                    >
                                                                        {y}
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-sm text-white/40 italic">No years found</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-[600] text-white/80 mb-2">Password</label>
                                <div className="relative mb-2">
                                    <input
                                        type={showPass ? 'text' : 'password'} required
                                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'} required
                                        value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                        placeholder="Confirm password"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-[400]"
                                    />
                                    {validationErrors.confirmPassword && <p className="text-xs text-red-400 mt-1 ml-1">{validationErrors.confirmPassword}</p>}
                                </div>
                            </div>


                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox" id="agree" required
                                    checked={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })}
                                    className="mt-1 w-4 h-4 rounded accent-indigo-500"
                                />
                                <label htmlFor="agree" className="text-sm text-white/60 cursor-pointer">
                                    I agree to the{' '}
                                    <span className="text-indigo-400 hover:underline cursor-pointer">Terms of Service</span>
                                    {' '}and{' '}
                                    <span className="text-indigo-400 hover:underline cursor-pointer">Privacy Policy</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl font-[600] hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    type="submit" disabled={isLoading}
                                    className="flex-2 flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-white/50 text-sm mt-6">
                        Already have an account?{' '}
                        <button onClick={() => router.push('/login')} className="text-indigo-400 hover:text-indigo-300 font-[600] transition-colors">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
