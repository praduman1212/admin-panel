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

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30">
            <div className="flex flex-col h-full">
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
    );
};

export default Sidebar;