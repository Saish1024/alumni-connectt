import Link from 'next/link'
import { Button } from './Button'

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                        A
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        AlumniConnect
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <Link href="/directory" className="hover:text-white transition-colors">Directory</Link>
                    <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
                    <Link href="/events" className="hover:text-white transition-colors">Events</Link>
                    <Link href="/feed" className="hover:text-white transition-colors">Community</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
