"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import StudentOverview from '@/components/dashboards/StudentOverview';
import AdminOverview from '@/components/dashboards/AdminOverview';
import FacultyOverview from '@/components/dashboards/FacultyOverview';
import AlumniOverview from '@/components/dashboards/AlumniOverview';

export default function DashboardOverviewPage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading || !user) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (user.role === 'admin') {
        return <AdminOverview />;
    }

    if (user.role === 'faculty') {
        return <FacultyOverview />;
    }

    if (user.role === 'alumni') {
        return <AlumniOverview />;
    }

    return <StudentOverview />;
}
