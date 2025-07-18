import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/Auth.context';
import Link from 'next/link';

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const [showLabel, setShowLabel] = useState('');
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [listening, setListening] = useState(false);
    const recognitionRef = React.useRef(null);

    // Dummy search logic (replace with real API/filter as needed)
    React.useEffect(() => {
        if (search.trim() === '') {
            setSearchResults([]);
            return;
        }
        // Example: filter courses by name (replace with real data)
        const courses = [
            { name: 'React Basics', id: 1 },
            { name: 'Advanced JS', id: 2 },
            { name: 'Firebase 101', id: 3 },
            { name: 'Next.js Mastery', id: 4 },
        ];
        setSearchResults(
            courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search]);

    // Microphone/voice search logic
    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.');
            return;
        }
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        setListening(true);
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            setSearch(transcript);
        };
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognition.start();
    };
    return (
        <nav className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
            <div className="h-full flex items-center justify-between px-5">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 ml-64">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">LMS</span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative flex items-center border-2 border-[#8d95ab] rounded-lg bg-white dark:bg-gray-900">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* Microphone Button */}
                        <button
                            type="button"
                            aria-label="Voice Search"
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-shadow ${listening ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={handleMicClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v3m0 0h-3m3 0h3m-3-3a4 4 0 004-4V7a4 4 0 10-8 0v7a4 4 0 004 4z" />
                            </svg>
                        </button>
                    </div>
                    {/* Live Search Results Dropdown - previous style */}
                    {searchResults.length > 0 && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {searchResults.map(result => (
                                    <li key={result.id} className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer" onClick={() => setSearch(result.name)}>
                                        {result.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* Theme Toggle */}
                    <div className="relative flex flex-col items-center">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2"
                            style={{ borderColor: '#8d95ab' }}
                            onMouseEnter={() => setShowLabel('mode')}
                            onMouseLeave={() => setShowLabel('')}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                        {showLabel === 'mode' && (
                            <span className="absolute top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white shadow">Mode</span>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative flex flex-col items-center">
                        <button
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 relative border-2"
                            style={{ borderColor: '#8d95ab' }}
                            onClick={() => setShowLabel(showLabel === 'notification-bar' ? '' : 'notification-bar')}
                            onMouseEnter={() => setShowLabel('notification')}
                            onMouseLeave={() => setShowLabel(showLabel === 'notification-bar' ? 'notification-bar' : '')}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        {showLabel === 'notification' && (
                            <span className="absolute top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white shadow">Notification</span>
                        )}
                        {showLabel === 'notification-bar' && (
                            <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                <div className="p-4 text-sm text-gray-700 dark:text-gray-200">
                                    <div className="font-semibold mb-2">Notifications</div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                            Welcome to the LMS admin panel!
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                            Your profile is up to date.
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                                            New course added successfully.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin/User Profile */}
                    <div className="relative flex flex-col items-center">
                        <button
                            className="flex-shrink-0 focus:outline-none w-8 h-8 rounded-full bg-transparent flex items-center justify-center border-4 border-[#8d95ab] transition-shadow hover:shadow"
                            onClick={() => setShowLabel(showLabel === 'admin-bar' ? '' : 'admin-bar')}
                            onMouseEnter={() => setShowLabel('admin')}
                            onMouseLeave={() => setShowLabel(showLabel === 'admin-bar' ? 'admin-bar' : '')}
                        >
                            {user?.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.name || 'User'}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                    style={{ objectFit: 'cover' }}
                                    priority={true}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                                </div>
                            )}
                        </button>
                        {showLabel === 'admin' && (
                            <span className="absolute top-full mt-2 px-2 py-1 text-xs rounded bg-gray-800 text-white shadow">Admin</span>
                        )}
                        {showLabel === 'admin-bar' && (
                            <div
                                className="absolute top-full mt-2 w-[24rem] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 flex flex-col items-start p-5 overflow-y-auto"
                                style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxHeight: '28rem' }}
                            >
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        {user?.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt={user.name || 'User'}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover border border-[#8d95ab]"
                                                style={{ objectFit: 'cover' }}
                                                priority={true}
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-base font-medium border border-[#8d95ab]">
                                                {user?.name?.[0] || user?.email?.[0] || 'U'}
                                            </div>
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white break-words whitespace-pre-line">{user?.name || 'User'}</span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">{user?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Removed admin name and email from below admin icon */}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
