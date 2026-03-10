"use client"
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import {
    Home, Users, Briefcase, BookOpen, MessageCircle, Star, Target, Calendar, Settings, Trophy, FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && mounted && !user) {
            router.push('/login');
        }
    }, [user, isLoading, mounted, router]);

    // Prevent hydration mismatch or layout flashing before auth is checked
    if (!mounted || isLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Role-based Navigation
    const navItemsMap: Record<string, any[]> = {
        student: [
            { icon: Home, label: 'Dashboard', href: '/dashboard' },
            { icon: Users, label: 'Mentors', href: '/dashboard/mentors' },
            { icon: Briefcase, label: 'Job Portal', href: '/dashboard/jobs' },
            { icon: BookOpen, label: 'Quizzes / Tests', href: '/dashboard/tests' },
            { icon: MessageCircle, label: 'Messages', href: '/dashboard/sessions', badge: 3 },
            { icon: FileText, label: 'Resume Review', href: '/dashboard/resumes' },
            { icon: Calendar, label: 'Events', href: '/dashboard/events' },
            { icon: Star, label: 'Leaderboard', href: '/dashboard/leaderboard' },
            { icon: Users, label: 'Community', href: '/dashboard/community' },
        ],
        alumni: [
            { icon: Home, label: 'Overview', href: '/dashboard' },
            { icon: Calendar, label: 'Mentoring Sessions', href: '/dashboard/sessions' },
            { icon: Star, label: 'Earnings & Payouts', href: '/dashboard/earnings' },
            { icon: FileText, label: 'Resume Reviews', href: '/dashboard/resumes' },
            { icon: Briefcase, label: 'Post Job/Referral', href: '/dashboard/jobs' },
            { icon: Target, label: 'Stats & Reputation', href: '/dashboard/stats' },
            { icon: Users, label: 'Donations', href: '/dashboard/donations' },
            { icon: Settings, label: 'Mentoring Setup', href: '/dashboard/setup' },
        ],
        faculty: [
            { icon: Home, label: 'Overview', href: '/dashboard' },
            { icon: Users, label: 'Student Performance', href: '/dashboard/students' },
            { icon: BookOpen, label: 'Mentoring Monitor', href: '/dashboard/mentoring' },
            { icon: Trophy, label: 'Competitions', href: '/dashboard/competitions' },
            { icon: MessageCircle, label: 'Reports', href: '/dashboard/reports' },
        ],
        admin: [
            { icon: Home, label: 'Platform Overview', href: '/dashboard' },
            { icon: Users, label: 'User Management', href: '/dashboard/users' },
            { icon: Target, label: 'Registrations', href: '/dashboard/registrations', badge: 8 },
            { icon: Briefcase, label: 'Payments', href: '/dashboard/payments' },
            { icon: Calendar, label: 'Events', href: '/dashboard/events' },
            { icon: Star, label: 'Revenue Analytics', href: '/dashboard/revenue' },
            { icon: MessageCircle, label: 'Announcements', href: '/dashboard/announcements' },
            { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
        ],
    };

    const roleNavItems = navItemsMap[user.role] || navItemsMap.student;

    const dummyNotifications = [
        { id: 1, text: 'You have a new message from Priya Sharma', time: '5m ago', read: false },
        { id: 2, text: 'Your resume review is ready', time: '2h ago', read: false },
        { id: 3, text: 'Google is hiring for SDE-1 roles', time: '1d ago', read: true },
    ];

    return (
        <DashboardLayout navItems={roleNavItems} notifications={dummyNotifications}>
            {children}
        </DashboardLayout>
    );
}
