import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Bell,
    Sun,
    Moon,
    ChevronDown,
    LogOut,
    Settings,
    User,
    GraduationCap
} from 'lucide-react';

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    // Wait for component to mount to avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    const notifications = [
        { id: 1, text: 'New message received', time: '5m ago' },
        { id: 2, text: 'Your report is ready', time: '1h ago' },
        { id: 3, text: 'Welcome to the dashboard', time: '2h ago' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="p-2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-10 h-10 text-white" />

                            </div>
                            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                                LMS
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {mounted && (
                                theme === 'dark' 
                                    ? <Sun className="h-5 w-5 text-gray-600 dark:text-gray-100" />
                                    : <Moon className="h-5 w-5 text-gray-600 dark:text-gray-100" />
                            )}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                            >
                                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-100" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            <p className="text-sm text-gray-700 dark:text-gray-200">{notification.text}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600 dark:text-gray-100" />
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-100" />
                            </button>

                            {/* Profile Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Your Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Link>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => {/* Add logout logic */ }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
