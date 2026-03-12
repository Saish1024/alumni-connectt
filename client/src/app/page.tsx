"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Users, BookOpen, Award, Briefcase, MessageCircle, Star,
    ArrowRight, Check, Sparkles, TrendingUp, Globe, Shield,
    Zap, Heart, Menu, X, Sun, Moon, Play, ChevronRight,
    GraduationCap, Video, Trophy, FileText, Code2, HandHeart,
    Linkedin, Twitter, Github, Instagram, Mail, MapPin, Phone,
} from 'lucide-react';

const alumni = [
    {
        name: 'Priya Sharma',
        role: 'Senior SDE @ Google',
        batch: 'B.Tech CS 2019',
        quote: 'Alumni Connect helped me land my dream job through referrals and mentorship from seniors.',
        achievement: '3x Promoted in 4 years',
        img: 'https://images.unsplash.com/photo-1650784855038-9f4d5ed154a9?w=200&h=200&fit=crop',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        name: 'Arjun Mehta',
        role: 'Co-Founder @ TechStart',
        batch: 'B.Tech ECE 2018',
        quote: 'The platform\'s quizzes and hackathons helped me build skills that led to my startup.',
        achievement: 'Raised $2M Seed Round',
        img: 'https://images.unsplash.com/photo-1570215170761-f056128eda48?w=200&h=200&fit=crop',
        color: 'from-purple-500 to-pink-600',
    },
    {
        name: 'Mei Lin',
        role: 'Data Scientist @ Microsoft',
        batch: 'M.Tech AI 2020',
        quote: 'The AI mentor matching found me the perfect mentor who guided me through my job search.',
        achievement: 'Published 4 Research Papers',
        img: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?w=200&h=200&fit=crop',
        color: 'from-cyan-500 to-blue-600',
    },
];

const features = [
    {
        icon: Sparkles,
        title: 'AI Mentor Matching',
        desc: 'Our AI analyzes your skills, goals, and interests to recommend the perfect alumni mentors for you.',
        color: 'from-violet-500 to-purple-600',
    },
    {
        icon: Briefcase,
        title: 'Job Referrals',
        desc: 'Get referred directly by alumni working at top companies. Skip the queue and get noticed.',
        color: 'from-blue-500 to-cyan-600',
    },
    {
        icon: Code2,
        title: 'Quizzes & Coding Tests',
        desc: 'Practice with topic-wise quizzes, coding challenges, and hackathons created by alumni.',
        color: 'from-green-500 to-emerald-600',
    },
    {
        icon: FileText,
        title: 'Resume Reviews',
        desc: 'Get your resume reviewed by alumni with hiring experience at top companies worldwide.',
        color: 'from-orange-500 to-amber-600',
    },
    {
        icon: Trophy,
        title: 'Gamification & Badges',
        desc: 'Earn points, unlock badges, and climb the leaderboard as you learn and grow.',
        color: 'from-pink-500 to-rose-600',
    },
    {
        icon: Video,
        title: 'Live Mentoring Sessions',
        desc: 'Book 1:1 video sessions with mentors. Free or paid — your choice.',
        color: 'from-indigo-500 to-blue-600',
    },
];

// Stat definition removed

const testimonials = [
    {
        name: 'Rohit Jain',
        role: 'Final Year CSE Student',
        text: 'I got placed at Amazon through an alumni referral. This platform is a game changer for students.',
        stars: 5,
    },
    {
        name: 'Sneha Patel',
        role: 'MBA Student',
        text: 'The mentoring sessions helped me crack my MBA interviews. Worth every rupee!',
        stars: 5,
    },
    {
        name: 'Karan Gupta',
        role: 'B.Tech 3rd Year',
        text: 'Quiz section is amazing! I improved my DSA skills significantly in just 2 months.',
        stars: 5,
    },
];

const steps = [
    {
        step: '01',
        title: 'Sign Up & Set Your Goals',
        desc: 'Create your profile as a student, alumni, faculty, or admin. Tell us your interests and career goals.',
    },
    {
        step: '02',
        title: 'Connect with Mentors',
        desc: 'Browse alumni mentors filtered by skills, company, role, and availability. Book sessions instantly.',
    },
    {
        step: '03',
        title: 'Learn, Grow & Get Placed',
        desc: 'Attend sessions, complete quizzes, earn badges, get referrals, and land your dream career.',
    },
];

export default function Landing() {
    const router = useRouter();
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    if (!mounted) return null; // Prevent hydration mismatch

    return (
        <div className={`min-h-screen ${isDark ? 'dark' : ''} bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-[Inter,sans-serif]`}>
            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-[800] text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Alumni Connect</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {['Features', 'How it Works', 'Success Stories', 'Pricing'].map(item => (
                                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-[500]">
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className="px-4 py-2 text-sm font-[500] text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
                                className="px-5 py-2.5 text-sm font-[600] bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all">
                                Get Started Free
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center gap-2">
                            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-3">
                        {['Features', 'How it Works', 'Success Stories'].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-sm text-slate-600 dark:text-slate-300 py-2">{item}</a>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => router.push('/login')} className="flex-1 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-xl text-center font-[500]">Sign In</button>
                            <button onClick={() => router.push('/signup')} className="flex-1 py-2.5 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[600]">Sign Up</button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 pt-16">
                {/* Background blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-2 rounded-full text-indigo-300 text-sm font-[500] mb-6">
                            <Sparkles className="w-4 h-4" />
                            Powered by AI Mentor Matching
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-[900] text-white leading-tight mb-6">
                            Connect.{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Learn.</span>
                            <br />Grow Together.
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                            The ultimate digital ecosystem connecting students, alumni, faculty, and mentors for career growth, referrals, and lifelong learning.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => router.push('/signup')}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-[700] shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all flex items-center justify-center gap-2">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Stats removed */}
                    </div>

                    {/* Hero Visual */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/50 border border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1723746571161-e45723f5db33?w=800&h=600&fit=crop"
                                alt="Students networking"
                                className="w-full h-80 lg:h-96 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        </div>
                        {/* Floating cards */}
                        <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-[700] text-slate-900 dark:text-white text-sm">New Achievement!</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Quiz Master Badge Earned</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1570215170761-f056128eda48?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <div className="font-[700] text-slate-900 dark:text-white text-xs">Arjun Mehta</div>
                                    <div className="text-xs text-green-500 font-[500]">● Available Now</div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">SDE @ Google · 4.9 ⭐</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-[600] mb-4">
                            <Zap className="w-4 h-4" /> Everything You Need
                        </div>
                        <h2 className="text-4xl md:text-5xl font-[800] text-slate-900 dark:text-white mb-4">
                            One Platform.{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Endless Possibilities.</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            From mentoring to job referrals, quizzes to certifications — everything for your academic and professional journey.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-[700] text-slate-900 dark:text-white mb-3">{title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-[600] opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-[800] text-slate-900 dark:text-white mb-4">How It Works</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Get started in minutes. Transform your career in months.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map(({ step, title, desc }, i) => (
                            <div key={step} className="text-center relative">
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-2/3 w-1/2 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30" />
                                )}
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-[900] text-white mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                                    {step}
                                </div>
                                <h3 className="font-[700] text-slate-900 dark:text-white mb-3">{title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES */}
            <section id="success-stories" className="py-24 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-[800] text-slate-900 dark:text-white mb-4">
                            Alumni{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Success Stories</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">Real students. Real results. Real careers.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {alumni.map(({ name, role, batch, quote, achievement, img, color }) => (
                            <div key={name} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all">
                                <div className={`h-2 bg-gradient-to-r ${color}`} />
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={img} alt={name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                                        <div>
                                            <div className="font-[700] text-slate-900 dark:text-white">{name}</div>
                                            <div className="text-sm text-indigo-600 dark:text-indigo-400 font-[600]">{role}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{batch}</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">"{quote}"</p>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${color} text-white text-xs font-[700]`}>
                                        <Trophy className="w-3.5 h-3.5" /> {achievement}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-[800] text-slate-900 dark:text-white mb-4">What Students Say</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map(({ name, role, text, stars }) => (
                            <div key={name} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50">
                                <div className="flex gap-1 mb-4">
                                    {Array(stars).fill(0).map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">"{text}"</p>
                                <div>
                                    <div className="font-[700] text-slate-900 dark:text-white text-sm">{name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
                <div className="relative max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-6xl font-[900] text-white mb-6">Ready to Transform Your Career?</h2>
                    <p className="text-xl text-white/80 mb-10">Join a thriving network of students and alumni dedicated to career excellence and lifelong learning.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/signup')}
                            className="px-10 py-5 bg-white text-indigo-600 rounded-xl font-[800] text-lg shadow-2xl hover:scale-105 transition-all">
                            Get Started for Free
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-10 py-5 bg-white/20 border border-white/30 text-white rounded-xl font-[700] text-lg backdrop-blur-sm hover:bg-white/30 transition-all">
                            Sign In
                        </button>
                    </div>
                    {/* Benefit labels removed */}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-[800] text-xl">Alumni Connect</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                Bridging the gap between students, alumni, and endless career opportunities.
                            </p>
                            <div className="flex gap-3">
                                {[Linkedin, Twitter, Github, Instagram].map((Icon, i) => (
                                    <button key={i} className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {[
                            { title: 'Platform', links: ['Features', 'For Students', 'For Alumni', 'For Faculty', 'Pricing'] },
                            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'] },
                            { title: 'Support', links: ['Help Center', 'Community', 'Privacy Policy', 'Terms of Use', 'Cookie Policy'] },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <div className="font-[700] text-sm uppercase tracking-wider text-slate-400 mb-4">{title}</div>
                                <ul className="space-y-3">
                                    {links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                        <span>© 2026 Alumni Connect Platform. All rights reserved.</span>
                        <span>Made with ❤️ for students everywhere</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
