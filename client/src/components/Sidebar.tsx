"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    MessageSquare,
    User,
    Settings,
    Bell
} from 'lucide-react'

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Alumni Directory', icon: Users, href: '/directory' },
    { label: 'Job Portal', icon: Briefcase, href: '/jobs' },
    { label: 'Events', icon: Calendar, href: '/events' },
    { label: 'Messages', icon: MessageSquare, href: '/messages' },
    { label: 'My Profile', icon: User, href: '/profile' },
    { label: 'Notifications', icon: Bell, href: '/notifications' },
    { label: 'Settings', icon: Settings, href: '/settings' },
]

export const Sidebar = () => {
    const pathname = usePathname()

    return (
        <aside className="w-64 min-h-screen bg-secondary/20 border-r border-gray-800 p-6 flex flex-col">
            <div className="mb-10 px-2">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-lg">A</div>
                    <span className="font-bold text-lg tracking-tight">Connect</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto px-4 py-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Need Help?</p>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">Contact our support team for any issues or queries.</p>
                <Button variant="outline" size="sm" className="w-full text-[12px] h-8 bg-transparent">Contact Support</Button>
            </div>
        </aside>
    )
}
