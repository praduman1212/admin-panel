import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, Users, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '@/context/Auth.context';

const Sidebar = () => {
    const router = useRouter();
    const { user, logout } = useAuth();

    const navigation = [
        {
            name: 'Overview',
            href: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Courses',
            href: '/course',
            icon: BookOpen
        },
        {
            name: 'Users',
            href: '/users',
            icon: Users
        },
        {
            name: 'Analytics',
            href: '/analytics',
            icon: BarChart2
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: Settings
        }
    ];

    const isActive = (path) => router.pathname === path;

    // Responsive sidebar state
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Mobile sidebar toggle button */}
            <button
                className="fixed left-2 top-20 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg sm:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open sidebar"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-transform duration-300 transform
                ${open ? 'translate-x-0' : '-translate-x-full'}
                sm:translate-x-0 sm:block`}
                style={{ willChange: 'transform' }}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Navigation Links */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg text-md font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-500'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                {user?.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.name || 'User'}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full"
                                        style={{ objectFit: 'cover' }}
                                        priority={true}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                        {user?.name?.[0] || user?.email?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Overlay for mobile when sidebar is open */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-20 sm:hidden"
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}
        </>
    );
};

export default Sidebar;